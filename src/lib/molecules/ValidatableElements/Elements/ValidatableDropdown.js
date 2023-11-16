import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useMount } from 'hooks';
import { noop } from 'utils';

import Dropdown from '../../../organisms/Dropdown';

function checkValidation(required, isValid, value) {
    if (isValid === false) return { key: 'customValidation', isValid: false };
    if ((value === 'undefined' || value === null) && required) return { key: 'required', isValid: false };

    return { key: null, isValid: true };
}

const DropdownField = forwardRef((props, ref) => {
    const { onChange, value, isValid, required, isFieldValid, forceAllowValidation, valueKey, ...restProps } = props;

    const isControlled = 'value' in props && typeof value !== 'undefined';

    const [val, setVal] = useState(value || null);

    const [validationState, setValidationState] = useState(true);
    const [allowValidation, setAllowValidation] = useState(false);

    const validate = useCallback(() => checkValidation(required, isValid, val).isValid, [val, required, isValid]);

    const handleChange = useCallback(
        (param) => {
            const { [valueKey]: value = null } = param || {};
            const validation = checkValidation(required, isValid, value);

            setValidationState(validation.isValid);
            setVal(value);

            onChange(param, validation.isValid, validation.key);
        },
        [onChange, required, isValid, valueKey]
    );

    // we use this because need to show field validation after onClose
    const onBlur = useCallback(() => setAllowValidation(true), []);

    const onClear = useCallback(() => {
        const validState = checkValidation(required, isValid, null).isValid;

        setValidationState(validState);
    }, [required, isValid]);

    useEffect(() => {
        isControlled && setValidationState(validate());
    }, [isControlled, validate]);

    useEffect(() => {
        setVal(value);
    }, [value]);

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
        <Dropdown
            required={required}
            ref={ref}
            value={val}
            isValid={!allowValidation || validationState}
            onChange={handleChange}
            onBlur={onBlur}
            onClear={onClear}
            valueKey={valueKey}
            {...restProps}
        />
    );
});

DropdownField.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    isValid: PropTypes.bool,
    forceAllowValidation: PropTypes.bool,
    isFieldValid: PropTypes.func
};

DropdownField.defaultProps = {
    required: false,
    readOnly: false,
    valueKey: 'value',
    isFieldValid: noop,
    onChange: noop
};

export default DropdownField;
