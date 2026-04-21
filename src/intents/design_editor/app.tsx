import { useFeatureSupport } from "@canva/app-hooks";
import { upload } from "@canva/asset";
import {
  Alert,
  Box,
  Button,
  ColorSelector,
  FormField,
  NumberInput,
  PlusIcon,
  ReloadIcon,
  Rows,
  Select,
  Slider,
  Switch,
  Text,
  TextInput,
  Title,
  TrashIcon,
} from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { useEffect, useState } from "react";
import {
  defineMessages,
  FormattedMessage,
  type IntlShape,
  type MessageDescriptor,
  useIntl,
} from "react-intl";
import * as styles from "styles/components.css";
import {
  createPresetPattern,
  createRemixedPattern,
  DEFAULT_EXPORT_TARGET_LONG_EDGE,
  getRepeatSize,
  MAX_REPEAT_COUNT,
  PRESETS,
  renderPatternDataUrl,
  WEAVE_TYPES,
} from "./weave";
import type {
  PatternConfig,
  PatternPreview,
  ThreadStrip,
  WeaveType,
} from "./weave";

type Notice =
  | {
      tone: "critical" | "positive" | "info" | "neutral";
      kind: "patternRemixed";
    }
  | {
      tone: "critical" | "positive" | "info" | "neutral";
      kind: "previewUnavailable";
    }
  | {
      tone: "critical" | "positive" | "info" | "neutral";
      kind: "repeatSheetAdded";
      values: {
        columns: number;
        rows: number;
        width: number;
        height: number;
      };
    }
  | {
      tone: "critical" | "positive" | "info" | "neutral";
      kind: "patternInsertFailed";
      errorId: InsertPatternErrorId;
    };

type ThreadKey = "warpThreads" | "weftThreads";
type InsertPatternErrorId =
  | "generic"
  | "permissionDenied"
  | "timeout"
  | "notFound";

const DEFAULT_REPEAT_COLUMNS = 10;
const DEFAULT_REPEAT_ROWS = 10;
const INITIAL_PRESET_ID = PRESETS[0]?.id ?? "heritage-tartan";

