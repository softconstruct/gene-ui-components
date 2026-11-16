import React, { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";

import ChartLegend from "@internal/components/ChartLegend";
import ChartSubtitle from "@internal/components/ChartSubtitle";
import ChartTooltip, { IChartTooltipItem } from "@internal/components/ChartTooltip";

// Helpers
import {
    getDefaultGroupedChartSeriesColorToken,
    mergeChartOptions,
    resolveGroupedChartSeriesColor
} from "../../../helpers/charts";

// Styles
import "./DualAxisChart.scss";

interface IDualAxisChartSeries {
    /**
     * Series name shown in the legend and tooltip.
     */
    name: string;
    /**
     * Series type. `column` series are plotted against the primary Y axis,
     * `line` series (smooth line with point markers) against the secondary Y axis.
     * Possible values: `column | line`
     */
    type: "column" | "line";
    /**
     * Numeric values corresponding to `categories`.
     */
    data: number[];
    /**
     * Optional series color. Defaults cycle through the grouped chart accent palette.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
    /**
     * Formats this series' point value for the tooltip. Overrides the chart-level `valueFormatter`,
     * useful when the two axes have different units.
     */
    valueFormatter?: (value: number) => string;
}

interface IDualAxisChartProps {
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
     * Column and line series sharing the categories. Lines are drawn above the columns.
     */
    series?: IDualAxisChartSeries[];
    /**
     * Optional subtitle rendered above the chart body.
     */
    subtitle?: string;
    /**
     * X axis title text.
     */
    xAxisTitle?: string;
    /**
     * Primary (column) Y axis title text.
     */
    yAxisTitle?: string;
    /**
     * Minimum value of the primary (column) Y axis.
     */
    min?: number;
    /**
     * Maximum value of the primary (column) Y axis.
     */
    max?: number;
    /**
     * Secondary (line) Y axis title text.
     */
    secondaryYAxisTitle?: string;
    /**
     * Minimum value of the secondary (line) Y axis.
     */
    secondaryMin?: number;
    /**
     * Maximum value of the secondary (line) Y axis.
     */
    secondaryMax?: number;
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
     * A series' own `valueFormatter` takes precedence.
     */
    valueFormatter?: (value: number) => string;
    /**
     * Deep-merged Highcharts options override for chart-level tweaks (axes, plotOptions, etc.).
     * Note: `series` is managed via the `series` prop and is ignored here, so the plot stays
     * in sync with the legend, tooltip, and visibility toggles.
     */
    options?: Highcharts.Options;
}

interface IDualAxisChartTooltipState {
    open: boolean;
    items: IChartTooltipItem[];
    pointKey: string | null;
    left: number;
    top: number;
}

const defaultValueFormatter = (value: number) => `${value}`;

const closedTooltip: IDualAxisChartTooltipState = { open: false, items: [], pointKey: null, left: 0, top: 0 };

const PRIMARY_Y_AXIS_INDEX = 0;
const SECONDARY_Y_AXIS_INDEX = 1;

const axisTitleStyle: Highcharts.CSSObject = {
    color: "var(--guit-sem-color-foreground-neutral-2)",
    fontSize: "1.2rem",
    fontWeight: "500"
};

const axisLabelStyle: Highcharts.CSSObject = {
    color: "var(--guit-sem-color-foreground-neutral-2)",
    fontSize: "1.2rem",
    fontWeight: "600"
};

/**
 * Dual axis chart built on Highcharts. Renders a column series and a smooth line series over shared categories, each on its own Y axis, to compare two measures with different scales; hovering a column or line point shows a tooltip for that point. Chart animations are disabled by default.
 */
const DualAxisChart: FC<IDualAxisChartProps> = ({
    className,
    categories,
    series,
    subtitle,
    xAxisTitle,
    yAxisTitle,
    min,
    max,
    secondaryYAxisTitle,
    secondaryMin,
    secondaryMax,
    showLegend = true,
    loading = false,
    loadingText,
    emptyTitle,
    emptyDescription,
    valueFormatter = defaultValueFormatter,
    options
}) => {
    const colorProbeRef = useRef<HTMLSpanElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [resolvedSeries, setResolvedSeries] = useState<IDualAxisChartSeries[]>([]);
    // One state object so a hover is a single render (Highcharts events are not batched by React 16).
    const [tooltip, setTooltip] = useState<IDualAxisChartTooltipState>(closedTooltip);
    const [hiddenSeriesIndexes, setHiddenSeriesIndexes] = useState<Record<number, boolean>>({});
    const [frozenBodyHeight, setFrozenBodyHeight] = useState<number | null>(null);
    const hasData = Boolean(series?.some(({ data }) => data?.length));
    const isRtl = typeof document !== "undefined" && document.dir === "rtl";
    const isLegendExpanded = frozenBodyHeight !== null;

    const handleLegendExpandedChange = (expanded: boolean) => {
        setFrozenBodyHeight(expanded ? (bodyRef.current?.offsetHeight ?? null) : null);
    };

    const tooltipHandlersRef = useRef<{
        show: (point: Highcharts.Point) => void;
        hide: () => void;
        scheduleHide: () => void;
    }>({
        show: () => undefined,
        hide: () => undefined,
        scheduleHide: () => undefined
    });

    const cancelScheduledHide = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    tooltipHandlersRef.current = {
        show: (point) => {
            cancelScheduledHide();

            const { chart } = point.series;
            const seriesIndex = point.series.index;
            const columnElement = point.series.type === "column" ? point.graphic?.element : undefined;
            let anchor = {
                left: chart.plotLeft + (point.plotX ?? 0),
                top: chart.plotTop + (point.plotY ?? 0)
            };

            // Columns anchor at the top-center of the bar's on-screen rectangle: with several column
            // series per category `plotX` is the category center, not the hovered column's.
            if (columnElement) {
                const columnRect = columnElement.getBoundingClientRect();
                const containerRect = chart.container.getBoundingClientRect();

                anchor = {
                    left: (columnRect.left + columnRect.right) / 2 - containerRect.left,
                    top: columnRect.top - containerRect.top
                };
            }

            const formatValue = resolvedSeries[seriesIndex]?.valueFormatter ?? valueFormatter;

            setTooltip({
                open: true,
                pointKey: `${seriesIndex}-${point.index}`,
                ...anchor,
                items: [
                    {
                        name: point.series.name,
                        value: formatValue(point.y as number),
                        color: String(point.series.color)
                    }
                ]
            });
        },
        hide: () => {
            cancelScheduledHide();
            setTooltip(closedTooltip);
        },
        // Highcharts fires `mouseOut` right before the next point's `mouseOver`; deferring the hide
        // lets that `mouseOver` cancel it, so the tooltip doesn't blink between points.
        scheduleHide: () => {
            cancelScheduledHide();
            hideTimeoutRef.current = setTimeout(() => tooltipHandlersRef.current.hide());
        }
    };

    useEffect(() => cancelScheduledHide, []);

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
        tooltipHandlersRef.current.hide();
    };

    const chartOptions = useMemo(() => {
        if (!resolvedSeries.length) {
            return {};
        }

        const pointEvents = {
            mouseOver(this: Highcharts.Point) {
                tooltipHandlersRef.current.show(this);
            },
            mouseOut() {
                tooltipHandlersRef.current.scheduleHide();
            }
        };

        const baseOptions: Highcharts.Options = {
            chart: {
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
                    style: axisTitleStyle
                },
                labels: {
                    style: axisLabelStyle
                },
                lineColor: "var(--guit-sem-color-border-neutral-2)",
                tickColor: "var(--guit-sem-color-border-neutral-2)",
                tickWidth: 1,
                reversed: isRtl
            },
            yAxis: [
                {
                    min,
                    max,
                    opposite: isRtl,
                    title: {
                        text: yAxisTitle,
                        style: axisTitleStyle
                    },
                    labels: {
                        style: axisLabelStyle,
                        align: isRtl ? "left" : "right"
                    },
                    gridLineDashStyle: "Dot",
                    gridLineColor: "var(--guit-sem-color-border-neutral-2)",
                    lineWidth: 0
                },
                {
                    min: secondaryMin,
                    max: secondaryMax,
                    opposite: !isRtl,
                    // Grid lines come from the primary axis only; two grids that don't line up are noise.
                    gridLineWidth: 0,
                    // Hide the axis while every line series is toggled off in the legend.
                    showEmpty: false,
                    title: {
                        text: secondaryYAxisTitle,
                        style: axisTitleStyle
                    },
                    labels: {
                        style: axisLabelStyle,
                        align: isRtl ? "right" : "left"
                    },
                    lineWidth: 0
                }
            ],
            plotOptions: {
                series: {
                    animation: false,
                    states: {
                        inactive: {
                            enabled: false
                        }
                    }
                },
                column: {
                    animation: false,
                    borderWidth: 0,
                    borderRadius: {
                        radius: 4,
                        scope: "point",
                        where: "end"
                    },
                    groupPadding: 0.35,
                    pointPadding: 0.05,
                    point: {
                        events: pointEvents
                    }
                },
                spline: {
                    animation: false,
                    lineWidth: 2,
                    marker: {
                        enabled: true,
                        symbol: "circle",
                        radius: 3,
                        states: {
                            hover: {
                                radiusPlus: 1,
                                lineWidthPlus: 0
                            }
                        }
                    },
                    states: {
                        hover: {
                            lineWidthPlus: 0,
                            halo: { size: 0 }
                        }
                    },
                    point: {
                        events: pointEvents
                    }
                }
            },
            series: resolvedSeries.map(({ name, type, data, color }, index) => {
                const isLine = type === "line";

                return {
                    type: isLine ? ("spline" as const) : ("column" as const),
                    name,
                    data,
                    color,
                    yAxis: isLine ? SECONDARY_Y_AXIS_INDEX : PRIMARY_Y_AXIS_INDEX,
                    // Lines stay readable above the columns regardless of series order.
                    zIndex: isLine ? 1 : 0,
                    visible: !hiddenSeriesIndexes[index],
                    animation: false
                };
            })
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
    }, [
        categories,
        hiddenSeriesIndexes,
        isRtl,
        max,
        min,
        options,
        resolvedSeries,
        secondaryMax,
        secondaryMin,
        secondaryYAxisTitle,
        xAxisTitle,
        yAxisTitle
    ]);

    // `HighchartsReact` is memoized; a new `containerProps` object per render would call
    // `chart.update()` on every hover.
    const plotContainerProps = useMemo(
        () => ({
            className: "dualAxisChart__plot",
            role: "img",
            "aria-label": subtitle ? `Dual axis chart: ${subtitle}` : "Dual axis chart"
        }),
        [subtitle]
    );

    const tooltipAnchorKey = tooltip.pointKey ?? "idle";

    return (
        <div
            className={classNames("dualAxisChart", className, {
                dualAxisChart_legendExpanded: isLegendExpanded
            })}
        >
            <span
                ref={colorProbeRef}
                className="dualAxisChart__colorProbe"
                style={{ backgroundColor: `var(${getDefaultGroupedChartSeriesColorToken(0)})` }}
                aria-hidden
            />
            {subtitle && <ChartSubtitle className="dualAxisChart__subtitle">{subtitle}</ChartSubtitle>}
            <div
                ref={bodyRef}
                className={classNames("dualAxisChart__body", {
                    dualAxisChart__body_frozen: isLegendExpanded
                })}
                style={frozenBodyHeight !== null ? { height: frozenBodyHeight } : undefined}
            >
                {loading && (
                    <div className="dualAxisChart__state">
                        <Loader loading text={loadingText} textPosition="below" size="large" appearance="brand" />
                    </div>
                )}
                {!loading && !hasData && (
                    <div className="dualAxisChart__state">
                        <Empty appearance="noData" title={emptyTitle} description={emptyDescription} size="small" />
                    </div>
                )}
                {!loading && hasData && resolvedSeries.length > 0 && (
                    <>
                        <ChartTooltip
                            open={tooltip.open}
                            items={tooltip.items}
                            left={tooltip.left}
                            top={tooltip.top}
                            pointKey={tooltipAnchorKey}
                            onClose={() => tooltipHandlersRef.current.hide()}
                        />
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions}
                            containerProps={plotContainerProps}
                        />
                    </>
                )}
            </div>
            {showLegend && !loading && hasData && resolvedSeries.length > 0 && (
                <ChartLegend
                    className="dualAxisChart__legend"
                    items={legendItems}
                    onItemClick={handleLegendItemClick}
                    onExpandedChange={handleLegendExpandedChange}
                />
            )}
        </div>
    );
};

export { IDualAxisChartProps, IDualAxisChartSeries, DualAxisChart as default };
