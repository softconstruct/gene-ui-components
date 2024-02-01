import React, { useMemo, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
import HighchartsReact from 'highcharts-react-official';
import classnames from 'classnames';

// Helpers
import { noop } from 'utils';
import { useDeviceType } from 'hooks';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Local components
import Icon from '../../../atoms/Icon';
import IconButton from './IconButton';

// Styles
import './index.scss';

HC_map(Highcharts);

function MapChart({
    data,
    title,
    width,
    height,
    joinBy,
    opacity,
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
    positionerCord,
    viewActivityText,
    fixedTooltipContent,
    isLoading,
    emptyText,
    ...restProps
}) {
    const { isMobile } = useDeviceType(screenType);

    const highChartRef = useRef(null);

    const [isViewActive, setViewActive] = useState(false);
    const [selectedName, setSelectedName] = useState(null);
    const [isItemSelected, setIsItemSelected] = useState(false);

    const [disabledButtons, setDisabledButtons] = useState({
        in: true,
        out: false,
        reset: true
    });

    const setViewActiveHandler = useCallback(() => setViewActive(!isViewActive), [isViewActive]);

    const handleZoomDisabled = useCallback((zoomLevel, minZoomLevel) => {
        setDisabledButtons({
            in: zoomLevel <= minZoomLevel,
            out: zoomLevel > 2,
            reset: zoomLevel <= minZoomLevel
        });
    }, []);

    const options = useMemo(
        () => ({
            chart: {
                width,
                height,
                type: 'map',
                animation: false
            },
            title: {
                text: title
            },
            xAxis: {
                minRange: 200
            },
            yAxis: {
                minRange: 200
            },
            colorAxis,
            mapNavigation: {
                enabled: true,
                enableButtons: false
            },
            legend: {
                enabled: withLegend,
                useHTML: true,
                padding: 20,
                itemStyle: {
                    padding: '0 10px',
                    color: '#3c4043',
                    'font-size': 14,
                    'font-weight': 600,
                    'line-height': 1.36
                }
            },
            tooltip: {
                useHTML: true,
                enabled: withTooltip,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderWidth: 0,
                formatter() {
                    return `<div class="hs-tooltip">
            ${this.key}
          </div>`;
                }
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            click: onPointClick,
                            mouseOver() {
                                if (withActivity) {
                                    onPointOver(this);
                                    setSelectedName(this.name);
                                    setIsItemSelected(true);
                                }
                            },
                            mouseOut() {
                                if (!isMobile && withActivity) {
                                    setIsItemSelected(false);
                                }
                            }
                        }
                    }
                }
            },
            series: [
                {
                    data,
                    joinBy,
                    mapData,
                    borderColor: '#fff',
                    borderWidth: 0.5,
                    states: {
                        hover: {
                            brightness: opacity
                        }
                    }
                }
            ],
            ...restProps
        }),
        [
            data,
            title,
            width,
            height,
            joinBy,
            opacity,
            mapData,
            isMobile,
            colorAxis,
            withLegend,
            withTooltip,
            withActivity,
            withNavigation
        ]
    );

    const handleMapZoom = useCallback(
        (level) => {
            highChartRef.current.chart.mapZoom(level);
            const { zoom, minZoom } = highChartRef.current.chart.mapView;
            handleZoomDisabled(zoom, minZoom);
        },
        [highChartRef]
    );

    const handleZoomOut = () => handleMapZoom(0.5);
    const handleZoomIn = () => handleMapZoom(2);
    const handleZoomReset = () => handleMapZoom(1000);

    return (
        <div className={`charts-map-chart chart-overflow-holder ${className}`}>
            <BusyLoader isBusy={isLoading} className="map-chart-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="map-chart-proxy-content" />
                ) : (
                    <>
                        {isMobile && selectedName && (
                            <div className="chart-selected-title">
                                <span>{selectedName}</span>
                            </div>
                        )}
                        <HighchartsReact
                            ref={highChartRef}
                            options={options}
                            highcharts={Highcharts}
                            constructorType="mapChart"
                        />
                        {withNavigation && (
                            <div className="actions-box">
                                <IconButton
                                    disabled={disabledButtons.reset}
                                    onClick={handleZoomReset}
                                    name="bc-icon-full-screen"
                                />
                                <IconButton
                                    disabled={disabledButtons.out}
                                    onClick={handleZoomOut}
                                    name="bc-icon-zoom-out"
                                />
                                <IconButton
                                    disabled={disabledButtons.in}
                                    onClick={handleZoomIn}
                                    name="bc-icon-zoom-in"
                                />
                            </div>
                        )}
                        {withActivity && !isMobile && (
                            <div
                                className={classnames('chart-activity-box', {
                                    active: isItemSelected
                                })}
                            >
                                <div className="headline">{selectedName}</div>
                                <div className="content">{selectedData}</div>
                            </div>
                        )}
                        {withActivity && isMobile && (
                            <div
                                className={classnames('chart-activity-table', {
                                    active: isViewActive
                                })}
                            >
                                {(isItemSelected || selectedName) && (
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
    );
}

MapChart.propTypes = {
    title: PropTypes.string,
    joinBy: PropTypes.array,
    width: PropTypes.number,
    screenType: PropTypes.string,
    viewActivityText: PropTypes.string,
    height: PropTypes.number,
    className: PropTypes.string,
    chartData: PropTypes.object,
    withLegend: PropTypes.bool,
    withActivity: PropTypes.bool,
    withTooltip: PropTypes.bool,
    withNavigation: PropTypes.bool,
    opacity: PropTypes.number,
    fixedTooltipContent: PropTypes.node,
    colorAxis: PropTypes.object.isRequired,
    data: PropTypes.array,
    onPointOver: PropTypes.func,
    onPointClick: PropTypes.func,
    selectedData: PropTypes.arrayOf(PropTypes.node),
    positionerCord: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

MapChart.defaultProps = {
    title: '',
    className: '',
    opacity: 0.05,
    mapData: {},
    withNavigation: true,
    withActivity: true,
    withTooltip: true,
    withLegend: true,
    onPointOver: noop,
    onPointClick: noop,
    positionerCord: {
        x: 850,
        y: 50
    },
    isLoading: false,
    emptyText: 'No data to display'
};

export default MapChart;
