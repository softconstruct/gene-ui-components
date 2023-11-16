import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { Empty, BusyLoader } from '../../../atoms';

import './index.scss';

function LineChart({
    curved,
    title,
    yAxisTitle,
    withMarker,
    categories,
    subtitle,
    sharedTooltip,
    gridLineDashStyle,
    isLoading,
    series,
    emptyText,
    ...restProps
}) {
    const options = {
        chart: {
            ignoreHiddenSeries: false,
            type: curved ? 'spline' : 'line'
        },
        yAxis: {
            gridLineDashStyle,
            title: {
                text: yAxisTitle
            },
            crosshair: {
                width: 1,
                color: 'gray',
                dashStyle: 'shortdot'
            },
            labels: {
                style: {
                    color: '#3c4043',
                    fontWeight: 600,
                    fontSize: '1.4rem'
                }
            }
        },
        title: {
            text: title
        },
        xAxis: {
            crosshair: {
                width: 1,
                color: 'gray',
                dashStyle: 'shortdot'
            },
            categories,
            gridLineWidth: 1,
            gridLineDashStyle,
            labels: {
                style: {
                    color: '#3c4043',
                    fontWeight: 600,
                    fontSize: '1.4rem'
                }
            }
        },
        subtitle: {
            text: subtitle
        },
        tooltip: {
            borderRadius: 5,
            shared: sharedTooltip,
            crosshairs: {
                width: 1,
                color: 'gray',
                dashStyle: 'shortdot'
            }
        },
        series,
        ...restProps
    };

    return (
        <div className="chart-overflow-holder line-chart">
            <BusyLoader isBusy={isLoading} className="line-chart-proxy-content">
                {!series?.length ? (
                    <Empty type="data" title={emptyText} className="line-chart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

LineChart.propTypes = {
    curved: PropTypes.bool,
    tooltip: PropTypes.object,
    title: PropTypes.string,
    categories: PropTypes.array,
    plotOptions: PropTypes.object,
    sharedTooltip: PropTypes.bool,
    subtitle: PropTypes.string,
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

LineChart.defaultProps = {
    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            marker: {
                lineWidth: 1,
                lineColor: null,
                symbol: 'circle',
                enabled: false
            }
        }
    },
    legend: {
        align: 'left',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        symbolPadding: 10,
        itemStyle: {
            color: '#3c4043',
            fontWeight: 600,
            fontSize: '1.4rem'
        }
    },
    gridLineDashStyle: 'Dot',
    isLoading: false,
    emptyText: 'No data to display'
};

export default LineChart;
