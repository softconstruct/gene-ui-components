import React, { useState, forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { checkboxRadioSwitcherConfig } from 'configs';
import { interceptValue, guid, noop, stopEvent } from 'utils';

// Components
import Tooltip from '../Tooltip';

// Styles
import 'src/assets/styles/checkboxRadioSwitcher.scss';

const Checkbox = forwardRef((props, ref) => {
    const {
        size,
        label,
        labelPosition,
        labelTooltip,
        labelAlignment,
        description,
        indeterminate,
        readOnly,
        disabled,
        required,
        isValid,
        errorText,
        defaultChecked,
        onChange,
        value,
        className,
        onKeyPress,
        checked,
        onWrapperClick,
        onMouseEnter,
        onMouseLeave,
        name,
        register,
        rules,
        ...restProps
    } = props;

    const [checkedState, setCheckedState] = useState(defaultChecked);
    const isControlled = 'checked' in props && typeof checked !== 'undefined';
    const localChecked = isControlled ? checked : checkedState;
    const randomId = useMemo(guid, []);

    const handleChange = (e) => {
        const { checked } = e.target;

        !isControlled && setCheckedState(checked);

        onChange(interceptValue(e, value));
    };

    const handleKeyPress = (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            // need this for prevent form default submit
            stopEvent(e);
            const { checked } = e.target;

            // need this because in event time checkbox value is old.
            const changedEvent = { ...e };
            changedEvent.target.checked = !checked;

            !isControlled && setCheckedState((checked) => !checked);
            onChange(interceptValue(changedEvent, value));
        }

        onKeyPress(e);
    };
    const hasError = !isValid;
    const getRegister = register && name ? { ...register(name, rules) } : {};
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={classnames('crs-holder', className, `lp-${labelPosition}`, `la-${labelAlignment}`, {
                disabled,
                error: hasError,
                'read-only': readOnly
            })}
            onClick={onWrapperClick}
        >
            <div
                className={classnames('label-holder', {
                    'has-label': !!label
                })}
            >
                {label && (
                    <Tooltip position="auto" title={label} isVisible={labelTooltip}>
                        <div className="crs-item crs-label">
                            <label className="ellipsis-text" title={labelTooltip} htmlFor={randomId}>
                                {required && `* `}
                                {label}
                            </label>
                        </div>
                    </Tooltip>
                )}
                <div className="crs-item crs-component">
                    <input
                        type="checkbox"
                        onKeyPress={handleKeyPress}
                        onChange={handleChange}
                        checked={localChecked}
                        disabled={disabled}
                        value={value}
                        ref={ref}
                        id={randomId}
                        {...restProps}
                        {...getRegister}
                    />
                    <label
                        className={classnames('checkbox', 'cr-element', `s-${size}`, {
                            indeterminate,
                            active: !indeterminate && localChecked,
                            'error-color': !indeterminate && !localChecked && !errorText && hasError
                        })}
                        htmlFor={randomId}
                    />
                </div>
            </div>
            {hasError && errorText && <div className="information-message color-danger">{errorText}</div>}
            {description && <div className="input-description">{description}</div>}
        </div>
    );
});

Checkbox.propTypes = {
    /**
     * At what point an element becomes focusable when a user is interacting with the page via a keyboard
     */
    tabIndex: PropTypes.number,
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
     * Tooltip for label
     */
    labelTooltip: PropTypes.string,
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
     * Fires an event when mouse enter((event: Event) => void).
     */
    onMouseEnter: PropTypes.func,
    /**
     * Fires an event when mouse leave((event: Event) => void).
     */
    onMouseLeave: PropTypes.func,
    /**
     * Fires an event when clicking on parent/wrapper of input ((event: Event) => void).
     */
    onWrapperClick: PropTypes.func,
    /**
     * Use this prop to get specified value when "onChange" is fired
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    /**
     * Additional className
     */
    className: PropTypes.string
};

Checkbox.defaultProps = {
    tabIndex: 0,
    size: checkboxRadioSwitcherConfig.size[0],
    label: '',
    labelPosition: checkboxRadioSwitcherConfig.labelPosition[0],
    labelAlignment: checkboxRadioSwitcherConfig.labelAlignment[0],
    description: '',
    indeterminate: false,
    readOnly: false,
    disabled: false,
    required: false,
    isValid: true,
    errorText: '',
    defaultChecked: false,
    onKeyPress: noop,
    onChange: noop,
    onWrapperClick: noop
};

export default Checkbox;
