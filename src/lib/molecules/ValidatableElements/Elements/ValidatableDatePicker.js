import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { getBrowserDateFormat, validateDatePickerField, validateTimePickerField, noop } from 'utils';
import { useMount } from 'hooks';

// Components
import DatePickerInput from '../../DatePickerInput';

const EMPTY_OBJECT = {};

const DatePicker = forwardRef(
    (
        {
            onChange,
            value,
            isValid,
            required,
            isFieldValid,
            withRange,
            min,
            max,
            format,
            withTime,
            onBlur,
            forceAllowValidation,
            ...restProps
        },
        ref
    ) => {
        const localValue = value || (withRange ? [null, null] : null);

        const checkValidation = useCallback(
            (value) => {
                const validFormat = format || getBrowserDateFormat(!!withTime);
                // We need null, because other values `dayjs` turns to valid date
                const formatted = withRange ? [value[0] || null, value[1] || null] : value;

                const { isValid: isValidDate, key: dateKey } = validateDatePickerField(
                    formatted,
                    required,
                    isValid,
                    min,
                    max,
                    validFormat
                );
                const { isValid: isValidTime = true, key: timeKey = null } =
                    !withTime || !validFormat.split(' ')[1]
                        ? EMPTY_OBJECT
                        : validateTimePickerField(required, isValid, min, max, validFormat, formatted);

                return {
                    isValid: isValidDate && isValidTime,
                    key: dateKey || timeKey || null
                };
            },
            [required, isValid, min, max, format, withTime, withRange]
        );

        const [validationState, setValidationState] = useState(true);
        const [allowValidation, setAllowValidation] = useState(false);

        const handleChange = useCallback(
            (value) => {
                const validation = checkValidation(value);

                setValidationState(validation.isValid);
                onChange && onChange(value, validation.isValid, validation.key);
            },
            [checkValidation, onChange]
        );

        // we use this because need to show field validation after onBlur
        const onClickOutside = useCallback(() => setAllowValidation(true), []);

        const handleBlur = useCallback(
            (e) => {
                setAllowValidation(true);
                onBlur(e);
            },
            [onBlur]
        );

        useEffect(() => {
            setValidationState(checkValidation(localValue).isValid);
        }, [localValue, required, min, max]);

        // need this for handling user's `isValid` prop
        useEffect(() => {
            setValidationState(isValid);
        }, [isValid]);

        // call function when validation state changes
        useEffect(() => {
            isFieldValid(validationState);
        }, [validationState]);

        // set Allow validation true if submit button clicked
        useEffect(() => {
            forceAllowValidation && setAllowValidation(true);
        }, [forceAllowValidation]);

        useMount(() => setValidationState(checkValidation(localValue).isValid));

        return withRange ? (
            <DatePickerInput.WithRange
                ref={ref}
                min={min}
                max={max}
                value={value}
                isValid={!allowValidation || validationState}
                onChange={handleChange}
                format={format}
                onClickOutside={onClickOutside}
                withTime={withTime}
                required={required}
                onBlur={handleBlur}
                {...restProps}
            />
        ) : (
            <DatePickerInput
                ref={ref}
                min={min}
                max={max}
                value={value}
                isValid={!allowValidation || validationState}
                onChange={handleChange}
                format={format}
                onClickOutside={onClickOutside}
                required={required}
                onBlur={handleBlur}
                {...restProps}
            />
        );
    }
);

DatePicker.propTypes = {
    /**
     * Value for date picker
     */
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    /**
     * Callback fires when date changes
     */
    onChange: PropTypes.func,
    /**
     * Callback fires when input blur
     */
    onBlur: PropTypes.func,
    /**
     * Define is field required or no.
     */
    required: PropTypes.bool,
    /**
     * Define is range picker with time or no
     */
    withTime: PropTypes.bool,
    /**
     * Define is single date picker or with range
     */
    withRange: PropTypes.bool,
    /**
     * Callback fires when field validation state changes
     */
    isFieldValid: PropTypes.func,
    /**
     * Additional validation state
     */
    isValid: PropTypes.bool,
    /**
     * Minimum date value
     */
    min: PropTypes.string,
    /**
     * Maximum date value
     */
    max: PropTypes.string,
    /**
     * Date format
     */
    format: PropTypes.string,
    /**
     * Allow validation without onBlur, validate field when mount
     */
    forceAllowValidation: PropTypes.bool
};

DatePicker.defaultProps = {
    isValid: true,
    onBlur: noop,
    isFieldValid: noop
};

export default DatePicker;
