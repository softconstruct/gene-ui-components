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

export const getDefaultChartSeriesColor = (probe: HTMLElement): string =>
    resolveCssColor(DEFAULT_CHART_SERIES_COLOR_TOKEN, probe);

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
