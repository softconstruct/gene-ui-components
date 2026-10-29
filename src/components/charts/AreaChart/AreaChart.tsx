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
import "./AreaChart.scss";

interface IAreaChartSeries {
    /**
     * Series name shown in the legend and tooltip.
     */
    name: string;
    /**
     * Numeric values corresponding to `categories`.
     */
    data: number[];
    /**
     * Optional line / area color. Defaults cycle through the grouped chart accent palette.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
}

interface IAreaChartProps {
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
     * Multiple series rendered as overlapping smooth areas.
     */
    series?: IAreaChartSeries[];
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

interface IAreaChartTooltipState {
    open: boolean;
    items: IChartTooltipItem[];
    categoryIndex: number | null;
    left: number;
    top: number;
}

const defaultValueFormatter = (value: number) => `${value}`;

const closedTooltip: IAreaChartTooltipState = { open: false, items: [], categoryIndex: null, left: 0, top: 0 };

/** Area fill opacity at the top of the gradient; it fades to fully transparent at the bottom. */
const AREA_FILL_OPACITY = 0.3;

const getAreaFillColor = (color: string): Highcharts.GradientColorObject => ({
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
        [0, Highcharts.color(color).setOpacity(AREA_FILL_OPACITY).get("rgba") as string],
        [1, Highcharts.color(color).setOpacity(0).get("rgba") as string]
    ]
});

/**
 * Multi-series area chart built on Highcharts. Smooth overlapping areas with a fading fill;
 * hover shows a crosshair with every series' value at that category. Chart animations are disabled by default.
 */
