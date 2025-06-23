import React, { FC } from "react";
import classNames from "classnames";

import CopyComponent from "@components/atoms/Copy";
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Text from "@components/atoms/Text";

// Styles
import "./TextArea.scss";

interface ITextAreaProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Define width and height of the Text Area.<br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     *
     */
    label?: string;
    /**
     *  Helper text to provide context or explain any errors, warnings related to the radio.
     */
    helperText?: string;
    /**
     *  Determines the radios appearance based on its status.<br>
     *  Possible values: `rest | warning | error`
     */
    type?: "rest" | "warning" | "error";
    /**
     *
     */
    disabled?: boolean;
    /**
     *
     */
    readOnly?: boolean;
    // fill TextArea component props interface
}

/**
 * Text area is a larger input field in a user interface designed for users to enter and edit multiline text.
 */
const TextArea: FC<ITextAreaProps> = ({
    className,
    size = "medium",
    label = "Label",
    helperText = "Helper Text",
    type = "rest",
    disabled,
    readOnly
}) => {
    return (
        <>
            <div
                className={classNames(`textArea textArea_size_${size} textArea_type_${type}`, className, {
                    textArea_disabled: disabled,
                    textArea_readOnly: readOnly
                })}
            >
                <Label text={label} size={size === "small" ? "small" : "medium"} disabled={disabled} required />
                <div className="textArea__wrapper">
                    {/* todo: add "textArea__content_scrolling" classname in scroll and remove :hover state */}
                    <textarea
                        name=""
                        id=""
                        className="textArea__content textArea__content_scrolling"
                        disabled={disabled || readOnly}
                    >
                        TextArea
                    </textarea>
                    <div className="textArea__copy">
                        <CopyComponent
                            size={size === "small" ? "smallNudge" : "small"}
                            appearance="secondary"
                            disabled={disabled || readOnly}
                        />
                    </div>
                    <span className="textArea__resizeIcon" />
                </div>
                <div className="textArea__footer">
                    <HelperText
                        text={helperText}
                        size={size === "small" ? "small" : "medium"}
                        type={type}
                        disabled={disabled}
                    />
                    <Text
                        as="span"
                        variant={size === "small" ? "captionLargeMedium" : "bodyMediumMedium"}
                        className="textArea__count"
                    >
                        0/100
                    </Text>
                </div>
            </div>
        </>
    );
};

export { ITextAreaProps, TextArea as default };
