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
import "./DonutChart.scss";

interface IDonutChartSeries {
    /**
     * Slice name shown in the legend and tooltip.
     */
    name: string;
    /**
     * Numeric value of the slice. Its share of the donut is calculated from the sum of all visible slices.
     */
    value: number;
    /**
     * Optional slice color. Defaults cycle through the grouped chart accent palette.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
}

interface IDonutChartProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Slices of the donut, one item per slice, drawn clockwise in the given order.
     */
    series?: IDonutChartSeries[];
    /**
     * Optional subtitle rendered above the chart body.
     */
    subtitle?: string;
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
     * Label of the legend toggle shown when legend items wrap past one row and the legend is collapsed.
     * Either a string, or a function that receives the number of hidden items, so translations can handle
     * plural forms and word order.
     * @default (hiddenCount) => `Show ${hiddenCount} more`
     */
    legendShowMoreText?: string | ((hiddenCount: number) => string);
    /**
     * Label of the legend toggle while the legend is expanded.
     * @default "Show less"
     */
    legendShowLessText?: string;
    /**
     * Formats a slice for the tooltip. Receives the raw value and the slice's share (0–100) of the
     * visible total, returns the display string.
     * @default (_value, percentage) => `${Math.round(percentage * 10) / 10}%`
     */
    valueFormatter?: (value: number, percentage: number) => string;
    /**
     * Deep-merged Highcharts options override for chart-level tweaks (plotOptions, etc.).
     * Note: `series` is managed via the `series` prop and is ignored here, so the plot stays
     * in sync with the legend, tooltip, and visibility toggles.
     */
    options?: Highcharts.Options;
}

interface IDonutChartTooltipState {
    open: boolean;
    items: IChartTooltipItem[];
    pointIndex: number | null;
    left: number;
    top: number;
}

const defaultValueFormatter = (_value: number, percentage: number) => `${Math.round(percentage * 10) / 10}%`;

const closedTooltip: IDonutChartTooltipState = { open: false, items: [], pointIndex: null, left: 0, top: 0 };

/**
 * Donut chart built on Highcharts. Use it to show how a small number of parts make up a whole as a ring;
 * hover shows the slice's share, legend items toggle slices. Chart animations are disabled by default.
 */
const DonutChart: FC<IDonutChartProps> = ({
    className,
    series,
    subtitle,
    showLegend = true,
    loading = false,
    loadingText,
    emptyTitle,
    emptyDescription,
    legendShowMoreText,
    legendShowLessText,
    valueFormatter = defaultValueFormatter,
    options
}) => {
    const colorProbeRef = useRef<HTMLSpanElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    const [resolvedSeries, setResolvedSeries] = useState<IDonutChartSeries[]>([]);
    const [tooltip, setTooltip] = useState<IDonutChartTooltipState>(closedTooltip);
    const [hiddenSeriesIndexes, setHiddenSeriesIndexes] = useState<Record<number, boolean>>({});
    const [frozenBodyHeight, setFrozenBodyHeight] = useState<number | null>(null);
    const hasData = Boolean(series?.some(({ value }) => value > 0));
    const isLegendExpanded = frozenBodyHeight !== null;

    const handleLegendExpandedChange = (expanded: boolean) => {
        setFrozenBodyHeight(expanded ? (bodyRef.current?.offsetHeight ?? null) : null);
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
            // `tooltipPos` (the slice's tooltip anchor) is missing from the public Highcharts typings.
            const [plotX = 0, plotY = 0] = (point as Highcharts.Point & { tooltipPos?: number[] }).tooltipPos ?? [];

            setTooltip({
                open: true,
                pointIndex: point.index,
                left: chart.plotLeft + plotX,
                top: chart.plotTop + plotY,
                items: [
                    {
                        name: point.name,
                        value: valueFormatter(point.y as number, point.percentage ?? 0),
                        color: String(point.color)
                    }
                ]
            });
        },
        hide: () => setTooltip(closedTooltip)
    };

    useLayoutEffect(() => {
        if (!series?.some(({ value }) => value > 0)) {
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
                type: "pie",
                height: null,
                animation: false,
                backgroundColor: "transparent",
                spacing: [0, 0, 0, 0],
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
            plotOptions: {
                series: {
                    animation: false
                },
                pie: {
                    animation: false,
                    innerSize: "60%",
                    borderColor: "var(--guit-sem-color-background-neutral-1)",
                    borderWidth: 2,
                    dataLabels: { enabled: false },
                    states: {
                        hover: {
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
                                tooltipHandlersRef.current.hide();
                            }
                        }
                    }
                }
            },
            series: [
                {
                    type: "pie" as const,
                    animation: false,
                    data: resolvedSeries.map(({ name, value, color }, index) => ({
                        name,
                        y: value,
                        color,
                        visible: !hiddenSeriesIndexes[index]
                    }))
                }
            ]
        };

        let optionsOverride = options;
        if (options && "series" in options) {
            optionsOverride = { ...options };
            delete optionsOverride.series;
        }

        return mergeChartOptions(baseOptions, optionsOverride);
    }, [hiddenSeriesIndexes, options, resolvedSeries]);

    // Memoized: a new `containerProps` object would make HighchartsReact reset the hovered slice on every render.
    const plotContainerProps = useMemo(
        () => ({
            className: "donutChart__plot",
            role: "img",
            "aria-label": subtitle
        }),
        [subtitle]
    );

    return (
        <div
            className={classNames("donutChart", className, {
                donutChart_legendExpanded: isLegendExpanded
            })}
        >
            <span
                ref={colorProbeRef}
                className="donutChart__colorProbe"
                style={{ backgroundColor: `var(${getDefaultGroupedChartSeriesColorToken(0)})` }}
                aria-hidden
            />
            {subtitle && <ChartSubtitle className="donutChart__subtitle">{subtitle}</ChartSubtitle>}
            <div
                ref={bodyRef}
                className={classNames("donutChart__body", {
                    donutChart__body_frozen: isLegendExpanded
                })}
                style={frozenBodyHeight !== null ? { height: frozenBodyHeight } : undefined}
            >
                {loading && (
                    <div className="donutChart__state">
                        <Loader loading text={loadingText} textPosition="below" size="large" appearance="brand" />
                    </div>
                )}
                {!loading && !hasData && (
                    <div className="donutChart__state">
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
                            pointKey={tooltip.pointIndex ?? "idle"}
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
                    className="donutChart__legend"
                    items={legendItems}
                    onItemClick={handleLegendItemClick}
                    onExpandedChange={handleLegendExpandedChange}
                    showMoreText={legendShowMoreText}
                    showLessText={legendShowLessText}
                />
            )}
        </div>
    );
};

export { IDonutChartProps, IDonutChartSeries, DonutChart as default };
