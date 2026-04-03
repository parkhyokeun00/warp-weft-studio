/* eslint-disable formatjs/no-literal-string-in-object */
export type WeaveType =
  | "plain"
  | "twill"
  | "satin"
  | "basket"
  | "jacquard"
  | "leno"
  | "pile";

export type ThreadStrip = {
  id: string;
  color: string;
  count: number;
};

export type PatternSettings = {
  over: number;
  under: number;
  satinStep: number;
  jacquardComplexity: number;
  pileDepth: number;
  cellSize: number;
  mirrored: boolean;
};

export type PatternConfig = {
  patternName: string;
  weaveType: WeaveType;
  warpThreads: ThreadStrip[];
  weftThreads: ThreadStrip[];
  settings: PatternSettings;
};

export type PatternRenderMode = "preview" | "export";

export type PatternRenderRequest = {
  mode: PatternRenderMode;
  targetLongEdge?: number;
  repeatColumns?: number;
  repeatRows?: number;
};

export type PatternRenderMetrics = {
  width: number;
  height: number;
  repeatWidth: number;
  repeatHeight: number;
  repeatColumns: number;
  repeatRows: number;
};

export type PatternPreview = {
  dataUrl: string;
  width: number;
  height: number;
  repeatWidth: number;
  repeatHeight: number;
};

export type PatternPreset = {
  id: string;
  label: string;
  description: string;
  pattern: PatternConfig;
};

export type ExportResolutionPreset = "full-hd" | "qhd" | "uhd-4k" | "uhd-8k";

