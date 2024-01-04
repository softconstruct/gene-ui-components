import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

import { Empty, BusyLoader } from 'components';
import './index.scss';

function StackedColumnChart({
    min,
    max,
    title,
    data,
    series,
    dataName,
    withLegend,
    categories,
    pointWidth,
    opacity,
    xAxisText,
    yAxisText,
    subtitle,
    emptyDataValue,
    gridLineDashStyle,
    isLoading,
    emptyText,
    ...restProps
}) {
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        xAxis: {
            title: {
                text: xAxisText,
                margin: 20
            },
            tickWidth: 1,
            categories,
            labels: {
                style: {
                    fontSize: '1.4rem',
                    color: '#3c4043',
                    fontWeight: '600'
                },
                formatter() {
                    return this.value.substring(0, 3);
                }
            },
            gridLineDashStyle
        },
        legend: {
            x: 48,
            enabled: withLegend,
            align: 'left',
            reversed: true,
            verticalAlign: 'bottom',
            layout: 'horizontal',
            symbolPadding: 10,
            itemStyle: {
                color: '#3c4043',
                fontWeight: 600,
                fontSize: '1.4rem'
            }
        },
        yAxis: {
            title: {
                text: yAxisText,
                margin: 20
            },
            min,
            max,
            labels: {
                style: {
                    fontSize: '1.4rem',
                    color: '#3c4043',
                    fontWeight: '600'
                }
            },
            gridLineDashStyle
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                }
            },
            point: {
                events: {
                    mouseOver() {
                        this.update({
                            color: Highcharts.Color(this.color).setOpacity(opacity).get()
                        });
                    },
                    mouseOut() {
                        this.update({
                            color: Highcharts.Color(this.color).setOpacity(1).get()
                        });
                    }
                }
            },
            series: {
                pointWidth,
                borderWidth: 0,
                animation: {
                    duration: 3000,
                    easing: 'easeOutBounce'
                }
            }
        },
        series: [
            {
                showInLegend: false,
                enableMouseTracking: false,
                color: 'rgba(255, 255, 255, 0.0)',
                data: Array(categories.length).fill(emptyDataValue)
            },
            ...(series || [])
        ],
        ...restProps
    };

    return (
        <div className="chart-overflow-holder stacked-column-chart">
            <BusyLoader isBusy={isLoading} className="stacked-column-chart-proxy-content">
                {!series?.length ? (
                    <Empty type="data" title={emptyText} className="stacked-column-chart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

StackedColumnChart.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    tooltip: PropTypes.object,
    dataName: PropTypes.string,
    withLegend: PropTypes.bool,
    categories: PropTypes.array,
    pointWidth: PropTypes.number,
    plotOptions: PropTypes.object,
    subtitle: PropTypes.string,
    opacity: PropTypes.number,
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            data: PropTypes.array
        })
    ),
    emptyDataValue: PropTypes.number,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

StackedColumnChart.defaultProps = {
    title: '',
    tooltip: {
        borderRadius: 5,
        headerFormat: '<div style="font-size:1.2rem">{point.key}</div>',
        pointFormat: '<div>{series.name}: <b>{point.y:.1f} </b></div>',
        useHTML: true
    },
    yAxisText: '<p class="axisText">Customers</p>',
    xAxisText: '<p class="axisText">Time</p>',
    opacity: 0.85,
    withLegend: true,
    pointWidth: 30,
    emptyDataValue: 5,
    colors: ['#71f0ff', '#bb8eff', '#34afef'],
    gridLineDashStyle: 'Dot',
    isLoading: false,
    emptyText: 'No data to display'
};

export default StackedColumnChart;
