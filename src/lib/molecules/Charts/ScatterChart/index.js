import React, { useRef, useState, useEffect, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Empty, BusyLoader, Tag, Label, Button } from 'components';

import './index.scss';

function ScatterChart(props) {
    const {
        label,
        name,
        color,
        data,
        zoomType,
        title,
        subtitle,
        yAxisText,
        xAxisText,
        className,
        showValue,
        gridLineDashStyle,
        resetButtonPosition,
        isLoading,
        emptyText,
        ...restProps
    } = props;

    const highchartRef = useRef(null);

    // We need key to dynamically update chart.
    const [key, setKey] = useState(true);
    const [visibilityResetButton, setVisibilityResetButton] = useState(false);

    useEffect(() => {
        setKey((val) => !val);
    }, [props]);

    const handleSelection = useCallback(({ resetSelection }) => {
        setVisibilityResetButton(!resetSelection);
    }, []);

    const options = {
        chart: {
            type: 'scatter',
            zoomType,
            resetZoomButton: {
                position: {
                    y: -200
                }
            },
            selectionMarkerFill: 'rgb(79 150 235 / 8%)',
            events: {
                selection: handleSelection
            }
        },
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        xAxis: {
            title: {
                margin: 20,
                text: xAxisText
            },
            labels: {
                style: {
                    fontSize: '1.4rem',
                    color: '#3c4043',
                    fontWeight: '600'
                }
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            gridLineDashStyle,
            title: {
                margin: 20,
                text: yAxisText
            },
            labels: {
                style: {
                    fontSize: '1.4rem',
                    color: '#3c4043',
                    fontWeight: '600'
                }
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: true
                        }
                    }
                }
            }
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.y}'
        },
        series: [
            {
                name,
                color,
                data
            }
        ],
        ...restProps
    };

    function handleResetZoom() {
        const { chart } = highchartRef.current;

        chart.xAxis[0].setExtremes(null, null);
        chart.yAxis[0].setExtremes(null, null);

        setVisibilityResetButton(false);
    }

    return (
        <div
            key={key ? 'key1' : 'key2'}
            className={classnames('chart-overflow-holder', 'scatter-chart-holder', className)}
        >
            <BusyLoader isBusy={isLoading} className="scatter-chart-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="scatter-chart-proxy-content" />
                ) : (
                    <>
                        <div className="chart-overflow-header">
                            <div className="chart-label">
                                {label && (
                                    <Label size="body" font="bold">
                                        {label}
                                    </Label>
                                )}
                                {showValue && <Tag size="small" appearance="light" name={getDataValue(data)} />}
                            </div>
                            {visibilityResetButton && (
                                <Button
                                    appearance="outline"
                                    icon="bc-icon-reset"
                                    itemsDirection="end"
                                    onClick={handleResetZoom}
                                >
                                    Reset Zoom
                                </Button>
                            )}
                        </div>
                        <HighchartsReact ref={highchartRef} options={options} highcharts={Highcharts} />
                    </>
                )}
            </BusyLoader>
        </div>
    );
}

function getDataValue(data) {
    return data ? data.reduce((prev, next) => prev + next) : 0;
}

ScatterChart.propTypes = {
    label: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
    showValue: PropTypes.bool,
    tooltip: PropTypes.object,
    zoomType: PropTypes.oneOf(['x', 'y', 'xy']),
    data: PropTypes.array,
    color: PropTypes.string,
    name: PropTypes.string,
    yAxisText: PropTypes.node,
    xAxisText: PropTypes.node,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    gridLineDashStyle: PropTypes.string,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

ScatterChart.defaultProps = {
    showValue: true,
    zoomType: 'xy',
    legend: {
        enabled: false
    },
    gridLineDashStyle: 'Dot',
    yAxisText: '<p class="axisText">Customers Activity</p>',
    xAxisText: '<p class="axisText">Custom Activity Metrics</p>',
    isLoading: false,
    emptyText: 'No data to display'
};

export default ScatterChart;