export type ExportResolutionOption = {
  label: string;
  value: ExportResolutionPreset;
  targetLongEdge: number;
  description: string;
  experimental?: boolean;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

const THREAD_LIBRARY = [
  "#0f172a",
  "#1d4ed8",
  "#0f766e",
  "#a16207",
  "#9f1239",
  "#7c3aed",
  "#334155",
  "#e2e8f0",
  "#f8fafc",
  "#d97706",
];

export const WEAVE_OPTIONS: { label: string; value: WeaveType }[] = [
  { label: "Plain weave", value: "plain" },
  { label: "Twill weave", value: "twill" },
  { label: "Satin weave", value: "satin" },
  { label: "Basket weave", value: "basket" },
  { label: "Jacquard", value: "jacquard" },
  { label: "Leno weave", value: "leno" },
  { label: "Pile weave", value: "pile" },
];

const DEFAULT_SETTINGS: PatternSettings = {
  over: 2,
  under: 2,
  satinStep: 3,
  jacquardComplexity: 5,
  pileDepth: 3,
  cellSize: 18,
  mirrored: true,
};

const PREVIEW_TARGET_LONG_EDGE = 1440;
const MAX_PREVIEW_TARGET_LONG_EDGE = 2048;
const PREVIEW_PIXEL_BUDGET = 8_388_608;
export const DEFAULT_EXPORT_TARGET_LONG_EDGE = 3840;
export const MIN_CUSTOM_EXPORT_TARGET_LONG_EDGE = 1024;
export const MAX_CUSTOM_EXPORT_TARGET_LONG_EDGE = 8192;
const EXPORT_PIXEL_BUDGET = 67_108_864;
export const MAX_REPEAT_COUNT = 20;

export const EXPORT_RESOLUTION_OPTIONS: ExportResolutionOption[] = [
  {
    label: "Full HD / 1080p",
    value: "full-hd",
    targetLongEdge: 1920,
    description: "Long edge up to 1920px for lighter Canva assets.",
  },
  {
    label: "QHD / 2K",
    value: "qhd",
    targetLongEdge: 2560,
    description: "Long edge up to 2560px for sharper mockups.",
  },
  {
    label: "4K UHD",
    value: "uhd-4k",
    targetLongEdge: 3840,
    description: "Long edge up to 3840px for production-ready textile tiles.",
  },
  {
    label: "8K experimental",
    value: "uhd-8k",
    targetLongEdge: 7680,
    description: "Long edge up to 7680px. Higher memory use and slower export.",
    experimental: true,
  },
];

function thread(id: string, color: string, count: number): ThreadStrip {
  return { id, color, count };
}

export const PRESETS: PatternPreset[] = [
  {
    id: "heritage-tartan",
    label: "Heritage tartan",
    description:
      "Balanced plaids for scarves, stationery, and editorial covers.",
    pattern: {
      patternName: "Heritage Tartan",
      weaveType: "plain",
      settings: {
        ...DEFAULT_SETTINGS,
        over: 1,
        under: 1,
        cellSize: 18,
        mirrored: true,
      },
      warpThreads: [
        thread("warp-1", "#1d3557", 8),
        thread("warp-2", "#f1faee", 3),
        thread("warp-3", "#b91c1c", 6),
        thread("warp-4", "#f59e0b", 2),
      ],
      weftThreads: [
        thread("weft-1", "#0b3d2e", 8),
        thread("weft-2", "#f1faee", 3),
        thread("weft-3", "#1d3557", 6),
        thread("weft-4", "#d97706", 2),
      ],
    },
  },
  {
    id: "denim-drift",
    label: "Denim drift",
    description:
      "Soft diagonal twill with indigo contrast for fashion mockups.",
    pattern: {
      patternName: "Denim Drift",
      weaveType: "twill",
      settings: {
        ...DEFAULT_SETTINGS,
        over: 2,
        under: 1,
        cellSize: 20,
        mirrored: false,
      },
      warpThreads: [
        thread("warp-1", "#1e40af", 10),
        thread("warp-2", "#93c5fd", 4),
        thread("warp-3", "#eff6ff", 2),
      ],
      weftThreads: [
        thread("weft-1", "#0f172a", 8),
        thread("weft-2", "#60a5fa", 4),
        thread("weft-3", "#dbeafe", 2),
      ],
    },
  },
  {
    id: "satin-luster",
    label: "Satin luster",
    description:
      "Glossy repeat for premium packaging and beauty campaign textures.",
    pattern: {
      patternName: "Satin Luster",
      weaveType: "satin",
      settings: {
        ...DEFAULT_SETTINGS,
        over: 4,
        under: 1,
        satinStep: 2,
        cellSize: 22,
        mirrored: false,
      },
      warpThreads: [
        thread("warp-1", "#f8fafc", 8),
        thread("warp-2", "#fde68a", 5),
        thread("warp-3", "#fb7185", 2),
      ],
      weftThreads: [
        thread("weft-1", "#fef3c7", 8),
        thread("weft-2", "#f9a8d4", 5),
        thread("weft-3", "#fff7ed", 2),
      ],
    },
  },
  {
    id: "loom-basket",
    label: "Loom basket",
    description:
      "Chunky basket weave for interiors, labels, and artisanal branding.",
    pattern: {
      patternName: "Loom Basket",
      weaveType: "basket",
      settings: {
        ...DEFAULT_SETTINGS,
        over: 2,
        under: 2,
        cellSize: 24,
        mirrored: true,
      },
      warpThreads: [
        thread("warp-1", "#7c2d12", 6),
        thread("warp-2", "#f5f5f4", 3),
        thread("warp-3", "#78716c", 6),
      ],
      weftThreads: [
        thread("weft-1", "#92400e", 6),
        thread("weft-2", "#fafaf9", 3),
        thread("weft-3", "#57534e", 6),
      ],
    },
  },
];

const INITIAL_PRESET = PRESETS[0];

if (!INITIAL_PRESET) {
  throw new Error("Warp Weft Studio requires at least one preset.");
}

const DEFAULT_PRESET: PatternPreset = INITIAL_PRESET;

export const DEFAULT_PATTERN = clonePattern(DEFAULT_PRESET.pattern);

export function clonePattern(pattern: PatternConfig): PatternConfig {
  return {
    patternName: pattern.patternName,
    weaveType: pattern.weaveType,
    warpThreads: pattern.warpThreads.map((item) => ({ ...item })),
    weftThreads: pattern.weftThreads.map((item) => ({ ...item })),
    settings: { ...pattern.settings },
  };
}

export function createPresetPattern(presetId: string): PatternConfig {
  const preset = PRESETS.find((item) => item.id === presetId) ?? DEFAULT_PRESET;
  return clonePattern(preset.pattern);
}

export function createRemixedPattern(source?: PatternConfig): PatternConfig {
  const base = clonePattern(
    source ??
      PRESETS[Math.floor(Math.random() * PRESETS.length)]?.pattern ??
      DEFAULT_PATTERN,
  );

  const offset = Math.floor(Math.random() * THREAD_LIBRARY.length);
  const rotateColor = (index: number) =>
    THREAD_LIBRARY[(index + offset) % THREAD_LIBRARY.length] ?? "#1d4ed8";

  base.patternName = `${base.patternName} Remix`;
  base.settings.mirrored = Math.random() > 0.4;
  base.settings.cellSize = clamp(
    base.settings.cellSize + randomBetween(-4, 4),
    10,
    26,
  );
  base.settings.over = clamp(base.settings.over + randomBetween(-1, 1), 1, 5);
  base.settings.under = clamp(base.settings.under + randomBetween(-1, 1), 1, 4);
  base.settings.satinStep = clamp(
    base.settings.satinStep + randomBetween(-1, 1),
    2,
    5,
  );
  base.settings.jacquardComplexity = clamp(
    base.settings.jacquardComplexity + randomBetween(-2, 2),
    2,
    10,
  );
  base.settings.pileDepth = clamp(
    base.settings.pileDepth + randomBetween(-1, 1),
    1,
    6,
  );

  base.warpThreads = base.warpThreads.map((item, index) => ({
    ...item,
    color: rotateColor(index),
    count: clamp(item.count + randomBetween(-2, 2), 2, 14),
  }));
  base.weftThreads = base.weftThreads.map((item, index) => ({
    ...item,
    color: rotateColor(index + 3),
    count: clamp(item.count + randomBetween(-2, 2), 2, 14),
  }));

  return base;
}

export function getRepeatSize(pattern: PatternConfig): {
  warp: number;
  weft: number;
} {
  const { warp, weft } = getExpandedThreads(pattern);

  return { warp: warp.length, weft: weft.length };
}

export function getPaletteSummary(threads: ThreadStrip[]): string {
  return threads
    .slice(0, 4)
    .map((item) => item.color.toUpperCase())
    .join(", ");
}

export function slugifyPatternName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "warp-weft-pattern"
  );
}

