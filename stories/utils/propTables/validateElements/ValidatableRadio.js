import React from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';

const ValidatableRadioProp = (props) => <div></div>;

ValidatableRadioProp.propTypes = {
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

ValidatableRadioProp.defaultProps = {
    isValid: true,
    isFieldValid: noop,
    onChange: noop
};

export default ValidatableRadioProp;
