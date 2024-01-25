import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

// Helpers
import { useDeviceType } from 'hooks';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Styles
import './index.scss';

const pointMountEvents = {
    mouseOver() {
        this.update({ opacity: 1 });
    },
    mouseOut() {
        this.update({ opacity: 1 });
    }
};

function ColumnChart({
    min,
    max,
    data,
    color,
    title,
    width,
    height,
    subtitle,
    dataName,
    prefix,
    screenType,
    categories,
    withEmptyBG,
    gridLineDashStyle,
    decimalNumberPrecision,
    isLoading,
    emptyText,
    ...restProps
}) {
    const { isMobile } = useDeviceType(screenType);

    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedAmount, setSelectedAmount] = useState();

    const pointWidth = isMobile ? 20 : 30;

    const options = {
        chart: {
            width,
            height,
            type: 'column'
        },
        title: {
            text: isMobile
                ? selectedCategory &&
                  `<div style="font-size: 1.5rem"><span style="color: #1473e6">${selectedCategory}</span> - ${dataName} : ${prefix}${selectedAmount}</div>`
                : title,
            align: isMobile ? 'left' : 'center',
            useHTML: true,
            style: {
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        subtitle: {
            text: isMobile ? null : subtitle,
            useHTML: true,
            style: {
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        xAxis: {
            categories,
            tickWidth: 1,
            tickColor: '#e6e6e6',
            lineColor: '#e6e6e6',
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
            gridLineDashStyle
        },
        legend: {
            enabled: false
        },
        yAxis: {
            title: {
                text: ''
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
        tooltip: {
            borderRadius: 5,
            formatter() {
                const { y, key } = this;

                return `<div>
            <div style="font-size:1.2rem">${key}</div>
            <div>${dataName}: <b>${prefix}${y.toFixed(decimalNumberPrecision)}</b></div>
          </div>`;
            },
            useHTML: true
        },
        series: [
            {
                pointWidth,
                data,
                color: withEmptyBG ? '#fafafa' : 'transparent',
                width: 2,
                animation: false,
                pointPlacement: 0.2,
                point: {
                    events: pointMountEvents
                }
            },
            {
                data,
                color,
                pointWidth,
                name: dataName,
                width: 2,
                pointPlacement: -0.1,
                point: {
                    events: {
                        click() {
                            const {
                                category,
                                options: { y }
                            } = this;

                            setSelectedCategory(category);
                            setSelectedAmount(y.toFixed(decimalNumberPrecision));
                        },
                        ...pointMountEvents
                    }
                }
            }
        ],
        ...restProps
    };

    return (
        <div className="chart-overflow-holder column-chart">
            <BusyLoader isBusy={isLoading} className="column-chart-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="column-chart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

ColumnChart.propTypes = {
    data: PropTypes.array,
    color: PropTypes.string,
    title: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    prefix: PropTypes.string,
    tooltip: PropTypes.object,
    dataName: PropTypes.string,
    subtitle: PropTypes.string,
    withEmptyBG: PropTypes.bool,
    categories: PropTypes.array,
    plotOptions: PropTypes.object,
    decimalNumberPrecision: PropTypes.number,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

ColumnChart.defaultProps = {
    title: '',
    prefix: '',
    color: '#ffef5e',
    dataName: 'Rake',
    withEmptyBG: false,
    gridLineDashStyle: 'Dot',
    decimalNumberPrecision: 0,
    isLoading: false,
    emptyText: 'No data to display'
};

export default ColumnChart;