const messages = defineMessages({
  appTitle: {
    defaultMessage: "Warp Weft Studio",
    description: "App title shown at the top of the Canva app side panel.",
  },
  appDescription: {
    defaultMessage:
      "Build seamless weaving repeat sheets and place them directly into your Canva design.",
    description:
      "Introductory description below the app title explaining the main workflow.",
  },
  insertUnavailableTitle: {
    defaultMessage: "Design insertion is unavailable here",
    description:
      "Alert title shown when the Canva editor surface does not support inserting generated assets.",
  },
  insertUnavailableBody: {
    defaultMessage:
      "Open a standard Canva design page to add repeat sheets from this app.",
    description:
      "Alert body explaining that the user must open a supported Canva design page to insert assets.",
  },
  insertUnavailableTooltip: {
    defaultMessage:
      "Open a standard design page to add repeat sheets from the app.",
    description:
      "Tooltip on the primary insert button when asset insertion is unavailable in the current Canva surface.",
  },
  previewAltText: {
    defaultMessage: "{patternName} preview",
    description:
      "Alt text for the generated pattern preview image shown inside the app panel.",
  },
  previewFallback: {
    defaultMessage: "Pattern preview will appear here.",
    description:
      "Placeholder text shown when the app cannot render a pattern preview.",
  },
  baseRepeatSizeLabel: {
    defaultMessage: "Base repeat size",
    description:
      "Metadata label describing the number of warp and weft units in a single base repeat.",
  },
  sheetRepeatsLabel: {
    defaultMessage: "Sheet repeats",
    description:
      "Metadata label describing how many repeats are included in the generated sheet.",
  },
  repeatSheetSectionTitle: {
    defaultMessage: "Repeat sheet",
    description:
      "Section title for controls that determine how many pattern repeats are exported together.",
  },
  repeatSheetSectionDescription: {
    defaultMessage:
      "Build a larger sheet in one go instead of placing single tiles manually.",
    description: "Short explanation under the repeat sheet section title.",
  },
  repeatColumnsLabel: {
    defaultMessage: "Repeat columns",
    description:
      "Form field label for the number of horizontal repeat columns in the generated sheet.",
  },
  repeatRowsLabel: {
    defaultMessage: "Repeat rows",
    description:
      "Form field label for the number of vertical repeat rows in the generated sheet.",
  },
  addRepeatSheetButton: {
    defaultMessage: "Add repeat sheet to design",
    description:
      "Primary button label that uploads the generated pattern sheet and inserts it into the Canva design.",
  },
  remixPaletteButton: {
    defaultMessage: "Remix palette",
    description:
      "Secondary button label that randomizes the current pattern colors and settings.",
  },
  presetSectionTitle: {
    defaultMessage: "Preset starting points",
    description: "Section title above the preset pattern buttons.",
  },
  presetSectionDescription: {
    defaultMessage:
      "Start with a commercial-ready base and tune it for your brand or collection.",
    description: "Short description introducing the preset pattern section.",
  },
  remixedPatternDescription: {
    defaultMessage:
      "Remixed patterns stay editable and can still be added to Canva as image assets.",
    description:
      "Description shown when the current pattern no longer matches a named preset.",
  },
  patternSettingsTitle: {
    defaultMessage: "Pattern settings",
    description: "Section title for the main pattern configuration controls.",
  },
  patternNameLabel: {
    defaultMessage: "Pattern name",
    description:
      "Form field label for the editable name of the current weaving pattern.",
  },
  patternNamePlaceholder: {
    defaultMessage: "Editorial Plaid",
    description:
      "Placeholder text in the pattern name text input. Example of a weaving pattern name.",
  },
  weaveTypeLabel: {
    defaultMessage: "Weave type",
    description: "Form field label for selecting the weave structure type.",
  },
  warpOverLabel: {
    defaultMessage: "Warp over",
    description:
      "Form field label for the count of threads passing over in the weave structure.",
  },
  warpUnderLabel: {
    defaultMessage: "Warp under",
    description:
      "Form field label for the count of threads passing under in the weave structure.",
  },
  threadScaleLabel: {
    defaultMessage: "Thread scale",
    description:
      "Slider label controlling the overall visual thickness of the woven threads.",
  },
  threadScaleDescription: {
    defaultMessage:
      "Increase the tile size for chunkier, more tactile repeats.",
    description:
      "Slider description explaining the effect of the thread scale control.",
  },
  satinStepLabel: {
    defaultMessage: "Satin step",
    description:
      "Slider label controlling the offset step used by the satin weave pattern.",
  },
  satinStepDescription: {
    defaultMessage: "Offset the float pattern to create a smoother sheen.",
    description:
      "Slider description explaining how the satin step changes the result.",
  },
  jacquardComplexityLabel: {
    defaultMessage: "Jacquard complexity",
    description:
      "Slider label controlling the organic variation in the jacquard weave pattern.",
  },
  jacquardComplexityDescription: {
    defaultMessage: "Increase organic variation for richer woven textures.",
    description:
      "Slider description explaining how jacquard complexity affects the texture.",
  },
  pileDepthLabel: {
    defaultMessage: "Pile depth",
    description:
      "Slider label controlling the depth of the pile effect in pile weaves.",
  },
  pileDepthDescription: {
    defaultMessage:
      "Boost highlight and shadow contrast for velvet-style tiles.",
    description:
      "Slider description explaining how pile depth affects the rendered pattern.",
  },
  mirrorRepeatLabel: {
    defaultMessage: "Mirror repeat",
    description:
      "Switch label for mirroring the thread order when expanding the repeat.",
  },
  mirrorRepeatDescription: {
    defaultMessage:
      "Reflect the thread order to create a balanced repeating tile.",
    description: "Switch description explaining the mirror repeat option.",
  },
  warpPaletteTitle: {
    defaultMessage: "Warp palette",
    description: "Section title for the list of warp thread colors.",
  },
  warpPaletteDescription: {
    defaultMessage:
      "Define the vertical yarn order. Each count becomes part of the seamless repeat.",
    description: "Description for the warp palette section.",
  },
  addWarpColorButton: {
    defaultMessage: "Add warp color",
    description: "Button label that adds another warp thread color entry.",
  },
  weftPaletteTitle: {
    defaultMessage: "Weft palette",
    description: "Section title for the list of weft thread colors.",
  },
  weftPaletteDescription: {
    defaultMessage:
      "Define the horizontal yarn order to control contrast and rhythm.",
    description: "Description for the weft palette section.",
  },
  addWeftColorButton: {
    defaultMessage: "Add weft color",
    description: "Button label that adds another weft thread color entry.",
  },
  warpThreadType: {
    defaultMessage: "warp",
    description:
      "Lowercase thread type name used inside dynamic labels for warp threads.",
  },
  weftThreadType: {
    defaultMessage: "weft",
    description:
      "Lowercase thread type name used inside dynamic labels for weft threads.",
  },
  threadItemLabel: {
    defaultMessage: "{threadType} thread {index}",
    description:
      "Label for a single thread entry in the palette list, with the thread type and one-based index.",
  },
  threadCountLabel: {
    defaultMessage: "Thread count",
    description:
      "Form field label for the number of repeated threads in a single color strip.",
  },
  removeThreadButtonLabel: {
    defaultMessage: "Remove {threadType} thread {index}",
    description:
      "Accessible label for the icon button that removes a thread entry from the palette list.",
  },
  repeatSheetLabel: {
    defaultMessage: "{columns} x {rows}",
    description:
      "Compact label describing the repeat sheet size as columns by rows.",
  },
  sizePairValue: {
    defaultMessage: "{first} x {second}",
    description:
      "Generic numeric pair label used to display two dimensions or counts side by side.",
  },
  patternRemixedTitle: {
    defaultMessage: "Pattern remixed",
    description:
      "Notice title shown after the user remixes the current pattern.",
  },
  patternRemixedBody: {
    defaultMessage:
      "Try the new palette, then add the repeat sheet to your Canva design.",
    description:
      "Notice body shown after the user remixes the current pattern.",
  },
  previewUnavailableTitle: {
    defaultMessage: "Preview unavailable",
    description:
      "Error notice title shown when the app cannot render the pattern at the selected size.",
  },
  previewUnavailableBody: {
    defaultMessage:
      "The repeat sheet could not be rendered at the selected insertion size.",
    description:
      "Error notice body shown when the app cannot render the pattern at the selected size.",
  },
  repeatSheetAddedTitle: {
    defaultMessage: "Repeat sheet added to design",
    description:
      "Success notice title shown after the generated repeat sheet is inserted into the Canva design.",
  },
  repeatSheetAddedBody: {
    defaultMessage:
      "{columns} x {rows} repeats uploaded at {width} x {height}px.",
    description:
      "Success notice body summarizing the generated repeat sheet size and output dimensions.",
  },
  patternInsertFailedTitle: {
    defaultMessage: "Could not add pattern",
    description:
      "Error notice title shown when the app fails to upload or insert the generated pattern.",
  },
  patternInsertFailedBodyGeneric: {
    defaultMessage:
      "Canva could not upload the pattern right now. Please try again.",
    description:
      "Generic error notice body shown when the app cannot upload or insert the generated pattern.",
  },
  patternInsertFailedBodyPermission: {
    defaultMessage:
      "Canva blocked access while uploading the pattern. Please reopen the design and try again.",
    description:
      "Error notice body shown when the platform denies permission during pattern upload or insertion.",
  },
  patternInsertFailedBodyTimeout: {
    defaultMessage:
      "The pattern upload took too long. Please try again in a moment.",
    description:
      "Error notice body shown when the upload or insertion request times out or is aborted.",
  },
  patternInsertFailedBodyNotFound: {
    defaultMessage:
      "The target design surface is no longer available. Please reopen the design and try again.",
    description:
      "Error notice body shown when the target design or insertion surface can no longer be found.",
  },
  repeatSheetAltText: {
    defaultMessage:
      "{patternName} weaving repeat sheet with {columns} columns and {rows} rows",
    description:
      "Alt text attached to the inserted repeat sheet image in the Canva design.",
  },
  remixedPatternName: {
    defaultMessage: "{patternName} Remix",
    description:
      "Default name assigned to a pattern after the user remixes it.",
  },
  weaveTypePlain: {
    defaultMessage: "Plain weave",
    description:
      "Option label for the plain weave type in the weave type selector.",
  },
  weaveTypeTwill: {
    defaultMessage: "Twill weave",
    description:
      "Option label for the twill weave type in the weave type selector.",
  },
  weaveTypeSatin: {
    defaultMessage: "Satin weave",
    description:
      "Option label for the satin weave type in the weave type selector.",
  },
  weaveTypeBasket: {
    defaultMessage: "Basket weave",
    description:
      "Option label for the basket weave type in the weave type selector.",
  },
  weaveTypeJacquard: {
    defaultMessage: "Jacquard",
    description:
      "Option label for the jacquard weave type in the weave type selector.",
  },
  weaveTypeLeno: {
    defaultMessage: "Leno weave",
    description:
      "Option label for the leno weave type in the weave type selector.",
  },
  weaveTypePile: {
    defaultMessage: "Pile weave",
    description:
      "Option label for the pile weave type in the weave type selector.",
  },
  presetHeritageTartanLabel: {
    defaultMessage: "Heritage tartan",
    description: "Button label for the heritage tartan preset.",
  },
  presetHeritageTartanDescription: {
    defaultMessage:
      "Balanced plaids for scarves, stationery, and editorial covers.",
    description:
      "Description for the heritage tartan preset shown below the preset buttons.",
  },
  presetHeritageTartanPatternName: {
    defaultMessage: "Heritage Tartan",
    description:
      "Default editable pattern name used when the heritage tartan preset is selected.",
  },
  presetDenimDriftLabel: {
    defaultMessage: "Denim drift",
    description: "Button label for the denim drift preset.",
  },
  presetDenimDriftDescription: {
    defaultMessage:
      "Soft diagonal twill with indigo contrast for fashion mockups.",
    description:
      "Description for the denim drift preset shown below the preset buttons.",
  },
  presetDenimDriftPatternName: {
    defaultMessage: "Denim Drift",
    description:
      "Default editable pattern name used when the denim drift preset is selected.",
  },
  presetSatinLusterLabel: {
    defaultMessage: "Satin luster",
    description: "Button label for the satin luster preset.",
  },
  presetSatinLusterDescription: {
    defaultMessage:
      "Glossy repeat for premium packaging and beauty campaign textures.",
    description:
      "Description for the satin luster preset shown below the preset buttons.",
  },
  presetSatinLusterPatternName: {
    defaultMessage: "Satin Luster",
    description:
      "Default editable pattern name used when the satin luster preset is selected.",
  },
  presetLoomBasketLabel: {
    defaultMessage: "Loom basket",
    description: "Button label for the loom basket preset.",
  },
  presetLoomBasketDescription: {
    defaultMessage:
      "Chunky basket weave for interiors, labels, and artisanal branding.",
    description:
      "Description for the loom basket preset shown below the preset buttons.",
  },
  presetLoomBasketPatternName: {
    defaultMessage: "Loom Basket",
    description:
      "Default editable pattern name used when the loom basket preset is selected.",
  },
});

