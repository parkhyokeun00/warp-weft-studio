/* eslint-disable formatjs/no-literal-string-in-jsx */
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
import * as styles from "styles/components.css";
import {
  createPresetPattern,
  createRemixedPattern,
  DEFAULT_EXPORT_TARGET_LONG_EDGE,
  getRepeatSize,
  MAX_REPEAT_COUNT,
  PRESETS,
  renderPatternDataUrl,
  WEAVE_OPTIONS,
} from "./weave";
import type { PatternConfig, PatternPreview, ThreadStrip } from "./weave";

type Notice = {
  tone: "critical" | "positive" | "info" | "neutral";
  title: string;
  body: string;
};

type ThreadKey = "warpThreads" | "weftThreads";

const DEFAULT_REPEAT_COLUMNS = 10;
const DEFAULT_REPEAT_ROWS = 10;
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
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const [pattern, setPattern] = useState<PatternConfig>(() =>
    createPresetPattern(PRESETS[0]?.id ?? "heritage-tartan"),
  );
  const [repeatColumns, setRepeatColumns] = useState(DEFAULT_REPEAT_COLUMNS);
  const [repeatRows, setRepeatRows] = useState(DEFAULT_REPEAT_ROWS);
  const [preview, setPreview] = useState<PatternPreview | null>(() =>
    renderPatternDataUrl(
      createPresetPattern(PRESETS[0]?.id ?? "heritage-tartan"),
      {
        mode: "preview",
        repeatColumns: DEFAULT_REPEAT_COLUMNS,
        repeatRows: DEFAULT_REPEAT_ROWS,
      },
    ),
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    PRESETS[0]?.id ?? null,
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

  const repeat = getRepeatSize(pattern);
  const exportLongEdge = DEFAULT_EXPORT_TARGET_LONG_EDGE;
  const repeatSheetLabel = `${repeatColumns} x ${repeatRows}`;
  const canInsert = Boolean(addElement && preview && !isInserting);
  const insertTooltip = !addElement
    ? "Open a standard design page to add repeat sheets from the app."
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
    setPattern(createPresetPattern(presetId));
    setSelectedPresetId(presetId);
    setNotice(null);
  };

  const remixPattern = () => {
    setPattern((current) => createRemixedPattern(current));
    setSelectedPresetId(null);
    setNotice({
      tone: "info",
      title: "Pattern remixed",
      body: "Try the new palette, then add the repeat sheet to your Canva design.",
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
        title: "Preview unavailable",
        body: "The repeat sheet could not be rendered at the selected insertion size.",
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
          text: `${pattern.patternName} weaving repeat sheet ${repeatSheetLabel}`,
          decorative: false,
        },
      });

      setNotice({
        tone: "positive",
        title: "Repeat sheet added to design",
        body: `${repeatSheetLabel} repeats uploaded at ${asset.width} x ${asset.height}px.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Canva could not upload the pattern.";

      setNotice({
        tone: "critical",
        title: "Could not add pattern",
        body: message,
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
              <Title size="small">Warp Weft Studio</Title>
              <Text size="small" tone="secondary">
                Build seamless weaving repeat sheets and place them directly
                into your Canva design.
              </Text>
            </Rows>

            {notice ? (
              <Alert tone={notice.tone} title={notice.title}>
                {notice.body}
              </Alert>
            ) : null}

            {!addElement ? (
              <Alert tone="info" title="Design insertion is unavailable here">
                Open a standard Canva design page to add repeat sheets from this
                app.
              </Alert>
            ) : null}

            <div className={styles.previewFrame}>
              {preview ? (
                // eslint-disable-next-line react/forbid-elements
                <img
                  alt={`${pattern.patternName} preview`}
                  className={styles.previewImage}
                  src={preview.dataUrl}
                />
              ) : (
                <div className={styles.previewFallback}>
                  <Text alignment="center" size="small" tone="secondary">
                    Pattern preview will appear here.
                  </Text>
                </div>
              )}
            </div>

            <div className={styles.metadataGrid}>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>
                  <Text size="xsmall" tone="tertiary">
                    Base repeat size
                  </Text>
                </div>
                <div className={styles.metadataValue}>
                  <Text size="small" variant="bold">
                    {repeat.warp} x {repeat.weft}
                  </Text>
                </div>
              </div>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>
                  <Text size="xsmall" tone="tertiary">
                    Sheet repeats
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
                  Repeat sheet
                </Text>
                <Text size="small" tone="secondary">
                  Build a larger sheet in one go instead of placing single tiles
                  manually.
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
                  label="Repeat columns"
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
                  label="Repeat rows"
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
                Add repeat sheet to design
              </Button>
              <Button
                variant="secondary"
                icon={ReloadIcon}
                onClick={remixPattern}
                stretch
              >
                Remix palette
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
              <Title size="small">Preset starting points</Title>
              <Text size="small" tone="secondary">
                Start with a commercial-ready base and tune it for your brand or
                collection.
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
                  {preset.label}
                </Button>
              ))}
            </div>

            {selectedPresetId ? (
              <Text size="small" tone="secondary">
                {
                  PRESETS.find((preset) => preset.id === selectedPresetId)
                    ?.description
                }
              </Text>
            ) : (
              <Text size="small" tone="secondary">
                Remixed patterns stay editable and can still be added to Canva
                as image assets.
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
            <Title size="small">Pattern settings</Title>

            <div className={styles.inputGrid}>
              <FormField
                label="Pattern name"
                control={(props) => (
                  <TextInput
                    {...props}
                    maxLength={48}
                    placeholder="Editorial Plaid"
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
                label="Weave type"
                control={(props) => (
                  <Select
                    {...props}
                    options={WEAVE_OPTIONS}
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
                label="Warp over"
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
                label="Warp under"
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
              label="Thread scale"
              description="Increase the tile size for chunkier, more tactile repeats."
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
                label="Satin step"
                description="Offset the float pattern to create a smoother sheen."
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
                label="Jacquard complexity"
                description="Increase organic variation for richer woven textures."
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
                label="Pile depth"
                description="Boost highlight and shadow contrast for velvet-style tiles."
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
              label="Mirror repeat"
              description="Reflect the thread order to create a balanced repeating tile."
              onChange={(value) => updateSettings({ mirrored: value })}
            />
          </Rows>
        </Box>

        <ThreadSection
          title="Warp palette"
          description="Define the vertical yarn order. Each count becomes part of the seamless repeat."
          addLabel="Add warp color"
          threads={pattern.warpThreads}
          onAdd={() => addThread("warpThreads")}
          onUpdate={(threadId, updates) =>
            updateThread("warpThreads", threadId, updates)
          }
          onRemove={(threadId) => removeThread("warpThreads", threadId)}
        />

        <ThreadSection
          title="Weft palette"
          description="Define the horizontal yarn order to control contrast and rhythm."
          addLabel="Add weft color"
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
  threads: ThreadStrip[];
  onAdd: () => void;
  onUpdate: (threadId: string, updates: Partial<ThreadStrip>) => void;
  onRemove: (threadId: string) => void;
};

function ThreadSection({
  title,
  description,
  addLabel,
  threads,
  onAdd,
  onUpdate,
  onRemove,
}: ThreadSectionProps) {
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
                    {title} {index + 1}
                  </Text>
                  <Text size="xsmall" tone="tertiary">
                    {thread.color.toUpperCase()}
                  </Text>
                  <FormField
                    label="Thread count"
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
                  ariaLabel={`Remove ${title} ${index + 1}`}
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
