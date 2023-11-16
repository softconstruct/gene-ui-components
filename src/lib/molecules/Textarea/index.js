import React from 'react';
import { noop } from 'utils';

import PropTypes from 'prop-types';
import { inputConfig, screenTypes } from 'configs';
import ExtendedInput from '../ExtendedInput';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function Textarea(props) {
    return <ExtendedInput {...props} type="textarea" />;
}

Textarea.propTypes = {
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
     * Use this prop to specify tooltip message.
     */
    tooltipText: PropTypes.string,
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
     * ExtendedInput appearance
     */
    appearance: PropTypes.oneOf(inputConfig.appearance),
    /**
     * ExtendedInput size
     */
    inputSize: PropTypes.oneOf(inputConfig.size),
    /**
     * ExtendedInput corner radius
     */
    cornerRadius: PropTypes.oneOf(inputConfig.cornerRadius),
    /**
     * Will make ExtendedInput readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * How to display inscription in relation to it's parent in ExtendedInput
     */
    flexibility: PropTypes.oneOf(inputConfig.flexibility),
    /**
     * This prop will only applied once as defaultState for "value" when ExtendedInput mounts.
     * Note that specifying this prop is not mean controlling it.
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
     * Fires an event on ExtendInput <input /> click((event: Event => void))
     */
    onClick: PropTypes.func,
    /**
     * Typing will be blocked when set to "true". Note design is different from "readonly" prop's design
     */
    writeProtected: PropTypes.bool,
    /**
     * Callback fires when input is focused
     */
    onFocus: PropTypes.func,
    /**
     * Callback fires when input loose focus
     */
    onBlur: PropTypes.func,
    /**
     * Callback fires when click in icon
     */
    onIconClick: PropTypes.func,
    /**
     * Define is input required or no.
     */
    required: PropTypes.bool,
    /**
     * The switch between mobile and desktop version
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Define is  need input info icon required.
     */
    withInfoIcon: PropTypes.bool,
    /**
     * ExtendedInput info icon title.
     */
    infoIconTitle: PropTypes.string,
    /**
     * Max Length of input Value
     */
    maxLength: PropTypes.number,
    /**
     * Show Remaining Length of input value, works only with maxLength
     */
    showRemainingLength: PropTypes.bool,
    /**
     * Suggestion Data
     */
    suggestionData: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired
                })
            )
        })
    )
};

Textarea.defaultProps = {
    step: 1,
    placeholder: '',
    itemsDirection: inputConfig.itemsDirection[0],
    appearance: inputConfig.appearance[0],
    inputSize: inputConfig.size[1],
    cornerRadius: inputConfig.cornerRadius[0],
    readOnly: false,
    flexibility: inputConfig.flexibility[0],
    colorBorderOnError: true,
    showErrorIcon: false,
    showClickableTooltipOnError: true,
    showErrorWithTooltip: false,
    colorOnValid: false,
    showIconOnValid: false,
    canClear: false,
    isValid: true,
    onChange: noop,
    onClick: noop,
    onClear: noop,
    onFocus: noop,
    onBlur: noop,
    onIconClick: noop,
    withInfoIcon: false,
    infoIconTitle: '',
    label: '',
    labelAppearance: inputConfig.labelAppearance[0],
    description: '',
    writeProtected: false,
    defaultValue: '',
    screenType: screenTypes[0]
};

Textarea.displayName = 'Textarea';

export default Textarea;
