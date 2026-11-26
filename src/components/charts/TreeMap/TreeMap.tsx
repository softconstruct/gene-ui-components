import React, { FC, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Highcharts from "highcharts";
import highchartsTreemap from "highcharts/modules/treemap";
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
    resolveChartSeriesColor,
    resolveGroupedChartSeriesColor
} from "../../../helpers/charts";

// Styles
import "./TreeMap.scss";

interface ITreeMapSubChannel {
    /**
     * Sub-channel name shown on its block and in the tooltip.
     */
    name: string;
    /**
     * Numeric value of the sub-channel. Its block is sized by its share of the channel.
     */
    value: number;
    /**
     * Optional block color. Defaults to a lighter tint of the channel color.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
}

interface ITreeMapSeries {
    /**
     * Channel name shown on its block, in the legend and in the tooltip.
     */
    name: string;
    /**
     * Numeric value of the channel. Its block is sized by its share of the sum of all visible channels.
     * Ignored when `subChannels` is passed: the channel then takes the sum of its sub-channel values.
     */
    value?: number;
    /**
     * Optional channel color. Defaults cycle through the grouped chart accent palette.
     * CSS variables / custom-property names are resolved through a DOM probe for Highcharts.
     */
    color?: string;
    /**
     * Optional breakdown of the channel. When passed, the channel is drawn as a titled group
     * of sub-channel blocks instead of a single block.
     */
    subChannels?: ITreeMapSubChannel[];
}

interface ITreeMapProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Channels of the tree map, one block per item. Pass `subChannels` on an item to break that channel down.
     */
    series?: ITreeMapSeries[];
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
     * Formats a value for the block label and the tooltip. Receives the raw value and its share (0–100):
     * a channel's share of the visible total, a sub-channel's share of its channel. Returns the display string.
     * @default (value) => `${value}`
     */
    valueFormatter?: (value: number, percentage: number) => string;
    /**
     * Deep-merged Highcharts options override for chart-level tweaks (plotOptions, etc.).
     * Note: `series` is managed via the `series` prop and is ignored here, so the plot stays
     * in sync with the legend, tooltip, and visibility toggles.
     */
    options?: Highcharts.Options;
}

interface ITreeMapResolvedChannel {
    name: string;
    value: number;
    color: string;
    subChannels: Required<ITreeMapSubChannel>[];
}

interface ITreeMapPointCustom {
    channelIndex: number;
    value: number;
    percentage: number;
    isGroup?: boolean;
}

interface ITreeMapTooltipState {
    open: boolean;
    items: IChartTooltipItem[];
    pointIndex: number | null;
    left: number;
    top: number;
}

interface ITreeMapLayoutArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ITreeMapLayoutSeries {
    yAxis: { len: number };
    squarified: (parent: ITreeMapLayoutArea, children: unknown[]) => ITreeMapLayoutArea[];
}

interface ITreeMapHighcharts {
    seriesTypes: { treemap: { prototype: Record<string, unknown> } };
}

const CHANNEL_PADDING = 16;
const CHANNEL_HEADER_HEIGHT = 36;
const CHANNEL_HEADER_OFFSET = { x: 28, y: 8 };
const LABEL_LINE_HEIGHT = 20;
const SUB_CHANNEL_TINT = 0.2;
const SUB_CHANNELS_LAYOUT = "geneUISubChannels";

const defaultValueFormatter = (value: number) => `${value}`;

const closedTooltip: ITreeMapTooltipState = { open: false, items: [], pointIndex: null, left: 0, top: 0 };

const getPointCustom = (point: Highcharts.Point) => point.options.custom as ITreeMapPointCustom | undefined;

const getSubChannels = ({ subChannels }: ITreeMapSeries) => subChannels?.filter(({ value }) => value > 0) ?? [];

const getChannelValue = (channel: ITreeMapSeries) => {
    const subChannels = getSubChannels(channel);

    return subChannels.length ? subChannels.reduce((total, { value }) => total + value, 0) : (channel.value ?? 0);
};

