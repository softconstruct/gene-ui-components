import React, { useCallback, useState } from 'react';

// Helpers
import { guid, noop } from 'utils';
import { useMount } from 'hooks';
import { useFormContext } from './utils/context';

function Formable(WrappedComponent) {
    return function (props) {
        const { isFieldValid = noop, name: defaultName, onChange = noop, value } = props;

        const [_name, setName] = useState('');

        const {
            fields,
            readOnlyState,
            allowValidation,
            handleFieldMount,
            handleFieldUnMount,
            handleFieldChange,
            handleValidationChange
        } = useFormContext();

        // this function is called every time when validation changes
        const handleInitialState = (isValid) => {
            const field = fields.find((item) => item.name === _name);
            handleValidationChange({
                ...field,
                _name,
                isValid
            });

            isFieldValid(isValid);
        };

        // this function is called every time when value changes
        // need to handle this because form submit follows form changes
        const handleChange = useCallback(
            (e, isValid, key) => {
                // we need this check, because some fields return string not `event` object
                const value = e && e.target ? e.target.value : e;
                const field = fields.find((item) => item.name === _name);

                field &&
                    handleFieldChange({
                        ...field,
                        isChanged: field.defaultValue !== value
                    });

                onChange(e, isValid, key);
            },
            [fields, handleFieldChange, _name, onChange]
        );

        // add fields to store when field mounted
        useMount(() => {
            // generate local name if `name` is undefined
            const localName = defaultName || guid();
            // generate default value if `value` is undefined
            const defaultValue = value || '';

            setName(localName);
            handleFieldMount({
                name: localName,
                defaultValue,
                isValid: true,
                isChanged: false
            });

            return () => handleFieldUnMount({ name: localName });
        });

        return (
            <WrappedComponent
                {...props}
                name={_name}
                onChange={handleChange}
                isFieldValid={handleInitialState}
                forceAllowValidation={allowValidation}
                readOnly={readOnlyState || props.readOnly}
            />
        );
    };
}

Formable.defaultProps = {
    onChange: noop,
    isFieldValid: noop
};

export default Formable;
