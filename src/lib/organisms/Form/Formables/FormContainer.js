import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { noop, stopEvent } from 'utils';

// Components
import Paper from '../../../atoms/Paper';
import Button from '../../../atoms/Button';

// Local components
import { useFormContext, FormProvider } from '../utils/context';

// Styles
import '../index.scss';

const KEYBOARD_ENTER_KEY = 13;

function Form({
    children,
    buttons,
    className,
    cancelText,
    submitText,
    onSubmit,
    onCancel,
    onFormChange,
    onValidationChange,
    submitOnEnter,
    onKeyPress,
    readOnly,
    disableFooter,
    ...restProps
}) {
    const { fields, setReadOnly, setAllowValidation } = useFormContext();

    const checkFormValidation = useMemo(() => fields.every((item) => item.isValid), [fields]);
    // Comment this row, because it can be useful after
    // const checkFormChanges = useMemo(() => fields.some(item => item.isChanged), [fields]);
    const checkFormChanges = true;

    const handleSubmit = useCallback(
        (e) => {
            stopEvent(e, true);
            setAllowValidation(true);
            checkFormValidation && onSubmit(e);
        },
        [setAllowValidation, checkFormValidation, onSubmit]
    );

    const handleCancel = useCallback(
        (e) => {
            stopEvent(e, true);
            onCancel(e);
        },
        [onCancel]
    );

    const stopFormSubmit = useCallback(stopEvent, []);

    // handle this because we need stop form default submit when user press `Enter` key,
    // and form still invalid
    const handleFormDefaultSubmit = useCallback(
        (e) => {
            if (e.which === 13) {
                checkFormValidation && submitOnEnter && handleSubmit(e);
            } else {
                stopEvent(e);
            }
            onKeyPress(e);
        },
        [checkFormValidation, handleSubmit, onKeyPress, submitOnEnter]
    );

    /**
     * in this cases form call this two functions `onFormChange and onValidationChange`
     * only in that case if this two values are changed
     * but if we want to call this function in every change, we must add some other variables in deps list
     */
    // No need to fire effect when `onFormChange` changes
    useEffect(() => {
        onFormChange(checkFormChanges, fields);
    }, [checkFormChanges]);

    // No need to fire effect when `onValidationChange` changes
    useEffect(() => {
        onValidationChange(checkFormValidation, fields);
    }, [checkFormValidation]);

    useEffect(() => {
        setReadOnly(readOnly);
    }, [readOnly]);

    const onKeyDown = useCallback(
        (e) => {
            e.keyCode === KEYBOARD_ENTER_KEY && checkFormChanges && submitOnEnter && handleSubmit(e);
        },
        [handleSubmit, checkFormChanges]
    );

    return (
        <form
            {...restProps}
            noValidate // disable native (browser) form validation
            className={className}
            onSubmit={stopFormSubmit}
            onKeyPress={handleFormDefaultSubmit}
            onKeyDown={onKeyDown}
        >
            {children}
            {!disableFooter &&
                (buttons || (
                    <Paper justifyContent="center" className="form-buttons">
                        <>
                            <Button onClick={handleCancel} appearance="outline">
                                {cancelText}
                            </Button>
                            <Button disabled={!checkFormChanges} onClick={handleSubmit}>
                                {submitText}
                            </Button>
                        </>
                    </Paper>
                ))}
        </form>
    );
}

function FormContainer({ readOnly, ...restProps }) {
    return (
        <FormProvider value={{ readOnly }}>
            <Form {...restProps} readOnly={readOnly} />
        </FormProvider>
    );
}

FormContainer.propTypes = {
    /**
     * Disables form footer with cancel and sumbit buttons
     */
    disableFooter: PropTypes.bool,
    /**
     * Desables events on form's elements
     */
    readOnly: PropTypes.bool,
    /**
     * Form submit will be called on ENTER press
     */
    submitOnEnter: PropTypes.bool,
    /**
     * Render custom buttons in footer
     */
    buttons: PropTypes.any,
    /**
     * Valid React nodes
     */
    children: PropTypes.node,
    /**
     * Additional classname which applies to form element
     */
    className: PropTypes.string,
    /**
     * Custom text for reject button in footer
     */
    cancelText: PropTypes.string,
    /**
     * Custom text for submit button in footer
     */
    submitText: PropTypes.string,
    /**
     * fires event when submit button in footer was clicked
     * (event: Event) => void
     */
    onSubmit: PropTypes.func,
    /**
     * Fires event when reject button in footer was clicked
     * (event: Event) => void
     */
    onCancel: PropTypes.func,
    /**
     * Fires when user attempts to change form's fields
     * (changedFields: Array) => void
     */
    onFormChange: PropTypes.func,
    /**
     * Check if every fields are valid
     * (isValid: Boolean) => void
     */
    onValidationChange: PropTypes.func,
    /**
     * Fires event when `ENTER` is pressed
     * (event: Event) => void
     */
    onKeyPress: PropTypes.func
};

FormContainer.defaultProps = {
    cancelText: 'Cancel',
    submitText: 'Submit',
    submitOnEnter: true,
    onCancel: noop,
    onSubmit: noop,
    onKeyPress: noop,
    onValidationChange: noop,
    onFormChange: noop
};

export default FormContainer;
