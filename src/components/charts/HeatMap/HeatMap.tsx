import React, { FC, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Highcharts from "highcharts";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import HighchartsReact from "highcharts-react-official";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";

import ChartSubtitle from "@internal/components/ChartSubtitle";
import ChartTooltip, { IChartTooltipItem } from "@internal/components/ChartTooltip";

// Helpers
import {
    CHART_AXIS_LABEL_STYLE,
    CHART_AXIS_TITLE_STYLE,
    DEFAULT_CHART_SERIES_COLOR_TOKEN,
    mergeChartOptions,
    resolveChartSeriesColor
} from "../../../helpers/charts";

// Styles
import "./HeatMap.scss";

// Highcharts 11 ships modules as factories; from 12 they self-register on import.
if (typeof HighchartsHeatmap === "function") {
    HighchartsHeatmap(Highcharts);
}

interface IHeatMapSeries {
    /**
     * Series name shown as the row label on the Y axis and in the tooltip.
     */
    name: string;
    /**
     * Numeric values corresponding to `categories`. Use `null` for a cell without a value.
     */
    data: (number | null)[];
}

interface IHeatMapProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Category labels for the X axis.
     */
    categories: string[];
    /**
     * Multiple series rendered as rows of cells, one cell per category. The first series is the bottom row.
     */
    series?: IHeatMapSeries[];
    /**
     * Optional color of the highest value; lower values fade towards transparent.
     * Defaults to `--guit-sem-color-background-accent-blue-2`.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
    /**
     * Optional subtitle rendered above the chart body.
     */
    subtitle?: string;
    /**
     * X axis title text.
     */
    xAxisTitle?: string;
    /**
     * Y axis title text.
     */
    yAxisTitle?: string;
    /**
     * Value mapped to the lightest color. Defaults to the lowest value in `series`.
     */
    min?: number;
    /**
     * Value mapped to the full series color. Defaults to the highest value in `series`.
     */
    max?: number;
    /**
     * Shows the color gradient scale under the plot.
     * @default true
     */
    showLegend?: boolean;
    /**
     * Displays the shared Loader instead of the plot.
     */
    loading?: boolean;
    /**
     * Loader supporting text.
     */
    loadingText?: string;
    /**
     * Empty state title. Forwarded to `Empty`.
     */
    emptyTitle?: string;
    /**
     * Empty state description. Forwarded to `Empty`.
     */
    emptyDescription?: string;
    /**
     * Formats a cell value for the tooltip and the gradient scale labels (raw number in, display string out).
     */
    valueFormatter?: (value: number) => string;
    /**
     * Deep-merged Highcharts options override.
     */
    options?: Highcharts.Options;
}

const defaultValueFormatter = (value: number) => `${value}`;

const defaultSeriesColor = `var(${DEFAULT_CHART_SERIES_COLOR_TOKEN})`;
/** Opacity of the series color at the low end of the scale (Figma gradient start). */
const MIN_COLOR_OPACITY = 0.1;

// Stable reference: HighchartsReact re-runs `chart.update` (recreating the points) whenever this object changes.
const plotContainerProps = { className: "heatMap__plot" };

/**
 * Heat map chart built on Highcharts: a matrix of cells whose color intensity encodes the value.
 * Use it to compare one metric across categories and series at once (e.g. weekday × hour).
 * Chart animations are disabled by default.
 */
