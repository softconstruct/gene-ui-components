import React, { useCallback, useState, useMemo, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { useDeviceType } from 'hooks';

// Components
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Local components
import ChartLegend from '../Legend';

// Styles
import './index.scss';

function PieChart({
    size,
    data,
    title,
    noActivityText,
    yAxisTitle,
    marginRight,
    seriesProps,
    subtitle,
    opacity,
    positioner,
    className,
    positionerCord,
    isTooltipVisible,
    fixedTooltipContent,
    screenType,
    showLegend,
    legendIsVertical,
    isLegendsHorizontal,
    customLegendFormatter,
    customTooltipFormatter,
    decimalNumberPrecision,
    isLoading,
    emptyText,
    ...restProps
}) {
    const { isMobile } = useDeviceType(screenType);

    const getLocalData = useCallback((options) =>
        options?.map((item) => ({
            ...item,
            visible: true,
            selected: false
        }))
    );

    const [localData, setLocalData] = useState(getLocalData(data));
    const [selectedName, setSelectedName] = useState(null);

    useEffect(() => setLocalData(getLocalData(data)), [data]);

    const formatter = useMemo(() => {
        if (customTooltipFormatter) {
            return function () {
                return customTooltipFormatter(this);
            };
        }
        return function () {
            return `<div class='hs-tooltip'>
                             ${this.key} : ${((this.y * 100) / this.total).toFixed(decimalNumberPrecision)}%
                             <br>
                             ${fixedTooltipContent || `Count: <b>${this.y}`} 
                         </div>`;
        };
    });

    const tooltipParams = useMemo(() => ({
        useHTML: true,
        enabled: !isMobile,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        positioner: fixedTooltipContent && (() => positionerCord)
    }));

    const tooltip = { ...tooltipParams, formatter };

    const handleLegendClick = useCallback(({ name }) => {
        setLocalData((data) =>
            data?.map((item) => ({
                ...item,
                visible: name === item.name ? !item.visible : item.visible
            }))
        );
    }, []);

    const visibleItem = useMemo(() => localData?.some((item) => item.visible), [localData]);

    const options = {
        chart: {
            type: 'pie',
            marginRight,
            backgroundColor: 'transparent'
        },
        yAxis: {
            title: {
                text: yAxisTitle
            }
        },
        title: {
            text: visibleItem ? selectedName || title : title,
            useHTML: true,
            style: {
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        subtitle: {
            text: visibleItem ? subtitle : noActivityText,
            useHTML: true,
            style: {
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        series: [
            {
                showInLegend: false,
                data: localData,
                size: isMobile ? 280 : size,
                borderWidth: 1,
                ...seriesProps
            }
        ],
        plotOptions: {
            pie: {
                size,
                states: {
                    inactive: {
                        opacity: 1
                    }
                }
            },
            series: {
                label: {
                    connectorAllowed: false
                },
                animation: {
                    duration: 100
                },
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
                cursor: visibleItem ? 'pointer' : 'default',
                point: {
                    events: {
                        click() {
                            const { name, y } = this;

                            setSelectedName((prevName) => {
                                const nextName =
                                    prevName === `${name} - ${y.toFixed(decimalNumberPrecision)}`
                                        ? null
                                        : `${name} - ${y.toFixed(decimalNumberPrecision)}`;
                                setLocalData((prevData) =>
                                    prevData?.map((item) => ({
                                        ...item,
                                        selected: nextName === `${item.name} - ${y.toFixed(decimalNumberPrecision)}`,
                                        sliced: nextName === `${item.name} - ${y.toFixed(decimalNumberPrecision)}`
                                    }))
                                );
                                return nextName;
                            });
                        }
                    }
                }
            }
        },
        tooltip,
        ...restProps
    };

    return (
        <div
            className={classnames('charts-pie-chart chart-overflow-holder', className, {
                'vertical-legend': legendIsVertical
            })}
        >
            <BusyLoader isBusy={isLoading} className="pie-chart-proxy-content">
                {!localData?.length ? (
                    <Empty type="data" title={emptyText} className="pie-chart-proxy-content" />
                ) : (
                    <>
                        <HighchartsReact options={options} highcharts={Highcharts} />
                        {!visibleItem && false && (
                            <div className="chart-inActive" style={{ top: '4rem', left: '50.5%' }}>
                                <div className="chart-inActive_footer">{noActivityText}</div>
                                <div className="chart-inActive_body" />
                            </div>
                        )}
                        {showLegend && (
                            <ChartLegend
                                options={localData}
                                isMobile={isMobile}
                                isVertical={legendIsVertical}
                                onLegendClick={handleLegendClick}
                                customLegendFormatter={customLegendFormatter}
                            />
                        )}
                    </>
                )}
            </BusyLoader>
        </div>
    );
}

PieChart.propTypes = {
    size: PropTypes.number,
    title: PropTypes.string,
    noActivityText: PropTypes.string,
    className: PropTypes.string,
    screenType: PropTypes.string,
    marginRight: PropTypes.number,
    opacity: PropTypes.number,
    subtitle: PropTypes.string,
    tooltipContent: PropTypes.node,
    positionerCord: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),
    seriesProps: PropTypes.object,
    legendIsVertical: PropTypes.bool,
    fixedTooltipContent: PropTypes.node,
    data: PropTypes.arrayOf(PropTypes.object),
    decimalNumberPrecision: PropTypes.number,
    /**
    The function should return a JSX. As an argument it will receive object with following shape
    {
        color: string
        name: string
        selected: boolean
        visible: boolean
        y: number
    }
    */
    customLegendFormatter: PropTypes.func,
    /**
    The function should return a JSX. As an argument it will receive object with following shape
    {
        color: string
        colorIndex: number
        key: string
        percentage: number
        total: number
        y: number
    }
    */
    customTooltipFormatter: PropTypes.func,
    showLegend: PropTypes.bool,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

PieChart.defaultProps = {
    positionerCord: {
        x: 350,
        y: 100
    },
    isTooltipVisible: true,
    seriesProps: {},
    data: [],
    size: 300,
    marginRight: 0,
    opacity: 0.6,
    showLegend: true,
    isLegendsHorizontal: false,
    decimalNumberPrecision: 0,
    fixedTooltipContent: '<div style="margin-top: 5rem"> Table of content </div>',
    isLoading: false,
    emptyText: 'No data to display'
};

export default PieChart;