export function getPatternRenderMetrics(
  pattern: PatternConfig,
  request: PatternRenderRequest,
): PatternRenderMetrics | null {
  const { warp, weft } = getExpandedThreads(pattern);
  if (warp.length === 0 || weft.length === 0) {
    return null;
  }

  const targetLongEdge = resolveTargetLongEdge(request);
  const repeatColumns = clampRepeatCount(request.repeatColumns);
  const repeatRows = clampRepeatCount(request.repeatRows);
  const totalWarp = warp.length * repeatColumns;
  const totalWeft = weft.length * repeatRows;
  const longestRepeat = Math.max(totalWarp, totalWeft, 1);
  const repeatArea = Math.max(totalWarp * totalWeft, 1);
  const maxCellSizeBySide = Math.max(
    1,
    Math.floor(targetLongEdge / longestRepeat),
  );
  const maxCellSizeByArea = Math.max(
    1,
    Math.floor(Math.sqrt(getPixelBudget(request.mode) / repeatArea)),
  );
  const maxAllowedCellSize = Math.max(
    1,
    Math.min(maxCellSizeBySide, maxCellSizeByArea),
  );
  const requestedCellSize =
    request.mode === "preview"
      ? Math.max(pattern.settings.cellSize * 4, 24)
      : maxAllowedCellSize;
  const resolvedCellSize = Math.max(
    1,
    Math.min(requestedCellSize, maxAllowedCellSize),
  );

  const width = Math.max(1, totalWarp * resolvedCellSize);
  const height = Math.max(1, totalWeft * resolvedCellSize);

  return {
    width,
    height,
    repeatWidth: warp.length,
    repeatHeight: weft.length,
    repeatColumns,
    repeatRows,
  };
}