const HeatMap: FC<IHeatMapProps> = ({
    className,
    categories,
    series,
    color,
    subtitle,
    xAxisTitle,
    yAxisTitle,
    min,
    max,
    showLegend = true,
    loading = false,
    loadingText,
    emptyTitle,
    emptyDescription,
    valueFormatter = defaultValueFormatter,
    options
}) => {
    const colorProbeRef = useRef<HTMLSpanElement>(null);
    const [colors, setColors] = useState({ series: color || defaultSeriesColor });
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [tooltip, setTooltip] = useState<{ title: string; items: IChartTooltipItem[]; key: string }>({
        title: "",
        items: [],
        key: "idle"
    });
    const [anchorPosition, setAnchorPosition] = useState({ left: 0, top: 0 });
    const hasData = Boolean(series?.some(({ data }) => data?.length));
    const isRtl = typeof document !== "undefined" && document.dir === "rtl";

    const tooltipHandlersRef = useRef<{ show: (point: Highcharts.Point) => void; hide: () => void }>({
        show: () => undefined,
        hide: () => undefined
    });

    tooltipHandlersRef.current = {
        show: (point) => {
            const { chart } = point.series;
            const cellElement = point.graphic?.element;

            if (typeof point.value !== "number" || !cellElement) {
                return;
            }

            // Anchor at the top-center of the cell's on-screen rectangle.
            const cellRect = cellElement.getBoundingClientRect();
            const containerRect = chart.container.getBoundingClientRect();

            // Read the point before any setState: outside React events each setState re-renders synchronously.
            const nextTooltip = {
                title: categories[point.x] ?? "",
                items: [
                    {
                        name: series?.[point.y as number]?.name ?? "",
                        value: valueFormatter(point.value),
                        color: colors.series
                    }
                ],
                key: `${point.x}-${point.y}`
            };

            setAnchorPosition({
                left: (cellRect.left + cellRect.right) / 2 - containerRect.left,
                top: cellRect.top - containerRect.top
            });
            setTooltip(nextTooltip);
            setIsTooltipOpen(true);
        },
        hide: () => setIsTooltipOpen(false)
    };

    useLayoutEffect(() => {
        const probe = colorProbeRef.current;

        setColors({
            // Never blank the plot: keep a concrete color when possible, otherwise a token var / provided color.
            series: resolveChartSeriesColor(probe, color) || color || defaultSeriesColor
        });
    }, [color]);

    const chartOptions = useMemo(() => {
        if (!series || !hasData) {
            return {};
        }

        const baseOptions: Highcharts.Options = {
            chart: {
                type: "heatmap",
                height: null,
                animation: false,
                backgroundColor: "transparent",
                style: {
                    fontFamily: "inherit"
                }
            },
            title: { text: undefined },
            subtitle: { text: undefined },
            credits: { enabled: false },
            tooltip: { enabled: false },
            legend: {
                enabled: showLegend,
                align: isRtl ? "right" : "left",
                verticalAlign: "bottom",
                layout: "horizontal",
                padding: 0,
                margin: 16,
                symbolWidth: 344,
                symbolHeight: 12
            },
            colorAxis: {
                min,
                max,
                reversed: isRtl,
                minColor: Highcharts.color(colors.series).setOpacity(MIN_COLOR_OPACITY).get("rgba") as string,
                maxColor: colors.series,
                gridLineColor: "var(--guit-sem-color-border-neutral-1)",
                labels: {
                    style: CHART_AXIS_LABEL_STYLE,
                    formatter: (context: Highcharts.AxisLabelsFormatterContextObject) =>
                        valueFormatter(context.value as number)
                }
            },
            xAxis: {
                categories,
                reversed: isRtl,
                title: { text: xAxisTitle, style: CHART_AXIS_TITLE_STYLE },
                labels: { style: CHART_AXIS_LABEL_STYLE },
                lineColor: "var(--guit-sem-color-border-neutral-2)",
                tickColor: "var(--guit-sem-color-border-neutral-2)",
                tickWidth: 1,
                tickLength: 12
            },
            yAxis: {
                categories: series.map(({ name }) => name),
                opposite: isRtl,
                title: { text: yAxisTitle, style: CHART_AXIS_TITLE_STYLE },
                labels: { style: CHART_AXIS_LABEL_STYLE },
                gridLineWidth: 0
            },
            plotOptions: {
                series: {
                    animation: false
                },
                heatmap: {
                    animation: false,
                    borderWidth: 1,
                    borderColor: "var(--guit-sem-color-border-neutral-1)",
                    nullColor: "transparent",
                    point: {
                        events: {
                            mouseOver(this: Highcharts.Point) {
                                tooltipHandlersRef.current.show(this);
                            },
                            mouseOut() {
                                tooltipHandlersRef.current.hide();
                            }
                        }
                    }
                }
            },
            responsive: {
                rules: [
                    {
                        // The gradient scale is wider than a mobile-width chart.
                        condition: { maxWidth: 360 },
                        chartOptions: { legend: { symbolWidth: 240 } }
                    }
                ]
            },
            series: [
                {
                    type: "heatmap",
                    data: series.flatMap(({ data }, rowIndex) =>
                        (data ?? []).map((value, columnIndex) => [columnIndex, rowIndex, value])
                    ),
                    animation: false
                }
            ]
        };

        return mergeChartOptions(baseOptions, options);
    }, [
        categories,
        colors,
        hasData,
        isRtl,
        max,
        min,
        options,
        series,
        showLegend,
        valueFormatter,
        xAxisTitle,
        yAxisTitle
    ]);

    return (
        <div className={classNames("heatMap", className)}>
            <span ref={colorProbeRef} className="heatMap__colorProbe" aria-hidden />
            {subtitle && <ChartSubtitle className="heatMap__subtitle">{subtitle}</ChartSubtitle>}
            <div className="heatMap__body">
                {loading && (
                    <div className="heatMap__state">
                        <Loader loading text={loadingText} textPosition="below" size="large" appearance="brand" />
                    </div>
                )}
                {!loading && !hasData && (
                    <div className="heatMap__state">
                        <Empty appearance="noData" title={emptyTitle} description={emptyDescription} size="small" />
                    </div>
                )}
                {!loading && hasData && (
                    <>
                        <ChartTooltip
                            open={isTooltipOpen}
                            title={tooltip.title}
                            items={tooltip.items}
                            left={anchorPosition.left}
                            top={anchorPosition.top}
                            pointKey={tooltip.key}
                            onClose={() => setIsTooltipOpen(false)}
                        />
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions}
                            containerProps={plotContainerProps}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export { IHeatMapProps, IHeatMapSeries, HeatMap as default };
