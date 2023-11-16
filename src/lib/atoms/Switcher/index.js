import React, { useState, forwardRef, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { checkboxRadioSwitcherConfig } from 'configs';
import { interceptValue, guid, noop } from 'utils';
import { useKeyDown } from 'hooks';

import 'src/assets/styles/globalStyling.scss';
import 'src/assets/styles/checkboxRadioSwitcher.scss';
import './index.scss';

const Switcher = forwardRef((props, ref) => {
    const {
        onText,
        offText,
        size,
        label,
        labelPosition,
        labelAlignment,
        description,
        readOnly,
        disabled,
        required,
        isValid,
        errorText,
        defaultChecked,
        onChange,
        changeOnEnter,
        value,
        className,
        ...restProps
    } = props;

    const containerRef = useRef(null);

    const [checkedState, setCheckedState] = useState(defaultChecked);
    const isControlled = 'checked' in props;
    const checked = isControlled ? props.checked : checkedState;
    const randomId = useMemo(guid, []);

    const handleChange = (e) => {
        const { checked } = e.target;

        !isControlled && setCheckedState(checked);

        onChange(interceptValue(e, value));
    };

    const hasError = !isValid;

    /*
     * Change value on Enter key down
     */
    useKeyDown(
        (e) => {
            if (changeOnEnter) {
                setCheckedState((checked) => !checked);
                onChange(interceptValue(e, value));
            }
        },
        [value, onChange],
        containerRef,
        ['Enter']
    );

    return (
        <div
            ref={containerRef}
            className={classnames('crs-holder', className, `lp-${labelPosition}`, `la-${labelAlignment}`, {
                disabled,
                error: hasError,
                'read-only': readOnly
            })}
        >
            <div
                className={classnames('label-holder', {
                    'has-label': !!label
                })}
            >
                {label && (
                    <div className="crs-item crs-label">
                        <label className="ellipsis-text" htmlFor={randomId}>
                            {required && `* `}
                            {label}
                        </label>
                    </div>
                )}
                <div className="crs-item crs-component">
                    <input
                        type="checkbox"
                        onChange={handleChange}
                        checked={checked}
                        disabled={disabled}
                        value={value}
                        ref={ref}
                        id={randomId}
                        {...restProps}
                    />
                    <label
                        className={classnames('switcher-element', `s-${size}`, {
                            active: checked,
                            'error-color': !checked && !errorText && hasError,
                            'read-only': readOnly
                        })}
                        htmlFor={randomId}
                    >
                        <span>{checked ? onText : offText}</span>
                        <small />
                    </label>
                </div>
            </div>
            {hasError && errorText && <div className="information-message color-danger">{errorText}</div>}
            {description && <div className="input-description">{description}</div>}
        </div>
    );
});

Switcher.propTypes = {
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
    size: PropTypes.oneOf(checkboxRadioSwitcherConfig.size),
    /**
     * Will add a label for switcher. Any valid React node
     */
    label: PropTypes.node,
    /**
     * Specify label position
     */
    labelPosition: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelPosition),
    /**
     * Specify label alignment
     */
    labelAlignment: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelAlignment),
    /**
     * Will add a description for switcher. Any valid React node
     */
    description: PropTypes.node,
    /**
     * Switcher will become readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * Switcher will change when Enter key pressed (note: its will not work inside of form component)
     */
    changeOnEnter: PropTypes.bool,
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

Switcher.defaultProps = {
    onText: '',
    offText: '',
    size: checkboxRadioSwitcherConfig.size[0],
    label: '',
    labelPosition: checkboxRadioSwitcherConfig.labelPosition[0],
    labelAlignment: checkboxRadioSwitcherConfig.labelAlignment[0],
    description: '',
    readOnly: false,
    onChange: noop,
    disabled: false,
    required: false,
    isValid: true,
    errorText: '',
    defaultChecked: false
};

export default Switcher;
