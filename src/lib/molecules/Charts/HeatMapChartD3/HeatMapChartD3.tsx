import React, { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import Legend, { LegendAppearances } from './Legend';

import * as d3 from 'd3';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';
import Popover from '../../../atoms/Popover';
import Tooltip from '../../Tooltip/Tooltip';

// Styles
import './HeatMapChartD3.scss';

interface IHoveredCell {
    x: number;
    y: number;
    text: string;
}

export const CONTAINER_PADDING = 8;
const BORDER_WIDTH = 1;
const X_LABELS_HEIGHT = 30;
const TOP_SPACE = 66;
const LEFT_SPACE = 74;

export interface IColorBreakpoint {
    value: number;
    color: string;
}

export interface IHeatMapChartD3Props {
    /**
     * Data of chart
     */
    data?: number[][];
    /**
     * Height of chart
     */
    chartHeight?: string;
    /**
     * Height of legend
     */
    legendHeight?: string;
    /**
     * Labels for X axis
     */
    xAxisCategories: string[];
    /**
     * Labels for Y axis
     */
    yAxisCategories: string[];
    /**
     * Chart title
     */
    title: string;
    /**
     * Chart subtitle
     */
    subTitle?: string;
    /**
     * Breakpoint values and colors for heatmap. For example to show values in range 0-10 from red to green color, and in range 10-20 from green to blue,
     * colorBreakpoints should be [{ value: 0, color: "#ff0000" }, { value: 10: "#00ff00" }, { value: 20, color: "#0000ff" }]
     */
    colorBreakpoints?: IColorBreakpoint[];
    /**
     * How many dividing points should have legend
     */
    legendThresholds?: number;
    /**
     * If true y axis will be reversed
     */
    reverseYAxisOrder?: boolean;
    /**
     * Is legend shown
     */
    enabledLegend?: boolean;
    /**
     * Legend layout <br/>
     * Possible values: `vertical | horizontal` <br/>
     */
    legendLayout?: LegendAppearances;
    /**
     * Function to format heatmap's cell's tooltip content. By default shows cell's value
     */
    tooltipFormatter?: (value: string, x: string, y: string) => string;
    /**
     * If true loading indicator is shown
     */
    isLoading?: boolean;
    /**
     * Text to show when data is empty
     */
    emptyText?: string;
}

const HeatMapChartD3: React.FC<IHeatMapChartD3Props> = ({
    title,
    data = [],
    enabledLegend,
    legendLayout = LegendAppearances.Vertical,
    tooltipFormatter = (value: string) => value,
    reverseYAxisOrder,
    xAxisCategories = [],
    yAxisCategories = [],
    legendHeight = '50%',
    chartHeight = '40%',
    subTitle = '',
    isLoading = false,
    emptyText = 'No data to display',
    colorBreakpoints = [],
    legendThresholds = 5
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heatMapRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [hoveredCell, setHoveredCell] = useState<(IHoveredCell & { value: number }) | undefined>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colorsSet = useRef(new Set());
    const titleRef = useRef<HTMLDivElement>(null);
    const subTitleRef = useRef<HTMLDivElement>(null);

    const [tooltipLeft, setTooltipLeft] = useState(hoveredCell?.x);
    const [tooltipTop, setTooltipTop] = useState(hoveredCell?.y);

    const onRefBecomeAvailable = (element: HTMLDivElement) => {
        if (!hoveredCell) {
            return;
        }

        const { width, height } = element?.getBoundingClientRect() ?? {};

        const { right: parentRight = 0 } = heatMapRef.current?.getBoundingClientRect() ?? {};

        if (hoveredCell.x + width / 2 >= parentRight - CONTAINER_PADDING) {
            setTooltipLeft(-1);
        } else if (width) {
            const leftPos = hoveredCell.x - width / 2;
            setTooltipLeft(leftPos < 0 ? 0 : leftPos);
        }
        if (height) {
            setTooltipTop(hoveredCell.y + yScale.bandwidth() / 2);
        }
    };

    const uniqueData = useMemo(() => {
        const xySet = new Set();
        const reversedFilteredData = [...data].reverse().filter(([x, y]) => {
            const xy = `${x}${y}`;
            if (xySet.has(xy)) {
                return false;
            }
            xySet.add(xy);
            return true;
        });

        return reversedFilteredData
            .reverse()
            .sort(([aX, aY], [bX, bY]) => (aX === bX ? (reverseYAxisOrder ? bY - aY : aY - bY) : aX - bX));
    }, [data, reverseYAxisOrder]);

    const yGroups = useMemo(() => [...new Set(uniqueData.map(([x, y]) => y.toString()))], [uniqueData]);
    const xGroups = useMemo(() => [...new Set(uniqueData.map(([x]) => x.toString()))], [uniqueData]);

    const boundsHeight = Number(chartHeight.replace('px', '')) - X_LABELS_HEIGHT;

    const xScale = useMemo(
        () => d3.scaleBand().range([0, containerWidth]).domain(xGroups).padding(0.001),
        [xGroups, containerWidth]
    );

    const yScale = useMemo(
        () => d3.scaleBand().range([boundsHeight, 0]).domain(yGroups).padding(0.001),
        [yGroups, boundsHeight]
    );

    const [min, max] = useMemo(() => d3.extent(uniqueData.map(([x, y, value]) => value)), [uniqueData]);

    const normalizedBreakpoints = useMemo(() => {
        let breakpoints = [...colorBreakpoints].sort((a, b) => a.value - b.value);

        if (!min || !max) {
            return breakpoints;
        }

        if (!breakpoints.length || breakpoints[0].value > min) {
            breakpoints = [{ value: min, color: '#ffffff' }, ...breakpoints];
        }

        if (!breakpoints.length || breakpoints[breakpoints.length - 1].value < max) {
            breakpoints = [...breakpoints, { value: max, color: '#1473e6' }];
        }

        let filteredBreakpoints = [] as IColorBreakpoint[];
        for (const index in breakpoints) {
            const breakpoint = breakpoints[index];
            if (breakpoint.value <= min) {
                filteredBreakpoints = [{ ...breakpoint, value: min }];
            } else if (breakpoint.value >= max) {
                filteredBreakpoints = [...filteredBreakpoints, { ...breakpoint, value: max }];
                return filteredBreakpoints;
            } else {
                filteredBreakpoints.push(breakpoint);
            }
        }

        return filteredBreakpoints;
    }, [colorBreakpoints, min, max]);

    const colorScale = (value: number) => {
        const rangeForValue = normalizedBreakpoints.reduce(
            ({ domain, range }, currentPoint) => {
                let [currentMin, currentMax] = domain;
                let [minColor, maxColor] = range;

                if (value >= currentPoint.value) {
                    currentMin = currentPoint.value;
                    minColor = currentPoint.color;
                }
                if (value <= currentPoint.value && currentMax >= currentPoint.value) {
                    currentMax = currentPoint.value;
                    maxColor = currentPoint.color;
                }
                return { domain: [currentMin, currentMax], range: [minColor, maxColor] };
            },
            {
                domain: [normalizedBreakpoints[0].value, normalizedBreakpoints[normalizedBreakpoints.length - 1].value],
                range: [normalizedBreakpoints[0].color, normalizedBreakpoints[normalizedBreakpoints.length - 1].color]
            }
        );

        return d3.scaleSequential(d3.interpolateInferno).domain(rangeForValue.domain).range(rangeForValue.range)(value);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) {
            return;
        }

        const { width, height } = containerRef.current?.getBoundingClientRect() ?? {};

        if (width) {
            canvasRef.current.width = width;
        }
        if (height) {
            canvasRef.current.height = height;
        }

        uniqueData.forEach(([x, y, value], i) => {
            const scaleX = xScale(x.toString());
            const scaleY = yScale(y.toString());

            if (!scaleX || !scaleY) {
                return null;
            }

            ctx.fillStyle = '#fff';
            ctx.fillRect(
                scaleX - BORDER_WIDTH,
                scaleY - BORDER_WIDTH,
                xScale.bandwidth() + BORDER_WIDTH * 2,
                yScale.bandwidth() + BORDER_WIDTH * 2
            );

            const color = colorScale(value);
            ctx.fillStyle = colorScale(value);
            colorsSet.current.add(color);
            ctx.fillRect(scaleX, scaleY, xScale.bandwidth(), yScale.bandwidth());
        });
    }, [canvasRef.current, uniqueData, xScale, yScale, colorScale, containerWidth]);

    const xLabels = useMemo(
        () =>
            xGroups.map((name, i) => (
                <span className="heatMap__labels__text heatMap__labels_direction_x__text" key={i}>
                    {xAxisCategories[name]}
                </span>
            )),
        [xGroups]
    );

    const yLabels = useMemo(
        () =>
            yGroups.reverse().map((name, i) => (
                <span className="heatMap__labels__text" key={i}>
                    {yAxisCategories[name]}
                </span>
            )),
        [yGroups]
    );

    useEffect(() => {
        const resizeHandler = () => setContainerWidth(containerRef.current?.getBoundingClientRect().width ?? 0);
        window.addEventListener('resize', resizeHandler);
        resizeHandler();

        return () => window.removeEventListener('resize', resizeHandler);
    }, [containerRef.current, legendLayout, enabledLegend]);

    const isTitleTruncated = Boolean(titleRef.current && titleRef.current.offsetWidth < titleRef.current.scrollWidth);
    const isSubTitleTruncated = Boolean(
        subTitleRef.current && subTitleRef.current.offsetWidth < subTitleRef.current.scrollWidth
    );

    const closeTooltip = () => setHoveredCell(undefined);

    const onMouseMoveOverCanvas = (e: MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = e.nativeEvent;

        const currentIndex = uniqueData.findIndex(([x, y]) => {
            const scaleX = xScale(x.toString());
            const scaleY = yScale(y.toString());
            if (!scaleX || !scaleY) {
                return false;
            }

            return (
                offsetX >= scaleX &&
                offsetX < scaleX + xScale.bandwidth() &&
                offsetY >= scaleY &&
                offsetY < scaleY + yScale.bandwidth()
            );
        });

        if (currentIndex > -1) {
            const [x, y, value] = uniqueData[currentIndex];
            const scaleX = xScale(x.toString());
            const scaleY = yScale(y.toString());

            if (scaleX && scaleY) {
                setHoveredCell({
                    x: scaleX + CONTAINER_PADDING + LEFT_SPACE + xScale.bandwidth() / 2,
                    y: scaleY + TOP_SPACE,
                    text: tooltipFormatter(String(value), xAxisCategories[x], yAxisCategories[y]),
                    value
                });
            }
        }
    };

    const titleElement = (
        <div ref={titleRef} className="heatMap__title">
            {title}
        </div>
    );
    const subtitleElement = (
        <div ref={subTitleRef} className="heatMap__subTitle">
            {subTitle}
        </div>
    );

    return (
        <div className="chart-overflow-holder whiteDrillDown heatMap" style={{ minHeight: chartHeight }}>
            <BusyLoader isBusy={isLoading} className="heatMap__emptyContent">
                {!data.length ? (
                    // @ts-ignore
                    <Empty type="data" title={emptyText} className="heatMap__emptyContent" />
                ) : (
                    <div
                        className="heatMap__container"
                        style={{ padding: CONTAINER_PADDING }}
                        onMouseLeave={closeTooltip}
                        ref={heatMapRef}
                    >
                        {title && (isSubTitleTruncated ? <Tooltip text={title}>{titleElement}</Tooltip> : titleElement)}
                        {subTitle &&
                            (subtitleElement ? <Tooltip text={subTitle}>{subtitleElement}</Tooltip> : subtitleElement)}
                        <div
                            style={{ height: chartHeight }}
                            className="heatMap__canvasContainer heatMap__canvasContainer_direction_horizontal"
                        >
                            <div className="heatMap__labels heatMap__labels_direction_y">{yLabels}</div>
                            <div className="heatMap__canvasContainer heatMap__canvasContainer_direction_vertical">
                                <div className="heatMap__canvasWrapper" ref={containerRef}>
                                    <canvas
                                        className="heatMap__canvas"
                                        ref={canvasRef}
                                        onMouseMove={onMouseMoveOverCanvas}
                                    ></canvas>
                                </div>
                                <div className="heatMap__labels heatMap__labels_direction_x">{xLabels}</div>
                            </div>
                            {enabledLegend && min && max && (
                                <Legend
                                    min={min}
                                    max={max}
                                    currentNumber={hoveredCell?.value}
                                    colorBreakpoints={normalizedBreakpoints}
                                    legendThresholds={legendThresholds}
                                    legendLayout={legendLayout}
                                    height={legendHeight}
                                />
                            )}
                        </div>
                        {hoveredCell && (
                            // @ts-ignore
                            <Popover
                                isOpen
                                screenType="desktop"
                                position="top"
                                align={tooltipLeft && tooltipLeft < 0 ? 'end' : undefined}
                                cornerRadius="smooth-radius"
                                Content={
                                    <div
                                        className="heatMap__tooltip"
                                        ref={onRefBecomeAvailable}
                                        dangerouslySetInnerHTML={{ __html: hoveredCell.text }}
                                    />
                                }
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: tooltipLeft === -1 ? undefined : tooltipLeft,
                                        right: tooltipLeft === -1 ? 0 : undefined,
                                        top: tooltipTop
                                    }}
                                />
                            </Popover>
                        )}
                    </div>
                )}
            </BusyLoader>
        </div>
    );
};

HeatMapChartD3.displayName = 'HeatMapChartD3';

export default HeatMapChartD3;
