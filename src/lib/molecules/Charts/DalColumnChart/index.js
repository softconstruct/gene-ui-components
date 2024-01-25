import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import DrillDown from 'highcharts/modules/drilldown';
import HighchartsReact from 'highcharts-react-official';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Styles
import './index.scss';

DrillDown(Highcharts);

function DalColumnChart(props) {
    const {
        min,
        max,
        title,
        columnData,
        lineData,
        sizes,
        color,
        dataName,
        categories,
        subtitle,
        drilldownTitleXAxis,
        drilldownTitleYAxis,
        gridLineDashStyle,
        resetButtonPosition,
        drillUpText,
        drillDown,
        crosshair,
        xAxisText,
        yAxisText,
        className,
        isLoading,
        emptyText,
        ...restProps
    } = props;

    // We need key to dynamically update chart.
    const [key, setKey] = useState(true);

    useEffect(() => {
        setKey((val) => !val);
    }, [props]);

    const options = {
        chart: {
            type: 'column',
            events: {
                drilldown() {
                    this.xAxis[0].setTitle({
                        text: drilldownTitleXAxis,
                        margin: 20
                    });
                    this.yAxis[0].setTitle({
                        text: drilldownTitleYAxis,
                        margin: 20
                    });
                },
                drillup() {
                    this.xAxis[0].setTitle({
                        text: xAxisText,
                        margin: 20
                    });
                    this.yAxis[0].setTitle({
                        text: yAxisText,
                        margin: 20
                    });
                }
            },
            ...sizes
        },
        lang: {
            drillUpText
        },
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        xAxis: {
            type: 'category',
            title: {
                text: xAxisText,
                margin: 20
            },
            crosshair,
            tickWidth: 1,
            labels: {
                rotation: 0,
                style: {
                    fontSize: '1.4rem',
                    color: '#3c4043',
                    fontWeight: '600'
                }
            },
            gridLineDashStyle
        },
        legend: {
            enabled: false
        },
        yAxis: {
            title: {
                text: yAxisText,
                margin: 20
            },
            crosshair,
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
        drilldown: {
            activeAxisLabelStyle: {
                fontSize: '1.4rem',
                color: '#3c4043',
                fontWeight: '600',
                textDecoration: 'none'
            },
            drillUpButton: {
                position: resetButtonPosition
            },
            ...drillDown
        },
        series: [
            {
                data: columnData,
                color,
                name: dataName,
                pointWidth: 30,
                tooltip: {
                    borderRadius: 5,
                    headerFormat: '<div class="hs-tooltip">{point.key} <br> {point.y:.1f}</div>',
                    pointFormat: null
                }
            },
            {
                name: dataName,
                type: 'spline',
                color: '#d987de',
                data: lineData,
                marker: {
                    lineWidth: 1,
                    symbol: 'circle'
                },
                tooltip: {
                    headerFormat: null,
                    borderRadius: 5,
                    pointFormatter() {
                        return `<div class="hs-tooltip">${categories[this.x]} <br> ${this.y}</div>`;
                    }
                }
            }
        ],
        ...restProps
    };

    return (
        <div key={key ? 'key1' : 'key2'} className={`chart-overflow-holder ${className} dal-chart`}>
            <BusyLoader isBusy={isLoading} className="dal-chart-proxy-content">
                {!lineData?.length ? (
                    <Empty type="data" title={emptyText} className="dal-chart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

DalColumnChart.propTypes = {
    columndData: PropTypes.arrayOf(
        PropTypes.shape({
            y: PropTypes.number,
            name: PropTypes.string,
            drilldown: PropTypes.string
        })
    ),
    gridLineDashStyle: PropTypes.string,
    lineData: PropTypes.array,
    color: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.object,
    dataName: PropTypes.string,
    categories: PropTypes.array,
    plotOptions: PropTypes.object,
    subtitle: PropTypes.string,
    drillUpText: PropTypes.string,
    crosshair: PropTypes.shape({
        width: PropTypes.number,
        color: PropTypes.string,
        dashStyle: PropTypes.string
    }),
    resetButtonPosition: PropTypes.object,
    className: PropTypes.string,
    restProps: PropTypes.object,
    min: PropTypes.number,
    max: PropTypes.number,
    sizes: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    yAxisText: PropTypes.node,
    xAxisText: PropTypes.node,
    drilldownTitleXAxis: PropTypes.node,
    drilldownTitleYAxis: PropTypes.node,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

DalColumnChart.defaultProps = {
    color: '#26e1f5',
    drillUpText: 'Back to Days',
    sizes: {
        height: 500
    },
    className: '',
    resetButtonPosition: {
        y: -47
    },
    gridLineDashStyle: 'Dot',
    crosshair: {
        width: 1,
        color: 'gray',
        dashStyle: 'shortdot'
    },
    yAxisText: '<p class="axisText">Customers</p>',
    xAxisText: '<p class="axisText">Time</p>',
    drilldownTitleXAxis: '<p class="axisText">Time (Hours)</p>',
    drilldownTitleYAxis: '<p class="axisText">Customers</p>',
    isLoading: false,
    emptyText: 'No data to display'
};

export default DalColumnChart;
