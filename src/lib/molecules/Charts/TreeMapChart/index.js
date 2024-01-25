import React from 'react';
import Highcharts from 'highcharts';
import HS_map from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Styles
import './index.scss';

HS_map(Highcharts);

function TreeMapChart({
    min,
    max,
    title,
    data,
    total,
    layoutAlgorithm,
    subtitle,
    className,
    decimalNumberPrecision,
    isLoading,
    emptyText,
    ...restProps
}) {
    const options = {
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        series: [
            {
                type: 'treemap',
                data,
                allowDrillToNode: true,
                borderWidth: 2,
                animationLimit: 1000,
                layoutAlgorithm,
                alternateStartingDirection: true,
                levels: [
                    {
                        level: 1,
                        dataLabels: {
                            formatter() {
                                const { value, name } = this.point.options;

                                return `${name}: ${value} (${(value / total).toFixed(decimalNumberPrecision) * 100}%)`;
                            },
                            enabled: true,
                            align: 'left',
                            verticalAlign: 'top',
                            style: {
                                shadow: false,
                                color: '#FFF',
                                fontSize: '1.4rem',
                                textOutline: 'none',
                                textOverflow: 'ellipsis',
                                fontWeight: 600
                            }
                        }
                    }
                ]
            }
        ],
        drilldown: {
            activeAxisLabelStyle: {
                fontSize: '1.4rem',
                color: '#3c4043',
                fontWeight: '600',
                textDecoration: 'none'
            },
            drillUpButton: {
                position: {
                    y: -47
                }
            }
        },
        tooltip: {
            borderRadius: 5,
            headerFormat: null,
            formatter() {
                const { value, infoText } = this.point.options;
                return `<div class="hs-tooltip tree-map-tp">
                    <p>${this.key}:<br/>${value} (${(value / total).toFixed(decimalNumberPrecision) * 100}%) </p>
                    <small> ${infoText} </small>
               </div>`;
            },
            useHTML: true
        },
        plotOptions: {
            series: {
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        ...restProps
    };

    return (
        <div className={classnames('chart-overflow-holder', 'whiteDrillDown', className, 'tree-map-chart')}>
            <BusyLoader isBusy={isLoading} className="tree-map-chart-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="tree-map-chart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

TreeMapChart.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    tooltip: PropTypes.object,
    dataName: PropTypes.string,
    withLegend: PropTypes.bool,
    categories: PropTypes.array,
    pointWidth: PropTypes.number,
    plotOptions: PropTypes.object,
    subtitle: PropTypes.string,
    decimalNumberPrecision: PropTypes.number,
    layoutAlgorithm: PropTypes.oneOf(['strip', 'stripes', 'squarified', 'sliceAndDice']),
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            data: PropTypes.array
        })
    ),
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

TreeMapChart.defaultProps = {
    title: '',
    layoutAlgorithm: 'squarified',
    decimalNumberPrecision: 0,
    isLoading: false,
    emptyText: 'No data to display'
};

export default TreeMapChart;
