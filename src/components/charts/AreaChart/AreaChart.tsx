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

const defaultValueFormatter = (value: number) => `${value}`;

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

    const [resolvedSeries, setResolvedSeries] = useState<IAreaChartSeries[]>([]);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [tooltipItems, setTooltipItems] = useState<IChartTooltipItem[]>([]);
    const [tooltipCategoryIndex, setTooltipCategoryIndex] = useState<number | null>(null);
    const [anchorPosition, setAnchorPosition] = useState({ left: 0, top: 0 });
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
    // Points are re-read from the chart each time: `HighchartsReact` calls `chart.update()`
    // on re-render, which resets point states and may replace point instances.
    const setCategoryPointsState = (state: "" | "hover") => {
        const highlight = highlightRef.current;

        if (!highlight?.chart.series) {
            return;
        }

        const { chart, categoryIndex } = highlight;

        chart.series.forEach((chartSeries) => {
            const categoryPoint = chartSeries.points?.[categoryIndex];

            if (categoryPoint && categoryPoint !== chart.hoverPoint && (chartSeries.visible || state === "")) {
                // `move` skips Highcharts' "already in this state" guard: after `chart.update()`
                // a point can keep `state === "hover"` while its marker graphic was rebuilt.
                categoryPoint.setState(state, true);
            }
        });
    };

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

            setCategoryPointsState("");
            highlightRef.current = { chart, categoryIndex };
            setCategoryPointsState("hover");

            const topPlotY = Math.min(...categoryPoints.map((categoryPoint) => categoryPoint.plotY ?? 0));

            setAnchorPosition({
                left: chart.plotLeft + (point.plotX ?? 0),
                top: chart.plotTop + topPlotY
            });
            setTooltipCategoryIndex(categoryIndex);
            setTooltipItems(
                categoryPoints.map((categoryPoint) => ({
                    name: categoryPoint.series.name,
                    value: valueFormatter(categoryPoint.y as number),
                    color: String(categoryPoint.series.color)
                }))
            );
            setIsTooltipOpen(true);
        },
        hide: () => {
            setCategoryPointsState("");
            highlightRef.current = null;
            setIsTooltipOpen(false);
            setTooltipItems([]);
        }
    };

    // Runs after `HighchartsReact` (a child) has applied `chart.update()` for this render.
    useLayoutEffect(() => {
        setCategoryPointsState("hover");
    });

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
                    color: "var(--guit-sem-color-border-neutral-2)"
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
                    lineWidth: 1,
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
                            lineWidthPlus: 0
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
                                tooltipHandlersRef.current.hide();
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

    const tooltipAnchorKey = tooltipCategoryIndex ?? "idle";

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
                                className: "areaChart__plot",
                                role: "img",
                                "aria-label": subtitle ? `Area chart: ${subtitle}` : "Area chart"
                            }}
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
