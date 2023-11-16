import React from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';

const ExtendedInputProp = (props) => <div></div>;

const inputConfig = {
    type: ['text', 'color', 'number', 'password', 'textarea'],
    appearance: ['outline', 'minimal', 'light'],
    size: ['small', 'default', 'big'],
    flexibility: ['full-width', 'content-size'],
    itemsDirection: ['start', 'end'],
    cornerRadius: ['full-radius', 'smooth-radius'],
    labelAppearance: ['none', 'title', 'swap']
};

ExtendedInputProp.propTypes = {
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Control ExtendedInput disabled state with this prop
     */
    disabled: PropTypes.bool,
    /**
     * Borders will be colored on when "isValid" and this props are set to "true"
     */
    colorBorderOnError: PropTypes.bool,
    /**
     * Shows an icon to clear ExtendedInput's value when set to "true"
     */
    showClearIcon: PropTypes.bool,
    /**
     * Use this props in combo with "icon" prop. This will fire on icon click when set to "true"
     */
    clickableIcon: PropTypes.bool,
    /**
     * Shows an error icon when "isValid" is set to "false" and this prop is set to "true"
     */
    showErrorIcon: PropTypes.bool,
    /**
     * Shows an "Icon" for number inputs, when "type" is set to "number" and this prop is et to "true"
     */
    showNumberIcon: PropTypes.bool,
    /**
     *.
     */
    showClickableTooltipOnError: PropTypes.bool,
    /**
     * ExtendedInput borders are colored when "isValid" and this props are set to "true"
     */
    colorOnValid: PropTypes.bool,
    /**
     * ExtendedInput will display an icon when "isValid" and this props are set to "true"
     */
    showIconOnValid: PropTypes.bool,
    /**
     * Shows the "errorText" value in "Tooltip" when set to "true"
     */
    showErrorWithTooltip: PropTypes.bool,
    /**
     * Control ExtendedInput validation. For more info see "ValidatableNumberInput", "ValidatableTextInput"(integrated ExtendedInputs with "Form" organism).
     */
    isValid: PropTypes.bool,
    /**
     * Use this prop to specify error message. This will be displayed when "isValid" is set to "false"
     */
    errorText: PropTypes.string,
    /**
     * Specify increment or decrement value, when arrow up or down are clicked
     */
    step: PropTypes.number,
    /**
     * Valid values are same as "Icon" type
     */
    icon: PropTypes.string,
    /**
     * ExtendedInput placeholder
     */
    placeholder: PropTypes.string,
    /**
     * Control items direction
     */
    itemsDirection: PropTypes.oneOf(inputConfig.itemsDirection),
    /**
     * Use this prop to control ExtendedInput state. Note that when you specify this prop, the ExtendedInput will not functionate itself
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * ExtenedInput type
     */
    type: PropTypes.oneOf(inputConfig.type).isRequired,
    /**
     * ExtenedInput appearance
     */
    appearance: PropTypes.oneOf(inputConfig.appearance),
    /**
     * ExtenedInput size
     */
    inputSize: PropTypes.oneOf(inputConfig.size),
    /**
     * ExtenedInput corner radius
     */
    cornerRadius: PropTypes.oneOf(inputConfig.cornerRadius),
    /**
     * Will make ExtenedInput readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * How to display inscription in relation to it's parent in ExtenedInput
     */
    flexibility: PropTypes.oneOf(inputConfig.flexibility),
    /**
     * This prop will only applied once as defaultState for "value" when ExtendedInput mounts.
     * Note that specifing this prop is not mean controlling it.
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Shows an "Icon" to remove ExtendedInput's value
     */
    canClear: PropTypes.bool,
    /**
     * Fires an event on clear "Icon" click((element: Element) => void)
     */
    onClear: PropTypes.func,
    /**
     * Fires an event on ExtendedInput change((event: Event) => void)
     */
    onChange: PropTypes.func,
    /**
     * Specify a label for ExtendedInput
     */
    label: PropTypes.string,
    /**
     * Specify a "label" appearance
     */
    labelAppearance: PropTypes.oneOf(inputConfig.labelAppearance),
    /**
     * Will add an additional description field
     */
    description: PropTypes.node,
    /**
     * Property is needed for "Dropdown" organism usage
     */
    isDropdown: PropTypes.bool,
    /**
     * Fires an event on ExtendInput <input /> click((event: Event => void))
     */
    onClick: PropTypes.func,
    /**
     * Typing will be blocked when set to "true". Note design is different from "readonly" prop's design
     */
    writeProtected: PropTypes.bool,
    /**
     * Max Length of input Value
     */
    maxLength: PropTypes.number,
    /**
     * Show Remaining Length of input value, works only with maxLength
     */
    showRemainingLength: PropTypes.bool
};

ExtendedInputProp.defaultProps = {
    step: 1,
    placeholder: '',
    itemsDirection: inputConfig.itemsDirection[0],
    type: inputConfig.type[0],
    appearance: inputConfig.appearance[0],
    inputSize: inputConfig.size[1],
    cornerRadius: inputConfig.cornerRadius[0],
    clickableIcon: false,
    readOnly: false,
    flexibility: inputConfig.flexibility[0],
    colorBorderOnError: true,
    showErrorIcon: false,
    showNumberIcon: true,
    showClickableTooltipOnError: true,
    showErrorWithTooltip: false,
    colorOnValid: false,
    showIconOnValid: false,
    canClear: false,
    isValid: true,
    onChange: noop,
    onClick: noop,
    onClear: noop,
    label: '',
    labelAppearance: inputConfig.labelAppearance[0],
    description: '',
    isDropdown: false,
    writeProtected: false,
    defaultValue: ''
};

export default ExtendedInputProp;