const fitsChannelFrame = (width: number, height: number) =>
    width >= 2 * CHANNEL_PADDING + LABEL_LINE_HEIGHT &&
    height >= CHANNEL_HEADER_HEIGHT + CHANNEL_PADDING + LABEL_LINE_HEIGHT;

function subChannelsLayout(this: ITreeMapLayoutSeries, parent: ITreeMapLayoutArea, children: unknown[]) {
    const pixel = 100 / this.yAxis.len;

    if (!fitsChannelFrame(parent.width / pixel, parent.height / pixel)) {
        return this.squarified(parent, children);
    }

    return this.squarified(
        {
            ...parent,
            x: parent.x + CHANNEL_PADDING * pixel,
            y: parent.y + CHANNEL_HEADER_HEIGHT * pixel,
            width: parent.width - 2 * CHANNEL_PADDING * pixel,
            height: parent.height - (CHANNEL_HEADER_HEIGHT + CHANNEL_PADDING) * pixel
        },
        children
    );
}

const channelBackgrounds = new WeakMap<Highcharts.Chart, Highcharts.SVGElement>();

function renderChannelBackgrounds(this: Highcharts.Chart) {
    channelBackgrounds.get(this)?.destroy();

    const group = this.renderer.g().attr({ zIndex: 1 }).add();
    channelBackgrounds.set(this, group);

    this.series[0]?.points.forEach((point) => {
        if (!getPointCustom(point)?.isGroup) {
            return;
        }

        const { x = 0, y = 0, width = 0, height = 0 } = point.shapeArgs ?? {};

        this.renderer
            .rect(this.plotLeft + x, this.plotTop + y, width, height)
            .attr({ fill: point.options.color as string })
            .add(group);
        (point as Highcharts.Point & { dataLabel?: Highcharts.SVGElement }).dataLabel?.css({
            width: Math.max(width - 2 * CHANNEL_HEADER_OFFSET.x, 0)
        });
    });
}

// Highcharts is a factory function, not an object, when it is imported without a `window` (SSR).
if (typeof Highcharts === "object") {
    highchartsTreemap(Highcharts);
    (Highcharts as unknown as ITreeMapHighcharts).seriesTypes.treemap.prototype[SUB_CHANNELS_LAYOUT] =
        subChannelsLayout;
}

/**
 * Tree map chart built on Highcharts. Use it to compare the shares of many channels at a glance;
 * a channel can be broken down into sub-channels. Hover shows the values, legend items toggle channels.
 * Chart animations are disabled by default.
 */
