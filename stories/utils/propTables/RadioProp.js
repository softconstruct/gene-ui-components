import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';

const RadioProp = (props) => <div></div>;

const Config = {
    size: ['small', 'big'],
    labelPosition: ['right', 'left', 'top', 'bottom'],
    labelAlignment: ['start', 'center', 'end']
};

RadioProp.propTypes = {
    /**
     * Radio size
     */
    size: PropTypes.oneOf(Config.size),
    /**
     * A label will be added to the Radio
     */
    label: PropTypes.string,
    /**
     * Specify the label position
     */
    labelPosition: PropTypes.oneOf(Config.labelPosition),
    /**
     * Specify the label alignment
     */
    labelAlignment: PropTypes.oneOf(Config.labelAlignment),
    /**
     * Optional description field
     */
    description: PropTypes.string,
    /**
     * Will make Radio readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * Will make Radio disabled when set to "true"
     */
    disabled: PropTypes.bool,
    /**
     * Radio will add an extra asterix to the "label". For more info see "ValidatableRadio"(integrated Radio with "Form" organism).
     */
    required: PropTypes.bool,
    /**
     * Control Radio validation. For more info see "ValidatableRadio"(integrated Radio with "Form" organism).
     */
    isValid: PropTypes.bool,
    /**
     * Shows error text when "isValid" is set to "false".
     */
    errorText: PropTypes.string,
    /**
     * Use this prop to get specified value when "onChange" is fired
     */
    value: PropTypes.any,
    /**
     * Fires an event when Radio is clicked((event: Event) => void).
     */
    onChange: PropTypes.func,
    /**
     * Specifies does the Radio checked or not.
     */
    checked: PropTypes.bool,
    /**
     * Needed for "RadioGroup" molecule
     */
    name: PropTypes.string
};

RadioProp.defaultProps = {
    size: Config.size[0],
    label: '',
    labelPosition: Config.labelPosition[0],
    labelAlignment: Config.labelAlignment[0],
    description: '',
    readOnly: false,
    disabled: false,
    required: false,
    isValid: true,
    errorText: '',
    checked: false
};

export default RadioProp;
