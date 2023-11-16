import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';
import { useMount } from 'hooks';

import ExtendedInput from '../../ExtendedInput';

const validateMin = (value, min) => value >= min;
const validateMax = (value, max) => value <= max;
const validateFloat = (value, precisionMin, precisionMax) => {
    const decimalPlaces = (value.split('.')[1] || []).length;

    if (precisionMax && decimalPlaces > precisionMax) return false;

    return true;
};

function checkValidation(required, isValid, min, max, numberType, precisionMin, precisionMax, value = '') {
    const numberedValue = Number(value);

    if (isValid === false) return { key: 'customValidation', isValid: false };
    if (numberType === 'integer' && !Number.isInteger(numberedValue)) return { key: 'isInteger', isValid: false };
    if (numberType === 'float' && !validateFloat(value, precisionMin, precisionMax))
        return { key: 'isFloat', isValid: false };
    if (min != null && value && !validateMin(numberedValue, min)) return { key: 'min', isValid: false };
    if (max != null && value && !validateMax(numberedValue, max)) return { key: 'max', isValid: false };
    if (required && !value.length) return { key: 'required', isValid: false };

    return { key: null, isValid: true };
}

const NumberInput = forwardRef((props, ref) => {
    const {
        onBlur,
        required,
        isValid,
        numberType,
        precisionMin,
        precisionMax,
        min,
        max,
        onChange,
        value,
        isFieldValid,
        forceAllowValidation,
        forceValidateDuringChange,
        ...restProps
    } = props;

    const isControlled = 'value' in props && typeof value !== 'undefined';

    const [validationState, setValidationState] = useState(true);
    const [allowValidation, setAllowValidation] = useState(false);

    const validate = useCallback(
        () => checkValidation(required, isValid, min, max, numberType, precisionMin, precisionMax, value || '').isValid,
        [required, isValid, min, max, value, numberType, precisionMin, precisionMax]
    );

    const handleChange = useCallback(
        (e) => {
            const { value } = e.target;
            const validation = checkValidation(
                required,
                isValid,
                min,
                max,
                numberType,
                precisionMin,
                precisionMax,
                value
            );

            setValidationState(validation.isValid);

            onChange(e, validation.isValid, validation.key);

            forceValidateDuringChange && setAllowValidation(true);
        },
        [onChange, min, max, required, isValid, numberType, precisionMin, precisionMax, forceValidateDuringChange]
    );

    // we use this because need to show field validation after onBlur
    const handleBlur = useCallback(
        (e) => {
            onBlur(e);
            setAllowValidation(true);
        },
        [onBlur]
    );

    useEffect(() => {
        isControlled && setValidationState(validate());
    }, [isControlled, validate]);

    // this for handling required prop changes
    useEffect(() => {
        setValidationState(validate());
    }, [required]);

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

    useMount(() => setValidationState(validate()));

    return (
        <ExtendedInput
            min={min}
            max={max}
            ref={ref}
            value={value}
            isValid={!allowValidation || validationState}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            type="number"
            {...restProps}
        />
    );
});

NumberInput.propTypes = {
    /**
     * Maximum value
     */
    min: PropTypes.number,
    /**
     * Minimum value
     */
    max: PropTypes.number,
    /**
     * Value for number field
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Callback fires when field changes
     */
    onChange: PropTypes.func,
    /**
     * Callback fires when input loose focus
     */
    onBlur: PropTypes.func,
    /**
     * Callback fires when field validation state changes
     */
    isFieldValid: PropTypes.func,
    /**
     * Additional validation state
     */
    isValid: PropTypes.bool,
    /**
     * Allow validation without onBlur, validate field when mount
     */
    forceAllowValidation: PropTypes.bool,
    /**
     * Define number type
     */
    numberType: PropTypes.oneOf(['integer', 'float']),
    /**
     * Precision minimum count
     */
    precisionMin: PropTypes.number,
    /**
     * Precision maximum count
     */
    precisionMax: PropTypes.number,
    /**
     * We use this props if we need to show validation of a field during onChange
     */
    forceValidateDuringChange: PropTypes.bool
};

NumberInput.defaultProps = {
    isValid: true,
    precisionMin: 0,
    isFieldValid: noop,
    onChange: noop,
    onBlur: noop
};

export default NumberInput;