const TreeMap: FC<ITreeMapProps> = ({
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

    const [resolvedSeries, setResolvedSeries] = useState<ITreeMapResolvedChannel[]>([]);
    const [tooltip, setTooltip] = useState<ITreeMapTooltipState>(closedTooltip);
    const [hiddenSeriesIndexes, setHiddenSeriesIndexes] = useState<Record<number, boolean>>({});
    const [frozenBodyHeight, setFrozenBodyHeight] = useState<number | null>(null);
    const hasData = Boolean(series?.some((channel) => getChannelValue(channel) > 0));
    const isLegendExpanded = frozenBodyHeight !== null;
    const isRtl = typeof document !== "undefined" && document.dir === "rtl";

    const handleLegendExpandedChange = (expanded: boolean) => {
        setFrozenBodyHeight(expanded ? (bodyRef.current?.offsetHeight ?? null) : null);
    };

    const chartHandlersRef = useRef<{
        show: (point: Highcharts.Point) => void;
        hide: () => void;
        formatValue: NonNullable<ITreeMapProps["valueFormatter"]>;
    }>({
        show: () => undefined,
        hide: () => undefined,
        formatValue: valueFormatter
    });

    chartHandlersRef.current = {
        show: (point) => {
            const custom = getPointCustom(point);
            const channel = custom && resolvedSeries[custom.channelIndex];

            if (!custom || !channel || custom.isGroup) {
                setTooltip(closedTooltip);
                return;
            }

            const { chart } = point.series;
            const { x = 0, y = 0, width = 0, height = 0 } = point.shapeArgs ?? {};

            setTooltip({
                open: true,
                pointIndex: point.index,
                left: chart.plotLeft + x + width / 2,
                top: chart.plotTop + y + height / 2 - LABEL_LINE_HEIGHT / 2,
                items: channel.subChannels.length
                    ? channel.subChannels.map((subChannel) => ({
                          name: subChannel.name,
                          value: valueFormatter(subChannel.value, (subChannel.value / channel.value) * 100),
                          color: subChannel.color,
                          showSwatch: false
                      }))
                    : [
                          {
                              name: channel.name,
                              value: valueFormatter(custom.value, custom.percentage),
                              color: channel.color
                          }
                      ]
            });
        },
        hide: () => setTooltip(closedTooltip),
        formatValue: valueFormatter
    };

    useLayoutEffect(() => {
        if (!series?.some((channel) => getChannelValue(channel) > 0)) {
            setResolvedSeries([]);
            return;
        }

        const probe = colorProbeRef.current;

        setResolvedSeries(
            series.map((channel, index) => {
                const color =
                    resolveGroupedChartSeriesColor(probe, channel.color, index) ||
                    channel.color ||
                    `var(${getDefaultGroupedChartSeriesColorToken(index)})`;
                const tint = String(Highcharts.color(color).tweenTo(Highcharts.color("#ffffff"), SUB_CHANNEL_TINT));

                return {
                    name: channel.name,
                    value: getChannelValue(channel),
                    color,
                    subChannels: getSubChannels(channel).map((subChannel) => ({
                        ...subChannel,
                        color:
                            (subChannel.color && resolveChartSeriesColor(probe, subChannel.color)) ||
                            subChannel.color ||
                            tint
                    }))
                };
            })
        );
    }, [series]);

    const legendItems = useMemo(
        () =>
            resolvedSeries.map(({ name, color }, index) => ({
                name,
                color,
                visible: !hiddenSeriesIndexes[index]
            })),
        [hiddenSeriesIndexes, resolvedSeries]
    );

    const handleLegendItemClick = (_item: { name: string }, index: number) => {
        setHiddenSeriesIndexes((previous) => ({
            ...previous,
            [index]: !previous[index]
        }));
        chartHandlersRef.current.hide();
    };

    const chartOptions = useMemo(() => {
        if (!resolvedSeries.length) {
            return {};
        }

        const visibleTotal = resolvedSeries.reduce(
            (total, { value }, index) => (hiddenSeriesIndexes[index] ? total : total + value),
            0
        );

        const data = resolvedSeries.reduce<Highcharts.PointOptionsObject[]>((points, channel, channelIndex) => {
            if (hiddenSeriesIndexes[channelIndex] || channel.value <= 0) {
                return points;
            }

            const id = `channel-${channelIndex}`;
            const custom: ITreeMapPointCustom = {
                channelIndex,
                value: channel.value,
                percentage: (channel.value / visibleTotal) * 100
            };

            if (!channel.subChannels.length) {
                return [...points, { id, name: channel.name, value: channel.value, color: channel.color, custom }];
            }

            return [
                ...points,
                {
                    id,
                    name: channel.name,
                    color: channel.color,
                    custom: { ...custom, isGroup: true },
                    dataLabels: {
                        enabled: true,
                        align: isRtl ? "right" : "left",
                        verticalAlign: "top",
                        x: isRtl ? -CHANNEL_HEADER_OFFSET.x : CHANNEL_HEADER_OFFSET.x,
                        y: CHANNEL_HEADER_OFFSET.y,
                        style: { fontWeight: "600" }
                    }
                },
                ...channel.subChannels.map((subChannel) => ({
                    parent: id,
                    name: subChannel.name,
                    value: subChannel.value,
                    color: subChannel.color,
                    borderColor: channel.color,
                    custom: {
                        channelIndex,
                        value: subChannel.value,
                        percentage: (subChannel.value / channel.value) * 100
                    }
                }))
            ];
        }, []);

        const baseOptions: Highcharts.Options = {
            chart: {
                type: "treemap",
                height: null,
                animation: false,
                backgroundColor: "transparent",
                spacing: [0, 0, 0, 0],
                style: {
                    fontFamily: "inherit"
                },
                events: {
                    render: renderChannelBackgrounds
                }
            },
            title: { text: undefined },
            subtitle: { text: undefined },
            credits: { enabled: false },
            legend: { enabled: false },
            tooltip: {
                enabled: false
            },
            xAxis: {
                reversed: isRtl
            },
            plotOptions: {
                series: {
                    animation: false
                },
                treemap: {
                    animation: false,
                    layoutAlgorithm: "squarified",
                    levels: [
                        {
                            level: 1,
                            borderColor: "var(--guit-sem-color-border-neutral-1)",
                            borderWidth: 1
                        },
                        {
                            level: 2,
                            layoutAlgorithm: SUB_CHANNELS_LAYOUT as Highcharts.OptionsLayoutAlgorithmValue
                        }
                    ],
                    dataLabels: {
                        padding: 0,
                        style: {
                            color: "var(--guit-sem-color-foreground-inverse)",
                            fontSize: "1.4rem",
                            fontWeight: "500",
                            textOutline: "none",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        },
                        formatter(this: Highcharts.PointLabelObject) {
                            const { point } = this;
                            const custom = getPointCustom(point);
                            const { width = 0, height = 0 } = point.shapeArgs ?? {};

                            if (!custom) {
                                return undefined;
                            }

                            if (custom.isGroup) {
                                return fitsChannelFrame(width, height) ? point.name : undefined;
                            }

                            return height >= LABEL_LINE_HEIGHT
                                ? `${point.name}: ${chartHandlersRef.current.formatValue(custom.value, custom.percentage)}`
                                : undefined;
                        }
                    },
                    states: {
                        hover: {
                            brightness: 0.1
                        }
                    },
                    point: {
                        events: {
                            mouseOver(this: Highcharts.Point) {
                                chartHandlersRef.current.show(this);
                            },
                            mouseOut() {
                                chartHandlersRef.current.hide();
                            }
                        }
                    }
                }
            },
            series: [
                {
                    type: "treemap" as const,
                    animation: false,
                    data
                }
            ]
        };

        let optionsOverride = options;
        if (options && "series" in options) {
            optionsOverride = { ...options };
            delete optionsOverride.series;
        }

        return mergeChartOptions(baseOptions, optionsOverride);
    }, [hiddenSeriesIndexes, isRtl, options, resolvedSeries]);

    // `HighchartsReact` is memoized; a new `containerProps` object per render would call
    // `chart.update()` on every hover and reset the hovered block's state.
    const plotContainerProps = useMemo(
        () => ({
            className: "treeMap__plot",
            role: "img",
            "aria-label": subtitle
        }),
        [subtitle]
    );

    return (
        <div
            className={classNames("treeMap", className, {
                treeMap_legendExpanded: isLegendExpanded
            })}
        >
            <span
                ref={colorProbeRef}
                className="treeMap__colorProbe"
                style={{ backgroundColor: `var(${getDefaultGroupedChartSeriesColorToken(0)})` }}
                aria-hidden
            />
            {subtitle && <ChartSubtitle className="treeMap__subtitle">{subtitle}</ChartSubtitle>}
            <div
                ref={bodyRef}
                className={classNames("treeMap__body", {
                    treeMap__body_frozen: isLegendExpanded
                })}
                style={frozenBodyHeight !== null ? { height: frozenBodyHeight } : undefined}
            >
                {loading && (
                    <div className="treeMap__state">
                        <Loader loading text={loadingText} textPosition="below" size="large" appearance="brand" />
                    </div>
                )}
                {!loading && !hasData && (
                    <div className="treeMap__state">
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
                            onClose={() => chartHandlersRef.current.hide()}
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
                    className="treeMap__legend"
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

export { ITreeMapProps, ITreeMapSeries, ITreeMapSubChannel, TreeMap as default };
