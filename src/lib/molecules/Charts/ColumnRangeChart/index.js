import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import 'src/assets/styles/globalStyling.scss';
import './style.scss';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more.src';

import { Empty, BusyLoader } from '../../../atoms';

HighchartsMore(Highcharts);

function ColumnRangeChart({
    data,
    title,
    subTitle,
    categories,
    showLegend,
    showTooltip,
    showColumnLabel,
    showUnitOnTooltip,
    isLoading,
    emptyText,
    ...restProps
}) {
    const options = useMemo(
        () => ({
            chart: {
                type: 'columnrange',
                inverted: true,
                animation: false
            },
            tooltip: {
                borderRadius: 6,
                backgroundColor: 'rgba(0,0,0,.8)',
                borderWidth: 0,
                split: true,
                shadow: false,
                enabled: showTooltip,
                verticalAlign: 'right',
                shape: 'rect',
                snap: 0,
                useHTML: false,
                positioner: (width, height, point) => ({
                    x: point.plotX + (showUnitOnTooltip ? width / 2 : 64),
                    y: point.plotY
                }),
                formatter() {
                    const { series } = this;
                    const percent = showUnitOnTooltip ? `(${this.point.low} / ${this.point.high})` : '';
                    return `<div>
                        <span >${series.name}</span>
                        <span >${percent}</span>
                      </div>`;
                }
            },
            title: {
                text: title,
                style: {
                    fontWeight: 600
                }
            },
            subtitle: {
                text: subTitle,
                style: {
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'rgba(0,0,0,.8)'
                }
            },
            xAxis: {
                categories,
                gridLineColor: '#707073',
                labels: {
                    style: {
                        backgroundColor: 'rgba(0,0,0,.8)',
                        color: 'rgba(0,0,0,.8)',
                        fontWeight: 600,
                        fontSize: 14
                    }
                }
            },
            yAxis: {
                title: false,
                gridLineDashStyle: 'Dash',
                gridLineColor: '#e6e6e6',
                labels: {
                    style: {
                        color: 'rgba(0,0,0,.8)',
                        fontWeight: 600,
                        fontSize: 14
                    }
                }
            },
            legend: {
                enabled: !!showLegend,
                align: 'left',
                x: 50,
                animation: false
            },
            plotOptions: {
                animation: false,
                series: {
                    grouping: false,
                    maxPointWidth: 500,
                    dataLabels: {
                        enabled: showColumnLabel,
                        formatter() {
                            const value = Math.abs(this.point.low - this.point.high);
                            return ` <span class='columnRangeChart__formatter' >${value}</span>` || '';
                        },
                        align: 'center',
                        inside: true,
                        useHTML: true,
                        style: {
                            strokeWidth: 10,
                            color: 'rgba(0,0,0,.8)',
                            outline: 0
                        }
                    }
                }
            },
            series: [...(structuredClone(data) || [])],
            colors: [
                '#56C3D3',
                '#4F96EB',
                '#9E90ED',
                '#FF81C0',
                '#1aadce',
                '#d642ff',
                '#42f2ff',
                '#b387b9',
                '#ffacac',
                '#519682'
            ],
            ...restProps
        }),
        [data, title, subTitle, restProps, categories, showLegend, showTooltip, showColumnLabel, showUnitOnTooltip]
    );

    return (
        <div className="column-range-chart">
            <BusyLoader isBusy={isLoading} className="column-range-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="column-range-proxy-content" />
                ) : (
                    <HighchartsReact highcharts={Highcharts} options={options} />
                )}
            </BusyLoader>
        </div>
    );
}

ColumnRangeChart.propTypes = {
    /**
     * Title for component
     */
    title: PropTypes.string,
    /**
     * Subtitle for component
     */
    subTitle: PropTypes.string,
    /**
     * Enable or disable the tooltip.
     */
    showTooltip: PropTypes.bool,
    /**
     * Enable or disable the legend.
     */
    showLegend: PropTypes.bool,
    /**
     * Enable or disable the label on column.
     */
    showColumnLabel: PropTypes.bool,
    /**
     * Enable or disable the Point Unit on tooltip.
     */
    showUnitOnTooltip: PropTypes.bool,
    /**
     * Initial data for chart.
     */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            data: PropTypes.array
        })
    ),
    /**
     * Initial data for chart.
     */
    categories: PropTypes.array,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

ColumnRangeChart.defaultProps = {
    data: [],
    showTooltip: true,
    showLegend: false,
    showColumnLabel: true,
    showUnitOnTooltip: true,
    isLoading: false,
    emptyText: 'No data to display'
};

export default ColumnRangeChart;
