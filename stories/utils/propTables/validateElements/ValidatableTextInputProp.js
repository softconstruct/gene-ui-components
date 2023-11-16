import React from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';

const ValidatableTextInputProp = (props) => <div></div>;

ValidatableTextInputProp.propTypes = {
    /**
     * Value for text input
     */
    value: PropTypes.string,
    /**
     * Callback fires when field changes
     */
    onChange: PropTypes.func,
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

ValidatableTextInputProp.defaultProps = {
    isValid: true,
    isFieldValid: noop
};

export default ValidatableTextInputProp;