const AreaChart: FC<IAreaChartProps> = ({
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
    loadingText,
    emptyTitle,
    emptyDescription,
    valueFormatter = defaultValueFormatter,
    options
}) => {
    const colorProbeRef = useRef<HTMLSpanElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<{ chart: Highcharts.Chart; categoryIndex: number } | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [resolvedSeries, setResolvedSeries] = useState<IAreaChartSeries[]>([]);
    // One state object so a hover is a single render (Highcharts events are not batched by React 16).
    const [tooltip, setTooltip] = useState<IAreaChartTooltipState>(closedTooltip);
    const [hiddenSeriesIndexes, setHiddenSeriesIndexes] = useState<Record<number, boolean>>({});
    const [frozenBodyHeight, setFrozenBodyHeight] = useState<number | null>(null);
    const hasData = Boolean(series?.some(({ data }) => data?.length));
    const isRtl = typeof document !== "undefined" && document.dir === "rtl";
    const isLegendExpanded = frozenBodyHeight !== null;

    const handleLegendExpandedChange = (expanded: boolean) => {
        setFrozenBodyHeight(expanded ? (bodyRef.current?.offsetHeight ?? null) : null);
    };

    // Highcharts only highlights the hovered series' point; the design shows a marker on
    // every visible series at the hovered category, so those states are managed here.
    // A series has ONE shared hover-marker graphic: resetting the previous category's point hides
    // the marker Highcharts already moved to the new hovered point. So "hover" is re-applied to every
    // point (the hovered one included) with `move = true`, which skips the "already in this state"
    // guard and redraws the marker.
    const setCategoryPointsState = (state: "" | "hover") => {
        const highlight = highlightRef.current;

        if (!highlight?.chart.series) {
            return;
        }

        const { chart, categoryIndex } = highlight;

        chart.series.forEach((chartSeries) => {
            const categoryPoint = chartSeries.points?.[categoryIndex];

            if (!categoryPoint) {
                return;
            }

            if (state === "hover") {
                if (chartSeries.visible) {
                    categoryPoint.setState(state, true);
                }
            } else if (categoryPoint !== chart.hoverPoint) {
                categoryPoint.setState(state);
            }
        });
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
            const categoryIndex = point.index;

            // Moving between series at the same category: only the markers need re-applying
            // (Highcharts resets the previously hovered point), the tooltip stays as is.
            if (highlightRef.current?.chart === chart && highlightRef.current.categoryIndex === categoryIndex) {
                setCategoryPointsState("hover");
                return;
            }

            const categoryPoints = chart.series
                .filter((chartSeries) => chartSeries.visible)
                .map((chartSeries) => chartSeries.points[categoryIndex])
                .filter((categoryPoint): categoryPoint is Highcharts.Point => Boolean(categoryPoint));

            if (!categoryPoints.length) {
                return;
            }

            setCategoryPointsState("");
            highlightRef.current = { chart, categoryIndex };
            setCategoryPointsState("hover");

            const topPlotY = Math.min(...categoryPoints.map((categoryPoint) => categoryPoint.plotY ?? 0));

            setTooltip({
                open: true,
                categoryIndex,
                left: chart.plotLeft + (point.plotX ?? 0),
                top: chart.plotTop + topPlotY,
                items: categoryPoints.map((categoryPoint) => ({
                    name: categoryPoint.series.name,
                    value: valueFormatter(categoryPoint.y as number),
                    color: String(categoryPoint.series.color)
                }))
            });
        },
        hide: () => {
            cancelScheduledHide();
            setCategoryPointsState("");
            highlightRef.current = null;
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

        const baseOptions: Highcharts.Options = {
            chart: {
                type: "areaspline",
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
                tickmarkPlacement: "on",
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
                crosshair: {
                    width: 1,
                    dashStyle: "Dash",
                    color: "var(--guit-sem-color-border-neutral-4)"
                },
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
                areaspline: {
                    animation: false,
                    lineWidth: 2,
                    // Category axes pad half a category on each side; `on` lets the areas reach the plot edges.
                    pointPlacement: "on",
                    marker: {
                        enabled: false,
                        symbol: "circle",
                        radius: 4,
                        states: {
                            hover: {
                                enabled: true,
                                radiusPlus: 0,
                                lineWidthPlus: 0
                            }
                        }
                    },
                    states: {
                        hover: {
                            lineWidthPlus: 0,
                            halo: { size: 0 }
                        },
                        inactive: {
                            enabled: false
                        }
                    },
                    point: {
                        events: {
                            mouseOver(this: Highcharts.Point) {
                                tooltipHandlersRef.current.show(this);
                            },
                            mouseOut() {
                                tooltipHandlersRef.current.scheduleHide();
                            }
                        }
                    }
                }
            },
            series: resolvedSeries.map(({ name, data, color }, index) => ({
                type: "areaspline" as const,
                name,
                data,
                color,
                fillColor: getAreaFillColor(color as string),
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

    // `HighchartsReact` is memoized; a new `containerProps` object per render would call
    // `chart.update()` on every hover and reset the hovered points' state.
    const plotContainerProps = useMemo(
        () => ({
            className: "areaChart__plot",
            role: "img",
            "aria-label": subtitle ? `Area chart: ${subtitle}` : "Area chart"
        }),
        [subtitle]
    );

    const tooltipAnchorKey = tooltip.categoryIndex ?? "idle";

    return (
        <div
            className={classNames("areaChart", className, {
                areaChart_legendExpanded: isLegendExpanded
            })}
        >
            <span
                ref={colorProbeRef}
                className="areaChart__colorProbe"
                style={{ backgroundColor: `var(${getDefaultGroupedChartSeriesColorToken(0)})` }}
                aria-hidden
            />
            {subtitle && <ChartSubtitle className="areaChart__subtitle">{subtitle}</ChartSubtitle>}
            <div
                ref={bodyRef}
                className={classNames("areaChart__body", {
                    areaChart__body_frozen: isLegendExpanded
                })}
                style={frozenBodyHeight !== null ? { height: frozenBodyHeight } : undefined}
            >
                {loading && (
                    <div className="areaChart__state">
                        <Loader loading text={loadingText} textPosition="below" size="large" appearance="brand" />
                    </div>
                )}
                {!loading && !hasData && (
                    <div className="areaChart__state">
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
                    className="areaChart__legend"
                    items={legendItems}
                    onItemClick={handleLegendItemClick}
                    onExpandedChange={handleLegendExpandedChange}
                />
            )}
        </div>
    );
};

export { IAreaChartProps, IAreaChartSeries, AreaChart as default };
