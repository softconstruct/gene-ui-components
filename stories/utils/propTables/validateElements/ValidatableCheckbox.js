import React from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';

const ValidatableCheckboxProp = (props) => <div></div>;

ValidatableCheckboxProp.propTypes = {
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

ValidatableCheckboxProp.defaultProps = {
    isValid: true,
    isFieldValid: noop,
    onChange: noop
};

export default ValidatableCheckboxProp;
