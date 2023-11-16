import React from 'react';
import PropTypes from 'prop-types';

const checkboxRadioSwitcherConfig = {
    size: ['small', 'big'],
    labelPosition: ['right', 'left', 'top', 'bottom'],
    labelAlignment: ['start', 'center', 'end']
};

function CheckboxProp(props) {
    return <div />;
}

CheckboxProp.propTypes = {
    /**
     * Use this prop to control Checkbox state. Note that when you specify this prop, the Checkbox will not functionate itself
     */
    checked: PropTypes.bool,
    /**
     * Checkbox size
     */
    size: PropTypes.oneOf(checkboxRadioSwitcherConfig.size),
    /**
     * Use this prop to add an additional label to Checkbox
     */
    label: PropTypes.node,
    /**
     * Specify "label" position
     */
    labelPosition: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelPosition),
    /**
     * Specify "label" alignment
     */
    labelAlignment: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelAlignment),
    /**
     * Use this prop to add an additional description field to the Checkbox
     */
    description: PropTypes.node,
    /**
     * Use this prop to make checkbox neither checked nor unchecked
     */
    indeterminate: PropTypes.bool,
    /**
     * Makes Checkbox readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * Makes Checkbox disabled when set to "true"
     */
    disabled: PropTypes.bool,
    /**
     * Checkbox adds an extra asterisk to the "label". For more info see "ValidatableCheckbox"(integrated Checkbox with "Form" organism).
     */
    required: PropTypes.bool,
    /**
     * Control Checkbox validation. For more info see "ValidatableCheckbox"(integrated Checkbox with "Form" organism).
     */
    isValid: PropTypes.bool,
    /**
     * Use this prop to specify error message. This will be displayed when "isValid" is set to "false"
     */
    errorText: PropTypes.node,
    /**
     * This prop will only applied once as defaultState for "checked" when Checkbox mounts.
     * Note that specifying this prop does not mean to control it.
     */
    defaultChecked: PropTypes.bool,
    /**
     * Fires an event when Checkbox is clicked or "enter" key is pressed((event: Event) => void).
     */
    onChange: PropTypes.func,
    /**
     * Fires an event when any key is pressed((event: Event) => void).
     */
    onKeyPress: PropTypes.func,
    /**
     * Use this prop to get specified value when "onChange" is fired
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    /**
     * Additional className
     */
    className: PropTypes.string
};

CheckboxProp.defaultProps = {
    size: 'small',
    label: '',
    labelPosition: 'right',
    labelAlignment: 'start',
    description: '',
    indeterminate: false,
    readOnly: false,
    disabled: false,
    required: false,
    isValid: true,
    errorText: '',
    defaultChecked: false
};

export { checkboxRadioSwitcherConfig };

export default CheckboxProp;
