import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { timePickerConfig, screenTypes } from 'configs';
import { noop } from 'utils';
import { useDeviceType } from 'hooks';

// Components
import Scrollbar from '../../atoms/Scrollbar';
import Icon from '../../atoms/Icon';
import ExtendedInput from '../ExtendedInput';
import ValidatableNumberInput from '../ValidatableElements/Elements/ValidatableNumberInput';

// Local components
import TimePickerPopover from './Popover';

// Styles
import './index.scss';

function generateTimeValues(format, max) {
    const numbers = [];
    const formatLength = format.length;

    for (let i = 0; i <= max; i++) {
        if (formatLength === 1) {
            numbers.push(String(i));
        } else {
            numbers.push(i < 10 ? `0${i}` : String(i));
        }
    }

    return numbers;
}

const checkFormatValidation = (format, value) =>
    (format.length === 1 && value.length <= 2 && Number(value[0]) !== 0) || (format.length === 2 && value.length === 2);

const checkHourRange = (value, format) =>
    value.length <= 2 && ((isLongHour(format) && Number(value) < 24) || (isShortHour(format) && Number(value) < 12));

// seconds and minutes cant be equal or higher then 60
const checkRange = (value) => value.length <= 2 && Number(value) < 60;

const isLongHour = (str) => str === 'HH' || str === 'H';
const isShortHour = (str) => str === 'hh' || str === 'h';

function convertToFormat(value, format, notEmpty) {
    if (!value && notEmpty) {
        return format.length === 1 ? '0' : '00';
    }
    if (format.length === 2 && value.length === 1) {
        return `0${value}`;
    }
    if (format.length === 1 && value.length === 2) {
        return Number(value).toString();
    }

    return value;
}

