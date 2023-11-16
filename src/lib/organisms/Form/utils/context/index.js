import React, { useMemo, useState, useContext, useReducer, useCallback, createContext } from 'react';

const Context = createContext();

const useFormContext = () => useContext(Context);

const reducer = (state, { type, field }) => {
    switch (type) {
        case 'add':
            return [...state, field];
        case 'validation':
            return state.map((item) => ({
                ...item,
                isValid: field.name === item.name ? field.isValid : item.isValid
            }));
        case 'change':
            return state.map((item) => ({
                ...item,
                isChanged: field.name === item.name ? field.isChanged : item.isChanged
            }));
        case 'unmount':
            return state.filter((item) => field.name !== item.name);
        default:
            return state;
    }
};

function FormProvider({ value, children }) {
    const [fields, dispatch] = useReducer(reducer, []);
    const [readOnlyState, setReadOnly] = useState(value.readOnly);
    const [allowValidation, setAllowValidation] = useState(false);

    // handle field `isChanged` prop when value changes
    const handleFieldChange = useCallback((field) => dispatch({ type: 'change', field }), []);

    // add field to store when mounted
    const handleFieldMount = useCallback((field) => dispatch({ type: 'add', field }), []);

    // remove field when unmounted
    const handleFieldUnMount = useCallback((field) => dispatch({ type: 'unmount', field }), []);

    // handle field `isValid` prop when validation changes
    const handleValidationChange = useCallback((field) => dispatch({ type: 'validation', field }), []);

    const contextProps = useMemo(
        () => ({
            fields,
            setReadOnly,
            readOnlyState,
            allowValidation,
            handleFieldMount,
            handleFieldUnMount,
            handleFieldChange,
            setAllowValidation,
            handleValidationChange
        }),
        [fields, readOnlyState, allowValidation]
    );

    return <Context.Provider value={contextProps}>{children}</Context.Provider>;
}

export { FormProvider, useFormContext };
