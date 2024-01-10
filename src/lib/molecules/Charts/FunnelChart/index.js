import React from 'react';
import PropTypes from 'prop-types';
import addFunnel from 'highcharts/modules/funnel';
import Highcharts from 'highcharts/highcharts-gantt';
import HighchartsReact from 'highcharts-react-official';

import { Empty, BusyLoader } from 'components';

import './index.scss';

addFunnel(Highcharts);

function FunnelChart({
    data,
    title,
    tooltip,
    subtitle,
    funnelSizes,
    opacity,
    plotOptions,
    isLoading,
    emptyText,
    ...restProps
}) {
    const options = {
        chart: {
            type: 'funnel',
            marginRight: 100
        },
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        plotOptions: {
            funnel: {
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
                ...funnelSizes
            },
            ...plotOptions
        },
        tooltip,
        series: [
            {
                data
            }
        ],
        ...restProps
    };

    return (
        <div className="chart-overflow-holder funnel-chart">
            <BusyLoader isBusy={isLoading} className="funnel-chart-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="funnel-chart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

FunnelChart.propTypes = {
    legend: PropTypes.object,
    tooltip: PropTypes.object,
    title: PropTypes.string,
    funnelSizes: PropTypes.object,
    subtitle: PropTypes.string,
    opacity: PropTypes.number,
    plotOptions: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

FunnelChart.defaultProps = {
    funnelSizes: {
        neckWidth: '20%',
        neckHeight: '0%',
        width: '60%',
        height: '100%'
    },
    tooltip: {
        useHTML: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderWidth: 0,
        formatter() {
            const { percentage, count } = this.point.options;

            return `<div class="hs-tooltip">
             ${this.key} : ${percentage}%
          <br>
              Count: <b>${count}</b>
        </div>`;
        }
    },
    legend: {
        y: 50,
        x: 0,
        align: 'right',
        floating: true,
        itemMarginTop: 20,
        layout: 'Vertical',
        verticalAlign: 'top',
        itemStyle: {
            color: '#3c4043',
            fontWeight: 600,
            fontSize: '1.4rem'
        },
        labelFormatter() {
            return `${this.name} (${this.options.percentage}%)`;
        }
    },
    opacity: 0.5,
    restPlotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    isLoading: false,
    emptyText: 'No data to display'
};

export default FunnelChart;
