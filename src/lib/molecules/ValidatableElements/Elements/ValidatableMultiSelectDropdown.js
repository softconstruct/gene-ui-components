import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useMount } from 'hooks';
import { noop } from 'utils';

import Dropdown from '../../../organisms/Dropdown';

function checkValidation(required, isValid, value, min, max) {
    const length = value?.length;
    if (isValid === false) return { key: 'customValidation', isValid: false };
    if (!length && required) return { key: 'required', isValid: false };
    if (min && length < min) return { key: 'min', isValid: false };
    if (max && length > max) return { key: 'max', isValid: false };

    return { key: null, isValid: true };
}

const MultiSelectDropdownField = forwardRef((props, ref) => {
    const { onChange, value, isValid, required, min, max, isFieldValid, valueKey, forceAllowValidation, ...restProps } =
        props;

    const isControlled = 'value' in props && typeof value !== 'undefined';

    const [val, setVal] = useState(value || []);

    const [validationState, setValidationState] = useState(true);
    const [allowValidation, setAllowValidation] = useState(false);

    const validate = useCallback(
        () => checkValidation(required, isValid, val, min, max).isValid,
        [required, isValid, val, min, max]
    );

    const handleChange = useCallback(
        (e) => {
            const validation = checkValidation(required, isValid, e, min, max);

            setValidationState(validation.isValid);
            setVal(e.map((item) => item[valueKey]));

            onChange && onChange(e, validation.isValid, validation.key);
        },
        [required, isValid, min, max, onChange, valueKey]
    );

    // we use this because need to show field validation after onClose
    const onBlur = useCallback(() => setAllowValidation(true), []);

    const onClear = useCallback(() => {
        const validState = checkValidation(required, isValid, []).isValid;

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
            isMultiSelect
            isValid={!allowValidation || validationState}
            onChange={handleChange}
            onBlur={onBlur}
            valueKey={valueKey}
            onClear={onClear}
            {...restProps}
        />
    );
});

MultiSelectDropdownField.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    valueKey: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    isValid: PropTypes.bool,
    forceAllowValidation: PropTypes.bool,
    isFieldValid: PropTypes.func
};

MultiSelectDropdownField.defaultProps = {
    required: false,
    readOnly: false,
    isFieldValid: noop,
    valueKey: 'value'
};

export default MultiSelectDropdownField;
