import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

import { Empty, BusyLoader } from '../../../atoms';

import './index.scss';

function BarChart({
    min,
    max,
    xAxisRest,
    yAxisRest,
    title,
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
            type: 'column',
            ignoreHiddenSeries: false
        },
        exporting: {
            enabled: true
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
            headerFormat: '<div style="font-size: 1.2rem">{point.key}</div>',
            pointFormat: '<ul style="color:{series.color}"><li>{series.name}: <span>{point.y:.1f}</span></li></ul>',
            shared: sharedTooltip,
            useHTML: true
        },
        xAxis: {
            crosshair: true,
            categories,
            tickWidth: 1,
            labels: {
                style: {
                    fontSize: '1.4rem',
                    color: '#3c4043',
                    fontWeight: '600'
                },
                formatter() {
                    return this.value;
                }
            },
            lineWidth: 1,
            gridLineDashStyle,
            ...xAxisRest
        },
        yAxis: {
            max,
            min: !sharedTooltip && min,
            title: '',
            labels: {
                style: {
                    fontSize: '1.4rem',
                    color: '#3c4043',
                    fontWeight: '600'
                }
            },
            gridLineDashStyle,
            ...yAxisRest
        },
        series,
        ...restProps
    };

    return (
        <div className="bar-chart chart-overflow-holder">
            <BusyLoader isBusy={isLoading} className="bar-chart-proxy-content">
                {!series?.length ? (
                    <Empty type="data" title={emptyText} className="bar-chart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

BarChart.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    tooltip: PropTypes.object,
    title: PropTypes.string,
    sharedTooltip: PropTypes.bool,
    plotOptions: PropTypes.object,
    subtitle: PropTypes.string,
    gridLineDashStyle: PropTypes.string,
    series: PropTypes.arrayOf(PropTypes.object),
    colors: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.arrayOf(PropTypes.string),
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

BarChart.defaultProps = {
    colors: ['#9e90ed', '#4f96eb', '#00c6db', '#ff81c0'],
    legend: {
        align: 'left',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        symbolWidth: 2,
        symbolPadding: 10,
        itemStyle: {
            color: '#3c4043',
            fontWeight: '600'
        },
        marker: {
            enabled: true
        }
    },
    gridLineDashStyle: 'Dot',
    isLoading: false,
    emptyText: 'No data to display'
};

export default BarChart;
