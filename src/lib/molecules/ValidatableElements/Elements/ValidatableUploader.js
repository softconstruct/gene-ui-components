import React, { useCallback, useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { useMount } from 'hooks';

// Components
import Uploader from '../../Uploader';

function checkValidation(required, isValid, value = '') {
    if (isValid === false) return { key: 'customValidation', isValid: false };
    if (required && value.length === 0) return { key: 'required', isValid: false };

    return { key: null, isValid: true };
}

const UploaderField = forwardRef(
    (
        { customValidation, onChange, required, forceAllowValidation, isValid, value, defaultValue, ...restProps },
        ref
    ) => {
        const [validationState, setValidationState] = useState(true);
        const [allowValidation, setAllowValidation] = useState(false);

        const validate = useCallback(
            (defaultValue) => checkValidation(required, isValid, value || defaultValue).isValid,
            [value, required, isValid, defaultValue]
        );

        const handleChange = useCallback(
            (e) => {
                const { value } = e;
                const isValid = checkValidation(required, isValid, value);

                setValidationState(isValid);
                onChange && onChange(e, isValid);
            },
            [onChange, isValid, required, customValidation]
        );

        // set Allow validation true if submit button clicked
        useEffect(() => {
            forceAllowValidation && setAllowValidation(true);
        }, [forceAllowValidation]);

        useMount(() => setValidationState(validate(defaultValue)));

        return (
            <Uploader
                ref={ref}
                isValid={!allowValidation || validationState}
                onChange={handleChange}
                required={required}
                {...restProps}
            />
        );
    }
);

UploaderField.propTypes = {
    onChange: PropTypes.func,
    customValidation: PropTypes.func,
    /**
     * Additional validation state
     */
    isValid: PropTypes.bool
};

export default UploaderField;
