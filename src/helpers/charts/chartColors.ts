/**
 * Resolves a CSS custom property via a probe element already mounted in the theme tree
 * (e.g. a hidden span ref inside the chart). Highcharts needs a concrete color value.
 */
const resolveCssColor = (token: string, probe: HTMLElement): string => {
    const colorProbe = probe;
    colorProbe.style.backgroundColor = `var(${token})`;
    const resolved = getComputedStyle(colorProbe).backgroundColor;

    if (!resolved || resolved === "rgba(0, 0, 0, 0)" || resolved === "transparent") {
        return "";
    }

    return resolved;
};

/** Figma `color/background/accent-blue-2` — default single-series bar fill. */
export const DEFAULT_CHART_SERIES_COLOR_TOKEN = "--guit-sem-color-background-accent-blue-2";

export const getDefaultChartSeriesColor = (probe: HTMLElement): string =>
    resolveCssColor(DEFAULT_CHART_SERIES_COLOR_TOKEN, probe);
