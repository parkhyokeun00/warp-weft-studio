import { useFeatureSupport } from "@canva/app-hooks";
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import type { Feature } from "@canva/platform";
import { fireEvent, render, waitFor } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import type { ReactNode } from "react";
import { App } from "../app";
import { renderPatternDataUrl } from "../weave";

function renderInTestProvider(node: ReactNode): RenderResult {
  return render(
    <TestAppI18nProvider>
      <TestAppUiProvider>{node}</TestAppUiProvider>
    </TestAppI18nProvider>,
  );
}

jest.mock("@canva/app-hooks");
jest.mock("@canva/asset");
jest.mock("../weave", () => {
  const actual = jest.requireActual("../weave");

  return {
    ...actual,
    renderPatternDataUrl: jest.fn(() => ({
      dataUrl: "data:image/png;base64,preview",
      width: 240,
      height: 240,
      repeatWidth: 12,
      repeatHeight: 12,
    })),
  };
});

describe("Warp Weft Studio", () => {
  const mockIsSupported = jest.fn();
  const mockUseFeatureSupport = jest.mocked(useFeatureSupport);
  const mockUpload = jest.mocked(upload);
  const mockRenderPatternDataUrl = jest.mocked(renderPatternDataUrl);

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsSupported.mockImplementation(
      (fn: Feature) => fn === addElementAtPoint,
    );
    mockUseFeatureSupport.mockReturnValue(mockIsSupported);
    mockUpload.mockResolvedValue({ ref: "asset-ref" } as Awaited<
      ReturnType<typeof upload>
    >);
    mockRenderPatternDataUrl.mockReturnValue({
      dataUrl: "data:image/png;base64,preview",
      width: 240,
      height: 240,
      repeatWidth: 12,
      repeatHeight: 12,
    });
  });

  it("renders the weaving editor controls", () => {
    const result = renderInTestProvider(<App />);

    expect(result.getByText("Warp Weft Studio")).toBeTruthy();
    expect(
      result.getByRole("button", { name: "Add repeat sheet to design" }),
    ).toBeTruthy();
    expect(result.queryByRole("button", { name: "Download PNG" })).toBeNull();
    expect(result.getByText("Preset starting points")).toBeTruthy();
    expect(result.getAllByText("Warp palette").length).toBeGreaterThan(0);
    expect(result.getAllByText("Weft palette").length).toBeGreaterThan(0);
  });

  it("uploads the generated tile and adds it to the design", async () => {
    const result = renderInTestProvider(<App />);

    fireEvent.click(
      result.getByRole("button", { name: "Add repeat sheet to design" }),
    );

    await waitFor(() => expect(mockUpload).toHaveBeenCalled());

    expect(mockIsSupported).toHaveBeenCalledWith(addElementAtPoint);
    expect(mockIsSupported).not.toHaveBeenCalledWith(addElementAtCursor);
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "image",
        mimeType: "image/png",
      }),
    );
    expect(addElementAtPoint).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "image",
        ref: "asset-ref",
      }),
    );
  });
});
