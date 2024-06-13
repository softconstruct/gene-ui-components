import React, { FC, MouseEvent, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import {
    select,
    pointer,
    geoPath,
    GeoPath,
    geoIdentity,
    D3ZoomEvent,
    zoomIdentity,
    zoom as d3Zoom,
    GeoPermissibleObjects,
    ZoomBehavior
} from 'd3';
import { GeoGeometryObjects } from 'd3-geo';
import classnames from 'classnames';

// Hooks
import { useDeviceType } from '../../../../hooks';

// Components
import Icon from '../../../atoms/Icon';
import IconButton from '../MapChart/IconButton';
import { BusyLoader, Empty, Popover } from '../../../../index';
import Button from '../../../atoms/Button';

// Styles
import './MapChartD3.scss';

interface ITooltip {
    top: number;
    left: number;
    content: ReactElement | undefined;
}

export interface IMapChartFeature {
    type: string;
    id: string;
    properties: any;
    geometry: {
        type: string;
        coordinates: any;
    };
}

interface IRegionData {
    id: string;
    value: number;
}

interface IDataClasses {
    to: number;
    from: number;
    name: string;
    color: string;
    disabled?: boolean;
}

export interface IMapChartD3Props {
    /**
     * Map chart title.
     */
    title?: string;
    /**
     * Brightness of regions on hover action.
     * Use positive numbers to reach the desired result.
     */
    brightness?: number;
    /**
     * Map chart data.
     */
    mapData: any;
    /**
     * Background colors with range ('from', 'to') of regions depends on statistics. <br>
     * Use a similar object to reach the desired result:
     * `{
     *     to: number;
     *     from: number;
     *     name: string;
     *     color: string;
     *     disabled?: boolean;
     * }`
     */
    colorAxis?: { dataClasses: IDataClasses[] };
    /**
     * Classname for parent element of chart.
     */
    className?: string;
    /**
     * Device screen type. <br/>
     * Possible values: `'mobile' | 'desktop'`
     */
    screenType?: 'mobile' | 'desktop';
    /**
     * Add legends for chart.
     */
    withLegend?: boolean;
    /**
     * Fires event when user click on Region.
     */
    onPointClick?: (event: IMapChartFeature) => void;
    /**
     * Fires event when user hover on Region.
     */
    onPointOver?: (event: IMapChartFeature) => void;
    /**
     * Show activities for regions on hover action.
     */
    withActivity?: boolean;
    /**
     * Content which will be shown in Activity box.
     */
    viewActivityContent?: ReactNode;
    /**
     * Show zoom navigation bar.
     */
    withNavigation?: boolean;
    /**
     * Activities name.
     */
    viewActivityName?: string;
    /**
     * The prop responsible for showing the loading spinner if passed true.
     */
    isLoading?: boolean;
    /**
     * Empty state text for component
     */
    emptyText?: string;
    /**
     * Regions data to highlight depending on the case.
     * <br>
     * Send `id` as the region ID and `value` as a number from a range that is customized for your case.
     * `{ id: 'AM.ER', value: 12 }`
     */
    regionData?: IRegionData[];
    /**
     * Default zoom scale value.
     * Use positive numbers to reach the desired result. <br>
     * See `defaultScaleExtent` prop for more information. <br>
     */
    defaultZoomScale?: number;
    /**
     * Region id on which should zoom initially.
     */
    initialZoomedRegionId?: string;
    /**
     * Default zoom scale extent. <br>
     * Send array with 2 elements as "from to" which well be zoom scale range.
     */
    defaultScaleExtent?: [number, number];
    /**
     * Default zoom translate extent
     * If extent is specified, sets the scale extent to the specified array of
     * numbers [k0, k1] where k0 is the minimum allowed scale factor and k1 is the
     * maximum allowed scale factor, and returns this zoom behavior. If extent is
     * not specified, returns the current scale extent, which defaults to [0, ∞].
     * The scale extent restricts zooming in and out.
     * See D3 documentation for more information.
     * <br>
     * ` [0, 0] `
     */
    defaultTranslateExtent?: [number, number];
    /**
     * Tooltip renderer method. <br>
     * Use to generate custom tooltip for the chart.
     * <br>
     * `(activeRegion) => <div style={{ padding: '7px 14px'}}>{activeRegion.properties.name}</div>`
     */
    tooltipRenderer?: (event: IMapChartFeature) => ReactElement;
}

const defaultFeatureColor = '#ebebeb';

const addBrightness = (color: string, brightnessFactor: number) => {
    if (!color) {
        return;
    }
    const rgbValues = hexToRgb(color);

    const [R, G, B] = rgbValues.map((value) => {
        const adjustedValue = Math.min(value + value * brightnessFactor, 255);
        return Math.round(adjustedValue);
    });

    return `rgb(${R}, ${G}, ${B})`;
};

const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.substring(1), 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;
    return [red, green, blue];
};

