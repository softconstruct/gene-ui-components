import React, { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import classNames from "classnames";

// Components
import HelperText from "@components/atoms/HelperText";

// Styles
import "./Switch.scss";

interface ISwitchProps {
    /**
     * Label for the switch
     */
    label?: string;
    /**
     * Additional helper text displayed below the switch
     */
    helperText?: string;
    /**
     * If true, the switch will be disabled
     */
    disabled?: boolean;
    /**
     * If true, the switch will be read-only
     */
    readOnly?: boolean;
    /**
     * The alignment of the label relative to the switch </br>
     * Possible values: `after | before | top`
     */
    labelAlignment?: "after" | "before" | "top";
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
}

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
        labelAlignment = "after",
        onChange,
        defaultChecked = false,
        checked,
        value = "",
        name
    } = props;

    const isControlled = "checked" in props;

    const [internalState, setInternalState] = useState(defaultChecked);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setInternalState((prev) => !prev);
        }
        onChange?.(e as ChangeEvent<HTMLInputElement>);
    };

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onChangeHandler(e);
        }
    };

    return (
        <div
            className={classNames(
                "switch",
                {
                    switch_labelAfter: labelAlignment === "after",
                    switch_labelBefore: labelAlignment === "before",
                    switch_labelTop: labelAlignment === "top"
                },
                className
            )}
        >
            <label className="switch__label">
                <input
                    type="checkbox"
                    className="switch__input"
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    disabled={disabled}
                    {...(name && { name })}
                    checked={isControlled ? checked : internalState}
                    readOnly={!disabled && readOnly}
                    value={value}
                />
                <span className="switch__slider" />
                {label && <span className="switch__labelText">{label}</span>}
            </label>
            {helperText && <HelperText text={helperText} className="switch__helperText" isDisabled={disabled} />}
        </div>
    );
};

export { ISwitchProps, Switch as default };
