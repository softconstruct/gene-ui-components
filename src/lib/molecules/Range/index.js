import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Range, createSliderWithTooltip } from 'rc-slider';

import { useWidth, useToggle } from 'hooks';

import 'src/assets/styles/globalStyling.scss';
import 'src/assets/styles/rangeAndSlider.scss';

function formatter(value, tooltipType) {
    switch (tooltipType) {
        case 'percentage':
            return `${value}%`;
        case 'currency':
            return `$${value}`;
        case 'pixel':
            return `${value}px`;
        default:
            return value;
    }
}

const rangeCircleTypes = ['c-type-1', 'c-type-2', 'c-type-3'];

const RangeWithTooltip = createSliderWithTooltip(Range);

const isMiddle = (value, max) => value > max / 3;
const isMax = (value, max) => value >= (max * 2) / 3;

function RangeMolecule(props) {
    const {
        max,
        min,
        step,
        value,
        coloring,
        disabled,
        onChange,
        circleTypes,
        withTooltip,
        defaultValue,
        tooltipType,
        isSmallHandler,
        showCircleOnDrag,
        className,
        circleSizeBasedOnRange,
        ...restProps
    } = props;

    const isControlled = 'value' in props;
    const [sliderValue, setSliderValue] = useState(defaultValue);
    const [tooltipVisibility, toggleTooltipVisibility] = useToggle(false);

    const localValue = isControlled ? value : sliderValue;
    const isGradient = coloring === 'gradient-value';
    const leftPercent = (localValue[0] * 100) / (max - min);

    const divRef = useRef();
    const sliderWidth = useWidth(divRef);

    const RangeElement = withTooltip ? RangeWithTooltip : Range;

    const setCircleStyles = useCallback(
        (i) => {
            const isMaxValue = isMax(localValue[i], max);
            const isMiddleValue = isMiddle(localValue[i], max);

            return classnames(circleTypes[i], {
                'max-coloring': isGradient && isMaxValue,
                'max-size': circleSizeBasedOnRange && isMaxValue,
                'min-coloring': !isMiddleValue && !isMaxValue && isGradient,
                'middle-coloring': isGradient && isMiddleValue && !isMaxValue,
                'middle-size': circleSizeBasedOnRange && !isMaxValue && isMiddleValue
            });
        },
        [localValue, max, circleTypes, isGradient, circleSizeBasedOnRange]
    );

    const handleSliderChange = useCallback(
        (val) => {
            if (val[1] <= max && val[0] >= min) {
                !isControlled && setSliderValue(val);
                onChange && onChange(val);
            }
        },
        [max, min, isControlled, onChange]
    );

    const tipFormatter = useCallback((value) => formatter(value, tooltipType), [tooltipType]);

    return (
        <div
            className={classnames('slider-holder ', className, coloring, {
                disabled,
                'show-on-drag': showCircleOnDrag
            })}
            onMouseEnter={toggleTooltipVisibility}
            onMouseLeave={toggleTooltipVisibility}
        >
            <div
                className={classnames('slider-comp', {
                    'size-small': isSmallHandler
                })}
                style={{
                    '--left': `-${leftPercent}%`,
                    '--sliderWidth': `${sliderWidth}px`
                }}
            >
                <div ref={divRef}>
                    <RangeElement
                        max={max}
                        min={min}
                        step={step}
                        value={localValue}
                        tipProps={{
                            prefixCls: 'tooltip-el',
                            visible: tooltipVisibility && localValue[1] - localValue[0] > max / 20
                        }}
                        allowCross={false}
                        tipFormatter={tipFormatter}
                        onChange={handleSliderChange}
                        handleStyle={[
                            {
                                content: `'${setCircleStyles(0)}'`
                            },
                            {
                                content: `'${setCircleStyles(1)}'`
                            }
                        ]}
                        {...restProps}
                    />
                </div>
            </div>
        </div>
    );
}

RangeMolecule.propTypes = {
    /**
     * Controlled value.
     */
    value: PropTypes.array,
    /**
     * Disabled state.
     */
    disabled: PropTypes.bool,
    /**
     * External/Additional className that can be added to 'Range' component.
     */
    className: PropTypes.string,
    /**
     * Fires an event on ExtendedInput change((event: Event) => void).
     */
    onChange: PropTypes.func,
    /**
     * Show/Hide tooltips on 'Range'.
     */
    withTooltip: PropTypes.bool,
    /**
     * Switch on/off small size.
     */
    isSmallHandler: PropTypes.bool,
    /**
     * Initial value.
     */
    defaultValue: PropTypes.array,
    /**
     * Show/hide circles.
     */
    showCircleOnDrag: PropTypes.bool,
    /**
     * Max value.
     */
    max: PropTypes.number.isRequired,
    /**
     * Min value.
     */
    min: PropTypes.number.isRequired,
    /**
     * Skip steps count.
     */
    step: PropTypes.number.isRequired,
    circleSizeBasedOnRange: PropTypes.bool,
    /**
     * Various circle type.
     */
    circleTypes: (props, propName, componentName) => {
        const prop = props[propName];

        const isCircleTypes =
            Array.isArray(prop) && prop.length === 2 && prop.every((item) => rangeCircleTypes.includes(item));

        if (!isCircleTypes) {
            return new Error(`Invalid prop ${propName} supplied to ${componentName}`);
        }
    },
    /**
     * Various tooltip types.
     */
    tooltipType: PropTypes.oneOf(['default', 'percentage', 'currency', 'pixel']),
    /**
     * Various themes/colors for component.
     */
    coloring: PropTypes.oneOf(['primary', 'positive-value', 'negative-value', 'gradient-value'])
};

RangeMolecule.defaultProps = {
    disabled: false,
    isSmallHandler: true,
    withTooltip: false,
    coloring: 'primary',
    tooltipType: 'default',
    showCircleOnDrag: false,
    circleSizeBasedOnRange: true
};

export default RangeMolecule;
