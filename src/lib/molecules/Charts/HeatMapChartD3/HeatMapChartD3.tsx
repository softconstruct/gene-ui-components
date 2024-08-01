import React, { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HS_map from 'highcharts/modules/treemap';
import Legend, { LegendAppearances } from './Legend';

import * as d3 from 'd3';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Styles
import './HeatMapChartD3.scss';
import { ITooltipProps, Tooltip } from './Tooltip';

HS_map(Highcharts);

export const CONTAINER_PADDING = 8;
const BORDER_WIDTH = 1;
const X_LABELS_HEIGHT = 30;
const TOP_SPACE = 66;
const LEFT_SPACE = 74;

type Data = number[];

export interface IColorBreakpoint {
    value: number;
    color: string;
}

export interface IHeatMapChartD3Props {
    data: Data[];
    chartHeight?: string;
    legendHeight?: string;
    xAxisCategories: string[];
    yAxisCategories: string[];
    title: string;
    subTitle: string;
    colorBreakpoints?: IColorBreakpoint[];
    legendThresholds?: number;
    yAxisNeedReverse?: boolean;
    enabledLegend?: boolean;
    legendLayout?: LegendAppearances;
    tooltipFormatter?: (value: string, x: string, y: string) => string;
    isLoading?: boolean;
    emptyText?: string;
}

const HeatMapChartD3: React.FC<IHeatMapChartD3Props> = ({
    title,
    data = [],
    enabledLegend,
    legendLayout = LegendAppearances.Vertical,
    tooltipFormatter = (value: string) => value,
    yAxisNeedReverse,
    xAxisCategories = [],
    yAxisCategories = [],
    legendHeight = '50%',
    chartHeight = '40%',
    subTitle = '',
    isLoading,
    emptyText = 'No data to display',
    colorBreakpoints = [],
    legendThresholds = 5
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [hoveredCell, setHoveredCell] = useState<ITooltipProps | undefined>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colorsSet = useRef(new Set());

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
            .sort(([aX, aY], [bX, bY]) => (aX === bX ? (yAxisNeedReverse ? bY - aY : aY - bY) : aX - bX));
    }, [data, yAxisNeedReverse]);

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

    if (!min || !max) {
        return null;
    }

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
                <span className="label" key={i}>
                    {xAxisCategories[name]}
                </span>
            )),
        [xGroups]
    );

    const yLabels = useMemo(
        () =>
            yGroups.reverse().map((name, i) => (
                <span className="label" key={i}>
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

    return (
        <div className="chart-overflow-holder whiteDrillDown chart">
            <BusyLoader isBusy={isLoading} className="proxy-content">
                {!data?.length ? (
                    // @ts-ignore
                    <Empty type="data" title={emptyText} className="proxy-content" />
                ) : (
                    <div className="container" style={{ padding: CONTAINER_PADDING }} onMouseLeave={closeTooltip}>
                        <div className="mapTitle">{title}</div>
                        <div className="mapSubTitle">{subTitle}</div>
                        <div style={{ height: chartHeight }} className="canvas-horizontal">
                            <div className="y-labels">{yLabels}</div>
                            <div className="canvas-vertical">
                                <div className="canvas-wrapper" ref={containerRef}>
                                    <canvas ref={canvasRef} onMouseMove={onMouseMoveOverCanvas}></canvas>
                                </div>
                                <div className="x-labels">{xLabels}</div>
                            </div>
                            {enabledLegend && (
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
                        {hoveredCell && <Tooltip {...hoveredCell} />}
                    </div>
                )}
            </BusyLoader>
        </div>
    );
};

HeatMapChartD3.displayName = 'HeatMapChartD3';

export default HeatMapChartD3;
