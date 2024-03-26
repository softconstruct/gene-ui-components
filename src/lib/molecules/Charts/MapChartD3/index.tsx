import React, { FC, MouseEvent, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    select,
    pointer,
    geoPath,
    GeoPath,
    geoIdentity,
    D3ZoomEvent,
    zoomIdentity,
    zoom as d3Zoom,
    GeoPermissibleObjects
} from 'd3';
import { GeoGeometryObjects } from 'd3-geo';
import classnames from 'classnames';

// Helpers
import { useDeviceType } from '../../../../hooks';

// Components
import Icon from '../../../atoms/Icon';
import IconButton from '../MapChart/IconButton';
import { BusyLoader, Empty, Popover } from '../../../../index';

// Styles
import './index.scss';

interface MapChartFeature {
    type: string;
    id: string;
    properties: any;
    geometry: {
        type: string;
        coordinates: any;
    };
}

interface RegionData {
    id: string;
    value: number;
}

interface DataClasses {
    to: number;
    from: number;
    name: string;
    color: string;
}

export interface IMapChartD3Props {
    /**
     * Map title
     */
    title: string;
    /**
     * Canvas width
     */
    width: number;
    /**
     * Canvas height
     */
    height: number;
    /**
     * Brightness of regions on hover action
     */
    brightness: number;
    /**
     * Map chart data
     */
    mapData: any;
    /**
     * Background colors with range ('from', 'to') of regions depends on statistics
     */
    colorAxis: { dataClasses: DataClasses[] };
    /**
     * Classname for parent element of chart
     */
    className: string;
    /**
     * Device screen type
     */
    screenType: string;
    /**
     * Add legends for chart
     */
    withLegend: boolean;
    /**
     * Show tooltip for regions on hover action
     */
    withTooltip: boolean;
    /**
     * Fires event when user click on Region.
     * <br>
     * <code>(event: MapChartFeature) => void </code>
     */
    onPointClick: (event: MapChartFeature) => void;
    /**
     * Fires event when user hover on Region.
     * <br>
     * <code>(event: MapChartFeature) => void </code>
     */
    onPointOver: (event: MapChartFeature) => void;
    /**
     * Show activities for regions on hover action
     */
    withActivity: boolean;
    /**
     * Activities content data
     */
    selectedData: string | ReactNode;
    /**
     * Show zoom navigation bar
     */
    withNavigation: boolean;
    /**
     * Activities content text
     */
    viewActivityText: string;
    /**
     * Show loading component
     */
    isLoading: boolean;
    /**
     * Content of empty component in case if nothing to show
     */
    emptyText: string;
    /**
     * Regions data which need to highlight depends on case
     */
    regionData: RegionData[];
    /**
     * Default zoom scale value
     */
    defaultZoomScale: number;
    /**
     * Feature id on which it should be zoom
     */
    zoomedFeatureId: string;
    /**
     * Default zoom scale extent.
     * <br>
     * <code> [1, 8] </code>
     */
    defaultScaleExtent: [number, number];
    /**
     * Default zoom translate extent.
     * <br>
     * <code> [0, 0] </code>
     */
    defaultTranslateExtent: [number, number];
}

const addBrightness = (color: string, brightnessFactor: number) => {
    if (!color) {
        return;
    }
    const rgbValues = hexToRgb(color);

    const adjustedRGB = rgbValues.map((value) => {
        const adjustedValue = Math.min(value + value * brightnessFactor, 255);
        return Math.round(adjustedValue);
    });

    return `rgb(${adjustedRGB[0]}, ${adjustedRGB[1]}, ${adjustedRGB[2]})`;
};

const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.substring(1), 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;
    return [red, green, blue];
};