function TimePicker({
    value,
    onChange,
    showSeconds,
    appearance,
    hourFormat,
    minuteFormat,
    secondFormat,
    separator,
    className,
    disabled,
    readOnly,
    screenType,
    onBlur,
    positions,
    ...restProps
}) {
    const { isMobile } = useDeviceType(screenType);

    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [minuteFieldError, setMinuteFieldError] = useState(false);
    const [secondFieldError, setSecondFieldError] = useState(false);
    const [hourFieldError, setHourFieldError] = useState(false);

    // We save every value that selected from popup, because we need to
    // close current popup when user select value from popup
    const [hourPopupValue, setHourPopupValue] = useState(null);
    const [minutePopupValue, setMinutePopupValue] = useState(null);
    const [secondPopupValue, setSecondPopupValue] = useState(null);
    const childRef = useRef();

    // for replacing special symbols
    const numberRegExp = useMemo(() => {
        const numberRegExpString = `[^0-9${separator}]`;
        return new RegExp(numberRegExpString, 'g');
    }, [separator]);

    const combinedValue = useCallback(
        (hour, minute, second, notEmpty = true) => {
            if (hour || minute || second) {
                const formated = [
                    convertToFormat(hour, hourFormat, notEmpty),
                    convertToFormat(minute, minuteFormat, notEmpty),
                    convertToFormat(second, secondFormat, notEmpty)
                ];
                return showSeconds ? formated.join(separator) : `${formated[0]}${separator}${formated[1]}`;
            }
            return '';
        },
        [showSeconds, separator, hourFormat, minuteFormat, secondFormat]
    );

    const checkHasError = useCallback(
        (currentValue, format) =>
            !currentValue || !checkFormatValidation(format, currentValue) || !checkRange(currentValue),
        []
    );

    const checkTimeValidation = useCallback(
        (value, needToSetState = true) => {
            const hasError = checkHasError(value || hour, hourFormat);
            needToSetState && setHourFieldError(hasError);
            return hasError;
        },
        [checkHasError, hour, hourFormat]
    );

    const checkMinuteValidation = useCallback(
        (value, needToSetState = true) => {
            const hasError = checkHasError(value || minute, minuteFormat);
            needToSetState && setMinuteFieldError(hasError);
            return hasError;
        },
        [checkHasError, minute, minuteFormat]
    );

    const checkSecondValidation = useCallback(
        (value, needToSetState = true) => {
            const hasError = checkHasError(value || second, secondFormat);
            needToSetState && showSeconds && setSecondFieldError(hasError);
            return !showSeconds || hasError;
        },
        [checkHasError, second, secondFormat, showSeconds]
    );

    const handleHourPopover = useCallback((e, open) => !open && checkTimeValidation(), [checkTimeValidation]);

    const handleMinutePopover = useCallback((e, open) => !open && checkMinuteValidation(), [checkMinuteValidation]);

    const handleSecondPopover = useCallback((e, open) => !open && checkSecondValidation(), [checkSecondValidation]);

    const handlePopoverToggle = useCallback(
        (e, open) => {
            if (open) return;

            const timeError = checkTimeValidation();
            const minuteError = checkMinuteValidation();
            const secondError = checkSecondValidation();

            // need to reset all data when user click outside and any of this fields has error
            if (timeError || minuteError || secondError) {
                setInputValue('');
                setHour('');
                setMinute('');
                setSecond('');
            }
        },
        [checkTimeValidation, checkMinuteValidation, checkSecondValidation]
    );

    const handleChange = useCallback(
        (e, value) => {
            // replacing event target's default value, because we have more then one input
            // and value can be changes from popup, too
            const changedEvent = {
                ...e,
                target: {
                    ...e.target,
                    value
                }
            };
            onChange(changedEvent);
        },
        [onChange]
    );

    const handleHourChange = useCallback(
        (e) => {
            const { value } = e.target;

            const isInRange = checkHourRange(value, hourFormat);

            if (isInRange) {
                if (!checkTimeValidation(value, false)) {
                    setHourFieldError(false);
                }
                setHour(value);
                // second argument needs because we call onChange event immediately after setState
                handleChange(e, combinedValue(value, minute, second));
            }
        },
        [hourFormat, checkTimeValidation, handleChange, combinedValue, minute, second]
    );

    const handleMinuteChange = useCallback(
        (e) => {
            const { value } = e.target;

            const isInRange = checkRange(value);

            if (isInRange) {
                if (!checkMinuteValidation(value, false)) {
                    setMinuteFieldError(false);
                }
                setMinute(value);
                // second argument needs because we call onChange event immediately after setState
                handleChange(e, combinedValue(hour, value, second));
            }
        },
        [checkMinuteValidation, handleChange, combinedValue, hour, second]
    );

    const handleSecondChange = useCallback(
        (e) => {
            const { value } = e.target;

            const isInRange = checkRange(value);

            if (isInRange) {
                if (!checkSecondValidation(value, false)) {
                    setSecondFieldError(false);
                }
                setSecond(value);
                // second argument needs because we call onChange event immediately after setState
                handleChange(e, combinedValue(hour, minute, value));
            }
        },
        [checkSecondValidation, handleChange, combinedValue, hour, minute]
    );

    const handleChangeFromPopup = useCallback(
        (e, value, key) => {
            let time = '';

            if (key === 'second') {
                time = combinedValue(hour, minute, value);
                setSecondFieldError(false);
                setSecondPopupValue(value);
            } else if (key === 'hour') {
                time = combinedValue(value, minute, second);
                setHourFieldError(false);
                setHourPopupValue(value);
            } else {
                time = combinedValue(hour, value, second);
                setMinuteFieldError(false);
                setMinutePopupValue(value);
            }

            const values = time.split(separator);
            setHour(values[0]);
            setMinute(values[1]);
            showSeconds && setSecond(values[2]);

            setInputValue(time);
            handleChange(e, time);
        },
        [hour, minute, second, separator, showSeconds, handleChange, combinedValue]
    );

    const handleInputChange = (e) => {
        const { value } = e.target;

        // replacing special chars that not allowed
        const replacedValue = value.replace(numberRegExp, '');
        const timeParts = replacedValue.split(separator);

        const lastChar = replacedValue[replacedValue.length - 1];
        const secondLastChar = replacedValue[replacedValue.length - 2];

        if (lastChar === separator && lastChar === secondLastChar) return;

        if (value === '') {
            setHour('');
            setMinute('');
            setSecond('');
            setInputValue('');

            handleChange(e, '');
            return;
        }

        if (typeof timeParts[showSeconds ? 3 : 2] !== 'undefined') return;

        if (timeParts.some((item) => item.length > 2)) return;

        let outOfRange = false;

        timeParts[0] && setHour(timeParts[0]);
        timeParts[1] && setMinute(timeParts[1]);
        showSeconds && timeParts[2] && setSecond(timeParts[2]);

        if (typeof timeParts[0] !== 'undefined') {
            const isInRange = checkHourRange(timeParts[0], hourFormat);

            if (isInRange) {
                setHour(timeParts[0]);
            } else {
                outOfRange = true;
            }
        }

        if (typeof timeParts[1] !== 'undefined') {
            const isInRange = checkRange(timeParts[1]);

            if (isInRange) {
                setMinute(timeParts[1]);
            } else {
                outOfRange = true;
            }
        }

        if (showSeconds && typeof timeParts[2] !== 'undefined') {
            const isInRange = checkRange(timeParts[2]);

            if (isInRange) {
                setSecond(timeParts[2]);
            } else {
                outOfRange = true;
            }
        }

        !checkTimeValidation(timeParts[0], false) && setHourFieldError(false);
        !checkMinuteValidation(timeParts[1], false) && setMinuteFieldError(false);
        (!showSeconds || !checkSecondValidation(timeParts[2], false)) && setSecondFieldError(false);

        if (!outOfRange) {
            setInputValue(replacedValue);
            onChange(e);
        }
    };

    useEffect(() => {
        if ((disabled || readOnly) && childRef.current) {
            childRef.current.toggleOpen(true);
        }
    }, [disabled, readOnly]);

    useEffect(() => {
        if (hour) {
            const formattedHour = convertToFormat(hour, hourFormat);
            setHour(formattedHour);
            setInputValue(combinedValue(formattedHour, minute, second, false));
        }
    }, [hourFormat]);

    useEffect(() => {
        if (minute) {
            const formattedMinute = convertToFormat(minute, minuteFormat);
            setMinute(formattedMinute);
            setInputValue(combinedValue(hour, formattedMinute, second, false));
        }
    }, [minuteFormat]);

    useEffect(() => {
        if (second) {
            const formattedSecond = convertToFormat(second, secondFormat);
            setSecond(formattedSecond);
            setInputValue(combinedValue(hour, minute, formattedSecond, false));
        }
    }, [secondFormat]);

    useEffect(() => {
        if (!inputValue) return;

        const [splitHour, splitMinute, splitSecond] = inputValue.split(separator);
        !showSeconds && setSecond('');
        showSeconds && (inputValue || hour) && !second && setSecond(convertToFormat(second, secondFormat));
        setInputValue(combinedValue(splitHour, splitMinute, splitSecond));
    }, [showSeconds]);

    useEffect(() => {
        if (value) {
            const [splitHour, splitMinute, splitSecond] = value.split(separator);
            splitHour && setHour(splitHour);
            splitMinute && setMinute(splitMinute);
            showSeconds && splitSecond && setSecond(splitSecond);

            setInputValue(value);
        }
    }, [value, separator, showSeconds]);

    const timeDropDown = useMemo(
        () =>
            function (numbers, active, key) {
                return (
                    <div className="time-picker-drop">
                        <Scrollbar autoHeight autoHeightMax={200} size="small">
                            <ul>
                                {numbers.map((i) => (
                                    <li
                                        onClick={(e) => handleChangeFromPopup(e, i, key)}
                                        key={i}
                                        className={classnames({
                                            active: i === active
                                        })}
                                    >
                                        <span>{i}</span>
                                    </li>
                                ))}
                            </ul>
                        </Scrollbar>
                    </div>
                );
            },
        [handleChangeFromPopup]
    );

    const hours = useMemo(
        () => timeDropDown(generateTimeValues(hourFormat, isLongHour(hourFormat) ? 23 : 11), hour, 'hour'),
        [timeDropDown, hourFormat, hour]
    );

    const minutes = useMemo(
        () => timeDropDown(generateTimeValues(minuteFormat, 59), minute, 'minute'),
        [timeDropDown, minuteFormat, minute]
    );

    const seconds = useMemo(
        () => timeDropDown(generateTimeValues(secondFormat, 59), second, 'second'),
        [timeDropDown, secondFormat, second]
    );

    const handleInputBlur = useCallback(
        (event) => {
            const {
                currentTarget: { value }
            } = event;
            let formated = value;
            if (value) {
                formated = combinedValue(...value.split(separator));
                setInputValue(formated);
                handleChange(event, formated);
            }
            onBlur(formated, event);
        },
        [combinedValue, separator, handleChange, onBlur]
    );

    const handleMultiInputBlur = useCallback(
        (event) => {
            const {
                currentTarget: { value }
            } = event;
            if (hour || minute || second) {
                setHour(convertToFormat(hour, hourFormat, true));
                setMinute(convertToFormat(minute, minuteFormat, true));
                showSeconds && setSecond(convertToFormat(second, secondFormat, true));
            }
            onBlur(`${hour}${hour && minute && ':'}${minute}${minute && second && ':'}${second}`, event);
        },
        [hour, minute, second, onBlur, hourFormat, minuteFormat, showSeconds, secondFormat]
    );

    const signleInputPopoverValue = useMemo(
        () => (showSeconds ? convertToFormat(second, secondFormat, true) : convertToFormat(minute, minuteFormat, true)),
        [second, secondFormat, minute, minuteFormat, showSeconds]
    );

    const handleIconClick = () => childRef.current && !readOnly && !disabled && childRef.current.toggleOpen();

    return (
        <div
            className={classnames('time-picker-holder', className, {
                'read-only': readOnly,
                mobile: isMobile,
                disabled
            })}
        >
            {appearance === timePickerConfig.appearance[0] ? (
                <ul>
                    <li className="no-shrink icon-holder">
                        <Icon type="bc-icon-clock" />
                    </li>
                    <li className="shrink-auto">
                        <TimePickerPopover
                            value={hourPopupValue}
                            toggleHandler={handleHourPopover}
                            Content={hours}
                            readOnly={readOnly}
                            positions={positions}
                        >
                            <ValidatableNumberInput
                                value={hour}
                                isValid={!hourFieldError}
                                forceAllowValidation
                                onChange={handleHourChange}
                                placeholder={hourFormat}
                                appearance="minimal"
                                showNumberIcon={false}
                                readOnly={readOnly}
                                writeProtected={isMobile}
                                onBlur={handleMultiInputBlur}
                            />
                        </TimePickerPopover>
                    </li>
                    <li className="no-shrink">
                        <span>{separator}</span>
                    </li>
                    <li className="shrink-auto">
                        <TimePickerPopover
                            value={minutePopupValue}
                            toggleHandler={handleMinutePopover}
                            Content={minutes}
                            readOnly={readOnly}
                            positions={positions}
                        >
                            <ValidatableNumberInput
                                value={minute}
                                isValid={!minuteFieldError}
                                forceAllowValidation
                                onChange={handleMinuteChange}
                                placeholder={minuteFormat}
                                appearance="minimal"
                                showNumberIcon={false}
                                readOnly={readOnly}
                                writeProtected={isMobile}
                                onBlur={handleMultiInputBlur}
                            />
                        </TimePickerPopover>
                    </li>
                    {showSeconds && (
                        <>
                            <li className="no-shrink">
                                <span>{separator}</span>
                            </li>
                            <li className="shrink-auto">
                                <TimePickerPopover
                                    value={secondPopupValue}
                                    toggleHandler={handleSecondPopover}
                                    Content={seconds}
                                    readOnly={readOnly}
                                    positions={positions}
                                >
                                    <ValidatableNumberInput
                                        value={second}
                                        forceAllowValidation
                                        isValid={!secondFieldError}
                                        onChange={handleSecondChange}
                                        placeholder={secondFormat}
                                        appearance="minimal"
                                        showNumberIcon={false}
                                        readOnly={readOnly}
                                        writeProtected={isMobile}
                                        onBlur={handleMultiInputBlur}
                                    />
                                </TimePickerPopover>
                            </li>
                        </>
                    )}
                </ul>
            ) : (
                <TimePickerPopover
                    toggleHandler={handlePopoverToggle}
                    readOnly={readOnly}
                    value={signleInputPopoverValue}
                    ref={childRef}
                    Content={
                        <ul className="time-picker-drop-holder">
                            <li>{hours}</li>
                            <li>{minutes}</li>
                            {showSeconds && <li>{seconds}</li>}
                        </ul>
                    }
                    positions={positions}
                >
                    <ExtendedInput
                        placeholder={`${hourFormat}${separator}${minuteFormat}${
                            showSeconds ? `${separator}${secondFormat}` : ''
                        }`}
                        icon="bc-icon-clock"
                        onChange={handleInputChange}
                        value={inputValue}
                        isValid={!(hourFieldError || minuteFieldError || secondFieldError)}
                        itemsDirection="end"
                        readOnly={readOnly}
                        writeProtected={isMobile}
                        onIconClick={handleIconClick}
                        clickableIcon
                        onBlur={handleInputBlur}
                        {...restProps}
                    />
                </TimePickerPopover>
            )}
        </div>
    );
}

