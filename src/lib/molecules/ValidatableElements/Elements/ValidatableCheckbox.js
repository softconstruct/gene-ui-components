import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { noop, interceptValue } from 'utils';
import { useMount } from 'hooks';

import Checkbox from '../../Checkbox';

function checkValidation(required, isValid, checked) {
    if (isValid === false) return { key: 'customValidation', isValid: false };
    if (required && !checked) return { key: 'required', isValid: false };

    return { key: null, isValid: true };
}

const CheckboxField = forwardRef((props, ref) => {
    const { onChange, value, isValid, required, isFieldValid, forceAllowValidation, ...restProps } = props;

    const isControlled = 'value' in props && typeof value !== 'undefined';

    const [validationState, setValidationState] = useState(true);
    const [checked, setChecked] = useState(false);
    const [allowValidation, setAllowValidation] = useState(false);

    const validate = useCallback(
        () => checkValidation(required, isValid, checked).isValid,
        [checked, required, isValid]
    );

    const handleChange = useCallback(
        (e) => {
            const { checked } = e.target;
            const { isValid: isCheckboxValid, key } = checkValidation(required, isValid, checked);

            setValidationState(isCheckboxValid);
            setChecked(checked);
            onChange(interceptValue(e, value), isCheckboxValid, key);
        },
        [onChange, required, isValid]
    );

    // we use this because need to show field validation after onBlur
    const onBlur = useCallback(() => setAllowValidation(true), []);

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

    useMount(() => setValidationState(validate()));

    return (
        <Checkbox
            required={required}
            ref={ref}
            value={value}
            isValid={!allowValidation || validationState}
            onChange={handleChange}
            onBlur={onBlur}
            {...restProps}
        />
    );
});

CheckboxField.propTypes = {
    /**
     * Value for checkbox
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    /**
     * Callback fires when checkbox changes
     */
    onChange: PropTypes.func,
    /**
     * Define is field required or no.
     */
    required: PropTypes.bool,
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

CheckboxField.defaultProps = {
    isValid: true,
    isFieldValid: noop,
    onChange: noop
};

export default CheckboxField;
