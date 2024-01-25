import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { useDeviceType } from 'hooks';

// Components
import Icon from '../../../atoms/Icon';
import Empty from '../../../atoms/Empty';
import BusyLoader from '../../../atoms/BusyLoader';

// Local components
import ChartLegend from '../Legend';

// Styles
import './index.scss';

const getLocalData = (options = []) => {
    let result = [];

    try {
        result = options.map((item) => ({
            ...item,
            selected: false,
            visible: !!item.y
        }));
    } catch (err) {
        console.error(err);
    }

    return result;
};

function DonutChart({
    size,
    data,
    title,
    dataName,
    noActivityText,
    viewActivityText,
    yAxisTitle,
    innerSize,
    opacity,
    marginRight,
    className,
    subtitle,
    totalCount,
    positioner,
    showLegend,
    isVerticalLegend,
    screenType,
    selectedData,
    disablePieceClick,
    centerText,
    isTooltipVisible,
    notApplicableSymbol,
    decimalNumberPrecision,
    customNameFormatter,
    customLegendFormatter,
    customTooltipFormatter,
    isPercentUnitOfMeasure,
    isLoading,
    emptyText,
    ...restProps
}) {
    const { isMobile } = useDeviceType(screenType);
    const [isViewActive, setViewActive] = useState(false);
    const [selectedName, setSelectedName] = useState(null);
    const [calculatedHeight, setCalculatedHeight] = useState(0);
    const highChartRef = useRef();

    const [localData, setLocalData] = useState(getLocalData(data));

    useEffect(() => setLocalData(getLocalData(data)), [data]);

    const isTooltipEnabled = !isMobile && isTooltipVisible;
    const isAllItemsEmpty = useMemo(() => (data ? data.every(({ y }) => !y) : false), [data]);
    const filteredData = useMemo(() => localData.filter((item) => item.y), [localData]);
    const visibleItem = useMemo(() => localData.some((item) => item.visible), [localData]);
    const isItemSelected = useMemo(() => localData.some((item) => item.selected), [localData]);

    const handleLegendClick = useCallback(
        ({ name }) => {
            !isAllItemsEmpty &&
                setLocalData((data) =>
                    data.map((item) => ({
                        ...item,
                        visible: name === item.name ? !item.visible : item.visible
                    }))
                );
        },
        [isAllItemsEmpty]
    );

    const nameFormatter = useCallback(
        (item) => {
            if (customNameFormatter) {
                customNameFormatter(item);
            }
            return `${item.name} - ${item.y?.toFixed(decimalNumberPrecision) || ''}`;
        },
        [decimalNumberPrecision]
    );

    function tooltipFormatter() {
        if (customTooltipFormatter) {
            return customTooltipFormatter(this);
        }
        return `<div class='hs-tooltip'>
        ${this.key} : ${((this.y * 100) / this.total)?.toFixed(decimalNumberPrecision) || ''}%
         <br>
         Count: <b>${this.y}
      </div>`;
    }

    function handlePointClick() {
        !disablePieceClick &&
            setSelectedName((prevName) => {
                const nextFormattedName = nameFormatter(this);
                const nextName = prevName === nextFormattedName ? null : nextFormattedName;

                setLocalData((prevData) =>
                    prevData.map((item) => {
                        const name = nameFormatter(item);
                        return {
                            ...item,
                            selected: nextName === name,
                            sliced: nextName === name
                        };
                    })
                );
                return nextName;
            });
    }

    const sizesCalculator = useMemo(() => {
        let calculatedFontSize;
        let calculatedPadding;
        if (isPercentUnitOfMeasure) {
            calculatedFontSize = innerSize >= 50 ? 1.5 : 1.1;
            calculatedPadding = innerSize >= 50 ? 10 : 40;
        } else {
            calculatedFontSize = innerSize >= 150 ? 1.5 : 1.1;
            calculatedPadding = innerSize >= 150 ? 15 : 40;
        }

        return { calculatedFontSize, calculatedPadding };
    }, [isVerticalLegend, isPercentUnitOfMeasure, innerSize, centerText, highChartRef]);

    useEffect(() => {
        if (highChartRef?.current?.chart?.title?.element) {
            setCalculatedHeight(parseInt(getComputedStyle(highChartRef?.current?.chart?.title?.element)?.height) || 0);
        }
    });

    const { calculatedFontSize, calculatedPadding } = sizesCalculator;

    const options = {
        chart: {
            type: 'pie',
            marginRight
        },
        yAxis: {
            title: {
                text: yAxisTitle
            }
        },
        title: {
            text: centerText || `${totalCount || data?.length || 0}<br/>${dataName}<br/>`,
            align: 'center',
            verticalAlign: 'middle',
            useHTML: true,
            style: {
                'font-size': `${calculatedFontSize}rem`,
                'font-weight': '650',
                'line-height': '1.36',
                'max-height': isPercentUnitOfMeasure ? `${innerSize}%` : `${innerSize}px`,
                'min-height': isPercentUnitOfMeasure ? `${innerSize}%` : `${innerSize}px`,
                'max-width': isPercentUnitOfMeasure ? `${calculatedHeight}px` : `${innerSize}px`,
                'min-width': isPercentUnitOfMeasure ? `${calculatedHeight}px` : `${innerSize}px`,
                padding: `${calculatedPadding}px`,
                color: '#3c4043'
            }
        },
        series: [
            {
                data: filteredData,
                size: isPercentUnitOfMeasure ? `${size}%` : size,
                innerSize: isPercentUnitOfMeasure ? `${innerSize}%` : innerSize,
                showInLegend: false,
                borderWidth: 1
            }
        ],
        plotOptions: {
            pie: {
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
                    shadow: true,
                    events: {
                        click: handlePointClick
                    }
                }
            }
        },
        tooltip: {
            positioner,
            useHTML: true,
            enabled: isTooltipEnabled,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 0,
            borderRadius: 5,
            formatter: tooltipFormatter
        },
        ...restProps
    };

    useEffect(() => {
        highChartRef?.current?.chart?.setSize();
    }, [isVerticalLegend]);

    return (
        <div
            className={classnames('charts-donut-chart chart-overflow-holder', className, {
                mobile: isMobile,
                empty: isAllItemsEmpty || !visibleItem,
                'direction-row': isVerticalLegend
            })}
        >
            <div className="chart-wrapper">
                <BusyLoader isBusy={isLoading} className="donut-chart-proxy-content">
                    {!filteredData.length ? (
                        <Empty type="data" title={emptyText} className="donut-chart-proxy-content" />
                    ) : (
                        <>
                            <div className="chart-title">{selectedName || title}</div>
                            <div className="chart-subtitle">{visibleItem ? subtitle : noActivityText}</div>
                            <HighchartsReact options={options} highcharts={Highcharts} ref={highChartRef} />
                            {isMobile && visibleItem && isItemSelected && (
                                <div
                                    className={classnames('chart-activity-table', {
                                        active: isViewActive
                                    })}
                                >
                                    <div className="view-activity" onClick={() => setViewActive(!isViewActive)}>
                                        <Icon type="bc-icon-backwards" />
                                        {!isViewActive && <span>{viewActivityText}</span>}
                                    </div>
                                    <div className="chart-activity-data">
                                        <div
                                            className="chart-activity-title"
                                            onClick={() => setViewActive(!isViewActive)}
                                        >
                                            <Icon type="bc-icon-backwards" />
                                            <span>{selectedName}</span>
                                        </div>
                                        <div className="chart-activity-body">{selectedData}</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </BusyLoader>
            </div>
            {showLegend && !!filteredData.length && !isLoading && (
                <ChartLegend
                    options={localData}
                    isMobile={isMobile}
                    isVertical={isVerticalLegend}
                    onLegendClick={handleLegendClick}
                    notApplicableSymbol={notApplicableSymbol}
                    customLegendFormatter={customLegendFormatter}
                />
            )}
        </div>
    );
}

DonutChart.propTypes = {
    /**
     * Outer size
     * By default, will transform to px (which is not adaptive)
     * if isPercentUnitOfMeasure = true
     * size will transform to % (which is adaptive)
     */
    size: PropTypes.number,
    legend: PropTypes.object,
    /**
     * Inner size
     * By default, will transform to px (which is not adaptive)
     * if isPercentUnitOfMeasure = true
     * size will transform to % (which is adaptive)
     */
    innerSize: PropTypes.number,
    title: PropTypes.string,
    totalCount: PropTypes.number,
    decimalNumberPrecision: PropTypes.number,
    dataName: PropTypes.string,
    showLegend: PropTypes.bool,
    isVerticalLegend: PropTypes.bool,
    isTooltipVisible: PropTypes.bool,
    disablePieceClick: PropTypes.bool,
    noActivityText: PropTypes.string,
    viewActivityText: PropTypes.string,
    marginRight: PropTypes.number,
    tooltipContent: PropTypes.node,
    subtitle: PropTypes.string,
    screenType: PropTypes.string,
    className: PropTypes.string,
    opacity: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object),
    selectedData: PropTypes.arrayOf(PropTypes.object),
    centerText: PropTypes.string,
    positioner: PropTypes.func,
    notApplicableSymbol: PropTypes.string,
    customNameFormatter: PropTypes.func,
    customLegendFormatter: PropTypes.func,
    customTooltipFormatter: PropTypes.func,
    /**
     * Unit of measure
     * false-> px
     * true -> %
     * For adaptive behavior set value to true, pass size and innerSize as percent unit
     */
    isPercentUnitOfMeasure: PropTypes.bool,
    /**
     * The prop responsible for showing the loading spinner if passed true. The default value is false
     */
    isLoading: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

DonutChart.defaultProps = {
    data: [],
    selectedData: [],
    isTooltipVisible: true,
    showLegend: true,
    isVerticalLegend: false,
    opacity: 0.6,
    marginRight: 0,
    centerText: '',
    decimalNumberPrecision: 0,
    notApplicableSymbol: 'N/A',
    isPercentUnitOfMeasure: false,
    size: 300,
    innerSize: 200,
    isLoading: false,
    emptyText: 'No data to display'
};

export default DonutChart;
