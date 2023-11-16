import React from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';

function ValidatableDatePickerProp(props) {
    return <div />;
}

ValidatableDatePickerProp.propTypes = {
    /**
     * Value for date picker
     */
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    /**
     * Callback fires when date changes
     */
    onChange: PropTypes.func,
    /**
     * Define is field required or no.
     */
    required: PropTypes.bool,
    /**
     * Define is range picker with time or no
     */
    withTime: PropTypes.bool,
    /**
     * Define is single date picker or with range
     */
    withRange: PropTypes.bool,
    /**
     * Callback fires when field validation state changes
     */
    isFieldValid: PropTypes.func,
    /**
     * Additional validation state
     */
    isValid: PropTypes.bool,
    /**
     * Minimum date value
     */
    min: PropTypes.string,
    /**
     * Maximum date value
     */
    max: PropTypes.string,
    /**
     * Date format
     */
    format: PropTypes.string,
    /**
     * Allow validation without onBlur, validate field when mount
     */
    forceAllowValidation: PropTypes.bool
};

ValidatableDatePickerProp.defaultProps = {
    isValid: true,
    isFieldValid: noop
};

export default ValidatableDatePickerProp;
