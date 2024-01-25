import React, { useCallback, useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { useDeviceType } from 'hooks';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Styles
import './index.scss';

function AreaChart({
    title,
    yAxisTitle,
    withMarker,
    categories,
    subtitle,
    sharedTooltip,
    showNavigator,
    gridLineDashStyle,
    yCrosshairStyle,
    xCrosshairStyle,
    emptyColor,
    screenType,
    series,
    isLoading,
    emptyText,
    ...restProps
}) {
    const { isMobile } = useDeviceType(screenType);
    const [changeableSeries, setChangeableSeries] = useState([]);

    const generateLegend = useCallback((data) => {
        setChangeableSeries(
            data?.map((item) => ({
                ...item,
                visible: true,
                lineWidth: 1,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [
                            0,
                            Highcharts.Color(item.color || emptyColor)
                                .setOpacity(0.2)
                                .get('rgba')
                        ],
                        [
                            1,
                            Highcharts.Color(item.color || emptyColor)
                                .setOpacity(0)
                                .get('rgba')
                        ]
                    ]
                }
            }))
        );
    }, []);

    useEffect(() => generateLegend(series), [series]);

    const options = {
        chart: {
            type: 'areaspline',
            ignoreHiddenSeries: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: title,
            useHTML: true,
            style: {
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        yAxis: {
            crosshair: yCrosshairStyle,
            labels: {
                style: {
                    color: '#3c4043',
                    fontWeight: 600,
                    fontSize: '1.4rem'
                }
            },
            title: {
                text: yAxisTitle
            },
            gridLineDashStyle
        },
        xAxis: {
            crosshair: xCrosshairStyle,
            categories,
            gridLineDashStyle,
            labels: {
                style: {
                    color: '#3c4043',
                    fontWeight: 600,
                    fontSize: '1.4rem'
                }
            }
        },
        plotOptions: {
            series: {
                showInLegend: false
            }
        },
        subtitle: {
            text: subtitle,
            useHTML: true,
            style: {
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        tooltip: {
            borderRadius: 5,
            shared: sharedTooltip
        },
        series: changeableSeries,
        ...restProps
    };

    const handleLegendClick = useCallback((index) => {
        setChangeableSeries((data) =>
            data?.map((item, i) => ({
                ...item,
                visible: index === i ? !item.visible : item.visible
            }))
        );
    }, []);

    return (
        <div className="chart-overflow-holder area-chart">
            <BusyLoader isBusy={isLoading} className="proxy-content">
                {!(series?.length && changeableSeries?.length) ? (
                    <Empty type="data" title={emptyText} className="proxy-content" />
                ) : (
                    <>
                        <HighchartsReact options={options} highcharts={Highcharts} />
                        <div
                            className={classnames('area-chart-lengend', {
                                mobile: isMobile
                            })}
                        >
                            <div className="area-chart-lengend-shadow" />
                            <div className="area-chart-lengend-content">
                                {changeableSeries?.map(({ visible, color, name }, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleLegendClick(index)}
                                        className={classnames('area-chart-legend-item', {
                                            disabled: !visible
                                        })}
                                    >
                                        <div className="area-chart-legend-symbol" style={{ backgroundColor: color }} />
                                        <div className="area-chart-legend-text">{name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </BusyLoader>
        </div>
    );
}

AreaChart.propTypes = {
    tooltip: PropTypes.object,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    categories: PropTypes.array,
    emptyColor: PropTypes.string,
    sharedTooltip: PropTypes.bool,
    screenType: PropTypes.string,
    showNavigator: PropTypes.bool,
    plotOptions: PropTypes.object,
    subTitleText: PropTypes.string,
    xCrosshairStyle: PropTypes.object,
    yCrosshairStyle: PropTypes.object,
    gridLineDashStyle: PropTypes.string,
    series: PropTypes.arrayOf(PropTypes.object),
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

AreaChart.defaultProps = {
    plotOptions: {
        area: {
            pointStart: '1'
        },
        series: {
            marker: {
                lineWidth: 1,
                symbol: 'circle',
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    xCrosshairStyle: {
        width: 1,
        color: 'gray',
        dashStyle: 'shortdot'
    },
    emptyColor: '#c7c8c9',
    yCrosshairStyle: {
        width: 1,
        color: 'gray',
        dashStyle: 'shortdot'
    },
    gridLineDashStyle: 'Dot',
    isLoading: false,
    emptyText: 'No data to display'
};

export default AreaChart;
