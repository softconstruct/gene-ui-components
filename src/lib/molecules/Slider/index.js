import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Slider, { createSliderWithTooltip } from 'rc-slider';

import { useWidth } from 'hooks';
import Icon from '../../atoms/Icon';
import NumberInput from '../ValidatableElements/Elements/ValidatableNumberInput';

import 'src/assets/styles/rangeAndSlider.scss';

const SliderWithTooltip = createSliderWithTooltip(Slider);

function tipFormatter(value, tooltipType) {
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

function SliderMolecule(props) {
    const {
        max,
        min,
        step,
        value,
        coloring,
        disabled,
        onChange,
        withInput,
        circleType,
        withTooltip,
        tooltipType,
        className,
        isSmallHandler,
        plusMinusIcons,
        likeDislikeIcons,
        withActionButtons,
        showCircleOnDrag,
        defaultValue = min,
        circleSizeBasedOnRange,
        ...restProps
    } = props;

    const isControlled = 'value' in props;
    const [sliderValue, setSliderValue] = useState(defaultValue);
    const localValue = isControlled ? value : sliderValue;

    const [withLikeDisLikeActions, setWithLikeDisLikeActions] = useState(withActionButtons);

    const isMin = localValue < max / 3;
    const isMiddle = localValue > max / 3;
    const isMax = localValue >= (max * 2) / 3;

    const divRef = useRef();
    const sliderWidth = useWidth(divRef);
    const isGradient = coloring === 'gradient-value';

    const SliderElement = withTooltip ? SliderWithTooltip : Slider;

    const handleSliderChange = useCallback(
        (val) => {
            !isControlled && setSliderValue(Number(val));

            onChange && onChange(val);
        },
        [onChange, isControlled]
    );

    const handleAfterChange = (val) => {
        val > max / 2 ? handleSliderChange(max) : handleSliderChange(min);
    };
    // Like and dislike buttons can change value only min or max
    const handleLikeDislikeClick = useCallback(
        (val) => {
            withLikeDisLikeActions && handleSliderChange(val);
        },
        [handleSliderChange, withLikeDisLikeActions]
    );

    useEffect(() => {
        !likeDislikeIcons && setWithLikeDisLikeActions((withLikeDisLikeActions) => !withLikeDisLikeActions);
    }, [likeDislikeIcons]);

    useEffect(() => {
        setWithLikeDisLikeActions(withActionButtons);
    }, [withActionButtons]);

    return (
        <div
            className={classnames('slider-holder', className, coloring, {
                disabled,
                'show-on-drag': showCircleOnDrag
            })}
            {...restProps}
        >
            {likeDislikeIcons && (
                <Icon
                    className={classnames('bc-icon-dislike', {
                        active: localValue === min,
                        'negative-value': !withLikeDisLikeActions
                    })}
                    onClick={() => handleLikeDislikeClick(min)}
                />
            )}
            <div
                className={classnames('slider-comp', {
                    'size-small': isSmallHandler
                })}
                style={{
                    '--sliderWidth': `${sliderWidth / 10}rem`
                }}
            >
                <div ref={divRef}>
                    <SliderElement
                        {...restProps}
                        max={max}
                        min={min}
                        step={step}
                        onAfterChange={withLikeDisLikeActions ? handleAfterChange : () => void 0}
                        value={Math.min(localValue, max)}
                        onChange={handleSliderChange}
                        tipProps={{
                            prefixCls: 'tooltip-el',
                            overlay: tipFormatter(localValue, tooltipType)
                        }}
                        handleStyle={{
                            content: `'${classnames(circleType, {
                                'min-coloring': isMin && isGradient,
                                'max-coloring': isGradient && isMax,
                                'max-size': circleSizeBasedOnRange && isMax,
                                'middle-coloring': isGradient && isMiddle && !isMax,
                                'middle-size': circleSizeBasedOnRange && !isMax && isMiddle
                            })}'`
                        }}
                    />
                </div>
            </div>
            {plusMinusIcons && (
                <div className="slider-actions">
                    <Icon
                        className={classnames('bc-icon-plus', {
                            disabled: localValue === max
                        })}
                        onClick={() => handleSliderChange(localValue + step)}
                    />
                    <Icon
                        className={classnames('bc-icon-minus', {
                            disabled: localValue === min
                        })}
                        onClick={() => handleSliderChange(localValue - step)}
                    />
                </div>
            )}
            {likeDislikeIcons && (
                <Icon
                    className={classnames('bc-icon-like', {
                        active: localValue === max,
                        'positive-value': !withLikeDisLikeActions
                    })}
                    onClick={() => handleLikeDislikeClick(max)}
                />
            )}
            {withInput && (
                <NumberInput
                    step={step}
                    min={min}
                    max={max}
                    type="number"
                    colorOnValid={false}
                    showIconOnValid={false}
                    colorBorderOnError
                    showErrorIcon={false}
                    value={String(localValue)}
                    flexibility="content-size"
                    onChange={(e) => handleSliderChange(e.target.value)}
                />
            )}
        </div>
    );
}

SliderMolecule.propTypes = {
    /**
     * Controlled value.
     */
    value: PropTypes.number,
    /**
     * Disabled state.
     */
    disabled: PropTypes.bool,
    /**
     * Fires an event when 'Slider' changes checked state((event: Event) => void).
     */
    onChange: PropTypes.func,
    /**
     * Additional view to choose step.
     */
    withInput: PropTypes.bool,
    /**
     * Show/hide 'Slider' tooltip.
     */
    withTooltip: PropTypes.bool,
    /**
     * Switch on/off small size.
     */
    isSmallHandler: PropTypes.bool,
    /**
     * External/Additional className that can be added to 'Range' component.
     */
    className: PropTypes.string,
    /**
     * Initial value.
     */
    defaultValue: PropTypes.number,
    /**
     * Show/hide actions with (+/-) icons
     */
    plusMinusIcons: PropTypes.bool,
    /**
     * Show/hide actions with (like/dislike) icons
     */
    likeDislikeIcons: PropTypes.bool,
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
    /**
     * Change circle size based on range
     */
    circleSizeBasedOnRange: PropTypes.bool,
    /**
     * Show/hide action button.
     */
    withActionButtons: PropTypes.bool,
    /**
     * Various circle type.
     */
    circleType: PropTypes.oneOf(['c-type-1', 'c-type-2', 'c-type-3']),
    /**
     * Various tooltip type.
     */
    tooltipType: PropTypes.oneOf(['default', 'percentage', 'currency', 'pixel']),
    /**
     * Various themes/colors for component.
     */
    coloring: PropTypes.oneOf(['primary', 'positive-value', 'negative-value', 'gradient-value'])
};

SliderMolecule.defaultProps = {
    disabled: false,
    withInput: false,
    isSmallHandler: true,
    withActionButtons: false,
    withTooltip: false,
    coloring: 'primary',
    plusMinusIcons: false,
    tooltipType: 'default',
    likeDislikeIcons: false,
    showCircleOnDrag: false,
    circleSizeBasedOnRange: true
};

export default SliderMolecule;
