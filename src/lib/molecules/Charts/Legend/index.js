import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Slide, ButtonBack, ButtonNext, CarouselProvider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import classnames from 'classnames';

import { noop } from 'utils';

import Icon from '../../../atoms/Icon';

import './styles.scss';

function ChartLegend({ options, isMobile, isVertical, onLegendClick, notApplicableSymbol, customLegendFormatter }) {
    const renderItem = (item, index) => (
        <div
            key={index}
            className={classnames('legend-item', {
                disabled: !item.y,
                inactive: !item.visible
            })}
            onClick={() => item.y && onLegendClick(item)}
        >
            <div
                className="item-symbol"
                style={{
                    backgroundColor: item.color,
                    borderColor: item.color
                }}
            />
            <span className="item-name">
                {customLegendFormatter
                    ? customLegendFormatter(item)
                    : `${item.name} - ${item.y || notApplicableSymbol}`}
            </span>
        </div>
    );

    return (
        <div
            className={classnames('chart-custom-legend', {
                mobile: isMobile,
                vertical: isVertical,
                horizontal: !isVertical
            })}
        >
            {!!options?.length && (
                <>
                    {isVertical ? (
                        options.map(renderItem)
                    ) : (
                        <CarouselProvider totalSlides={options.length / 3} isIntrinsicHeight dragEnabled={isMobile}>
                            <Slider>
                                {options.map((item, index) => (
                                    <Slide key={item.name} index={index}>
                                        {renderItem(item, index)}
                                    </Slide>
                                ))}
                            </Slider>
                            <ButtonBack>
                                <Icon type="bc-icon-arrow-left" />
                            </ButtonBack>
                            <ButtonNext>
                                <Icon type="bc-icon-arrow-right" />
                            </ButtonNext>
                        </CarouselProvider>
                    )}
                </>
            )}
        </div>
    );
}

ChartLegend.propTypes = {
    isMobile: PropTypes.bool,
    isVertical: PropTypes.bool,
    onLegendClick: PropTypes.func,
    notApplicableSymbol: PropTypes.string,
    customLegendFormatter: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object)
};

ChartLegend.defaultProps = {
    isMobile: false,
    isVertical: false,
    notApplicableSymbol: 'N/A',
    onLegendClick: noop,
    options: []
};

export default ChartLegend;