const MapChartD3: FC<IMapChartD3Props> = ({
    title = '',
    width = 900,
    height = 600,
    brightness,
    mapData,
    colorAxis,
    className,
    screenType,
    withLegend,
    withTooltip,
    onPointOver,
    onPointClick,
    withActivity,
    selectedData,
    withNavigation,
    viewActivityText,
    isLoading,
    emptyText,
    regionData,
    defaultZoomScale = 1,
    zoomedFeatureId = '',
    defaultScaleExtent = [1, 8],
    defaultTranslateExtent = [0, 0]
}) => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const zoomRef = useRef(null);
    const transformRef = useRef({ x: 0, y: 0, k: 1 });
    const popoverRef = useRef();
    const hoveredRegionRef = useRef<MapChartFeature>();
    const { isMobile } = useDeviceType(screenType);
    const [isViewActive, setViewActive] = useState<boolean>(false);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [chartData, setChartData] = useState<MapChartFeature[]>(mapData.features);
    const [tooltipData, setTooltipData] = useState({ top: 0, left: 0, content: null });

    useEffect(() => {
        const _chartData = [];

        mapData.features.map((item: MapChartFeature) => {
            const [region] = regionData.filter((region) => region.id === item.id);

            if (region) {
                const [dataClass] = colorAxis.dataClasses.filter(
                    (axis) => region.value >= axis.from && region.value <= axis.to
                );
                _chartData.push({
                    ...item,
                    properties: {
                        ...item.properties,
                        value: region.value,
                        color: dataClass.color,
                        legend: dataClass.name
                    }
                });
            } else {
                _chartData.push({ ...item, properties: { ...item.properties, value: 0, color: '#ebebeb' } });
            }
        });

        setChartData(_chartData);
    }, [mapData]);

    const handleMouseEnter = (geo: MapChartFeature, e: MouseEvent): void => {
        const [x, y] = pointer(e);
        withActivity && setSelectedName(geo.properties.name);
        withTooltip && setTooltipData({ top: y, left: x, content: geo.properties.name });
    };

    const handleMouseLeave = () => {
        withActivity && setSelectedName(null);
        withTooltip && setTooltipData({ top: 0, left: 0, content: null });
    };

    const handleMouseMove = (event: MouseEvent, context: CanvasRenderingContext2D, path: GeoPath) => {
        const [x, y] = pointer(event);

        // START Find hovered region
        context.beginPath();
        const generateContext = path.context(context);
        const hoveredRegion = chartData.find((feature) => {
            generateContext(feature as GeoPermissibleObjects);

            return context.isPointInPath(
                (x - transformRef.current.x) / transformRef.current.k,
                (y - transformRef.current.y) / transformRef.current.k
            );
        });

        // END Find hovered region

        if (!hoveredRegion) {
            if (!hoveredRegionRef.current) {
                return;
            }
            hoveredRegionRef.current.properties.brightness = 0;
            drawMap(context, path);
            hoveredRegionRef.current = hoveredRegion;
            handleMouseLeave();
            return;
        }

        // START Highlight regions depends on brightness

        if (hoveredRegion && hoveredRegion?.properties.value) {
            if (hoveredRegionRef.current?.id === hoveredRegion.id) {
                if (hoveredRegionRef.current.properties.brightness === hoveredRegion.properties.brightness) {
                    handleMouseEnter(hoveredRegion, event);
                    return;
                }
                handleMouseEnter(hoveredRegion, event);
                hoveredRegion.properties.brightness = 0;

                drawMap(context, path);
            } else {
                if (hoveredRegionRef.current) hoveredRegionRef.current.properties.brightness = 0;

                hoveredRegion.properties.brightness = brightness;
                drawMap(context, path);

                handleMouseEnter(hoveredRegion, event);
            }

            hoveredRegionRef.current = hoveredRegion as MapChartFeature;
            onPointOver(hoveredRegion);
        } else if (
            hoveredRegionRef.current &&
            hoveredRegionRef.current.id !== hoveredRegion.id &&
            hoveredRegionRef.current.properties.value
        ) {
            handleMouseLeave();
            hoveredRegion.properties.brightness = 0;
            hoveredRegionRef.current.properties.brightness = 0;
            drawMap(context, path);
            hoveredRegionRef.current = hoveredRegion;
        }
        // END Highlight regions depends on brightness
    };

    const handleClick = (event: MouseEvent, context: CanvasRenderingContext2D, path: GeoPath) => {
        const [x, y] = pointer(event);

        const clickedRegion = chartData.find((feature) => {
            context.beginPath();
            path.context(context)(feature as GeoPermissibleObjects);

            return context.isPointInPath(x, y);
        });
        onPointClick(clickedRegion);
    };

    // START Draw map

    const drawMap = (context: CanvasRenderingContext2D, path: GeoPath) => {
        context.save();
        context.clearRect(0, 0, width, height);
        context.resetTransform();
        context.translate(transformRef.current.x, transformRef.current.y);
        context.scale(transformRef.current.k, transformRef.current.k);
        context.beginPath();
        chartData.forEach((feature) => {
            context.beginPath();
            path(feature as GeoPermissibleObjects);
            context.fillStyle = addBrightness(feature.properties.color, feature.properties.brightness || 0);
            context.fill();
            context.strokeStyle = '#cee7f2';
            context.lineWidth = 1.5;
            context.stroke();
        });
        context.restore();
    };

    // END Draw map

    const handleZoom = (
        event: D3ZoomEvent<typeof canvasRef.current, any>,
        context: CanvasRenderingContext2D,
        path: GeoPath
    ) => {
        transformRef.current = { x: event.transform.x, y: event.transform.y, k: event.transform.k };

        drawMap(context, path);
    };

    // START Set configurations for D3 CANVAS

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        let transformedX: number;
        let transformedY: number;

        const context = canvas.getContext('2d');

        const projection = geoIdentity()
            .reflectY(true)
            .fitExtent(
                [
                    [0, 0],
                    [width, height]
                ],
                mapData as GeoGeometryObjects
            );

        const path = geoPath(projection, context);

        if (zoomedFeatureId && defaultZoomScale > 1) {
            const zoomedRegion = chartData.find((item) => item.id === zoomedFeatureId);
            const [[minX, minY], [maxX, maxY]] = path.bounds(zoomedRegion as GeoGeometryObjects);

            transformedX = -(width / 2 - ((minX + maxX) / 2) * defaultZoomScale);
            transformedY = -(height / 2 - ((minY + maxY) / 2) * defaultZoomScale);
        } else {
            transformedX = width / 2;
            transformedY = height / 2;
        }

        const zoom = d3Zoom()
            .scaleExtent(defaultScaleExtent)
            .translateExtent([defaultTranslateExtent, [width, height]])
            .on('zoom', (event) => handleZoom(event, context, path));
        zoomRef.current = zoom;

        select(canvas)
            .call(zoom)
            .call(
                zoom.transform,
                zoomIdentity
                    .translate(transformedX, transformedY)
                    .scale(defaultZoomScale)
                    .translate(-transformedX, -transformedY)
            );

        select(canvas).on('mousemove', (event) => {
            handleMouseMove(event, context, path);
        });

        select(canvas).on('mouseout', () => {
            handleMouseLeave();
        });

        select(canvas).on('click', (event) => handleClick(event, context, path));
    }, [mapData, chartData, withTooltip, withActivity, canvasRef, zoomRef, width, height, defaultZoomScale]);

    // END Set configurations for D3 CANVAS

    const handleZoomIn = () => {
        const zoom = zoomRef.current;
        canvasRef.current.getContext('2d').resetTransform();
        zoom.scaleBy(select(canvasRef.current).transition().duration(100), 1.1);
    };

    const handleZoomOut = useCallback(() => {
        const zoom = zoomRef.current;
        canvasRef.current.getContext('2d').resetTransform();
        zoom.scaleBy(select(canvasRef.current).transition().duration(100), 0.9);
    }, [canvasRef, zoomRef]);

    const handleZoomReset = () => {
        const zoom = zoomRef.current;
        canvasRef.current.getContext('2d').resetTransform();
        zoom.scaleTo(select(canvasRef.current).transition().duration(150), 1);
    };

    const setViewActiveHandler = () => setViewActive(!isViewActive);

    const handleLegendClick = useCallback(
        (name: string, color: string) => {
            const _chartData = structuredClone(chartData);

            _chartData.forEach((dataItem) =>
                !!dataItem.properties.legend && dataItem.properties.legend === name
                    ? dataItem.properties.color !== '#ebebeb'
                        ? (dataItem.properties.color = '#ebebeb')
                        : (dataItem.properties.color = color)
                    : null
            );

            setChartData(_chartData);
        },
        [chartData]
    );

    return (
        <>
            {!!tooltipData.content && (
                <Popover
                    isOpen={true}
                    screenType="desktop"
                    ref={popoverRef}
                    position={'top'}
                    cornerRadius={'smooth-radius'}
                    Content={<div className="popover__content">{tooltipData.content}</div>}
                >
                    <div
                        className=""
                        style={{ position: 'absolute', left: `${tooltipData.left}px`, top: `${tooltipData.top}px` }}
                    ></div>
                </Popover>
            )}
            <div className={`charts__map-chart chart-overflow-holder ${className}`}>
                <BusyLoader isBusy={isLoading} className="map-chart__proxy-content">
                    {!mapData?.features.length ? (
                        <Empty type="data" title={emptyText} className="map-chart__proxy-content" />
                    ) : (
                        <>
                            {!!title && (
                                <div className="chart__title-wrapper">
                                    <h2 className="chart__title">{title}</h2>
                                </div>
                            )}
                            {isMobile && selectedName && (
                                <div className="chart-selected-title">
                                    <span>{selectedName}</span>
                                </div>
                            )}
                            <canvas ref={canvasRef} width={width} height={height}></canvas>
                            {withLegend && (
                                <div className="chart__legends" style={{ width: `${width}px` }}>
                                    {colorAxis.dataClasses.map(({ to, color, name }) => (
                                        <button
                                            key={`${name}_${to}`}
                                            className="legend__button"
                                            onClick={() => handleLegendClick(name, color)}
                                        >
                                            <i className="legend__circle" style={{ background: color }} />
                                            <span className="legend__name">{name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {withNavigation && (
                                <div className="actions__box">
                                    <IconButton name="bc-icon-full-screen" onClick={handleZoomReset} />
                                    <IconButton name="bc-icon-zoom-out" onClick={handleZoomIn} />
                                    <IconButton name="bc-icon-zoom-in" onClick={handleZoomOut} />
                                </div>
                            )}

                            {withActivity && !isMobile && selectedName && (
                                <div className={classnames('chart__activity-box active')}>
                                    <div className="headline">{selectedName}</div>
                                    <div className="content">{selectedData}</div>
                                </div>
                            )}
                            {withActivity && isMobile && (
                                <div
                                    className={classnames('chart__activity-table', {
                                        active: isViewActive
                                    })}
                                >
                                    {selectedName && (
                                        <div className="view-activity" onClick={setViewActiveHandler}>
                                            <Icon type="bc-icon-backwards" />
                                            {!isViewActive && <span>{viewActivityText}</span>}
                                        </div>
                                    )}
                                    <div className="chart-activity-data">
                                        <div className="chart-activity-title" onClick={setViewActiveHandler}>
                                            <Icon type="bc-icon-backwards" />
                                            <span>{selectedName}</span>
                                        </div>
                                        <div className="chart-activity-body">{selectedData}</div>
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