export function renderPatternDataUrl(
  pattern: PatternConfig,
  request: PatternRenderRequest,
): PatternPreview | null {
  if (typeof document === "undefined") {
    return null;
  }

  const { warp, weft } = getExpandedThreads(pattern);
  const metrics = getPatternRenderMetrics(pattern, request);

  if (!metrics) {
    return null;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const width = metrics.width;
  const height = metrics.height;
  const totalWarp = metrics.repeatWidth * metrics.repeatColumns;
  const totalWeft = metrics.repeatHeight * metrics.repeatRows;
  const resolvedCellSize = Math.max(
    1,
    Math.floor(width / Math.max(totalWarp, 1)),
  );

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, width, height);

  for (let y = 0; y < totalWeft; y += 1) {
    for (let x = 0; x < totalWarp; x += 1) {
      const cellX = x * resolvedCellSize;
      const cellY = y * resolvedCellSize;
      const baseX = x % metrics.repeatWidth;
      const baseY = y % metrics.repeatHeight;
      const warpColor = warp[baseX] ?? "#000000";
      const weftColor = weft[baseY] ?? "#ffffff";
      const weaveState = resolveWeaveState(
        pattern.weaveType,
        baseX,
        baseY,
        pattern.settings,
      );
      const topColor = weaveState.isWeftTop ? weftColor : warpColor;
      const bottomColor = weaveState.isWeftTop ? warpColor : weftColor;
      const blendFactor = clamp(0.66 + weaveState.anisotropy, 0.48, 0.84);

      let baseColor = mixColors(topColor, bottomColor, blendFactor);

      if (pattern.weaveType === "pile") {
        baseColor =
          weaveState.depth > 0
            ? mixColors(baseColor, "#ffffff", 0.18)
            : mixColors(baseColor, "#000000", 0.18);
      }

      context.fillStyle = baseColor;
      context.fillRect(cellX, cellY, resolvedCellSize, resolvedCellSize);

      drawThreadGloss(
        context,
        cellX,
        cellY,
        resolvedCellSize,
        weaveState.isWeftTop,
        weaveState.depth,
      );

      context.fillStyle = "rgba(15, 23, 42, 0.08)";
      context.fillRect(cellX, cellY, resolvedCellSize, 1);
      context.fillRect(cellX, cellY, 1, resolvedCellSize);
    }
  }

  try {
    return {
      dataUrl: canvas.toDataURL("image/png"),
      width,
      height,
      repeatWidth: metrics.repeatWidth,
      repeatHeight: metrics.repeatHeight,
    };
  } catch {
    return null;
  }
}

function getExpandedThreads(pattern: PatternConfig): {
  warp: string[];
  weft: string[];
} {
  return {
    warp: expandThreads(pattern.warpThreads, pattern.settings.mirrored),
    weft: expandThreads(pattern.weftThreads, pattern.settings.mirrored),
  };
}

function resolveTargetLongEdge(request: PatternRenderRequest): number {
  if (request.mode === "preview") {
    return clamp(
      Math.round(request.targetLongEdge ?? PREVIEW_TARGET_LONG_EDGE),
      720,
      MAX_PREVIEW_TARGET_LONG_EDGE,
    );
  }

  return clamp(
    Math.round(request.targetLongEdge ?? DEFAULT_EXPORT_TARGET_LONG_EDGE),
    MIN_CUSTOM_EXPORT_TARGET_LONG_EDGE,
    MAX_CUSTOM_EXPORT_TARGET_LONG_EDGE,
  );
}

function getPixelBudget(mode: PatternRenderMode): number {
  return mode === "preview" ? PREVIEW_PIXEL_BUDGET : EXPORT_PIXEL_BUDGET;
}

function clampRepeatCount(value: number | undefined): number {
  return clamp(Math.round(value ?? 1), 1, MAX_REPEAT_COUNT);
}

