import React, { Children, cloneElement, FC, FunctionComponentElement, useEffect, useState } from "react";
// Styles
import "./SegmentedControl.scss";

// Component
import { HelperText, Label } from "../../../index";
import { ISegmentedControlItemProps } from "./SegmentedControlItem ";

interface ISegmentedControlProps {
    /**
     * Additional descriptive text shown with info icon and tooltip alongside of the label component.
     */
    infoText?: string;
    /**
     * The text content of the `label`.
     * This is the main text displayed within the `label`.
     */
    label?: string;
    /**
     * SegmentedControlItem component. Renders inside the component
     */

    children:
        | FunctionComponentElement<ISegmentedControlItemProps>
        | FunctionComponentElement<ISegmentedControlItemProps>[];
    /**
     * The actual text content to be displayed as helper text.
     */
    helperText?: string;
    /**
     *  It works when the user clicks on one of the control items. Returns the value of the `name` prop from the `SegmentedControlItem`.
     */
    onChange: (name: string) => void;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Indicates whether the `SegmentedControlItem` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * Indicates whether the label represents a required field.
     * When set to `true`, a visual indicator (asterisk) will be added to denote that the field is required.
     */
    required?: boolean;
}

const SegmentedControl: FC<ISegmentedControlProps> = ({
    children,
    onChange,
    helperText,
    label,
    infoText,
    required,
    disabled,
    size
}) => {
    const [selectedElementName, setSelectedElementName] = useState("");

    const onSelect = (name: string) => {
        setSelectedElementName(name);
    };

    useEffect(() => {
        onChange(selectedElementName);
    }, [selectedElementName]);

    const textSizes = size === "large" ? "medium" : size;

    return (
        <div className="segmentedControl">
            <Label labelText={label} required={required} size={textSizes} infoText={infoText} />
            <div className="segmentedControl__wrapper">
                {Children.map(children, (el) => {
                    return cloneElement(el, {
                        ...el.props,
                        selected: selectedElementName ? selectedElementName === el.props.name : el.props.selected,
                        size,
                        onSelect,
                        disabled
                    });
                })}
            </div>
            {helperText && <HelperText text={helperText} size={textSizes} />}
        </div>
    );
};

export { ISegmentedControlProps, SegmentedControl as default };
