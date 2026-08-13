/**
 * Resolves a CSS color value via a probe element already mounted in the theme tree
 * (e.g. a hidden span ref inside the chart). Highcharts needs a concrete color value.
 */
const readResolvedBackground = (probe: HTMLElement, cssBackground: string): string => {
    const colorProbe = probe;
    colorProbe.style.backgroundColor = cssBackground;
    const resolved = getComputedStyle(colorProbe).backgroundColor;

    if (!resolved || resolved === "rgba(0, 0, 0, 0)" || resolved === "transparent") {
        return "";
    }

    return resolved;
};

const isCssCustomPropertyName = (value: string): boolean => value.startsWith("--");

const isCssVarFunction = (value: string): boolean => /^var\(/i.test(value);

/**
 * Resolves a custom-property token name (e.g. `--guit-…`) through the probe.
 */
export const resolveCssColor = (token: string, probe: HTMLElement): string =>
    readResolvedBackground(probe, `var(${token})`);

/** Figma `color/background/accent-blue-2` — default single-series bar fill. */
export const DEFAULT_CHART_SERIES_COLOR_TOKEN = "--guit-sem-color-background-accent-blue-2";

/**
 * Default palette for multi-series charts (Figma Grouped Bar Chart channels).
 * Order: red, blue, green, purple, then additional accents.
 */
export const DEFAULT_GROUPED_CHART_SERIES_COLOR_TOKENS = [
    "--guit-sem-color-background-accent-red-2",
    "--guit-sem-color-background-accent-blue-2",
    "--guit-sem-color-background-accent-green-2",
    "--guit-sem-color-background-accent-purple-2",
    "--guit-sem-color-background-accent-orange-2",
    "--guit-sem-color-background-accent-magenta-2",
    "--guit-sem-color-background-accent-lagoon-2",
    "--guit-sem-color-background-accent-slate-2"
] as const;

export const getDefaultChartSeriesColor = (probe: HTMLElement): string =>
    resolveCssColor(DEFAULT_CHART_SERIES_COLOR_TOKEN, probe);

export const getDefaultGroupedChartSeriesColorToken = (index: number): string =>
    DEFAULT_GROUPED_CHART_SERIES_COLOR_TOKENS[index % DEFAULT_GROUPED_CHART_SERIES_COLOR_TOKENS.length];

export const getDefaultGroupedChartSeriesColor = (probe: HTMLElement, index: number): string =>
    resolveCssColor(getDefaultGroupedChartSeriesColorToken(index), probe);

/**
 * Resolves a series color for Highcharts.
 * Concrete colors (hex / rgb / named) pass through; CSS variables and token names go through the probe.
 * Returns `""` when a CSS variable cannot be resolved yet.
 */
export const resolveChartSeriesColor = (probe: HTMLElement | null, color?: string): string => {
    if (!probe) {
        return "";
    }

    if (!color) {
        return getDefaultChartSeriesColor(probe);
    }

    const trimmed = color.trim();

    if (isCssCustomPropertyName(trimmed)) {
        return resolveCssColor(trimmed, probe);
    }

    if (isCssVarFunction(trimmed)) {
        return readResolvedBackground(probe, trimmed);
    }

    return trimmed;
};

/**
 * Resolves a grouped-series color. Falls back to the palette token at `index` when `color` is omitted.
 */
export const resolveGroupedChartSeriesColor = (
    probe: HTMLElement | null,
    color: string | undefined,
    index: number
): string => {
    if (!probe) {
        return "";
    }

    if (!color) {
        return getDefaultGroupedChartSeriesColor(probe, index);
    }

    return resolveChartSeriesColor(probe, color);
};