function expandThreads(threads: ThreadStrip[], mirrored: boolean): string[] {
  const expanded: string[] = [];

  for (const item of threads) {
    const count = clamp(Math.round(item.count), 1, 48);

    for (let index = 0; index < count; index += 1) {
      expanded.push(normalizeHex(item.color));
    }
  }

  if (!mirrored) {
    return expanded;
  }

  return [...expanded, ...[...expanded].reverse()];
}

function resolveWeaveState(
  weaveType: WeaveType,
  x: number,
  y: number,
  settings: PatternSettings,
): {
  isWeftTop: boolean;
  anisotropy: number;
  depth: number;
} {
  const cycle = Math.max(1, settings.over + settings.under);

  if (weaveType === "plain") {
    return { isWeftTop: (x + y) % 2 === 0, anisotropy: 0, depth: 0 };
  }

  if (weaveType === "twill") {
    return {
      isWeftTop: (x + y) % cycle < settings.over,
      anisotropy: 0.04,
      depth: 0,
    };
  }

  if (weaveType === "satin") {
    return {
      isWeftTop: (x * settings.satinStep + y) % cycle === 0,
      anisotropy: 0.12,
      depth: 0,
    };
  }

  if (weaveType === "basket") {
    return {
      isWeftTop:
        (Math.floor(x / Math.max(settings.over, 1)) +
          Math.floor(y / Math.max(settings.under, 1))) %
          2 ===
        0,
      anisotropy: 0.01,
      depth: 0,
    };
  }

  if (weaveType === "jacquard") {
    const noise =
      Math.sin(x * 0.5) *
      Math.cos(y * 0.5) *
      Math.max(settings.jacquardComplexity, 1);
    return {
      isWeftTop: Math.abs(noise) % 2 < 1 && (x + y) % cycle < settings.over,
      anisotropy: 0.06,
      depth: 0,
    };
  }

  if (weaveType === "leno") {
    return {
      isWeftTop: x % 4 === 0 || y % 4 === 0 || (x + y) % cycle < settings.over,
      anisotropy: 0.03,
      depth: 0,
    };
  }

  const isWeftTop = (x + y) % cycle < settings.over;
  return {
    isWeftTop,
    anisotropy: 0.02,
    depth: isWeftTop ? settings.pileDepth : -settings.pileDepth,
  };
}

function drawThreadGloss(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  horizontal: boolean,
  depth: number,
): void {
  const highlightSize = Math.max(2, Math.floor(size * 0.35));
  const inset = Math.max(1, Math.floor(size * 0.18));
  const shadowSize = Math.max(1, Math.floor(size * 0.1));
  const depthBoost = depth === 0 ? 0 : Math.min(0.08, Math.abs(depth) * 0.02);

  context.save();

  context.globalAlpha = 0.16 + depthBoost;
  context.fillStyle = "#ffffff";
  if (horizontal) {
    context.fillRect(x, y + inset, size, highlightSize);
  } else {
    context.fillRect(x + inset, y, highlightSize, size);
  }

  context.globalAlpha = 0.08 + depthBoost / 2;
  context.fillStyle = "#000000";
  if (horizontal) {
    context.fillRect(x, y, size, shadowSize);
    context.fillRect(x, y + size - shadowSize, size, shadowSize);
  } else {
    context.fillRect(x, y, shadowSize, size);
    context.fillRect(x + size - shadowSize, y, shadowSize, size);
  }

  context.restore();
}

function normalizeHex(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color.toLowerCase();
  }

  return "#000000";
}

function mixColors(
  topColor: string,
  bottomColor: string,
  topWeight: number,
): string {
  const top = hexToRgb(topColor);
  const bottom = hexToRgb(bottomColor);
  const weight = clamp(topWeight, 0, 1);

  return rgbToHex({
    r: Math.round(top.r * weight + bottom.r * (1 - weight)),
    g: Math.round(top.g * weight + bottom.g * (1 - weight)),
    b: Math.round(top.b * weight + bottom.b * (1 - weight)),
  });
}

function hexToRgb(color: string): Rgb {
  const normalized = normalizeHex(color);
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex(color: Rgb): string {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

function randomBetween(min: number, max: number): number {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