const MapChartD3: FC<IMapChartD3Props> = ({
    title,
    brightness,
    mapData,
    colorAxis,
    className,
    screenType,
    withLegend = false,
    onPointOver,
    onPointClick,
    withActivity = false,
    viewActivityContent,
    withNavigation = true,
    viewActivityName,
    isLoading = false,
    emptyText,
    regionData,
    defaultZoomScale = 1,
    initialZoomedRegionId,
    defaultScaleExtent = [1, 8],
    defaultTranslateExtent = [0, 0],
    tooltipRenderer
}) => {
    const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const zoomRef = useRef<ZoomBehavior<Element, unknown> | null>(null);
    const currentTransform = useRef({ x: 0, y: 0, k: defaultZoomScale });
    const transformRef = useRef({ x: 0, y: 0, k: defaultZoomScale });
    const popoverRef = useRef();
    const hoveredRegionRef = useRef<IMapChartFeature | null>(null);
    const { isMobile } = useDeviceType(screenType);
    const [isViewActive, setViewActive] = useState<boolean>(false);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [chartData, setChartData] = useState<IMapChartFeature[]>(mapData?.features || []);
    const [tooltipData, setTooltipData] = useState<ITooltip>({ top: 0, left: 0, content: undefined });
    const [zoomButtonsStatus, setZoomButtonsStatus] = useState({ zoomIn: false, zoomOut: true, reset: true });
    const [minScaleExtent, maxScaleExtent] = defaultScaleExtent;
    const pathRef = useRef<GeoPath | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [legends, setLegends] = useState(colorAxis?.dataClasses || []);
    const initialCanvasWidth = useRef<number | undefined>();
    const canvasWidth = (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().width;
    const initialCanvasHeight = useRef<number | undefined>();
    const canvasHeight = (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().height;
    const initialCoordinates = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
    const zoomedCoordinates = useRef({ x: 0, y: 0 });

    useEffect(() => {
        initialCanvasWidth.current = (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().width;
        initialCanvasHeight.current = (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().height;
    }, []);

    useEffect(() => {
        const _chartData = mapData?.features?.map((item: IMapChartFeature) => {
            const region =
                colorAxis && regionData && regionData.length
                    ? regionData.find((region) => region.id === item.id)
                    : null;

            if (region && colorAxis) {
                const dataClass = legends.find((axis) => region.value >= axis.from && region.value <= axis.to);
                return {
                    ...item,
                    properties: {
                        ...item.properties,
                        value: region.value,
                        color: dataClass?.color,
                        legend: dataClass?.name
                    }
                };
            } else {
                return { ...item, properties: { ...item.properties, value: 0, color: defaultFeatureColor } };
            }
        });

        setChartData(_chartData);
    }, [regionData, colorAxis, mapData]);

    const handleMouseEnter = (geo: IMapChartFeature, e: MouseEvent): void => {
        withActivity && setSelectedName(geo.properties.name);
        const tooltipContent = tooltipRenderer && tooltipRenderer(geo);
        tooltipRenderer && setTooltipData({ top: e.clientY, left: e.clientX, content: tooltipContent });
    };

    const handleMouseLeave = () => {
        withActivity && !isMobile && setSelectedName(null);
        tooltipRenderer && setTooltipData({ top: 0, left: 0, content: undefined });
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!contextRef.current || !pathRef.current) {
            return;
        }

        const context = contextRef.current;
        const path = pathRef.current;

        const [x, y] = pointer(event);

        // START Find hovered region
        context.beginPath();
        const generateContext = path.context(context);
        const hoveredRegion = chartData.find((feature) => {
            generateContext(feature as GeoPermissibleObjects);

            return context.isPointInPath(
                (x - currentTransform.current.x) / currentTransform.current.k,
                (y - currentTransform.current.y) / currentTransform.current.k
            );
        });

        // END Find hovered region

        if (!hoveredRegion) {
            if (!hoveredRegionRef.current) {
                return;
            }
            hoveredRegionRef.current.properties.brightness = 0;
            drawMap();
            hoveredRegionRef.current = null;
            handleMouseLeave();
            return;
        }

        // START Highlight regions depends on brightness

        if (hoveredRegion.properties.value && hoveredRegion.properties.color !== defaultFeatureColor) {
            if (hoveredRegionRef.current?.id === hoveredRegion.id) {
                handleMouseEnter(hoveredRegion, event);

                if (hoveredRegionRef.current.properties.brightness === hoveredRegion.properties.brightness) return;

                hoveredRegion.properties.brightness = 0;
            } else {
                if (hoveredRegionRef.current) hoveredRegionRef.current.properties.brightness = 0;

                hoveredRegion.properties.brightness = brightness;
                handleMouseEnter(hoveredRegion, event);
            }

            hoveredRegionRef.current = hoveredRegion as IMapChartFeature;
            onPointOver && onPointOver(hoveredRegion);
        } else if (
            hoveredRegionRef.current &&
            hoveredRegionRef.current.id !== hoveredRegion.id &&
            hoveredRegionRef.current.properties.value
        ) {
            handleMouseLeave();
            hoveredRegion.properties.brightness = 0;
            hoveredRegionRef.current.properties.brightness = 0;
            hoveredRegionRef.current = hoveredRegion;
        }
        drawMap();
        // END Highlight regions depends on brightness
    };

    const handleClick = (event: PointerEvent) => {
        if (!contextRef.current || !pathRef.current || !onPointClick) {
            return;
        }

        const context = contextRef.current;
        const path = pathRef.current;

        const [x, y] = pointer(event);

        const clickedRegion = chartData.find((feature) => {
            context.beginPath();
            path.context(context)(feature as GeoPermissibleObjects);

            return context.isPointInPath(x, y);
        });
        clickedRegion && onPointClick(clickedRegion);
    };

    // START Draw map

    const drawMap = () => {
        if (!contextRef.current || !pathRef.current) {
            return;
        }

        const context = contextRef.current;
        const path = pathRef.current;
        const { width, height } = (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect();
        const clearRectSize = width > height ? width : height;
        transformRef.current = currentTransform.current;

        context.save();
        context.clearRect(0, 0, clearRectSize, clearRectSize);
        context.resetTransform();
        context.translate(currentTransform.current.x, currentTransform.current.y);
        context.scale(currentTransform.current.k, currentTransform.current.k);
        context.beginPath();
        chartData.forEach((feature) => {
            context.beginPath();
            path(feature as GeoPermissibleObjects);
            context.fillStyle =
                addBrightness(feature.properties.color, feature.properties.brightness || 0) || defaultFeatureColor;
            context.fill();
            context.strokeStyle = '#cee7f2';
            context.lineWidth = 1.5 / currentTransform.current.k;
            context.stroke();
        });
        context.restore();
    };

    // END Draw map

    const handleZoom = (event: D3ZoomEvent<HTMLCanvasElement, any>) => {
        const {
            transform: { x, y, k }
        } = event;
        const [[minX, minY], [maxX, maxY]] = pathRef.current.bounds(mapData as GeoGeometryObjects);
        if (event.sourceEvent) {
            zoomedCoordinates.current.x = event.sourceEvent.clientX;
            zoomedCoordinates.current.y = event.sourceEvent.clientY;
        }

        initialCoordinates.current = { minX, minY, maxX, maxY };
        currentTransform.current = { x, y, k };
        setZoomButtonsStatus({
            zoomIn: k === maxScaleExtent,
            zoomOut: k === minScaleExtent,
            reset: k === minScaleExtent
        });
        drawMap();
    };

    useEffect(() => {
        if (!canvasRef.current || !zoomRef.current) {
            return;
        }

        // contextRef.current.translate(0, 0);

        setTimeout(() => {
            if (
                initialCanvasWidth.current &&
                initialCanvasHeight.current &&
                (initialCanvasHeight.current !==
                    (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().height ||
                    initialCanvasWidth.current !==
                        (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().width)
            ) {
                const [[currentMinX, currentMinY], [currentMaxX, currentMaxY]] = pathRef.current.bounds(
                    mapData as GeoGeometryObjects
                );

                if (initialCanvasWidth.current !== canvasWidth) {
                    const initialWidth = initialCanvasWidth.current || 0;
                    const initialHeight = initialCanvasHeight.current || 0;
                    const { x, y, k } = transformRef.current;
                    const zoomScale = k / (initialWidth / initialHeight) < 1 ? 1 : k / (initialWidth / initialHeight);

                    const calculatedX = (x * zoomScale) / (initialWidth / canvasWidth);
                    const calculatedY = (y * zoomScale) / (initialHeight / canvasHeight);

                    currentTransform.current = { x: -calculatedX, y: -calculatedY, k };

                    initialCanvasWidth.current = canvasWidth;
                    initialCanvasHeight.current = currentMaxY - currentMinY;
                }
                select(canvasRef.current as Element)
                    .call(zoomRef.current)
                    .call(
                        zoomRef.current.transform,
                        zoomIdentity
                            .translate(currentTransform.current.x, currentTransform.current.y)
                            .scale(currentTransform.current.k)
                    );
            }
        }, 0);
    }, [
        canvasWidth,
        canvasHeight,
        pathRef.current,
        contextRef.current,
        canvasRef.current,
        zoomRef.current,
        initialCanvasHeight.current,
        initialCanvasWidth.current
    ]);
    // START Set configurations for D3 CANVAS

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;

        let transformedX: number;
        let transformedY: number;

        const context = canvas.getContext('2d');
        contextRef.current = context;

        const projection = geoIdentity()
            .reflectY(true)
            .fitExtent(
                [
                    [0, 0],
                    [canvas.width, canvas.height]
                ],
                mapData as GeoGeometryObjects
            );

        const path = geoPath(projection, context);
        pathRef.current = path;

        const zoom = d3Zoom()
            .scaleExtent(defaultScaleExtent)
            .translateExtent([defaultTranslateExtent, [canvas.width, canvas.height]])
            .on('zoom', (event: D3ZoomEvent<HTMLCanvasElement, any>) => handleZoom(event));

        if (
            initialCanvasWidth.current &&
            initialCanvasHeight.current &&
            initialCanvasHeight.current ===
                (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().height &&
            initialCanvasWidth.current === (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().width
        ) {
            if (initialZoomedRegionId && defaultZoomScale > 1) {
                const zoomedRegion = chartData.find((item) => item.id === initialZoomedRegionId);
                const [[minX, minY], [maxX, maxY]] = path.bounds(zoomedRegion as GeoGeometryObjects);
                transformedX = -(canvas.width / 2 - ((minX + maxX) / 2) * defaultZoomScale);
                transformedY = -(canvas.height / 2 - ((minY + maxY) / 2) * defaultZoomScale);
            } else {
                transformedX = canvas.width / 2;
                transformedY = canvas.height / 2;
            }

            select(canvas as Element)
                .call(zoom)
                .call(
                    zoom.transform,
                    zoomIdentity
                        .translate(transformedX, transformedY)
                        .scale(currentTransform.current.k)
                        .translate(-transformedX, -transformedY)
                );
        }
        zoomRef.current = zoom;

        select(canvas).on('mousemove', handleMouseMove);

        select(canvas).on('mouseleave', () => {
            if (hoveredRegionRef.current && hoveredRegionRef.current.properties.brightness > 0) {
                hoveredRegionRef.current.properties.brightness = 0;
                hoveredRegionRef.current = null;
                handleMouseLeave();
                drawMap();
            }
        });

        select(canvas).on('click', handleClick);
    }, [
        chartData,
        canvasRef,
        zoomRef,
        canvasWrapperRef,
        defaultZoomScale,
        isMobile,
        isLoading,
        withLegend,
        isViewActive,
        withActivity,
        screenType,
        title,
        canvasWidth,
        canvasHeight
    ]);

    // END Set configurations for D3 CANVAS

    const handleZoomIn = () => {
        const zoom = zoomRef.current;
        canvasRef.current?.getContext('2d')?.resetTransform();
        zoom?.scaleBy(
            select(canvasRef.current as Element)
                .transition()
                .duration(100),
            1.1
        );
    };

    const handleZoomOut = () => {
        const zoom = zoomRef.current;
        canvasRef.current?.getContext('2d')?.resetTransform();
        zoom?.scaleBy(
            select(canvasRef.current as Element)
                .transition()
                .duration(100),
            0.9
        );
    };

    const handleZoomReset = () => {
        const zoom = zoomRef.current;
        canvasRef.current?.getContext('2d')?.resetTransform();
        zoom?.scaleTo(
            select(canvasRef.current as Element)
                .transition()
                .duration(150),
            1
        );
    };

    const setViewActiveHandler = () => setViewActive(!isViewActive);

    const handleLegendClick = (name: string, color: string) => {
        chartData.forEach((dataItem) => {
            if (dataItem?.properties?.legend === name) {
                if (dataItem.properties.color !== defaultFeatureColor) {
                    dataItem.properties.brightness = 0;
                    dataItem.properties.color = defaultFeatureColor;
                } else {
                    dataItem.properties.color = color;
                }
            } else {
                if (dataItem.properties.value === 0) {
                    return;
                }
                dataItem.properties.brightness = dataItem.properties.brightness > 0 ? 0 : 0.5;
            }
        });

        const legend = legends.find((item) => item.name === name);

        if (legend) {
            legend.disabled = !legend.disabled;
            setLegends([...legends]);
        }

        drawMap();
    };

    const handleLegendMouseOver = (isEnter: boolean, disabled: boolean | undefined) => {
        chartData.forEach(({ properties }) => {
            if (properties.value > 0) {
                properties.brightness = isEnter && !disabled ? 0.3 : 0;
            }
        });

        drawMap();
    };

    return (
        <>
            {tooltipData.content && (
                // @ts-ignore
                <Popover
                    isOpen={true}
                    screenType="desktop"
                    ref={popoverRef}
                    position={'top'}
                    cornerRadius={'smooth-radius'}
                    Content={<div className="popover">{tooltipData.content}</div>}
                >
                    <div
                        className="popover__target"
                        style={{ position: 'absolute', left: `${tooltipData.left}px`, top: `${tooltipData.top}px` }}
                    />
                </Popover>
            )}
            <div className={`map-chart chart-overflow-holder ${className || ''}`}>
                <BusyLoader isBusy={isLoading} className="map-chart__proxy-content">
                    {!mapData?.features?.length ? (
                        <Empty type="data" title={emptyText} className="map-chart__proxy-content" />
                    ) : (
                        <>
                            {title && (
                                <div className="map-chart__title-wrapper">
                                    <h2 className="map-chart__title chart-title ellipsis-text">{title}</h2>
                                </div>
                            )}
                            <div className="canvas-wrapper" ref={canvasWrapperRef}>
                                <canvas
                                    className="canvas"
                                    ref={canvasRef}
                                    width={(canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().width}
                                    height={
                                        (canvasWrapperRef.current as HTMLDivElement)?.getBoundingClientRect().height
                                    }
                                ></canvas>
                            </div>
                            {withLegend && colorAxis && (
                                <div className="map-chart__legends">
                                    {legends.map(({ to, color, name, disabled }) => (
                                        <button
                                            key={`${name}_${to}`}
                                            className={classnames('legend__button', { disabled })}
                                            onClick={() => handleLegendClick(name, color)}
                                            onMouseEnter={() => handleLegendMouseOver(true, disabled)}
                                            onMouseLeave={() => handleLegendMouseOver(false, disabled)}
                                        >
                                            <i
                                                className="legend__circle"
                                                style={{ background: disabled ? defaultFeatureColor : color }}
                                            />
                                            <span className="legend__name">{name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {withNavigation && !isViewActive && (
                                <div className="map-chart__actions__box">
                                    <IconButton
                                        name="bc-icon-full-screen"
                                        onClick={handleZoomReset}
                                        disabled={zoomButtonsStatus.reset}
                                    />
                                    <IconButton
                                        name="bc-icon-zoom-out"
                                        onClick={handleZoomIn}
                                        disabled={zoomButtonsStatus.zoomIn}
                                    />
                                    <IconButton
                                        name="bc-icon-zoom-in"
                                        onClick={handleZoomOut}
                                        disabled={zoomButtonsStatus.zoomOut}
                                    />
                                </div>
                            )}
                            {withActivity && !isMobile && selectedName && (
                                <div className={classnames('map-chart__activity-box active')}>
                                    <div className="activity-box__headline">{selectedName}</div>
                                    <div className="activity-box__content">{viewActivityContent}</div>
                                </div>
                            )}
                            {withActivity && isMobile && (
                                <div
                                    className={classnames('map-chart__activity-box__mobile', {
                                        active: isViewActive
                                    })}
                                >
                                    <Button
                                        disabled={!selectedName}
                                        color="default"
                                        appearance="minimal"
                                        itemsDirection="end"
                                        flexibility="content-size"
                                        className="activity__mobile-view"
                                        onClick={setViewActiveHandler}
                                    >
                                        {/*@ts-ignore*/}
                                        <Icon type="bc-icon-backwards" />
                                        {!isViewActive && (
                                            <span className="activity__mobile-view-name">{viewActivityName}</span>
                                        )}
                                    </Button>
                                    <div className="activity__mobile-content chart-activity-data">
                                        <div
                                            className="activity__mobile-content__header chart-activity-title"
                                            onClick={setViewActiveHandler}
                                        >
                                            {/*@ts-ignore*/}
                                            <Icon type="bc-icon-backwards" />
                                            <span className="activity__mobile-content__header-title">
                                                {selectedName}
                                            </span>
                                        </div>
                                        <div className="activity__mobile-content__body chart-activity-body">
                                            {viewActivityContent}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </BusyLoader>
            </div>
        </>
    );
};

export default MapChartD3;
