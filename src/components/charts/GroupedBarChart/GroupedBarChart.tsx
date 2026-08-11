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
import "./GroupedBarChart.scss";

// Helpers
import {
    getDefaultGroupedChartSeriesColorToken,
    mergeChartOptions,
    resolveGroupedChartSeriesColor
} from "../../../helpers/charts";

interface IGroupedBarChartSeries {
    /**
     * Series name shown in the legend and tooltip.
     */
    name: string;
    /**
     * Numeric values corresponding to `categories`.
     */
    data: number[];
    /**
     * Optional bar color. Defaults cycle through the grouped chart accent palette.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
}

interface IGroupedBarChartProps {
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
     * Multiple column series rendered as grouped bars per category.
     */
    series?: IGroupedBarChartSeries[];
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
     * Deep-merged Highcharts options override for chart-level tweaks (axes, plotOptions, etc.).
     * Note: `series` is managed via the `series` prop and is ignored here, so the plot stays
     * in sync with the legend, tooltip, and visibility toggles.
     */
    options?: Highcharts.Options;
}

const defaultValueFormatter = (value: number) => `${value}`;

/**
 * Vertical multi-series grouped bar (column) chart built on Highcharts.
 * Hover shows all series values for the hovered category. Chart animations are disabled by default.
 */
const GroupedBarChart: FC<IGroupedBarChartProps> = ({
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
    const [resolvedSeries, setResolvedSeries] = useState<IGroupedBarChartSeries[]>(() => {
        if (!series?.length) {
            return [];
        }

        return series.map((seriesItem, index) => ({
            ...seriesItem,
            color: seriesItem.color || `var(${getDefaultGroupedChartSeriesColorToken(index)})`
        }));
    });
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [tooltipItems, setTooltipItems] = useState<IChartTooltipItem[]>([]);
    const [tooltipCategoryIndex, setTooltipCategoryIndex] = useState<number | null>(null);
    const [anchorPosition, setAnchorPosition] = useState({ left: 0, top: 0 });
    const [hiddenSeriesIndexes, setHiddenSeriesIndexes] = useState<Record<number, boolean>>({});
    const hasData = Boolean(series?.some(({ data }) => data?.length));
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
            const categoryIndex = point.index;
            const categoryPoints = chart.series
                .filter((chartSeries) => chartSeries.visible)
                .map((chartSeries) => chartSeries.points[categoryIndex])
                .filter((categoryPoint): categoryPoint is Highcharts.Point => Boolean(categoryPoint));

            if (!categoryPoints.length) {
                return;
            }

            const averagePlotX =
                categoryPoints.reduce((sum, categoryPoint) => sum + (categoryPoint.plotX ?? 0), 0) /
                categoryPoints.length;
            const topPlotY = Math.min(...categoryPoints.map((categoryPoint) => categoryPoint.plotY ?? 0));

            setAnchorPosition({
                left: chart.plotLeft + averagePlotX,
                top: chart.plotTop + topPlotY
            });
            setTooltipCategoryIndex(categoryIndex);
            setTooltipItems(
                categoryPoints.map((categoryPoint) => ({
                    name: categoryPoint.series.name,
                    value: valueFormatter(categoryPoint.y as number),
                    color: String(categoryPoint.color)
                }))
            );
            setIsTooltipOpen(true);
        },
        hide: () => {
            setIsTooltipOpen(false);
            setTooltipItems([]);
        }
    };

    useLayoutEffect(() => {
        if (!series?.length || !series.some(({ data }) => data?.length)) {
            setResolvedSeries([]);
            return;
        }

        const probe = colorProbeRef.current;

        setResolvedSeries(
            series.map((seriesItem, index) => {
                const fallbackColor = `var(${getDefaultGroupedChartSeriesColorToken(index)})`;
                const resolved = resolveGroupedChartSeriesColor(probe, seriesItem.color, index);

                return {
                    ...seriesItem,
                    color: resolved || seriesItem.color || fallbackColor
                };
            })
        );
    }, [series]);

    const legendItems = useMemo(
        () =>
            resolvedSeries.map(({ name, color }, index) => ({
                name,
                color: color as string,
                visible: !hiddenSeriesIndexes[index]
            })),
        [hiddenSeriesIndexes, resolvedSeries]
    );

    const handleLegendItemClick = (_item: { name: string }, index: number) => {
        setHiddenSeriesIndexes((previous) => ({
            ...previous,
            [index]: !previous[index]
        }));
        setIsTooltipOpen(false);
        setTooltipItems([]);
    };

    const chartOptions = useMemo(() => {
        if (!resolvedSeries.length) {
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
            colors: resolvedSeries.map(({ color }) => color as string),
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
                    borderRadius: {
                        // Figma `radius/3xsmall` (`--guit-ref-radius-3xsmall` = 4px)
                        radius: 4,
                        scope: "point",
                        where: "end"
                    },
                    groupPadding: 0.15,
                    pointPadding: 0.05,
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
            series: resolvedSeries.map(({ name, data, color }, index) => ({
                type: "column" as const,
                name,
                data,
                color,
                visible: !hiddenSeriesIndexes[index],
                animation: false
            }))
        };

        // `series` is owned by the `series` prop so the legend, tooltip, and visibility
        // toggles stay in sync with the plot. Drop any `series` coming through `options`
        // (arrays replace on merge, which would otherwise clobber the managed series).
        let optionsOverride = options;
        if (options && "series" in options) {
            optionsOverride = { ...options };
            delete optionsOverride.series;
        }

        return mergeChartOptions(baseOptions, optionsOverride);
    }, [categories, hiddenSeriesIndexes, isRtl, max, min, options, resolvedSeries, xAxisTitle, yAxisTitle]);

    const tooltipAnchorKey = tooltipCategoryIndex ?? "idle";

    return (
        <div className={classNames("groupedBarChart", className)}>
            <span
                ref={colorProbeRef}
                className="groupedBarChart__colorProbe"
                style={{ backgroundColor: `var(${getDefaultGroupedChartSeriesColorToken(0)})` }}
                aria-hidden
            />
            {subtitle && <ChartSubtitle className="groupedBarChart__subtitle">{subtitle}</ChartSubtitle>}
            <div className="groupedBarChart__body">
                {loading && (
                    <div className="groupedBarChart__state">
                        <Loader loading text={loadingText} textPosition="below" size="large" appearance="brand" />
                    </div>
                )}
                {!loading && !hasData && (
                    <div className="groupedBarChart__state">
                        <Empty appearance="noData" title={emptyTitle} description={emptyDescription} size="small" />
                    </div>
                )}
                {!loading && hasData && resolvedSeries.length > 0 && (
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
                            containerProps={{
                                className: "groupedBarChart__plot",
                                role: "img",
                                "aria-label": subtitle ? `Grouped bar chart: ${subtitle}` : "Grouped bar chart"
                            }}
                        />
                    </>
                )}
            </div>
            {showLegend && !loading && hasData && resolvedSeries.length > 0 && (
                <ChartLegend
                    className="groupedBarChart__legend"
                    items={legendItems}
                    onItemClick={handleLegendItemClick}
                />
            )}
        </div>
    );
};

export { IGroupedBarChartProps, IGroupedBarChartSeries, GroupedBarChart as default };