const REPEAT_PRESET_OPTIONS = [
  {
    // eslint-disable-next-line formatjs/no-literal-string-in-object
    label: "1 x 1",
    columns: 1,
    rows: 1,
  },
  {
    // eslint-disable-next-line formatjs/no-literal-string-in-object
    label: `${DEFAULT_REPEAT_COLUMNS} x ${DEFAULT_REPEAT_ROWS}`,
    columns: DEFAULT_REPEAT_COLUMNS,
    rows: DEFAULT_REPEAT_ROWS,
  },
  {
    // eslint-disable-next-line formatjs/no-literal-string-in-object
    label: "20 x 20",
    columns: 20,
    rows: 20,
  },
] as const;

const ADD_THREAD_COLORS = [
  "#1d4ed8",
  "#0f766e",
  "#b91c1c",
  "#d97706",
  "#7c3aed",
  "#334155",
];

function createThreadId(prefix: "warp" | "weft"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function nextColor(index: number): string {
  return ADD_THREAD_COLORS[index % ADD_THREAD_COLORS.length] ?? "#1d4ed8";
}

function isMeaningfulNumber(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value);
}

export const App = () => {
  const intl = useIntl();
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const buildPresetPattern = (presetId: string): PatternConfig => {
    const presetPattern = createPresetPattern(presetId);
    return {
      ...presetPattern,
      patternName: formatPresetPatternName(intl, presetId),
    };
  };

  const initialPattern = buildPresetPattern(INITIAL_PRESET_ID);

  const [pattern, setPattern] = useState<PatternConfig>(initialPattern);
  const [repeatColumns, setRepeatColumns] = useState(DEFAULT_REPEAT_COLUMNS);
  const [repeatRows, setRepeatRows] = useState(DEFAULT_REPEAT_ROWS);
  const [preview, setPreview] = useState<PatternPreview | null>(() =>
    renderPatternDataUrl(initialPattern, {
      mode: "preview",
      repeatColumns: DEFAULT_REPEAT_COLUMNS,
      repeatRows: DEFAULT_REPEAT_ROWS,
    }),
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    INITIAL_PRESET_ID,
  );
  const [isInserting, setIsInserting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    setPreview(
      renderPatternDataUrl(pattern, {
        mode: "preview",
        repeatColumns,
        repeatRows,
      }),
    );
  }, [pattern, repeatColumns, repeatRows]);

  useEffect(() => {
    if (!selectedPresetId) {
      return;
    }

    const localizedPatternName = formatPresetPatternName(
      intl,
      selectedPresetId,
    );

    setPattern((current) =>
      current.patternName === localizedPatternName
        ? current
        : { ...current, patternName: localizedPatternName },
    );
  }, [intl.locale, selectedPresetId]);

  const repeat = getRepeatSize(pattern);
  const exportLongEdge = DEFAULT_EXPORT_TARGET_LONG_EDGE;
  const repeatSheetLabel = intl.formatMessage(messages.repeatSheetLabel, {
    columns: repeatColumns,
    rows: repeatRows,
  });
  const weaveOptions = WEAVE_TYPES.map((value) => ({
    value,
    label: formatWeaveTypeLabel(intl, value),
  }));
  const canInsert = Boolean(addElement && preview && !isInserting);
  const insertTooltip = !addElement
    ? intl.formatMessage(messages.insertUnavailableTooltip)
    : undefined;

  const updatePattern = (
    updater: (current: PatternConfig) => PatternConfig,
    presetId: string | null = null,
  ) => {
    setPattern((current) => updater(current));
    setSelectedPresetId(presetId);
  };

  const updateSettings = (updates: Partial<PatternConfig["settings"]>) => {
    updatePattern(
      (current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...updates,
        },
      }),
      null,
    );
  };

  const updateThreadList = (
    threadKey: ThreadKey,
    updater: (threads: ThreadStrip[]) => ThreadStrip[],
  ) => {
    updatePattern(
      (current) => ({
        ...current,
        [threadKey]: updater(current[threadKey]),
      }),
      null,
    );
  };

  const updateThread = (
    threadKey: ThreadKey,
    threadId: string,
    updates: Partial<ThreadStrip>,
  ) => {
    updateThreadList(threadKey, (threads) =>
      threads.map((thread) =>
        thread.id === threadId ? { ...thread, ...updates } : thread,
      ),
    );
  };

  const addThread = (threadKey: ThreadKey) => {
    updateThreadList(threadKey, (threads) => [
      ...threads,
      {
        id: createThreadId(threadKey === "warpThreads" ? "warp" : "weft"),
        color: nextColor(threads.length),
        count: 4,
      },
    ]);
  };

  const removeThread = (threadKey: ThreadKey, threadId: string) => {
    updateThreadList(threadKey, (threads) => {
      if (threads.length <= 1) {
        return threads;
      }

      return threads.filter((thread) => thread.id !== threadId);
    });
  };

  const applyPreset = (presetId: string) => {
    setPattern(buildPresetPattern(presetId));
    setSelectedPresetId(presetId);
    setNotice(null);
  };

  const remixPattern = () => {
    setPattern((current) =>
      createRemixedPattern(
        current,
        intl.formatMessage(messages.remixedPatternName, {
          patternName: current.patternName,
        }),
      ),
    );
    setSelectedPresetId(null);
    setNotice({
      tone: "info",
      kind: "patternRemixed",
    });
  };

  const insertPattern = async () => {
    if (!addElement) {
      return;
    }

    const asset = renderPatternDataUrl(pattern, {
      mode: "export",
      targetLongEdge: exportLongEdge,
      repeatColumns,
      repeatRows,
    });

    if (!asset) {
      setNotice({
        tone: "critical",
        kind: "previewUnavailable",
      });
      return;
    }

    setIsInserting(true);
    setNotice(null);

    try {
      const uploadResult = await upload({
        type: "image",
        mimeType: "image/png",
        url: asset.dataUrl,
        thumbnailUrl: preview?.dataUrl ?? asset.dataUrl,
        aiDisclosure: "none",
      });

      await addElement({
        type: "image",
        ref: uploadResult.ref,
        altText: {
          text: intl.formatMessage(messages.repeatSheetAltText, {
            patternName: pattern.patternName,
            columns: repeatColumns,
            rows: repeatRows,
          }),
          decorative: false,
        },
      });

      setNotice({
        tone: "positive",
        kind: "repeatSheetAdded",
        values: {
          columns: repeatColumns,
          rows: repeatRows,
          width: asset.width,
          height: asset.height,
        },
      });
    } catch (error) {
      setNotice({
        tone: "critical",
        kind: "patternInsertFailed",
        errorId: getInsertPatternErrorId(error),
      });
    } finally {
      setIsInserting(false);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Box
          background="surface"
          border="standard"
          borderRadius="large"
          padding="2u"
        >
          <Rows spacing="2u">
            <Rows spacing="0.5u">
              <Title size="small">
                <FormattedMessage {...messages.appTitle} />
              </Title>
              <Text size="small" tone="secondary">
                <FormattedMessage {...messages.appDescription} />
              </Text>
            </Rows>

            {notice ? (
              <Alert tone={notice.tone} title={formatNoticeTitle(intl, notice)}>
                {formatNoticeBody(intl, notice)}
              </Alert>
            ) : null}

            {!addElement ? (
              <Alert
                tone="info"
                title={intl.formatMessage(messages.insertUnavailableTitle)}
              >
                {intl.formatMessage(messages.insertUnavailableBody)}
              </Alert>
            ) : null}

            <div className={styles.previewFrame}>
              {preview ? (
                // eslint-disable-next-line react/forbid-elements
                <img
                  alt={intl.formatMessage(messages.previewAltText, {
                    patternName: pattern.patternName,
                  })}
                  className={styles.previewImage}
                  src={preview.dataUrl}
                />
              ) : (
                <div className={styles.previewFallback}>
                  <Text alignment="center" size="small" tone="secondary">
                    <FormattedMessage {...messages.previewFallback} />
                  </Text>
                </div>
              )}
            </div>

            <div className={styles.metadataGrid}>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>
                  <Text size="xsmall" tone="tertiary">
                    <FormattedMessage {...messages.baseRepeatSizeLabel} />
                  </Text>
                </div>
                <div className={styles.metadataValue}>
                  <Text size="small" variant="bold">
                    {intl.formatMessage(messages.sizePairValue, {
                      first: repeat.warp,
                      second: repeat.weft,
                    })}
                  </Text>
                </div>
              </div>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>
                  <Text size="xsmall" tone="tertiary">
                    <FormattedMessage {...messages.sheetRepeatsLabel} />
                  </Text>
                </div>
                <div className={styles.metadataValue}>
                  <Text size="small" variant="bold">
                    {repeatSheetLabel}
                  </Text>
                </div>
              </div>
            </div>

            <Rows spacing="1u">
              <Rows spacing="0.5u">
                <Text size="small" variant="bold">
                  <FormattedMessage {...messages.repeatSheetSectionTitle} />
                </Text>
                <Text size="small" tone="secondary">
                  <FormattedMessage
                    {...messages.repeatSheetSectionDescription}
                  />
                </Text>
              </Rows>

              <div className={styles.repeatPresetGrid}>
                {REPEAT_PRESET_OPTIONS.map((option) => (
                  <Button
                    key={option.label}
                    variant="secondary"
                    selected={
                      option.columns === repeatColumns &&
                      option.rows === repeatRows
                    }
                    onClick={() => {
                      setRepeatColumns(option.columns);
                      setRepeatRows(option.rows);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              <div className={styles.dualGrid}>
                <FormField
                  label={intl.formatMessage(messages.repeatColumnsLabel)}
                  control={(props) => (
                    <NumberInput
                      {...props}
                      min={1}
                      max={MAX_REPEAT_COUNT}
                      step={1}
                      value={repeatColumns}
                      onChange={(value) =>
                        setRepeatColumns(clampRepeatCountInput(value))
                      }
                    />
                  )}
                />
                <FormField
                  label={intl.formatMessage(messages.repeatRowsLabel)}
                  control={(props) => (
                    <NumberInput
                      {...props}
                      min={1}
                      max={MAX_REPEAT_COUNT}
                      step={1}
                      value={repeatRows}
                      onChange={(value) =>
                        setRepeatRows(clampRepeatCountInput(value))
                      }
                    />
                  )}
                />
              </div>
            </Rows>

            <div className={styles.actionGrid}>
              <Button
                variant="primary"
                onClick={() => void insertPattern()}
                disabled={!canInsert}
                loading={isInserting}
                tooltipLabel={insertTooltip}
                stretch
              >
                {intl.formatMessage(messages.addRepeatSheetButton)}
              </Button>
              <Button
                variant="secondary"
                icon={ReloadIcon}
                onClick={remixPattern}
                stretch
              >
                {intl.formatMessage(messages.remixPaletteButton)}
              </Button>
            </div>
          </Rows>
        </Box>

        <Box
          background="surface"
          border="standard"
          borderRadius="large"
          padding="2u"
        >
          <Rows spacing="2u">
            <Rows spacing="0.5u">
              <Title size="small">
                <FormattedMessage {...messages.presetSectionTitle} />
              </Title>
              <Text size="small" tone="secondary">
                <FormattedMessage {...messages.presetSectionDescription} />
              </Text>
            </Rows>

            <div className={styles.presetGrid}>
              {PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="secondary"
                  selected={preset.id === selectedPresetId}
                  onClick={() => applyPreset(preset.id)}
                >
                  {formatPresetLabel(intl, preset.id)}
                </Button>
              ))}
            </div>

            {selectedPresetId ? (
              <Text size="small" tone="secondary">
                {formatPresetDescription(intl, selectedPresetId)}
              </Text>
            ) : (
              <Text size="small" tone="secondary">
                <FormattedMessage {...messages.remixedPatternDescription} />
              </Text>
            )}
          </Rows>
        </Box>

        <Box
          background="surface"
          border="standard"
          borderRadius="large"
          padding="2u"
        >
          <Rows spacing="2u">
            <Title size="small">
              <FormattedMessage {...messages.patternSettingsTitle} />
            </Title>

            <div className={styles.inputGrid}>
              <FormField
                label={intl.formatMessage(messages.patternNameLabel)}
                control={(props) => (
                  <TextInput
                    {...props}
                    maxLength={48}
                    placeholder={intl.formatMessage(
                      messages.patternNamePlaceholder,
                    )}
                    value={pattern.patternName}
                    onChange={(value) =>
                      updatePattern(
                        (current) => ({ ...current, patternName: value }),
                        null,
                      )
                    }
                  />
                )}
              />
              <FormField
                label={intl.formatMessage(messages.weaveTypeLabel)}
                control={(props) => (
                  <Select
                    {...props}
                    options={weaveOptions}
                    value={pattern.weaveType}
                    onChange={(value) =>
                      updatePattern(
                        (current) => ({ ...current, weaveType: value }),
                        null,
                      )
                    }
                  />
                )}
              />
            </div>

            <div className={styles.dualGrid}>
              <FormField
                label={intl.formatMessage(messages.warpOverLabel)}
                control={(props) => (
                  <NumberInput
                    {...props}
                    min={1}
                    max={6}
                    step={1}
                    value={pattern.settings.over}
                    onChange={(value) =>
                      updateSettings({
                        over: isMeaningfulNumber(value) ? value : 1,
                      })
                    }
                  />
                )}
              />
              <FormField
                label={intl.formatMessage(messages.warpUnderLabel)}
                control={(props) => (
                  <NumberInput
                    {...props}
                    min={1}
                    max={6}
                    step={1}
                    value={pattern.settings.under}
                    onChange={(value) =>
                      updateSettings({
                        under: isMeaningfulNumber(value) ? value : 1,
                      })
                    }
                  />
                )}
              />
            </div>

            <FormField
              label={intl.formatMessage(messages.threadScaleLabel)}
              description={intl.formatMessage(messages.threadScaleDescription)}
              control={(props) => (
                <Slider
                  {...props}
                  min={8}
                  max={28}
                  step={1}
                  value={pattern.settings.cellSize}
                  onChange={(value) => updateSettings({ cellSize: value })}
                />
              )}
            />

            {pattern.weaveType === "satin" ? (
              <FormField
                label={intl.formatMessage(messages.satinStepLabel)}
                description={intl.formatMessage(messages.satinStepDescription)}
                control={(props) => (
                  <Slider
                    {...props}
                    min={2}
                    max={5}
                    step={1}
                    value={pattern.settings.satinStep}
                    onChange={(value) => updateSettings({ satinStep: value })}
                  />
                )}
              />
            ) : null}

            {pattern.weaveType === "jacquard" ? (
              <FormField
                label={intl.formatMessage(messages.jacquardComplexityLabel)}
                description={intl.formatMessage(
                  messages.jacquardComplexityDescription,
                )}
                control={(props) => (
                  <Slider
                    {...props}
                    min={2}
                    max={10}
                    step={1}
                    value={pattern.settings.jacquardComplexity}
                    onChange={(value) =>
                      updateSettings({ jacquardComplexity: value })
                    }
                  />
                )}
              />
            ) : null}

            {pattern.weaveType === "pile" ? (
              <FormField
                label={intl.formatMessage(messages.pileDepthLabel)}
                description={intl.formatMessage(messages.pileDepthDescription)}
                control={(props) => (
                  <Slider
                    {...props}
                    min={1}
                    max={6}
                    step={1}
                    value={pattern.settings.pileDepth}
                    onChange={(value) => updateSettings({ pileDepth: value })}
                  />
                )}
              />
            ) : null}

            <Switch
              value={pattern.settings.mirrored}
              label={intl.formatMessage(messages.mirrorRepeatLabel)}
              description={intl.formatMessage(messages.mirrorRepeatDescription)}
              onChange={(value) => updateSettings({ mirrored: value })}
            />
          </Rows>
        </Box>

        <ThreadSection
          title={intl.formatMessage(messages.warpPaletteTitle)}
          description={intl.formatMessage(messages.warpPaletteDescription)}
          addLabel={intl.formatMessage(messages.addWarpColorButton)}
          threadType={intl.formatMessage(messages.warpThreadType)}
          threads={pattern.warpThreads}
          onAdd={() => addThread("warpThreads")}
          onUpdate={(threadId, updates) =>
            updateThread("warpThreads", threadId, updates)
          }
          onRemove={(threadId) => removeThread("warpThreads", threadId)}
        />

        <ThreadSection
          title={intl.formatMessage(messages.weftPaletteTitle)}
          description={intl.formatMessage(messages.weftPaletteDescription)}
          addLabel={intl.formatMessage(messages.addWeftColorButton)}
          threadType={intl.formatMessage(messages.weftThreadType)}
          threads={pattern.weftThreads}
          onAdd={() => addThread("weftThreads")}
          onUpdate={(threadId, updates) =>
            updateThread("weftThreads", threadId, updates)
          }
          onRemove={(threadId) => removeThread("weftThreads", threadId)}
        />
      </Rows>
    </div>
  );
};

type ThreadSectionProps = {
  title: string;
  description: string;
  addLabel: string;
  threadType: string;
  threads: ThreadStrip[];
  onAdd: () => void;
  onUpdate: (threadId: string, updates: Partial<ThreadStrip>) => void;
  onRemove: (threadId: string) => void;
};

function ThreadSection({
  title,
  description,
  addLabel,
  threadType,
  threads,
  onAdd,
  onUpdate,
  onRemove,
}: ThreadSectionProps) {
  const intl = useIntl();

  return (
    <Box
      background="surface"
      border="standard"
      borderRadius="large"
      padding="2u"
    >
      <Rows spacing="2u">
        <Rows spacing="0.5u">
          <Title size="small">{title}</Title>
          <Text size="small" tone="secondary">
            {description}
          </Text>
        </Rows>

        <div className={styles.threadList}>
          {threads.map((thread, index) => (
            <Box
              key={thread.id}
              background="neutralSubtle"
              border="standard"
              borderRadius="standard"
              padding="1u"
            >
              <div className={styles.threadRow}>
                <div className={styles.threadColor}>
                  <ColorSelector
                    color={thread.color}
                    onChange={(color) => onUpdate(thread.id, { color })}
                  />
                </div>
                <div className={styles.threadContent}>
                  <Text size="small" variant="bold">
                    {intl.formatMessage(messages.threadItemLabel, {
                      threadType,
                      index: index + 1,
                    })}
                  </Text>
                  <Text size="xsmall" tone="tertiary">
                    {thread.color.toUpperCase()}
                  </Text>
                  <FormField
                    label={intl.formatMessage(messages.threadCountLabel)}
                    control={(props) => (
                      <NumberInput
                        {...props}
                        min={1}
                        max={24}
                        step={1}
                        value={thread.count}
                        onChange={(value) =>
                          onUpdate(thread.id, {
                            count: isMeaningfulNumber(value) ? value : 1,
                          })
                        }
                      />
                    )}
                  />
                </div>
                <Button
                  variant="tertiary"
                  icon={TrashIcon}
                  ariaLabel={intl.formatMessage(
                    messages.removeThreadButtonLabel,
                    {
                      threadType,
                      index: index + 1,
                    },
                  )}
                  onClick={() => onRemove(thread.id)}
                  disabled={threads.length <= 1}
                />
              </div>
            </Box>
          ))}
        </div>

        <Button variant="secondary" icon={PlusIcon} onClick={onAdd}>
          {addLabel}
        </Button>
      </Rows>
    </Box>
  );
}

function clampRepeatCountInput(value: number | undefined): number {
  return Math.min(Math.max(Math.round(value ?? 1), 1), MAX_REPEAT_COUNT);
}

function formatNoticeTitle(intl: IntlShape, notice: Notice): string {
  switch (notice.kind) {
    case "patternRemixed":
      return intl.formatMessage(messages.patternRemixedTitle);
    case "previewUnavailable":
      return intl.formatMessage(messages.previewUnavailableTitle);
    case "repeatSheetAdded":
      return intl.formatMessage(messages.repeatSheetAddedTitle);
    case "patternInsertFailed":
      return intl.formatMessage(messages.patternInsertFailedTitle);
    default:
      return intl.formatMessage(messages.patternInsertFailedTitle);
  }
}

function formatNoticeBody(intl: IntlShape, notice: Notice): string {
  switch (notice.kind) {
    case "patternRemixed":
      return intl.formatMessage(messages.patternRemixedBody);
    case "previewUnavailable":
      return intl.formatMessage(messages.previewUnavailableBody);
    case "repeatSheetAdded":
      return intl.formatMessage(messages.repeatSheetAddedBody, notice.values);
    case "patternInsertFailed":
      return intl.formatMessage(getInsertPatternErrorMessage(notice.errorId));
    default:
      return intl.formatMessage(messages.patternInsertFailedBodyGeneric);
  }
}

function getInsertPatternErrorMessage(
  errorId: InsertPatternErrorId,
): MessageDescriptor {
  switch (errorId) {
    case "permissionDenied":
      return messages.patternInsertFailedBodyPermission;
    case "timeout":
      return messages.patternInsertFailedBodyTimeout;
    case "notFound":
      return messages.patternInsertFailedBodyNotFound;
    default:
      return messages.patternInsertFailedBodyGeneric;
  }
}

function getInsertPatternErrorId(error: unknown): InsertPatternErrorId {
  if (error && typeof error === "object") {
    const errorCode =
      "code" in error && typeof error.code === "string" ? error.code : "";
    const errorName = error instanceof Error ? error.name : "";
    const identifier = `${errorCode} ${errorName}`.toLowerCase();

    if (
      identifier.includes("permission") ||
      identifier.includes("denied") ||
      identifier.includes("notallowed")
    ) {
      return "permissionDenied";
    }

    if (identifier.includes("abort") || identifier.includes("timeout")) {
      return "timeout";
    }

    if (identifier.includes("notfound")) {
      return "notFound";
    }
  }

  return "generic";
}

function formatWeaveTypeLabel(intl: IntlShape, weaveType: WeaveType): string {
  return intl.formatMessage(getWeaveTypeMessage(weaveType));
}

function getWeaveTypeMessage(weaveType: WeaveType): MessageDescriptor {
  switch (weaveType) {
    case "plain":
      return messages.weaveTypePlain;
    case "twill":
      return messages.weaveTypeTwill;
    case "satin":
      return messages.weaveTypeSatin;
    case "basket":
      return messages.weaveTypeBasket;
    case "jacquard":
      return messages.weaveTypeJacquard;
    case "leno":
      return messages.weaveTypeLeno;
    case "pile":
      return messages.weaveTypePile;
    default:
      return messages.weaveTypePlain;
  }
}

function formatPresetLabel(intl: IntlShape, presetId: string): string {
  return intl.formatMessage(getPresetMessages(presetId).label);
}

function formatPresetDescription(intl: IntlShape, presetId: string): string {
  return intl.formatMessage(getPresetMessages(presetId).description);
}

function formatPresetPatternName(intl: IntlShape, presetId: string): string {
  return intl.formatMessage(getPresetMessages(presetId).patternName);
}

function getPresetMessages(presetId: string): {
  label: MessageDescriptor;
  description: MessageDescriptor;
  patternName: MessageDescriptor;
} {
  switch (presetId) {
    case "denim-drift":
      return {
        label: messages.presetDenimDriftLabel,
        description: messages.presetDenimDriftDescription,
        patternName: messages.presetDenimDriftPatternName,
      };
    case "satin-luster":
      return {
        label: messages.presetSatinLusterLabel,
        description: messages.presetSatinLusterDescription,
        patternName: messages.presetSatinLusterPatternName,
      };
    case "loom-basket":
      return {
        label: messages.presetLoomBasketLabel,
        description: messages.presetLoomBasketDescription,
        patternName: messages.presetLoomBasketPatternName,
      };
    case "heritage-tartan":
    default:
      return {
        label: messages.presetHeritageTartanLabel,
        description: messages.presetHeritageTartanDescription,
        patternName: messages.presetHeritageTartanPatternName,
      };
  }
}
