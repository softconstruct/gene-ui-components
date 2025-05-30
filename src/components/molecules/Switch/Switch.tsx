import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent, useState } from "react";
import classNames from "classnames";

// Components
import HelperText from "@components/atoms/HelperText";

// Styles
import "./Switch.scss";

interface ISwitchProps {
    /**
     * The text displayed as the label for the switch, describing its purpose or function.
     */
    label?: string;
    /**
     * Helper text to provide context or explain any errors, warnings related to the switch.
     */
    helperText?: string;
    /**
     * Disables the switch, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     * Displays the switch as read-only, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     * The direction of the label relative to the switch </br>
     * Possible values: `horizontal | vertical`
     */
    direction?: "horizontal" | "vertical";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     *  Fires when the user changes the switch state. Provides the change event as a callback's argument.
     */
    onChange: (state: ChangeEvent<HTMLInputElement>) => void;
    /**
     *  The initial state of the switch was checked before user interaction. This prop does not make the component controlled.
     */
    defaultChecked?: boolean;
    /**
     *  Manages the checked state of the switch in a controlled way.
     */
    checked?: boolean;
    /**
     *  HTML name attribute for the input element.<br>
     *  A unique identifier for the switch within a form.
     */
    name?: string;
    /**
     * The value of the component that will be returned in the onChange event.
     */
    value?: string;
    /**
     *  Event handler for when the Switch loses focus. Provides the focus event as a callback's argument.
     */
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     *  Event handler for when the Switch receives focus. Provides the focus event as a callback's argument.
     */
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

// TODO
// autoFocus
// onBlur ✅
// onFocus ✅
// infoText
// labelAlignment should be changed to direction (values = horizontal | vertical) ✅

/**
 * A switch component allows users to toggle between two states, typically "on" and "off". It is commonly used in settings and preferences to enable or disable features or functionalities.
 */
const Switch: FC<ISwitchProps> = (props) => {
    const {
        className,
        label,
        helperText,
        disabled,
        readOnly,
        direction = "horizontal",
        onChange,
        defaultChecked = false,
        checked,
        value = "",
        name,
        onFocus,
        onBlur
    } = props;

    const isControlled = "checked" in props;

    const [internalState, setInternalState] = useState(defaultChecked);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setInternalState((prev) => !prev);
        }
        onChange?.(e as ChangeEvent<HTMLInputElement>);
    };

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => onFocus?.(e);

    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => onBlur?.(e);

    return (
        <div className={classNames("switch", `switch_direction_${direction}`, className)}>
            <label className="switch__label">
                <input
                    type="checkbox"
                    className="switch__input"
                    onChange={onChangeHandler}
                    onFocus={onFocusHandler}
                    onBlur={onBlurHandler}
                    disabled={disabled}
                    {...(name && { name })}
                    {...((disabled || readOnly) && { tabIndex: -1 })}
                    checked={isControlled ? checked : internalState}
                    readOnly={!disabled && readOnly}
                    value={value}
                />
                <span className="switch__slider" />
                {label && <span className="switch__labelText">{label}</span>}
                {/** TODO need to be replaced by Label component and support infoText props */}
            </label>
            {helperText && <HelperText text={helperText} className="switch__helperText" disabled={disabled} />}
        </div>
    );
};

export { ISwitchProps, Switch as default };
