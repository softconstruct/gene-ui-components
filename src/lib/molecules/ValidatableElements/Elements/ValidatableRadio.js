import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { noop } from 'utils';
import { useMount } from 'hooks';

// Components
import RadioGroup from '../../RadioGroup';

function checkValidation(required, isValid, value = '') {
    if (isValid === false) return { key: 'customValidation', isValid: false };
    if (required && (!value || value.length === 0)) return { key: 'required', isValid: false };

    return { key: null, isValid: true };
}

const Radio = forwardRef((props, ref) => {
    const { onChange, value, isValid, required, isFieldValid, forceAllowValidation, ...restProps } = props;

    const isControlled = 'value' in props && typeof value !== 'undefined';

    const [validationState, setValidationState] = useState(true);
    const [allowValidation, setAllowValidation] = useState(false);

    const validate = useCallback(() => checkValidation(required, isValid, value).isValid, [value, required, isValid]);

    const handleChange = useCallback(
        (e) => {
            const { value } = e.target;
            const validation = checkValidation(required, isValid, value);

            setValidationState(validation.isValid);
            onChange(e, validation.isValid, validation.key);
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
        <RadioGroup
            ref={ref}
            value={value}
            isValid={!allowValidation || validationState}
            onChange={handleChange}
            onBlur={onBlur}
            {...restProps}
        />
    );
});

Radio.propTypes = {
    /**
     * Value for radio field
     */
    value: PropTypes.string,
    /**
     * Callback fires when radio field changes
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

Radio.defaultProps = {
    isValid: true,
    isFieldValid: noop,
    onChange: noop
};

export default Radio;
