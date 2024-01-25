import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';

// Helpers
import { inputConfig, popoverConfig } from 'configs';
import { getBrowserDateFormat, noop, stopEvent } from 'utils';
import { useClick, useDeviceType, useKeyDown } from 'hooks';
import { dayjsWithPlugins } from 'wrappers';

// Components
import Popover from '../../atoms/PopoverV2';
import ExtendedInput from '../ExtendedInput';
import DatePicker from '../../organisms/DatePicker';

function getLastValidValue(startDate, endDate, validFormat, rangeSeparator) {
    if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
        return `${startDate.format(validFormat)}${rangeSeparator}${endDate.format(validFormat)}`;
    }

    return '';
}

const rangeSeparator = ' — ';

function DateRangePickerInput({
    startTimePlaceholder,
    startDatePlaceholder,
    endDatePlaceholder,
    endTimePlaceholder,
    defaultStartTime,
    defaultEndTime,
    withoutPicker,
    popoverAlign,
    flexibility,
    placeholder,
    pickerProps,
    appearance,
    className,
    withTime,
    onChange,
    required,
    disabled,
    readOnly,
    isValid,
    onFocus,
    format,
    onBlur,
    title,
    value,
    size,
    max,
    min,
    isIncludeEndDateLastSecond,
    markedDate,
    frozenDateRange,
    clearable,
    ...restProps
}) {
    const { isMobile } = useDeviceType();

    const maxDate = max && dayjsWithPlugins(max);
    const minDate = min && dayjsWithPlugins(min);

    const validFormat = useMemo(
        () => (isMobile ? (withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') : format || getBrowserDateFormat(!!withTime)),
        [isMobile, withTime, format]
    );

    const [inputValue, setInputValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [mobileStartDate, setMobileStartDate] = useState('');
    const [mobileEndDate, setMobileEndDate] = useState('');
    const [mobileStartTime, setMobileStartTime] = useState('');
    const [mobileEndTime, setMobileEndTime] = useState('');

    const [popoverOpened, setPopoverState] = useState(false);

    const inputRef = useRef();

    const setPickerRef = useClick((e) => {
        e.preventDefault();
    });

    const setMobileDate = useCallback((start, end) => {
        setMobileStartDate(start ? start.format('YYYY-MM-DD') : '');
        setMobileEndDate(end ? end.format('YYYY-MM-DD') : '');
        setMobileStartTime(start ? start.format('HH:mm') : '');
        setMobileEndTime(end ? end.format('HH:mm') : '');
    }, []);

    const handleDateValidation = useCallback(
        (first, second, value) => {
            const startDateLocal = dayjsWithPlugins(first, validFormat);
            const endDateLocal = dayjsWithPlugins(second, validFormat);
            const isStartDateValid = startDateLocal.isValid() && startDateLocal.format(validFormat) === first;
            const isEndDateValid = endDateLocal.isValid() && endDateLocal.format(validFormat) === second;

            if (frozenDateRange.length && Array.isArray(frozenDateRange)) {
                const format = 'YYYY/MM/DD';

                const isValid = !frozenDateRange.find(
                    ({ from, to }) =>
                        from &&
                        to &&
                        (startDateLocal.isBetween(dayjs(from).format(format), dayjs(to).format(format), 'day', '[]') ||
                            endDateLocal.isBetween(dayjs(from).format(format), dayjs(to).format(format), 'day', '[]'))
                );

                if (!isValid) {
                    return [null, null];
                }
            }

            if (isStartDateValid && isEndDateValid && dayjsWithPlugins(startDateLocal).isAfter(endDateLocal)) {
                const diff = endDate && startDate ? dayjsWithPlugins(endDate).diff(startDate, 'm') : 0;

                const changedDate = dayjsWithPlugins(startDateLocal).isSame(startDate)
                    ? {
                          start: endDateLocal.subtract(diff, 'minute'),
                          end: endDateLocal
                      }
                    : {
                          start: startDateLocal,
                          end: startDateLocal.add(diff, 'minute')
                      };

                setStartDate(changedDate.start);
                setEndDate(changedDate.end);
                return [changedDate.start, changedDate.end];
            }
            if (isStartDateValid && isEndDateValid) {
                setStartDate(startDateLocal);
                setEndDate(endDateLocal);
                return [startDateLocal, endDateLocal];
            }
            if (!required && value === '') {
                setStartDate('');
                setEndDate('');

                return [null, null];
            }
        },
        [frozenDateRange, validFormat, endDate, startDate, required]
    );

    const handleRangeChange = useCallback(
        (value) => {
            const [startDate, endDate] = value;
            if (startDate && endDate) {
                const start = dayjsWithPlugins(startDate);
                const end = dayjsWithPlugins(endDate);

                setStartDate(start);
                setEndDate(end);

                if (!withTime) {
                    inputRef.current.blur();
                    setPopoverState(false);
                }

                setInputValue(`${start.format(validFormat)}${rangeSeparator}${end.format(validFormat)}`);
                onChange(value);
            }
        },
        [validFormat, rangeSeparator, onChange, withTime]
    );

    const handleInputChange = useCallback(
        (e) => {
            let { value } = e.target;
            if (
                value?.length >= validFormat?.length &&
                !value?.includes(rangeSeparator) &&
                inputValue?.length < value?.length
            ) {
                value = `${value}${rangeSeparator}`;
            }

            const [startDate = null, endDate = null] = value.split(rangeSeparator.trim());

            const dates = handleDateValidation(startDate?.trim(), endDate?.trim(), value);

            if (dates && dates[0] && dates[1]) {
                onChange([dates[0].toDate(), dates[1].toDate()]);
            }

            setInputValue(value);
            return dates;
        },
        [onChange, handleDateValidation, inputValue]
    );

    const handleMobileDateChange = useCallback(
        (e, index) => {
            const isStart = index === 0;
            const { value } = e.target;
            const date = dayjsWithPlugins(value);

            const start = isStart ? value : mobileStartDate || date.subtract(1, 'day').format('YYYY-MM-DD');
            const end = !isStart ? value : mobileEndDate || date.add(1, 'day').format('YYYY-MM-DD');
            const startTime = mobileStartTime || defaultStartTime;
            const endTime = mobileEndTime || defaultEndTime;

            const fullStartDate = withTime
                ? `${start} ${startTime}${rangeSeparator}${end} ${endTime}`
                : `${start}${rangeSeparator}${end}`;
            const [first, second] =
                handleInputChange({
                    target: { value: fullStartDate }
                }) || [];

            setMobileStartDate(first?.format('YYYY-MM-DD'));
            setMobileEndDate(second?.format('YYYY-MM-DD'));
            setMobileStartTime(startTime);
            setMobileEndTime(endTime);
        },
        [
            mobileStartDate,
            mobileEndDate,
            mobileStartTime,
            defaultStartTime,
            mobileEndTime,
            defaultEndTime,
            withTime,
            rangeSeparator,
            handleInputChange
        ]
    );

    const handleMobileTimeChange = useCallback(
        (e, index) => {
            const isStart = index === 0;
            const { value } = e.target;
            const date = dayjsWithPlugins();

            const startTime = isStart ? value : mobileStartTime || defaultStartTime;
            const endTime = !isStart ? value : mobileEndTime || defaultEndTime;
            const start = mobileStartDate || date.format('YYYY-MM-DD');
            const end = mobileEndDate || date.add(1, 'day').format('YYYY-MM-DD');

            if (startTime && endTime) {
                const [first, second] = handleInputChange({
                    target: {
                        value: `${start} ${startTime}${rangeSeparator}${end} ${endTime}`
                    }
                });

                setMobileStartDate(first.format('YYYY-MM-DD'));
                setMobileEndDate(second.format('YYYY-MM-DD'));
                setMobileStartTime(first.format('HH:mm'));
                setMobileEndTime(second.format('HH:mm'));
            } else {
                endTime && setMobileStartTime(startTime);
                startTime && setMobileEndTime(endTime);
            }
        },
        [
            mobileStartTime,
            defaultStartTime,
            mobileEndTime,
            defaultEndTime,
            mobileStartDate,
            mobileEndDate,
            handleInputChange,
            rangeSeparator
        ]
    );

    const checkDateInerval = useCallback(
        (validDate) => {
            if (!validDate) {
                return null;
            }

            let value = dayjs(validDate, validFormat);
            const minUnix = minDate && minDate.valueOf();
            const maxUnix = maxDate && maxDate.valueOf();
            const dateUnix = value && value.valueOf();

            if (minUnix > dateUnix) {
                value = minUnix;
            } else if (maxUnix < dateUnix) {
                value = maxUnix;
            }

            return dayjs(value);
        },
        [validFormat, maxDate, minDate]
    );

    const handleBlur = useCallback(
        (e) => {
            const lastValidValue = getLastValidValue(startDate, endDate, validFormat, rangeSeparator);
            setInputValue(lastValidValue);
            setPopoverState(false);
            onBlur(e);
            if (lastValidValue) {
                handleRangeChange([
                    checkDateInerval(startDate.format(validFormat)),
                    checkDateInerval(endDate.format(validFormat))
                ]);
            } else {
                onChange([null, null]);
            }
        },
        [startDate, endDate, validFormat, rangeSeparator, onBlur, handleRangeChange, checkDateInerval, onChange]
    );

    const handleFocus = useCallback(
        (e) => {
            setPopoverState(true);
            onFocus(e);
        },
        [onFocus]
    );

    const handleOnApply = useCallback(
        (e) => {
            pickerProps?.onApply(e);
            setPopoverState(false);
        },
        [pickerProps]
    );

    const handleIconClick = useCallback(
        (e, isBlurInitiatorCalendarIcon) => {
            e.stopPropagation();
            e.preventDefault();

            if (!popoverOpened && !isBlurInitiatorCalendarIcon) {
                inputRef.current.focus();
            }
        },
        [popoverOpened]
    );

    useEffect(() => {
        const [first, second] = value;
        const startDate = dayjsWithPlugins(first);
        const endDate = dayjsWithPlugins(second);

        if (first && second) {
            setStartDate(dayjsWithPlugins(startDate, validFormat));
            setEndDate(dayjsWithPlugins(endDate, validFormat));

            isMobile && setMobileDate(startDate, endDate);

            setInputValue(`${startDate.format(validFormat)}${rangeSeparator}${endDate.format(validFormat)}`);
        } else if (first === null && second === null) {
            setStartDate('');
            setEndDate('');

            isMobile && setMobileDate();

            setInputValue('');
        }
    }, [value, validFormat, isMobile]);

    useKeyDown(() => setPopoverState(false), [], { current: window }, ['Escape']);

    const onClear = useCallback(() => onChange([null, null]), []);

    const sharedProps = {
        appearance,
        inputSize: size,
        disabled,
        readOnly,
        required,
        onClear,
        canClear: clearable,
        ...restProps
    };

    const dynamicProps = {};

    if (isIncludeEndDateLastSecond) {
        // @TODO need move to separated file
        // add constants available for all lib components
        // as this constant value also used in organisms
        dynamicProps.defaultTimeValues = [
            ['00', '00', '00'],
            ['00', '00', '00']
        ];
    }

    return isMobile ? (
        <div className="mobile-date-ranges-holder">
            {placeholder && <div className="md-range-title">{placeholder}</div>}
            <div
                className={classnames('mobile-date-ranges-picker', {
                    'with-time': withTime
                })}
            >
                <ExtendedInput
                    type="date"
                    label="From"
                    isValid={isValid}
                    onBlur={handleBlur}
                    itemsDirection="end"
                    onFocus={handleFocus}
                    value={mobileStartDate}
                    className="m-start-date"
                    placeholder={startDatePlaceholder}
                    onKeyDown={(e) => stopEvent(e, true)}
                    icon={readOnly ? '' : 'bc-icon-calendar'}
                    onChange={(e) => handleMobileDateChange(e, 0)}
                    {...sharedProps}
                />
                <ExtendedInput
                    label="To"
                    type="date"
                    isValid={isValid}
                    onBlur={handleBlur}
                    itemsDirection="end"
                    onFocus={handleFocus}
                    value={mobileEndDate}
                    className="m-end-date"
                    placeholder={endDatePlaceholder}
                    onKeyDown={(e) => stopEvent(e, true)}
                    icon={readOnly ? '' : 'bc-icon-calendar'}
                    onChange={(e) => handleMobileDateChange(e, 1)}
                    {...sharedProps}
                />
                {withTime && (
                    <>
                        <ExtendedInput
                            type="time"
                            label="Time"
                            isValid={isValid}
                            value={mobileStartTime}
                            className="m-start-time"
                            placeholder={startTimePlaceholder}
                            icon={readOnly ? '' : 'bc-icon-clock'}
                            onChange={(e) => handleMobileTimeChange(e, 0)}
                            {...sharedProps}
                        />
                        <ExtendedInput
                            type="time"
                            label="Time"
                            isValid={isValid}
                            value={mobileEndTime}
                            className="m-end-time"
                            placeholder={endTimePlaceholder}
                            icon={readOnly ? '' : 'bc-icon-clock'}
                            onChange={(e) => handleMobileTimeChange(e, 1)}
                            {...sharedProps}
                        />
                    </>
                )}
            </div>
        </div>
    ) : (
        <Popover
            behave="open"
            align={popoverAlign}
            isOpen={popoverOpened}
            extendTargetWidth={false}
            Content={
                !withoutPicker && (
                    <DatePicker.RangePicker
                        min={minDate}
                        max={maxDate}
                        value={value}
                        withApply={false}
                        ref={setPickerRef}
                        withTime={withTime}
                        rangeEndDefault={endDate}
                        onChange={handleRangeChange}
                        rangeStartDefault={startDate}
                        frozenDateRange={frozenDateRange}
                        className={classnames({
                            'pointer-events-none': readOnly
                        })}
                        {...pickerProps}
                        onApply={handleOnApply}
                        {...dynamicProps}
                        markedDate={markedDate}
                    />
                )
            }
        >
            <ExtendedInput
                label={title}
                clickableIcon
                ref={inputRef}
                isValid={isValid}
                value={inputValue}
                onBlur={handleBlur}
                itemsDirection="end"
                onFocus={handleFocus}
                flexibility={flexibility}
                placeholder={placeholder}
                onChange={handleInputChange}
                icon={readOnly ? '' : 'bc-icon-calendar'}
                onIconClick={handleIconClick}
                className={classnames(className, 'date-input', {
                    'default-cursor': readOnly,
                    'clearable-date-picker': clearable
                })}
                autoComplete="off"
                {...sharedProps}
            />
        </Popover>
    );
}

const { flexibility, appearance: appearances, size } = inputConfig;

DateRangePickerInput.propTypes = {
    /**
     * Controls appearance of input element
     */
    appearance: PropTypes.oneOf(appearances),
    /**
     * Placeholder text for input
     */
    placeholder: PropTypes.string,
    /**
     * Title for input
     */
    title: PropTypes.string,
    /**
     * The CSS class name of the wrapper element.
     */
    className: PropTypes.string,
    /**
     * Custom date format
     */
    format: PropTypes.string,
    /**
     * Controls flexibility of input element
     */
    flexibility: PropTypes.oneOf(flexibility),
    /**
     * Define range picker is with time or no.
     */
    withTime: PropTypes.bool,
    /**
     * If true, the input element will show icon which can reset selected date.
     */
    clearable: PropTypes.bool,
    /**
     * If true, the input element will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * 	It prevents the user from changing the value of the field.
     */
    readOnly: PropTypes.bool,
    /**
     * Callback fired when the value is changed.
     * function([startDate: Date, endDate: Date) => void
     */
    onChange: PropTypes.func,
    /**
     * Callback fired when the input looses focus.
     * function(e: Event) => void
     */
    onBlur: PropTypes.func,
    /**
     * Callback fired when the input get focused.
     * function(e: Event) => void
     */
    onFocus: PropTypes.func,
    /**
     * The value of the input element, required for a controlled component.
     */
    value: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.instanceOf(dayjsWithPlugins)),
        PropTypes.arrayOf(PropTypes.instanceOf(Date)),
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number)
    ]),
    /**
     * If false, the input will indicate an error.
     */
    isValid: PropTypes.bool,
    /**
     *  Disables datepicker when input is focused
     */
    withoutPicker: PropTypes.bool,
    /**
     * Accepts same props as DatePicker component(organisms)
     */
    pickerProps: PropTypes.object,
    /**
     * Min specifies the minimum value allowed for datepicker
     */
    min: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjsWithPlugins),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Max specifies the maximum value allowed for datepicker
     */
    max: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjsWithPlugins),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Controls input size
     */
    size: PropTypes.oneOf(size),
    /**
     * Controls alignment of popover
     */
    popoverAlign: PropTypes.oneOf(popoverConfig.align),
    /**
     * Placeholder text for start date input, which is used in mobile version
     */
    startDatePlaceholder: PropTypes.string,
    /**
     * Placeholder text for end date input, which is used in mobile version
     */
    endDatePlaceholder: PropTypes.string,
    /**
     * Placeholder text for start time input, which is used in mobile version
     */
    startTimePlaceholder: PropTypes.string,
    /**
     * Placeholder text for end time input, which is used in mobile version
     */
    endTimePlaceholder: PropTypes.string,
    /**
     * Set default start time when date changed
     */
    defaultStartTime: PropTypes.string,
    /**
     * Set default end time when date changed
     */
    defaultEndTime: PropTypes.string,
    /**
     * Prop is responsible for add one second to end date time value in case of true parameter
     */
    isIncludeEndDateLastSecond: PropTypes.bool,
    /**
     * MarkedDate specifies the default mark date
     */
    markedDate: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Prop is responsible for disabling selected range
     */
    frozenDateRange: PropTypes.arrayOf(
        PropTypes.shape({
            from: PropTypes.oneOfType([
                PropTypes.instanceOf(dayjs),
                PropTypes.instanceOf(Date),
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
            to: PropTypes.oneOfType([
                PropTypes.instanceOf(dayjs),
                PropTypes.instanceOf(Date),
                PropTypes.string,
                PropTypes.number
            ]).isRequired
        })
    )
};

DateRangePickerInput.defaultProps = {
    popoverAlign: popoverConfig.align[1],
    placeholder: getBrowserDateFormat(),
    flexibility: flexibility[0],
    appearance: appearances[0],
    title: 'Datepicker',
    onChange: noop,
    size: size[1],
    onFocus: noop,
    onBlur: noop,
    value: [],
    defaultStartTime: '00:00',
    defaultEndTime: '00:00',
    startDatePlaceholder: 'Start date',
    endDatePlaceholder: 'End date',
    startTimePlaceholder: 'Start',
    endTimePlaceholder: 'End',
    isIncludeEndDateLastSecond: false,
    frozenDateRange: [],
    clearable: false
};

export default DateRangePickerInput;
