import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';
import { useMount } from 'hooks';

import Switcher from '../../../atoms/Switcher';

function checkValidation(value, required, isValid) {
    if (required && !value) return { key: 'required', isValid: false };
    if (isValid === false) return { key: 'customValidation', isValid: false };

    return { key: null, isValid: true };
}

const SwitcherElement = forwardRef((props, ref) => {
    const { onChange, isValid, required, isFieldValid, forceAllowValidation, ...restProps } = props;

    const isControlled = 'checked' in props;

    const [validationState, setValidationState] = useState(true);
    const [allowValidation, setAllowValidation] = useState(false);
    const [value, setValue] = useState(false);

    const localValue = isControlled ? props.checked : value;

    const validate = useCallback(
        () => checkValidation(localValue, required, isValid).isValid,
        [localValue, required, isValid]
    );

    const handleChange = useCallback(
        (e) => {
            const validation = checkValidation(e.target.checked, required, isValid);

            setAllowValidation(true);
            !isControlled && setValidationState(validation.isValid);
            setValue(e.target.checked);
            onChange(e, validation.isValid, validation.key);
        },
        [required, isValid, isControlled, onChange]
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

    useMount(() => setValidationState(validate()));

    return (
        <Switcher
            ref={ref}
            isValid={!allowValidation || validationState}
            onChange={handleChange}
            required={required}
            {...restProps}
        />
    );
});

SwitcherElement.propTypes = {
    onChange: PropTypes.func,
    required: PropTypes.bool,
    checked: PropTypes.bool,
    isFieldValid: PropTypes.func,
    isValid: PropTypes.bool,
    forceAllowValidation: PropTypes.bool
};

SwitcherElement.defaultProps = {
    isValid: true,
    isFieldValid: noop,
    onChange: noop
};

export default SwitcherElement;
