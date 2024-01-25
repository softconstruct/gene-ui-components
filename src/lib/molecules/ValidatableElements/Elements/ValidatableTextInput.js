import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { noop } from 'utils';
import { useMount } from 'hooks';

// Components
import ExtendedInput from '../../ExtendedInput';

const emailRegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function checkValidation(required, isValid, maxLength, minLength, isEmail, value = '') {
    const valueWithoutSpaces = value ? value.toString().trim() : value;

    if (isValid === false) return { key: 'customValidation', isValid: false };
    if (minLength && valueWithoutSpaces.length <= minLength) return { key: 'minLength', isValid: false };
    if (maxLength && valueWithoutSpaces.length >= maxLength) return { key: 'maxLength', isValid: false };
    if (valueWithoutSpaces.length > 0 && isEmail && !emailRegExp.test(valueWithoutSpaces))
        return { key: 'isEmail', isValid: false };
    if (required && valueWithoutSpaces.length === 0) return { key: 'required', isValid: false };

    return { key: null, isValid: true };
}

const TextInput = forwardRef((props, ref) => {
    const {
        onChange,
        value,
        isValid,
        onBlur,
        required,
        maxLength,
        minLength,
        isEmail,
        isFieldValid,
        forceAllowValidation,
        defaultValue,
        ...restProps
    } = props;

    const isControlled = 'value' in props && typeof value !== 'undefined';

    const [validationState, setValidationState] = useState(true);
    const [allowValidation, setAllowValidation] = useState(false);

    const validate = useCallback(
        (defaultValue) =>
            checkValidation(required, isValid, maxLength, minLength, isEmail, value || defaultValue).isValid,
        [value, required, isValid, maxLength, minLength, isEmail]
    );

    const handleChange = useCallback(
        (e) => {
            const { value } = e.target;
            const validation = checkValidation(required, isValid, maxLength, minLength, isEmail, value);

            setValidationState(validation.isValid);

            onChange && onChange(e, validation.isValid, validation.key);
        },
        [onChange, required, isValid, maxLength, minLength, isEmail]
    );

    // we use this because need to show field validation after onBlur
    const handleBlur = useCallback(
        (e) => {
            setAllowValidation(true);
            onBlur(e);
        },
        [onBlur]
    );

    useEffect(() => {
        isControlled && setValidationState(validate());
    }, [isControlled, validate]);

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

    useMount(() => setValidationState(validate(defaultValue)));

    return (
        <ExtendedInput
            {...restProps}
            ref={ref}
            value={value}
            isValid={!allowValidation || validationState}
            onChange={handleChange}
            required={required}
            defaultValue={defaultValue}
            onBlur={handleBlur}
        />
    );
});

TextInput.propTypes = {
    /**
     * Value for text input
     */
    value: PropTypes.string,
    /**
     * Callback fires when field changes
     */
    onChange: PropTypes.func,
    /**
     * Callback fires when field blured
     */
    onBlur: PropTypes.func,
    /**
     *  Define is field required or no.
     */
    required: PropTypes.bool,
    /**
     * Is field accept only email or no
     */
    isEmail: PropTypes.bool,
    /**
     * Maximum length of value
     */
    maxLength: PropTypes.number,
    /**
     * Minimum length of value
     */
    minLength: PropTypes.number,
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
    forceAllowValidation: PropTypes.bool
};

TextInput.defaultProps = {
    isValid: true,
    isFieldValid: noop,
    onBlur: noop
};

export default TextInput;
