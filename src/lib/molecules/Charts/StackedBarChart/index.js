import React, { useState, useEffect, useMemo } from 'react';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

import { Empty, BusyLoader } from 'components';

import './index.scss';

function StackedBarChart({
    data,
    title,
    subTitle,
    categories,
    showLegend,
    background,
    showTooltip,
    showColumnLabel,
    showByPercentage,
    showUnitOnTooltip,
    isLoading,
    emptyText,
    ...restProps
}) {
    const [localData, setLocalData] = useState([]);
    const [maxNumFromData, setMaxNumFromData] = useState(null);
    const [minNumFromData, setMinNumFromData] = useState(null);

    const options = useMemo(
        () => ({
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
                positioner: (width, height, point) => {
                    if (point.negative) {
                        return {
                            x: point.plotX + point.h / 2 + 30,
                            y: point.plotY
                        };
                    }
                    return {
                        x: point.plotX - point.h / 2 + 30,
                        y: point.plotY
                    };
                },
                formatter() {
                    const { series, percentage, y } = this;
                    const percent = showUnitOnTooltip
                        ? `(${Math.round(showByPercentage ? percentage : y)}${showByPercentage ? '%' : ''})`
                        : '';
                    return `<div>
                        <span >${series.name}</span>
                        <span >${percent}</span>
                      </div>`;
                }
            },
            chart: {
                animation: false,
                type: 'bar',
                height: showLegend ? 500 : 460
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
                max: showByPercentage ? 100 : maxNumFromData,
                min: showByPercentage ? -100 : minNumFromData,

                labels: {
                    format: showByPercentage ? '{value:.0f}%' : '',
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
                    colorAxis: 'rgba(0,0,0,.8)',
                    dataLabels: {
                        enabled: showColumnLabel,
                        formatter() {
                            const { series } = this;
                            return `<div >
                                <span style="color:rgba(0,0,0,.8);font-weight: 700;font-size: 10px ">${
                                    series.name.length * 6.7 < this.point.shapeArgs.height ? series.name : ''
                                }</span>
                             </div>`;
                        },
                        useHTML: true,

                        style: {
                            strokeWidth: 0,
                            color: 'rgba(0,0,0,.8)',
                            outline: 0
                        }
                    }
                },
                bar: {
                    stacking: showByPercentage ? 'percent' : 'normal',
                    animation: false
                }
            },
            series: JSON.parse(JSON.stringify(localData)),
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
        [
            title,
            subTitle,
            restProps,
            categories,
            showLegend,
            showTooltip,
            showColumnLabel,
            showByPercentage,
            showUnitOnTooltip,
            localData,
            maxNumFromData,
            minNumFromData
        ]
    );

    const setDataHandler = () => {
        let negativeData;
        let dataLength = 0;

        data?.forEach((item) => {
            dataLength < item?.data?.length && (dataLength = item?.data?.length);
            if (item?.data?.find((elem) => elem < 0)) {
                negativeData = true;
            }
        });

        const objectForPercentage = (value, groupingOption) => ({
            name: '',
            data: new Array(dataLength).fill(value === '+' ? 100 : -100),
            showInLegend: false,
            enableMouseTracking: false,
            zIndex: -1,
            color: background ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.0)',
            ...(!groupingOption && { grouping: false, stacking: false })
        });

        const objectForNonPercentage = (negative) => {
            const tempArr = [];
            const tempArrNegative = [];
            data?.forEach(({ data: array }) => {
                array.forEach((num, index) => {
                    if (num >= 0) {
                        tempArr[index] ? (tempArr[index] += num) : (tempArr[index] = num);
                    } else {
                        tempArrNegative[index] ? (tempArrNegative[index] += num) : (tempArrNegative[index] = num);
                    }
                });
            });

            const max = Math.max(...tempArr.filter((n) => n));
            const min = Math.min(...tempArrNegative.filter((n) => n));

            const maxNum = Math.floor(max + (max / 100) * 10);
            const minNum = Math.floor(min + (min / 100) * 10);

            !maxNumFromData && setMaxNumFromData(Number.isFinite(max) ? max : null);
            !minNumFromData && setMinNumFromData(Number.isFinite(min) ? min : null);
            return {
                name: '',
                data: new Array(dataLength)?.fill(negative ? minNum : maxNum),
                grouping: false,
                stacking: false,
                showInLegend: false,
                enableMouseTracking: false,
                zIndex: -1,
                color: background ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.0)'
            };
        };

        if (showByPercentage && negativeData) {
            setLocalData([objectForPercentage('+'), ...(data || []), objectForPercentage()]);
        } else if (showByPercentage && !negativeData) {
            setLocalData([objectForPercentage('+', true), ...(data || [])]);
        } else if (!showByPercentage && !negativeData) {
            setLocalData([objectForNonPercentage(), ...(data || [])]);
        } else if (!showByPercentage && negativeData) {
            setLocalData([objectForNonPercentage(), ...(data || []), objectForNonPercentage(true)]);
        }
    };

    useEffect(setDataHandler, [data, background, showByPercentage, maxNumFromData, minNumFromData]);

    return (
        <div className="stacked-chart">
            <BusyLoader isBusy={isLoading} className="stacked-chart-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="stacked-chart-proxy-content" />
                ) : (
                    <HighchartsReact highcharts={Highcharts} options={options} />
                )}
            </BusyLoader>
        </div>
    );
}

StackedBarChart.propTypes = {
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
     * unit of count , true will show bar stacking by percent false by numbers
     */
    showByPercentage: PropTypes.bool,
    /**
     * Enable or disable the label on column.
     */
    showColumnLabel: PropTypes.bool,
    /**
     * Enable or disable the Point Unit on tooltip.
     */
    showUnitOnTooltip: PropTypes.bool,
    /**
     * Enable or disable the rows background colors.
     */
    background: PropTypes.bool,
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

StackedBarChart.defaultProps = {
    data: [],
    background: true,
    showTooltip: true,
    showLegend: false,
    showColumnLabel: true,
    showByPercentage: false,
    showUnitOnTooltip: true,
    isLoading: false,
    emptyText: 'No data to display'
};

export default StackedBarChart;
