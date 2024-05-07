import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import classnames from 'classnames';

// Helpers
// @ts-ignore
import { timePickerConfig } from 'configs';
// @ts-ignore
import { noop } from 'utils';
// @ts-ignore
import { useDeviceType } from 'hooks';

// Components
import Scrollbar from '../../atoms/Scrollbar';
// @ts-ignore
import Icon from '../../atoms/Icon';
// @ts-ignore
import ExtendedInput from '../ExtendedInput';
// @ts-ignore
import ValidatableNumberInput from '../ValidatableElements/Elements/ValidatableNumberInput';

// Local components
import TimePickerPopover from './TimePickerPopover';

// Styles
import './TimePicker.scss';

function generateTimeValues(format: string, max: number) {
    const numbers: string[] = [];
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

const checkFormatValidation = (format: string | string[] | undefined, value: string | undefined) =>
    (format?.length === 1 && value?.length && value?.length <= 2 && value && Number(value[0]) !== 0) ||
    (format?.length === 2 && value && value.length === 2);

const checkHourRange = (value: string, format: string) => {
    return value.length <= 2 && Array.isArray(format)
        ? Number(value) < 12
        : (isLongHour(format) && Number(value) < 24) || (isShortHour(format) && Number(value) < 12);
};

// seconds and minutes cant be equal or higher then 60
const checkRange = (value: string) => value.length <= 2 && Number(value) < 60;

const isLongHour = (str: string) => str === 'HH' || str === 'H';
const isShortHour = (str: string) => str === 'hh' || str === 'h';

function convertToFormat(value: string, format: string | string[] | undefined, notEmpty: boolean) {
    if (!value && notEmpty) {
        return format?.length === 1 ? '0' : '00';
    }
    if (format?.length === 2 && value?.length === 1) {
        return `0${value}`;
    }
    if (format?.length === 1 && value?.length === 2) {
        return Number(value).toString();
    }

    return value;
}

const TimePickerConfig = {
    appearance: ['multipleInputs', 'singleInput'],
    screenTypes: ['desktop', 'mobile'],
    positions: ['top', 'right', 'bottom', 'left']
} as const;

export type GetArrayAsUnion<T extends keyof typeof TimePickerConfig> = (typeof TimePickerConfig)[T][number];

interface ITimePickerProps {
    /**
     * Define is seconds field will shown or no
     */
    showSeconds?: boolean;
    /**
     * Select view with multiple inputs or with single inputs
     */
    appearance?: GetArrayAsUnion<'appearance'>;
    /**
     * Format for hour field
     */
    hourFormat?: 'HH' | 'H' | 'hh' | 'h';
    /**
     * Format for hour field
     */
    minuteFormat?: 'mm' | 'm';
    /**
     * Format for hour field
     */
    secondFormat?: 'ss' | 's';
    /**
     * Time field separator
     */
    separator?: string;
    /**
     * Fires an event when field is changed((event: SyntheticEvent) => void).
     */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * Fires an event when field is blurred((date: Date, event: SyntheticEvent) => void).
     */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /**
     * Additional classname
     */
    className?: string;
    /**
     * Value for input field
     */
    value?: string;
    /**
     * disabled for input field
     */
    disabled?: boolean;
    /**
     * Makes Time picker readonly when set to "true"
     */
    readOnly?: boolean;
    /**
     * The switch between mobile and desktop version of Dropdown will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType?: GetArrayAsUnion<'screenTypes'>;
    /**
     * preferred positions by priority ['bottom','top', 'left', 'right']
     * default is ['bottom','top', 'left', 'right']
     * if you'd like, you can limit the positions ['top', 'left']
     */
    positions: GetArrayAsUnion<'positions'>;
}

export interface ChildRef {
    toggleOpen: () => void;
}

const TimePicker: React.FC<ITimePickerProps> = ({
    value,
    onChange = noop,
    showSeconds = true,
    appearance = timePickerConfig.appearance[0],
    hourFormat = 'HH',
    minuteFormat = 'mm',
    secondFormat = 'ss',
    separator = ':',
    className,
    disabled = false,
    readOnly = false,
    screenType,
    onBlur = noop,
    positions,
    ...restProps
}) => {
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
    const [hourPopupValue, setHourPopupValue] = useState<string | null>(null);
    const [minutePopupValue, setMinutePopupValue] = useState<string | null>(null);
    const [secondPopupValue, setSecondPopupValue] = useState<string | null>(null);
    const childRef = useRef<ChildRef | undefined>();
    // for replacing special symbols
    const numberRegExp = useMemo(() => {
        const numberRegExpString = `[^0-9${separator}]`;
        return new RegExp(numberRegExpString, 'g');
    }, [separator]);

    const combinedValue = useCallback(
        (hour: string, minute: string, second: string, notEmpty = true) => {
            if (hour || minute || second) {
                const formatted = [
                    convertToFormat(hour, hourFormat, notEmpty),
                    convertToFormat(minute, minuteFormat, notEmpty),
                    convertToFormat(second, secondFormat, notEmpty)
                ];
                return showSeconds ? formatted.join(separator) : `${formatted[0]}${separator}${formatted[1]}`;
            }
            return '';
        },
        [showSeconds, separator, hourFormat, minuteFormat, secondFormat]
    );

    const checkHasError = useCallback(
        (currentValue: string, format: string | string[]) =>
            !currentValue || !checkFormatValidation(format, currentValue) || !checkRange(currentValue),
        []
    );

    const checkTimeValidation = useCallback(
        (value: string, needToSetState = true) => {
            const hasError = checkHasError(value || hour, hourFormat);
            needToSetState && setHourFieldError(hasError);
            return hasError;
        },
        [checkHasError, hour, hourFormat]
    );

    const checkMinuteValidation = useCallback(
        (value: string, needToSetState = true) => {
            const hasError = checkHasError(value || minute, minuteFormat);
            needToSetState && setMinuteFieldError(hasError);
            return hasError;
        },
        [checkHasError, minute, minuteFormat]
    );

    const checkSecondValidation = useCallback(
        (value: string, needToSetState = true) => {
            const hasError = checkHasError(value || second, secondFormat);
            needToSetState && showSeconds && setSecondFieldError(hasError);
            return !showSeconds || hasError;
        },
        [checkHasError, second, secondFormat, showSeconds]
    );

    const handleHourPopover = useCallback(
        (open: boolean) => {
            return !open && checkTimeValidation(hour, true);
        },
        [checkTimeValidation, hour]
    );

    const handleMinutePopover = useCallback(
        (open: boolean) => !open && checkMinuteValidation(minute, true),
        [checkMinuteValidation, minute]
    );

    const handleSecondPopover = useCallback(
        (open: boolean) => !open && checkSecondValidation(second, true),
        [checkSecondValidation, second]
    );

    const handlePopoverToggle = useCallback(
        (open: boolean) => {
            if (open) return;

            const timeError = checkTimeValidation(hour, true);
            const minuteError = checkMinuteValidation(minute, true);
            const secondError = checkSecondValidation(second, true);

            // need to reset all data when user click outside and any of this fields has error
            if (timeError || minuteError || secondError) {
                setInputValue('');
                setHour('');
                setMinute('');
                setSecond('');
            }
        },
        [
            checkTimeValidation,
            checkMinuteValidation,
            checkSecondValidation,
            hour,
            minute,
            second,
            setInputValue,
            setHour,
            setMinute,
            setSecond
        ]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLLIElement, MouseEvent>, value: string) => {
            // replacing event target's default value, because we have more than one input
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
        (e: React.ChangeEvent<HTMLInputElement>) => {
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
        (e: React.ChangeEvent<HTMLInputElement>) => {
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
        (e: React.ChangeEvent<HTMLInputElement>) => {
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
        (e: React.MouseEvent<HTMLLIElement, MouseEvent>, value: string, key: string) => {
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

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target) {
                return;
            }
            const { value } = e.target;

            // replacing special chars that not allowed
            let replacedValue = value.replace(numberRegExp, '');
            const timeParts = replacedValue.split(separator);

            const lastChar = replacedValue[replacedValue.length - 1];
            const secondLastChar = replacedValue[replacedValue.length - 2];

            // Checking if last and second last chars are same and equal to separator then return
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

            if (timeParts.some((item: string) => item.length > 2)) return;

            if (typeof timeParts[0] !== 'undefined') {
                if (Array.isArray(hourFormat)) {
                    if (+timeParts[0] > 11) {
                        let tempValue = replacedValue.split(separator);
                        tempValue[0] = hour;
                        replacedValue = tempValue.join(separator);
                    }
                } else {
                    if (isShortHour(hourFormat)) {
                        if (+timeParts[0] > 11) {
                            let tempValue = replacedValue.split(separator);
                            tempValue[0] = hour;
                            replacedValue = tempValue.join(separator);
                        }
                    } else {
                        if (+timeParts[0] > 23) {
                            let tempValue = replacedValue.split(separator);
                            tempValue[0] = hour;
                            replacedValue = tempValue.join(separator);
                        }
                    }
                }
            }

            if (typeof timeParts[1] !== 'undefined' && +timeParts[1] > 59) {
                let tempValue = replacedValue.split(separator);
                tempValue[1] = minute;
                replacedValue = tempValue.join(separator);
            }

            if (showSeconds && typeof timeParts[2] !== 'undefined' && +timeParts[2] > 59) {
                let tempValue = replacedValue.split(separator);
                tempValue[2] = second;
                replacedValue = tempValue.join(separator);
            }

            // Make field valid when after typing field pass validation
            // but we must set error only when user click outside or onBlur event fires
            !checkTimeValidation(timeParts[0], false) && setHourFieldError(false);
            !checkMinuteValidation(timeParts[1], false) && setMinuteFieldError(false);
            (!showSeconds || !checkSecondValidation(timeParts[2], false)) && setSecondFieldError(false);

            setInputValue(replacedValue);
            onChange(e);
        },
        [numberRegExp, handleChange, showSeconds, hourFormat, separator, onChange, minute, second]
    );

    useEffect(() => {
        if (value) {
            const timeParts = value.split(separator);
            timeParts[0] && setHour(timeParts[0]);
            timeParts[1] && setMinute(timeParts[1]);
            showSeconds && timeParts[2] && setSecond(timeParts[2]);

            setInputValue(value);
        }
    }, [value, separator, showSeconds]);

    const timeDropDown = useMemo(
        () =>
            function (numbers: string[], active: string, key: string) {
                return (
                    <div className="time-picker-drop">
                        {/* @ts-ignore */}
                        <Scrollbar autoHeight autoHeightMax={200} size="small">
                            <ul>
                                {numbers.map((i: string) => (
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
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const {
                currentTarget: { value }
            } = event;
            let formatted = value;
            if (value) {
                const [hour, minute, second] = value.split(separator);

                formatted = combinedValue(hour, minute, second);
                setInputValue(formatted);
                handleChange(event, formatted);
            }
            onBlur(formatted, event);

            const timeParts = inputValue.split(separator);

            timeParts[0] && setHour(timeParts[0]);
            timeParts[1] && setMinute(timeParts[1]);
            showSeconds && timeParts[2] && setSecond(timeParts[2]);
        },
        [
            checkSecondValidation,
            checkMinuteValidation,
            checkTimeValidation,
            combinedValue,
            handleChange,
            numberRegExp,
            showSeconds,
            inputValue,
            hourFormat,
            separator,
            onBlur
        ]
    );

    const handleMultiInputBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            const formattedHour = convertToFormat(hour, hourFormat, true);
            const formattedMinute = convertToFormat(minute, minuteFormat, true);
            const formattedSecond = convertToFormat(second, secondFormat, true);
            setHour(formattedHour);
            setMinute(formattedMinute);
            setSecond(formattedSecond);
            setInputValue(combinedValue(formattedHour, formattedMinute, formattedSecond, false));

            if (hour || minute || second) {
                setHour(convertToFormat(hour, hourFormat, true));
                setMinute(convertToFormat(minute, minuteFormat, true));
                showSeconds && setSecond(convertToFormat(second, secondFormat, true));
            }
            onBlur(`${hour}${hour && minute && ':'}${minute}${minute && second && ':'}${second}`, event);
        },
        [
            hour,
            minute,
            second,
            onBlur,
            hourFormat,
            minuteFormat,
            showSeconds,
            secondFormat,
            setHour,
            setMinute,
            setSecond,
            setInputValue,
            combinedValue
        ]
    );

    const singleInputPopoverValue = useMemo(
        () => (showSeconds ? convertToFormat(second, secondFormat, true) : convertToFormat(minute, minuteFormat, true)),
        [second, secondFormat, minute, minuteFormat, showSeconds]
    );

    const handleIconClick = useCallback(() => {
        childRef.current && childRef.current.toggleOpen();
    }, [childRef]);

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
                        {/* @ts-ignore */}
                        <Icon type="bc-icon-clock" />
                    </li>
                    <li className="shrink-auto">
                        <TimePickerPopover
                            toggleHandler={handleHourPopover}
                            value={hourPopupValue}
                            positions={positions}
                            readOnly={readOnly}
                            Content={hours}
                        >
                            <ValidatableNumberInput
                                // @ts-ignore
                                onBlur={handleMultiInputBlur}
                                onChange={handleHourChange}
                                isValid={!hourFieldError}
                                writeProtected={isMobile}
                                placeholder={hourFormat}
                                showNumberIcon={false}
                                appearance="minimal"
                                forceAllowValidation
                                readOnly={readOnly}
                                value={hour}
                            />
                        </TimePickerPopover>
                    </li>
                    <li className="no-shrink">
                        <span>{separator}</span>
                    </li>
                    <li className="shrink-auto">
                        {/* @ts-ignore */}
                        <TimePickerPopover
                            toggleHandler={handleMinutePopover}
                            value={minutePopupValue}
                            positions={positions}
                            readOnly={readOnly}
                            Content={minutes}
                        >
                            <ValidatableNumberInput
                                // @ts-ignore
                                onBlur={handleMultiInputBlur}
                                onChange={handleMinuteChange}
                                isValid={!minuteFieldError}
                                placeholder={minuteFormat}
                                writeProtected={isMobile}
                                showNumberIcon={false}
                                forceAllowValidation
                                appearance="minimal"
                                readOnly={readOnly}
                                value={minute}
                            />
                        </TimePickerPopover>
                    </li>
                    {showSeconds && (
                        <>
                            <li className="no-shrink">
                                <span>{separator}</span>
                            </li>
                            <li className="shrink-auto">
                                {/* @ts-ignore */}
                                <TimePickerPopover
                                    toggleHandler={handleSecondPopover}
                                    value={secondPopupValue}
                                    positions={positions}
                                    readOnly={readOnly}
                                    Content={seconds}
                                >
                                    <ValidatableNumberInput
                                        // @ts-ignore
                                        onBlur={handleMultiInputBlur}
                                        onChange={handleSecondChange}
                                        isValid={!secondFieldError}
                                        placeholder={secondFormat}
                                        writeProtected={isMobile}
                                        showNumberIcon={false}
                                        forceAllowValidation
                                        appearance="minimal"
                                        readOnly={readOnly}
                                        value={second}
                                    />
                                </TimePickerPopover>
                            </li>
                        </>
                    )}
                </ul>
            ) : (
                <TimePickerPopover
                    toggleHandler={handlePopoverToggle}
                    value={singleInputPopoverValue}
                    positions={positions}
                    readOnly={readOnly}
                    ref={childRef}
                    Content={
                        <ul className="time-picker-drop-holder">
                            <li className="time-picker-drop-hours">{hours}</li>
                            <li className="time-picker-drop-minutes">{minutes}</li>
                            {showSeconds && <li className="time-picker-drop-seconds">{seconds}</li>}
                        </ul>
                    }
                >
                    <ExtendedInput
                        // @ts-ignore
                        placeholder={`${hourFormat}${separator}${minuteFormat}${
                            showSeconds ? `${separator}${secondFormat}` : ''
                        }`}
                        isValid={!(hourFieldError || minuteFieldError || secondFieldError)}
                        className="time-picker-single-input"
                        onIconClick={handleIconClick}
                        onChange={handleInputChange}
                        writeProtected={isMobile}
                        onBlur={handleInputBlur}
                        itemsDirection="end"
                        icon="bc-icon-clock"
                        readOnly={readOnly}
                        value={inputValue}
                        clickableIcon
                        {...restProps}
                    />
                </TimePickerPopover>
            )}
        </div>
    );
};

export { ITimePickerProps, TimePicker as default };
