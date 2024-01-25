import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HS_map from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Styles
import './index.scss';

HS_map(Highcharts);

const legendAppearances = {
    vertical: 'vertical',
    horizontal: 'horizontal',
    proximate: 'proximate'
};

const getPointCategoryName = (point, dimension) => {
    const { series } = point;
    const isY = dimension === 'y';
    const axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
};

function HeatMapChart({
    title,
    data,
    axisData,
    enabledLegend,
    legendLayout,
    tooltipFormatter,
    yAxisTitle,
    yAxisNeedReverse,
    xAxisCategories,
    yAxisCategories,
    legendHeight,
    chartHeight,
    subTitle,
    isLoading,
    emptyText,
    ...restProps
}) {
    const verticalLegendProps = useMemo(
        () => ({
            margin: 0,
            y: 25,
            symbolHeight: legendHeight,
            align: 'right'
        }),
        [legendHeight]
    );

    const options = useMemo(
        () => ({
            chart: {
                type: 'heatmap',
                marginBottom: 80,
                marginRight: legendLayout === legendAppearances.proximate ? 260 : 80,
                plotBorderWidth: 1,
                height: chartHeight,
                spacingBottom: legendLayout === legendAppearances.vertical ? 90 : 0
            },
            title: {
                text: title
            },
            subtitle: {
                text: subTitle
            },
            xAxis: {
                categories: xAxisCategories
            },
            yAxis: {
                categories: yAxisCategories,
                title: yAxisTitle,
                reversed: yAxisNeedReverse
            },
            colors: ['#FFFFFF'],
            accessibility: {
                point: {
                    descriptionFormatter(point) {
                        const ix = point.index + 1;
                        const xName = getPointCategoryName(point, 'x');
                        const yName = getPointCategoryName(point, 'y');
                        const val = point.value;
                        return `${ix}. ${xName} sales ${yName}, ${val}.`;
                    }
                }
            },
            colorAxis: {
                min: 0,
                maxColor: '#1473e6',
                endOnTick: false,
                startOnTick: false
            },
            animation: false,
            legend:
                legendLayout === legendAppearances.horizontal
                    ? {
                          layout: legendLayout,
                          enabled: enabledLegend,
                          align: 'right',
                          verticalAlign: 'bottom',
                          navigation: {
                              animation: false
                          }
                      }
                    : {
                          layout: legendLayout,
                          enabled: enabledLegend,
                          navigation: {
                              animation: false
                          },
                          verticalAlign: 'bottom',
                          ...verticalLegendProps
                      },
            tooltip: {
                useHTML: true,
                formatter() {
                    const { value } = this.point.options;
                    return tooltipFormatter(
                        value,
                        getPointCategoryName(this.point, 'x'),
                        getPointCategoryName(this.point, 'y')
                    );
                }
            },
            series: [
                {
                    borderWidth: 1,
                    data
                }
            ],
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            yAxis: {
                                labels: {
                                    formatter() {
                                        return this.value.charAt(0);
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            ...restProps
        }),
        [
            title,
            data,
            subTitle,
            enabledLegend,
            legendLayout,
            tooltipFormatter,
            yAxisTitle,
            yAxisNeedReverse,
            xAxisCategories,
            yAxisCategories,
            chartHeight
        ]
    );

    return (
        <div className="chart-overflow-holder whiteDrillDown high-chart">
            <BusyLoader isBusy={isLoading} className="highchart-proxy-content">
                {!data?.length ? (
                    <Empty type="data" title={emptyText} className="highchart-proxy-content" />
                ) : (
                    <HighchartsReact options={options} highcharts={Highcharts} />
                )}
            </BusyLoader>
        </div>
    );
}

HeatMapChart.propTypes = {
    /**
     * Enable or disable the legend.
     */
    enabledLegend: PropTypes.bool,
    /**
     * Dataset for chart.
     */
    data: PropTypes.array,
    /**
     * Use this prop to specify tooltip message.
     */
    tooltipFormatter: PropTypes.func,
    /**
     * Use this prop to specify legend appearance.
     */
    legendLayout: PropTypes.oneOf(Object.keys(legendAppearances)),
    /**
     * Data for xAxis.
     */
    xAxisCategories: PropTypes.array,
    /**
     * Data for yAxis.
     */
    yAxisCategories: PropTypes.array,
    /**
     * Title for yAxis.
     */
    yAxisTitle: PropTypes.string,
    /**
     * Use this prop if you need to reverse yAxis data.
     */
    yAxisNeedReverse: PropTypes.bool,
    /**
     * Use this prop to specify legend height.
     */
    legendHeight: PropTypes.number,
    /**
     * Use this prop to specify chart height.
     */
    chartHeight: PropTypes.number,
    /**
     * Title for component
     */
    title: PropTypes.string,
    /**
     * Subtitle for component
     */
    subTitle: PropTypes.string,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

HeatMapChart.defaultProps = {
    enabledLegend: false,
    yAxisNeedReverse: false,
    subTitle: '',
    yAxisTitle: '',
    legendHeight: 280,
    chartHeight: '40%',
    xAxisCategories: [],
    yAxisCategories: [],
    data: [],
    legendLayout: legendAppearances.vertical,
    isLoading: false,
    emptyText: 'No data to display'
};

HeatMapChart.displayName = 'HeatMapChart';

export default HeatMapChart;