TimePicker.propTypes = {
    /**
     * Define is seconds field will shown or no
     */
    showSeconds: PropTypes.bool,
    /**
     * Select view with multiple inputs or with single inputs
     */
    appearance: PropTypes.oneOf(timePickerConfig.appearance),
    /**
     * Format for hour field
     */
    hourFormat: PropTypes.oneOf(['HH', 'H', 'hh', 'h']),
    /**
     * Format for hour field
     */
    minuteFormat: PropTypes.oneOf(['mm', 'm']),
    /**
     * Format for hour field
     */
    secondFormat: PropTypes.oneOf(['ss', 's']),
    /**
     * Time field separator
     */
    separator: PropTypes.string,
    /**
     * Fires an event when field is changed((event: SyntheticEvent) => void).
     */
    onChange: PropTypes.func,
    /**
     * Fires an event when field is blurred((date: Date, event: SyntheticEvent) => void).
     */
    onBlur: PropTypes.func,
    /**
     * Additional classname
     */
    className: PropTypes.string,
    /**
     * Value for input field
     */
    value: PropTypes.string,
    /**
     * disabled for input field
     */
    disabled: PropTypes.bool,
    /**
     * Makes Time picker readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * The switch between mobile and desktop version of Dropdown will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * preferred positions by priority ['bottom','top', 'left', 'right']
     * default is ['bottom','top', 'left', 'right']
     * if you'd like, you can limit the positions ['top', 'left']
     */
    positions: PropTypes.array
};

TimePicker.defaultProps = {
    appearance: timePickerConfig.appearance[0],
    showSeconds: true,
    hourFormat: 'HH',
    minuteFormat: 'mm',
    secondFormat: 'ss',
    separator: ':',
    onChange: noop,
    onBlur: noop,
    disabled: false,
    readOnly: false
};

export default TimePicker;
