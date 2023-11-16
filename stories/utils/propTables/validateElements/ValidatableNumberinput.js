import React from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';

const ValidatableNumberInputProp = (props) => <div></div>;

ValidatableNumberInputProp.propTypes = {
    /**
     * Maximum value
     */
    min: PropTypes.number,
    /**
     * Minimum value
     */
    max: PropTypes.number,
    /**
     * Value for number field
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Callback fires when field changes
     */
    onChange: PropTypes.func,
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

ValidatableNumberInputProp.defaultProps = {
    isValid: true,
    isFieldValid: noop
};

export default ValidatableNumberInputProp;
