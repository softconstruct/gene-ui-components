import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { noop, stopEvent } from 'utils';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useKeyDown } from 'hooks';
import Tooltip from '../Tooltip';
import ExtendedInput from '../ExtendedInput';
import { Button, Label, SkeletonLoader } from '../../atoms';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

const keyDownKeys = {
    arrowUp: 'ArrowUp',
    arrowDown: 'ArrowDown'
};

const inputRadiusMap = {
    round: 'full-radius',
    smooth: 'smooth-radius'
};

function Counter({
    minusTooltipText,
    plusTooltipText,
    inputReadOnly,
    defaultValue,
    cornerRadius,
    isLoading,
    className,
    minValue,
    maxValue,
    readOnly,
    disabled,
    onChange,
    label,
    value,
    width,
    size,
    step
}) {
    const ref = useRef();
    const inputRef = useRef();

    const [showInputTooltip, setShowInputTooltip] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [data, setData] = useState(defaultValue || 0);
    const [counterStep, setCounterStep] = useState(step);

    useEffect(() => setCounterStep(step), [step]);

    const isMinMaxWrong = useMemo(() => minValue >= maxValue, [minValue, maxValue]);

    const isControlled = useMemo(() => value === 0 || !!value, [value]);
    const modifiedSize = useMemo(() => (typeof width === 'number' ? `${width}px` : width), [width]);

    const isDisableMinus = useMemo(() => +data === minValue, [minValue, data]);
    const isDisablePlus = useMemo(() => +data === maxValue, [maxValue, data]);

    const isMinValue = useMemo(() => minValue !== undefined, [minValue]);
    const isMaxValue = useMemo(() => maxValue !== undefined, [maxValue]);

    useEffect(() => {
        if (typeof defaultValue === 'number' && defaultValue <= maxValue && defaultValue >= minValue) {
            return setData(defaultValue);
        }
        if (typeof minValue === 'number' && minValue > defaultValue) {
            return setData(minValue);
        }
    }, [minValue, defaultValue, maxValue]);

    useEffect(() => {
        isControlled && setData(value);
    }, [value]);

    const setNewValue = useCallback(
        (val) => {
            !isControlled && setData((eventState) => (+eventState + +val).toString());
            onChange((+data + +val).toString());
        },
        [isControlled, data]
    );

    const setValueToMin = useCallback(() => {
        !isControlled && setData(minValue?.toString());
        onChange(minValue?.toString());
    }, [isControlled, minValue]);

    const setValueToMax = useCallback(() => {
        !isControlled && setData(maxValue?.toString());
        onChange(maxValue?.toString());
    }, [isControlled, maxValue]);

    const handleChange = useCallback(
        (val) => {
            if (isMinValue && isMaxValue) {
                if (
                    (+data <= maxValue && +data >= minValue && +val + +data <= maxValue && +val + +data >= minValue) ||
                    val === '-'
                ) {
                    setNewValue(val);
                } else if (+val + +data > maxValue) {
                    setValueToMax();
                } else if (+val + +data < minValue) {
                    setValueToMin();
                }
            } else if ((isMaxValue && +data <= maxValue) || val === '-') {
                if (+val + +data <= maxValue) {
                    setNewValue(val);
                } else {
                    setValueToMax();
                }
            } else if ((isMinValue && +data >= minValue) || val === '-') {
                if (+val + +data >= minValue) {
                    setNewValue(val);
                } else {
                    setValueToMin();
                }
            } else {
                setNewValue(val);
            }
        },
        [data, isControlled]
    );

    const setNewInputValue = useCallback(
        (value) => {
            !isControlled && setData(value.trim());
            !isNaN(+value) && onChange(value);
        },
        [isControlled]
    );

    const handleInputChange = useCallback(
        ({ target: { value } }) => {
            if (isMinValue && isMaxValue) {
                if ((+value <= maxValue && +value >= minValue) || value === '-') {
                    setNewInputValue(value);
                }
            } else if (isMaxValue) {
                if (+value <= maxValue) {
                    setNewInputValue(value);
                } else if (value === '-') {
                    setNewInputValue(value);
                }
            } else if (isMinValue) {
                if (+value >= minValue) {
                    setNewInputValue(value);
                } else if (value === '-') {
                    setNewInputValue(value);
                }
            } else {
                setNewInputValue(value);
            }
        },
        [maxValue, minValue]
    );

    useKeyDown(
        (e) => {
            stopEvent(e, true);

            if (e.key === keyDownKeys.arrowUp && !isDisablePlus) {
                handleChange(counterStep);
            }

            if (e.key === keyDownKeys.arrowDown && !isDisableMinus) {
                handleChange(-counterStep);
            }
        },
        [handleChange],
        ref,
        [keyDownKeys.arrowUp, keyDownKeys.arrowDown]
    );

    useEffect(() => {
        if (inputRef.current?.scrollWidth > inputRef.current?.offsetWidth) {
            !isTruncated && setIsTruncated(true);
        } else {
            isTruncated && setIsTruncated(false);
        }
    }, [data]);

    return (
        <div
            ref={ref}
            style={{ maxWidth: modifiedSize }}
            onMouseOver={() => isTruncated && setShowInputTooltip(true)}
            onMouseLeave={() => isTruncated && setShowInputTooltip(false)}
            className={classnames('counter', className, `s-${size}`, `r-${cornerRadius}`)}
        >
            {label && (
                <Tooltip title={label}>
                    <Label className="counter__label ellipsis-text" size="bodySmall">
                        {label}
                    </Label>
                </Tooltip>
            )}
            <div className="counter__wrapper">
                {!readOnly && (
                    <Tooltip title={isDisableMinus && !isLoading ? minusTooltipText : ''}>
                        <div className="counter__button counter__button-minus">
                            {isLoading ? (
                                <SkeletonLoader isBusy={isLoading} />
                            ) : (
                                <Button
                                    icon={isLoading ? 'bc-icon-loader' : 'bc-icon-minus'}
                                    disabled={isMinMaxWrong || isDisableMinus || disabled}
                                    cornerRadius={cornerRadius}
                                    onClick={() => handleChange(-counterStep)}
                                />
                            )}
                        </div>
                    </Tooltip>
                )}
                <Tooltip alwaysShow={showInputTooltip} title={isTruncated ? data : ''}>
                    <div className="counter__input-holder">
                        {isLoading ? (
                            <SkeletonLoader isBusy={isLoading} />
                        ) : (
                            <ExtendedInput
                                ref={inputRef}
                                className="counter__input"
                                disabled={isMinMaxWrong || disabled || isLoading}
                                cornerRadius={inputRadiusMap[cornerRadius]}
                                onChange={handleInputChange}
                                showNumberIcon={false}
                                readOnly={readOnly || inputReadOnly}
                                type="number"
                                value={data}
                            />
                        )}
                    </div>
                </Tooltip>
                {!readOnly && (
                    <Tooltip title={isDisablePlus && !isLoading ? plusTooltipText : ''}>
                        <div className="counter__button counter__button-plus">
                            {isLoading ? (
                                <SkeletonLoader isBusy={isLoading} />
                            ) : (
                                <Button
                                    icon={isLoading ? 'bc-icon-loader' : 'bc-icon-plus'}
                                    disabled={isMinMaxWrong || isDisablePlus || disabled}
                                    cornerRadius={cornerRadius}
                                    onClick={() => handleChange(counterStep)}
                                />
                            )}
                        </div>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

const CounterConfig = {
    size: ['small', 'medium', 'big'],
    cornerRadius: ['round', 'smooth']
};

Counter.propTypes = {
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * counter will become disabled when set to "true"
     */
    disabled: PropTypes.bool,
    /**
     * counter input will become readonly when set to "true"
     */
    inputReadOnly: PropTypes.bool,
    /**
     * Label for 'counter'.
     */
    label: PropTypes.string,
    /**
     * onChange function which returns callBack if there is a change
     */
    onChange: PropTypes.func,
    /**
     * Use this prop to control counter state. Note that when you specify this prop, the counter will not functionate itself
     */
    value: PropTypes.number,
    /**
     * This prop will only applied once as defaultState for "value" when counter mounts.
     * Note that specifying this prop is not mean controlling it.
     */
    defaultValue: PropTypes.number,
    /**
     * Is loading state.
     */
    isLoading: PropTypes.bool,
    /**
     * counter size, if the set value is number default use px
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * counter size
     */
    size: PropTypes.oneOf(CounterConfig.size),
    /**
     * counter corner radius
     */
    cornerRadius: PropTypes.oneOf(CounterConfig.cornerRadius),
    /**
     * minus tooltip text
     */
    minusTooltipText: PropTypes.string,
    /**
     * plus tooltip text
     */
    plusTooltipText: PropTypes.string,
    /**
     * Counter minimum value
     */
    minValue: PropTypes.number,
    /**
     * Counter maximum value
     */
    maxValue: PropTypes.number,
    /**
     * Counter step value
     */
    step: PropTypes.number
};

Counter.defaultProps = {
    cornerRadius: CounterConfig.cornerRadius[0],
    size: CounterConfig.size[1],
    minusTooltipText: '',
    inputReadOnly: false,
    plusTooltipText: '',
    isLoading: false,
    disabled: false,
    readOnly: false,
    onChange: noop,
    width: '100px',
    label: '',
    step: 1
};

export default Counter;
