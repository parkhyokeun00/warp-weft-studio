import {
  createPresetPattern,
  getPatternRenderMetrics,
  MAX_CUSTOM_EXPORT_TARGET_LONG_EDGE,
  MAX_REPEAT_COUNT,
} from "../weave";

describe("pattern render sizing", () => {
  it("renders close to the requested Full HD long edge", () => {
    const metrics = getPatternRenderMetrics(
      createPresetPattern("heritage-tartan"),
      {
        mode: "export",
        targetLongEdge: 1920,
      },
    );

    expect(metrics).not.toBeNull();

    if (!metrics) {
      return;
    }

    const longEdge = Math.max(metrics.width, metrics.height);
    expect(longEdge).toBeLessThanOrEqual(1920);
    expect(longEdge).toBeGreaterThan(1800);
  });

  it("supports 4K-class exports", () => {
    const metrics = getPatternRenderMetrics(
      createPresetPattern("heritage-tartan"),
      {
        mode: "export",
        targetLongEdge: 3840,
      },
    );

    expect(metrics).not.toBeNull();

    if (!metrics) {
      return;
    }

    const longEdge = Math.max(metrics.width, metrics.height);
    expect(longEdge).toBeLessThanOrEqual(3840);
    expect(longEdge).toBeGreaterThan(3600);
  });

  it("clamps oversized custom exports to the supported maximum", () => {
    const metrics = getPatternRenderMetrics(
      createPresetPattern("heritage-tartan"),
      {
        mode: "export",
        targetLongEdge: MAX_CUSTOM_EXPORT_TARGET_LONG_EDGE + 2048,
      },
    );

    expect(metrics).not.toBeNull();

    if (!metrics) {
      return;
    }

    expect(Math.max(metrics.width, metrics.height)).toBeLessThanOrEqual(
      MAX_CUSTOM_EXPORT_TARGET_LONG_EDGE,
    );
  });

  it("builds multi-repeat sheets inside the requested long edge", () => {
    const metrics = getPatternRenderMetrics(
      createPresetPattern("heritage-tartan"),
      {
        mode: "export",
        targetLongEdge: 3840,
        repeatColumns: 10,
        repeatRows: 10,
      },
    );

    expect(metrics).not.toBeNull();

    if (!metrics) {
      return;
    }

    expect(metrics.repeatColumns).toBe(10);
    expect(metrics.repeatRows).toBe(10);
    expect(Math.max(metrics.width, metrics.height)).toBeLessThanOrEqual(3840);
    expect(Math.floor(metrics.width / metrics.repeatColumns)).toBeGreaterThan(
      300,
    );
    expect(Math.floor(metrics.height / metrics.repeatRows)).toBeGreaterThan(
      300,
    );
  });

  it("clamps repeat sheets to the supported maximum count", () => {
    const metrics = getPatternRenderMetrics(
      createPresetPattern("heritage-tartan"),
      {
        mode: "export",
        targetLongEdge: 3840,
        repeatColumns: MAX_REPEAT_COUNT + 8,
        repeatRows: MAX_REPEAT_COUNT + 8,
      },
    );

    expect(metrics).not.toBeNull();

    if (!metrics) {
      return;
    }

    expect(metrics.repeatColumns).toBe(MAX_REPEAT_COUNT);
    expect(metrics.repeatRows).toBe(MAX_REPEAT_COUNT);
  });
});
