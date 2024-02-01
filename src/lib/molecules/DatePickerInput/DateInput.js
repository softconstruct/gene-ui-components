import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';

// Helpers
import { inputConfig, popoverConfig } from 'configs';
import { noop, stopEvent } from 'utils';
import { dayjsWithPlugins } from 'wrappers';
import { useClick, useDeviceType, useKeyDown } from 'hooks';

// Components
import Popover from '../../atoms/PopoverV2';
import ExtendedInput from '../ExtendedInput';
import DatePicker from '../../organisms/DatePicker';

const getLastValidValue = (date, validFormat) => (date && date.isValid() ? date.format(validFormat) : '');

function DatePickerInput({
    min,
    max,
    size,
    title,
    value,
    onBlur,
    onFocus,
    isValid,
    required,
    onChange,
    readOnly,
    disabled,
    className,
    appearance,
    pickerProps,
    flexibility,
    popoverAlign,
    withoutPicker,
    withTime,
    format: dateFormat,
    placeholder: inputPlaceholder,
    markedDate,
    frozenDateRange,
    clearable,
    ...restProps
}) {
    const { isMobile } = useDeviceType();

    const maxDate = max && dayjsWithPlugins(max);
    const minDate = min && dayjsWithPlugins(min);

    const mobileFormat = useMemo(() => (withTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'), [withTime]);
    const defaultFormat = useMemo(() => (withTime ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY'), [withTime]);
    const format = useMemo(() => dateFormat || defaultFormat, [dateFormat, defaultFormat]);
    const placeholder = useMemo(() => inputPlaceholder || format, [inputPlaceholder, format]);
    const validFormat = useMemo(() => (isMobile ? mobileFormat : format), [isMobile, mobileFormat, format]);

    const [date, setDate] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [popoverOpened, setPopoverState] = useState(false);

    const setPickerRef = useClick((e) => {
        e.preventDefault();
    });
    const inputRef = useRef();

    const handleChange = useCallback(
        (value) => {
            const date = dayjsWithPlugins(value);

            if (!withTime) {
                setPopoverState(false);
                inputRef.current.blur();
            }

            setDate(date);
            onChange(date.toDate());
            setInputValue(date.format(validFormat));
        },
        [validFormat, withTime, onChange]
    );

    const handleInputChange = useCallback(
        (e) => {
            const { value } = e.target;

            const isPM = dayjs(value.toLocaleLowerCase().replace('am', '').replace('pm', '')).hour() >= 12;

            const customValue = isPM ? value.replace('am', 'PM') : value.replace('pm', 'AM');

            let isFrozenDate = false;
            const date = dayjsWithPlugins(customValue, validFormat);
            const isValid = dayjs(date).format(validFormat) === customValue;

            if (frozenDateRange.length && Array.isArray(frozenDateRange)) {
                const format = 'YYYY/MM/DD';

                isFrozenDate = !!frozenDateRange.find(
                    ({ from, to }) =>
                        from && to && date.isBetween(dayjs(from).format(format), dayjs(to).format(format), 'day', '[]')
                );
            }

            if (!isFrozenDate) {
                if (isValid) {
                    setDate(date);
                    onChange(date.toDate());
                } else if (!required && value === '') {
                    setDate('');
                    onChange(null);
                }
            }
            setInputValue(value);
        },
        [frozenDateRange, validFormat, onChange, required]
    );

    const checkDateInerval = useCallback(() => {
        let value = getLastValidValue(date, validFormat);

        if (!value) {
            return null;
        }

        const minUnix = minDate && minDate.valueOf();
        const maxUnix = maxDate && maxDate.valueOf();
        const dateUnix = date && dayjs(date, validFormat).valueOf();

        if (value) {
            if (minUnix > dateUnix) {
                value = minDate.format(validFormat);
            } else if (maxUnix < dateUnix) {
                value = maxDate.format(validFormat);
            }
        }

        handleInputChange({ target: { value } });
    }, [date, validFormat, minDate, maxDate, handleInputChange]);

    const handleBlur = useCallback(
        (e) => {
            onBlur(e);
            setPopoverState(false);
            checkDateInerval();
        },
        [onBlur, checkDateInerval]
    );

    const handleFocus = useCallback(
        (e) => {
            setPopoverState(true);
            onFocus(e);
        },
        [onFocus]
    );

    const handleIconClick = useCallback(
        (e, isBlurInitiatorCalendarIcon) => {
            e.stopPropagation();
            e.preventDefault();

            if ((!popoverOpened && !isBlurInitiatorCalendarIcon) || withoutPicker) {
                inputRef.current.focus();
            }
        },
        [popoverOpened, withoutPicker]
    );

    useEffect(() => {
        const date = dayjsWithPlugins(value);

        if (value) {
            setDate(dayjsWithPlugins(date, validFormat));
            setInputValue(date.format(validFormat));
        } else if (value === null) {
            setDate('');
            setInputValue('');
        }
    }, [value, validFormat]);

    useKeyDown(() => setPopoverState(false), [], { current: window }, ['Escape']);

    const sharedProps = {
        flexibility,
        placeholder,
        appearance,
        label: title,
        isValid,
        inputSize: size,
        disabled,
        readOnly,
        required,
        ref: inputRef,
        canClear: clearable,
        ...restProps
    };

    /* *** Mobile functions *** */
    const mobileValue = useMemo(() => {
        const val = value || inputValue;
        return val ? dayjs(val).format(withTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD') : '';
    }, [withTime, value, inputValue]);

    const mobileInputType = useMemo(() => (withTime ? 'datetime-local' : 'date'), [withTime]);

    const handleMobileChange = useCallback(
        (event) => {
            const { value } = event.target;
            withTime
                ? handleChange(value)
                : handleInputChange({
                      target: { value }
                  });
        },
        [handleChange, handleInputChange, withTime]
    );

    return isMobile ? (
        <ExtendedInput
            value={mobileValue}
            itemsDirection="end"
            onKeyDown={stopEvent}
            type={mobileInputType}
            onChange={handleMobileChange}
            className="mobile-single-date-picker"
            icon={readOnly ? '' : 'bc-icon-calendar'}
            {...sharedProps}
        />
    ) : (
        <Popover
            behave="open"
            align={popoverAlign}
            isOpen={popoverOpened}
            extendTargetWidth={false}
            Content={
                !withoutPicker && (
                    <DatePicker
                        value={date}
                        min={minDate}
                        max={maxDate}
                        ref={setPickerRef}
                        withTime={withTime}
                        format={validFormat}
                        defaultValue={value}
                        defaultPreview={date}
                        onChange={handleChange}
                        onTimeChange={handleChange}
                        className={readOnly ? 'pointer-events-none' : ''}
                        {...pickerProps}
                        markedDate={markedDate}
                        frozenDateRange={frozenDateRange}
                        autoComplete="off"
                    />
                )
            }
        >
            <ExtendedInput
                clickableIcon
                value={inputValue}
                onBlur={handleBlur}
                itemsDirection="end"
                onFocus={handleFocus}
                onIconClick={handleIconClick}
                onChange={handleInputChange}
                icon={readOnly ? '' : 'bc-icon-calendar'}
                className={classnames(className, 'date-input', {
                    'default-cursor': readOnly,
                    'clearable-date-picker': clearable,
                    'text-cursor': withoutPicker
                })}
                {...sharedProps}
            />
        </Popover>
    );
}

const { flexibility, appearance: appearances, size } = inputConfig;

DatePickerInput.propTypes = {
    /**
     * Controls alignment of popover
     */
    popoverAlign: PropTypes.oneOf(popoverConfig.align),
    /**
     * Controls flexibility of input element
     */
    flexibility: PropTypes.oneOf(flexibility),
    /**
     * Controls appearance of input element
     */
    appearance: PropTypes.oneOf(appearances),
    /**
     * Placeholder text for input
     */
    placeholder: PropTypes.string,
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
     * The value of the input element, required for a controlled component.
     */
    value: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjsWithPlugins),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * The CSS class name of the wrapper element.
     */
    className: PropTypes.string,
    /**
     * Controls input size
     */
    size: PropTypes.oneOf(size),
    /**
     * Custom date format
     */
    format: PropTypes.string,
    /**
     * If true, the input element will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * 	It prevents the user from changing the value of the field.
     */
    readOnly: PropTypes.bool,
    /**
     * If true, the input element will show icon which can reset selected date.
     */
    clearable: PropTypes.bool,
    /**
     * Callback fired when the value is changed.
     * function(date: Date) => void
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
     * If false, the input will indicate an error.
     */
    isValid: PropTypes.bool,
    /**
     * Title for input
     */
    title: PropTypes.string,
    /**
     *  MarkedDate specifies the default mark date
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

DatePickerInput.defaultProps = {
    popoverAlign: popoverConfig.align[1],
    flexibility: flexibility[0],
    appearance: appearances[0],
    title: 'Datepicker',
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    size: size[1],
    frozenDateRange: [],
    clearable: false
};

export default DatePickerInput;
