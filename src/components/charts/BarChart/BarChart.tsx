import React, { FC, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";

import ChartLegend from "@internal/components/ChartLegend";
import ChartSubtitle from "@internal/components/ChartSubtitle";
import ChartTooltip, { IChartTooltipItem } from "@internal/components/ChartTooltip";

// Styles
import "./BarChart.scss";

// Helpers
import { DEFAULT_CHART_SERIES_COLOR_TOKEN, mergeChartOptions, resolveChartSeriesColor } from "../../../helpers/charts";

interface IBarChartSeries {
    /**
     * Series name shown in the legend and tooltip.
     */
    name: string;
    /**
     * Numeric values corresponding to `categories`.
     */
    data: number[];
    /**
     * Optional bar color. Defaults to `--guit-sem-color-background-accent-blue-2`.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
}

interface IBarChartProps {
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
     * Single column series. Multi-series / grouped bars belong in `GroupedBarChart`.
     */
    series?: IBarChartSeries;
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
     * Minimum value of the Y axis.
     */
    min?: number;
    /**
     * Maximum value of the Y axis.
     */
    max?: number;
    /**
     * Shows the external chart legend under the plot.
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
     * Formats a point value for the tooltip (raw number in, display string out).
     */
    valueFormatter?: (value: number) => string;
    /**
     * Deep-merged Highcharts options override.
     */
    options?: Highcharts.Options;
}

const defaultValueFormatter = (value: number) => `${value}`;

const defaultSeriesColor = `var(${DEFAULT_CHART_SERIES_COLOR_TOKEN})`;

/**
 * Vertical single-series bar (column) chart built on Highcharts.
 * Use GroupedBarChart for multiple series per category. Chart animations are disabled by default.
 */
const BarChart: FC<IBarChartProps> = ({
    className,
    categories,
    series,
    subtitle,
    xAxisTitle,
    yAxisTitle,
    min,
    max,
    showLegend = true,
    loading = false,
    loadingText = "Loading Info",
    emptyTitle = "No Data Available",
    emptyDescription = "No data is available for display at this moment.",
    valueFormatter = defaultValueFormatter,
    options
}) => {
    const colorProbeRef = useRef<HTMLSpanElement>(null);
    const [resolvedColor, setResolvedColor] = useState(series?.color || defaultSeriesColor);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [tooltipItems, setTooltipItems] = useState<IChartTooltipItem[]>([]);
    const [tooltipPointIndex, setTooltipPointIndex] = useState<number | null>(null);
    const [anchorPosition, setAnchorPosition] = useState({ left: 0, top: 0 });
    const hasData = Boolean(series?.data?.length);
    const isRtl = typeof document !== "undefined" && document.dir === "rtl";

    const tooltipHandlersRef = useRef<{
        show: (point: Highcharts.Point) => void;
        hide: () => void;
    }>({
        show: () => undefined,
        hide: () => undefined
    });

    tooltipHandlersRef.current = {
        show: (point) => {
            const { chart } = point.series;

            setAnchorPosition({
                left: chart.plotLeft + (point.plotX ?? 0),
                top: chart.plotTop + (point.plotY ?? 0)
            });
            setTooltipPointIndex(point.index);
            setTooltipItems([
                {
                    name: point.series.name,
                    value: valueFormatter(point.y as number),
                    color: String(point.color)
                }
            ]);
            setIsTooltipOpen(true);
        },
        hide: () => {
            setIsTooltipOpen(false);
            setTooltipItems([]);
        }
    };

    useLayoutEffect(() => {
        if (!series?.data?.length) {
            setResolvedColor(defaultSeriesColor);
            return;
        }

        const resolved = resolveChartSeriesColor(colorProbeRef.current, series.color);
        // Never blank the plot: keep a concrete color when possible, otherwise a token var / provided color.
        setResolvedColor(resolved || series.color || defaultSeriesColor);
    }, [series?.color, series?.data?.length]);

    const resolvedSeries = useMemo(() => {
        if (!series?.data?.length) {
            return null;
        }

        return {
            ...series,
            color: resolvedColor || series.color || defaultSeriesColor
        };
    }, [resolvedColor, series]);

    const legendItems = useMemo(
        () =>
            resolvedSeries
                ? [
                      {
                          name: resolvedSeries.name,
                          color: resolvedSeries.color as string
                      }
                  ]
                : [],
        [resolvedSeries]
    );

    const chartOptions = useMemo(() => {
        if (!resolvedSeries) {
            return {};
        }

        const baseOptions: Highcharts.Options = {
            chart: {
                type: "column",
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
            legend: { enabled: false },
            tooltip: {
                enabled: false
            },
            colors: [resolvedSeries.color as string],
            xAxis: {
                categories,
                title: {
                    text: xAxisTitle,
                    style: {
                        color: "var(--guit-sem-color-foreground-neutral-2)",
                        fontSize: "1.2rem",
                        fontWeight: "500"
                    }
                },
                labels: {
                    style: {
                        color: "var(--guit-sem-color-foreground-neutral-2)",
                        fontSize: "1.2rem",
                        fontWeight: "600"
                    }
                },
                lineColor: "var(--guit-sem-color-border-neutral-2)",
                tickColor: "var(--guit-sem-color-border-neutral-2)",
                tickWidth: 1,
                reversed: isRtl
            },
            yAxis: {
                min,
                max,
                opposite: isRtl,
                title: {
                    text: yAxisTitle,
                    style: {
                        color: "var(--guit-sem-color-foreground-neutral-2)",
                        fontSize: "1.2rem",
                        fontWeight: "500"
                    }
                },
                labels: {
                    style: {
                        color: "var(--guit-sem-color-foreground-neutral-2)",
                        fontSize: "1.2rem",
                        fontWeight: "600"
                    },
                    align: isRtl ? "left" : "right"
                },
                gridLineDashStyle: "Dot",
                gridLineColor: "var(--guit-sem-color-border-neutral-2)",
                lineWidth: 0
            },
            plotOptions: {
                series: {
                    animation: false
                },
                column: {
                    animation: false,
                    borderWidth: 0,
                    borderRadius: 0,
                    groupPadding: 0.2,
                    pointPadding: 0.1,
                    point: {
                        events: {
                            // Highcharts invokes these with the point as `this`; handlers stay fresh via ref.
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
            series: [
                {
                    type: "column",
                    name: resolvedSeries.name,
                    data: resolvedSeries.data,
                    color: resolvedSeries.color,
                    animation: false
                }
            ]
        };

        return mergeChartOptions(baseOptions, options);
    }, [categories, isRtl, max, min, options, resolvedSeries, xAxisTitle, yAxisTitle]);

    const tooltipAnchorKey = tooltipPointIndex ?? "idle";

    return (
        <div className={classNames("barChart", className)}>
            <span
                ref={colorProbeRef}
                className="barChart__colorProbe"
                style={{ backgroundColor: defaultSeriesColor }}
                aria-hidden
            />
            {subtitle && <ChartSubtitle className="barChart__subtitle">{subtitle}</ChartSubtitle>}
            <div className="barChart__body">
                {loading && (
                    <div className="barChart__state">
                        <Loader loading text={loadingText} textPosition="below" size="large" appearance="brand" />
                    </div>
                )}
                {!loading && !hasData && (
                    <div className="barChart__state">
                        <Empty appearance="noData" title={emptyTitle} description={emptyDescription} size="small" />
                    </div>
                )}
                {!loading && hasData && resolvedSeries && (
                    <>
                        <ChartTooltip
                            open={isTooltipOpen}
                            items={tooltipItems}
                            left={anchorPosition.left}
                            top={anchorPosition.top}
                            pointKey={tooltipAnchorKey}
                            onClose={() => setIsTooltipOpen(false)}
                        />
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions}
                            containerProps={{ className: "barChart__plot" }}
                        />
                    </>
                )}
            </div>
            {showLegend && !loading && hasData && resolvedSeries && (
                <ChartLegend className="barChart__legend" items={legendItems} />
            )}
        </div>
    );
};

export { IBarChartProps, IBarChartSeries, BarChart as default };
