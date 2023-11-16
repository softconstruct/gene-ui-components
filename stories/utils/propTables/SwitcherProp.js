import React, { useState, forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';

const SwitcherProp = (props) => <div></div>;
const Config = {
    size: ['small', 'big'],
    labelPosition: ['right', 'left', 'top', 'bottom'],
    labelAlignment: ['start', 'center', 'end']
};

SwitcherProp.propTypes = {
    /**
     * Text to be written when on
     */
    onText: PropTypes.string,
    /**
     * Text to be written when off
     */
    offText: PropTypes.string,
    /**
     * Control Switcher state with this prop. When component is  controled it will not switch automatically
     */
    checked: PropTypes.bool,
    /**
     * Switcher size
     */
    size: PropTypes.oneOf(Config.size),
    /**
     * Will add a label for switcher. Any valid React node
     */
    label: PropTypes.node,
    /**
     * Specify label position
     */
    labelPosition: PropTypes.oneOf(Config.labelPosition),
    /**
     * Specify label alignment
     */
    labelAlignment: PropTypes.oneOf(Config.labelAlignment),
    /**
     * Will add a description for switcher. Any valid React node
     */
    description: PropTypes.node,
    /**
     * Switcher will become readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * Switcher will become disabled when set to "true"
     */
    disabled: PropTypes.bool,
    /**
     * Switcher will add an extra asterix to the "label". For more info see "ValidatableSwitcher"(integrated Radio with "Form" organism).
     */
    required: PropTypes.bool,
    /**
     * Control Switcher validation. For more info see "ValidatableSwitcher"(integrated Radio with "Form" organism).
     */
    isValid: PropTypes.bool,
    /**
     * Shows error text when "isValid" is set to "false".
     */
    errorText: PropTypes.string,
    /**
     * This prop will only applied once as defaultState for "checked" when Swticher mounts.
     * Note that specifing this prop is not mean controlling it.
     */
    defaultChecked: PropTypes.bool,
    /**
     * Fires an event when Switcher changes checked state((event: Event) => void).
     */
    onChange: PropTypes.func,
    /**
     * Pass a value to Switcher and get it back within "onChange" event
     */
    value: PropTypes.any,
    /**
     * Additional className
     */
    className: PropTypes.string
};

SwitcherProp.defaultProps = {
    onText: '',
    offText: '',
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
    defaultChecked: false
};

export default SwitcherProp;
