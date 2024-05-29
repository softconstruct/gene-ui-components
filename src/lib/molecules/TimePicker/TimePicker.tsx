import React, { FC, useState, useEffect, useRef, ChangeEvent, FocusEvent, MouseEvent as ReactMouseEvent } from 'react';
import classnames from 'classnames';

// Helpers
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
import TimePickerPopover from './TimePickerPopover';

// Styles
import './TimePicker.scss';

function generateTimeValues(format: string, max: number) {
    const numbers: string[] = [];
    const formatLength = format.length;

    for (let i = 0; i <= max; i++) {
        numbers.push(i < 10 && formatLength !== 1 ? `0${i}` : String(i));
    }

    return numbers;
}

const checkFormatValidation = (format: string, value: string) =>
    (format.length === 1 && value.length <= 2 && Number(value[0]) !== 0) || (format.length === 2 && value.length === 2);

const checkHourRange = (value: string, format: string) =>
    value.length <= 2 && ((isLongHour(format) && Number(value) < 24) || (isShortHour(format) && Number(value) < 12));

const checkRange = (value: string) => value.length <= 2 && Number(value) < 60;

const isLongHour = (str: string) => str === 'HH' || str === 'H';
const isShortHour = (str: string) => str === 'hh' || str === 'h';

function convertToFormat(value: string, format: string, notEmpty: boolean = true) {
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

interface ITimePickerProps {
    /**
     * Define is seconds field will be shown or no
     */
    showSeconds?: boolean;
    /**
     * Select view with multiple inputs or with single inputs <br>
     * Possible values: `'multipleInputs' | 'singleInput'`
     */
    appearance?: 'multipleInputs' | 'singleInput';
    /**
     * Format for hour field <br>
     * Possible values: `'HH' | 'H' | 'hh' | 'h'`
     */
    hourFormat?: 'HH' | 'H' | 'hh' | 'h';
    /**
     * Format for hour field <br>
     * Possible values: `'mm' | 'm'`
     */
    minuteFormat?: 'mm' | 'm';
    /**
     * Format for hour field <br>
     * Possible values: `'ss' | 's'`
     */
    secondFormat?: 'ss' | 's';
    /**
     * Time field separator
     */
    separator?: string;
    /**
     * Fires an event when field is changed
     * `((event: SyntheticEvent) => void)`.
     */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Fires an event when field is blurred
     * `((date: Date, event: SyntheticEvent) => void)`.
     */
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     * Additional classname
     */
    className?: string;
    /**
     * Value for input field
     */
    value?: string;
    /**
     * Disabled for input field
     */
    disabled?: boolean;
    /**
     * Makes Time picker readonly when set to "true"
     */
    readOnly?: boolean;
    /**
     * The switch between mobile and desktop version of Dropdown will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside. <br>
     * Possible values: `'desktop' | 'mobile'`
     */
    screenType?: 'desktop' | 'mobile';
    /**
     * Preferred positions by priority ['bottom', 'top', 'left', 'right']
     * default is ['bottom', 'top', 'left', 'right']
     * if you'd like, you can limit the positions ['top', 'left']
     */
    positions?: ('bottom' | 'top' | 'left' | 'right')[];
}

export interface ChildRef {
    toggleOpen: (isOpen?: boolean) => void;
}

const TimePicker: FC<ITimePickerProps> = ({
    value,
    onChange = noop,
    showSeconds = true,
    appearance = 'multipleInputs',
    hourFormat = 'HH',
    minuteFormat = 'mm',
    secondFormat = 'ss',
    separator = ':',
    className,
    disabled = false,
    readOnly = false,
    screenType = 'desktop',
    onBlur = noop,
    positions = ['bottom', 'top', 'left', 'right'] as ('bottom' | 'top' | 'left' | 'right')[],
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
    const [hourPopupValue, setHourPopupValue] = useState('');
    const [minutePopupValue, setMinutePopupValue] = useState('');
    const [secondPopupValue, setSecondPopupValue] = useState('');
    const childRef = useRef<ChildRef>();

    const numberRegExp = () => {
        const numberRegExpString = `[^0-9${separator}]`;
        return new RegExp(numberRegExpString, 'g');
    };

    const combinedValue = (hour: string, minute: string, second: string, notEmpty = true) => {
        if (hour || minute || second) {
            const [formattedHour, formattedMinute, formattedSecond] = [
                convertToFormat(hour, hourFormat, notEmpty),
                convertToFormat(minute, minuteFormat, notEmpty),
                convertToFormat(second, secondFormat, notEmpty)
            ];
            return showSeconds
                ? `${formattedHour}${separator}${formattedMinute}${separator}${formattedSecond}`
                : `${formattedHour}${separator}${formattedMinute}`;
        }
        return '';
    };

    const checkHasError = (currentValue: string, format: string) =>
        !currentValue || !checkFormatValidation(format, currentValue) || !checkRange(currentValue);

    const checkTimeValidation = (value: string, needToSetState = true) => {
        const hasError = checkHasError(value || hour, hourFormat);
        needToSetState && setHourFieldError(hasError);
        return hasError;
    };

    const checkMinuteValidation = (value: string, needToSetState = true) => {
        const hasError = checkHasError(value || minute, minuteFormat);
        needToSetState && setMinuteFieldError(hasError);
        return hasError;
    };

    const checkSecondValidation = (value: string, needToSetState = true) => {
        const hasError = checkHasError(value || second, secondFormat);
        needToSetState && showSeconds && setSecondFieldError(hasError);
        return !showSeconds || hasError;
    };

    const handleHourPopover = (open: boolean) => !open && checkTimeValidation(hour);

    const handleMinutePopover = (open: boolean) => !open && checkMinuteValidation(minute);

    const handleSecondPopover = (open: boolean) => !open && checkSecondValidation(second);

    const handlePopoverToggle = (open: boolean) => {
        if (open) return;

        const timeError = checkTimeValidation(hour);
        const minuteError = checkMinuteValidation(minute);
        const secondError = checkSecondValidation(second);

        if (timeError || minuteError || secondError) {
            setInputValue('');
            setHour('');
            setMinute('');
            setSecond('');
        }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement> | ReactMouseEvent<HTMLLIElement, MouseEvent>,
        value: string
    ) => {
        const changedEvent = {
            ...e,
            target: {
                ...e.target,
                value
            }
        };
        onChange(changedEvent);
    };

    const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const isInRange = checkHourRange(value, hourFormat);
        if (isInRange) {
            if (!checkTimeValidation(value, false)) {
                setHourFieldError(false);
            }
            setHour(value);
            handleChange(e, combinedValue(value, minute, second));
        }
    };

    const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const isInRange = checkRange(value);

        if (isInRange) {
            if (!checkMinuteValidation(value, false)) {
                setMinuteFieldError(false);
            }
            setMinute(value);
            handleChange(e, combinedValue(hour, value, second));
        }
    };

    const handleSecondChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const isInRange = checkRange(value);

        if (isInRange) {
            if (!checkSecondValidation(value, false)) {
                setSecondFieldError(false);
            }
            setSecond(value);
            handleChange(e, combinedValue(hour, minute, value));
        }
    };

    const handleChangeFromPopup = (e: ReactMouseEvent<HTMLLIElement, MouseEvent>, value: string, key: string) => {
        let time: string;

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

        const [changedHour, changedMinute, changedSecond] = time.split(separator);
        setHour(changedHour);
        setMinute(changedMinute);
        showSeconds && setSecond(changedSecond);

        setInputValue(time);
        handleChange(e, time);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const replacedValue: string = value.replace(numberRegExp(), '');
        const timeParts: string[] = replacedValue.split(separator);
        const [splitHour, splitMinute, splitSecond] = timeParts;

        const lastChar = replacedValue[replacedValue.length - 1];
        const preLastChar = replacedValue[replacedValue.length - 2];

        if (lastChar === separator && lastChar === preLastChar) return;

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

        splitHour && setHour(splitHour);
        minute && setMinute(minute);
        showSeconds && second && setSecond(second);

        if (typeof splitHour !== 'undefined') {
            const isInRange = checkHourRange(splitHour, hourFormat);

            if (isInRange) {
                setHour(splitHour);
            } else {
                outOfRange = true;
            }
        }

        if (typeof splitMinute !== 'undefined') {
            const isInRange = checkRange(splitMinute);

            if (isInRange) {
                setMinute(splitMinute);
            } else {
                outOfRange = true;
            }
        }

        if (showSeconds && typeof splitSecond !== 'undefined') {
            const isInRange = checkRange(splitSecond);

            if (isInRange) {
                setSecond(splitSecond);
            } else {
                outOfRange = true;
            }
        }

        !checkTimeValidation(splitHour, false) && setHourFieldError(false);
        !checkMinuteValidation(splitMinute, false) && setMinuteFieldError(false);
        (!showSeconds || !checkSecondValidation(splitSecond, false)) && setSecondFieldError(false);

        if (!outOfRange) {
            setInputValue(replacedValue);
            onChange(e);
        }
    };

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
        if ((disabled || readOnly) && childRef.current) {
            childRef.current.toggleOpen(true);
        }
    }, [disabled, readOnly]);

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

    const timeDropDown = (numbers: string[], active: string, key: string) => (
        <div className="time-picker-drop">
            {/* @ts-ignore */}
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

    const hours = timeDropDown(generateTimeValues(hourFormat, isLongHour(hourFormat) ? 23 : 11), hour, 'hour');

    const minutes = timeDropDown(generateTimeValues(minuteFormat, 59), minute, 'minute');
    const seconds = timeDropDown(
        generateTimeValues(secondFormat, 59),
        inputValue || hour ? convertToFormat(second, secondFormat) : second,
        'second'
    );

    const handleInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
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
    };

    const handleMultiInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value }
        } = event;
        if (hour || minute || second) {
            setHour(convertToFormat(hour, hourFormat));
            setMinute(convertToFormat(minute, minuteFormat));
            showSeconds && setSecond(convertToFormat(second, secondFormat));
        }
        onBlur(`${hour}${hour && minute && ':'}${minute}${minute && second && ':'}${second}`, event);
    };

    const singleInputPopoverValue = showSeconds
        ? convertToFormat(second, secondFormat)
        : convertToFormat(minute, minuteFormat);

    const handleIconClick = () => childRef.current && !readOnly && !disabled && childRef.current.toggleOpen();

    return (
        <div
            className={classnames('time-picker-holder', className, {
                'read-only': readOnly,
                mobile: isMobile,
                disabled
            })}
        >
            {appearance === 'multipleInputs' ? (
                <ul>
                    <li className="no-shrink icon-holder">
                        {/* @ts-ignore */}
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
                                // @ts-ignore
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
                                // @ts-ignore
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
                                {/* @ts-ignore */}
                                <TimePickerPopover
                                    value={secondPopupValue}
                                    toggleHandler={handleSecondPopover}
                                    Content={seconds}
                                    readOnly={readOnly}
                                    positions={positions}
                                >
                                    <ValidatableNumberInput
                                        // @ts-ignore
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
                    value={singleInputPopoverValue}
                    ref={childRef}
                    Content={
                        <ul className="time-picker-drop-holder">
                            <li className="time-picker-drop-hours">{hours}</li>
                            <li className="time-picker-drop-minutes">{minutes}</li>
                            {showSeconds && <li className="time-picker-drop-seconds">{seconds}</li>}
                        </ul>
                    }
                    positions={positions}
                >
                    <ExtendedInput
                        // @ts-ignore
                        className="time-picker-single-input"
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
                        onBlur={handleInputBlur}
                        onIconClick={handleIconClick}
                        clickableIcon
                        {...restProps}
                    />
                </TimePickerPopover>
            )}
        </div>
    );
};

export { ITimePickerProps, TimePicker as default };
