import React, { FC, useRef } from "react";
import classNames from "classnames";
import { Close, TagOutline, WarningFill, ErrorAlertFill, IconProps } from "@geneui/icons";

// Components
import Button from "../../atoms/Button";
import Tooltip from "../Tooltip";

// Hooks
import { useEllipsisDetection } from "../../../hooks";

// Styles
import "./Tag.scss";

type TagTypes = "rest" | "error" | "warning";

const icons: Record<TagTypes, React.FC<IconProps>> = {
    rest: TagOutline,
    warning: WarningFill,
    error: ErrorAlertFill
};

interface ITagProps {
    /**
     * Tag content text
     */
    text: string;
    /**
     * Tag type <br/>
     * Possible values: `rest | error | warning`
     */
    type?: TagTypes;
    /**
     * Disables tag
     */
    disabled?: boolean;
    /**
     * Tag size <br/>
     * Possible values: `medium | small`
     */
    size?: "medium" | "small";
    /**
     * Hides or shows left icon
     */
    withIcon?: boolean;
    /**
     * Callback function that calls when close button is pressed
     */
    onClose: () => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * Tag is used to label, categorize, and organize content within an interface. It can be used to highlight keywords, topics, or attributes related to an item. Tags enhance user navigation and search functionality by providing a quick way to filter and identify relevant information.
 */
const Tag: FC<ITagProps> = ({
    className,
    text,
    type = "rest",
    disabled,
    size = "medium",
    withIcon = true,
    onClose
}) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(textRef, [text]);

    const Icon = icons[type];

    return (
        <div
            className={classNames("tag", `tag_size_${size}`, className, {
                [`tag_state_${type}`]: !disabled,
                tag_state_disabled: disabled,
                tag_withIcon: withIcon
            })}
        >
            {withIcon && <Icon className="tag__icon" size={20} />}
            <Tooltip text={text} isVisible={isTruncated}>
                <span ref={textRef} className="tag__text ellipsis-text">
                    {text}
                </span>
            </Tooltip>
            <Button
                className="tag__button"
                appearance="secondary"
                displayType="text"
                Icon={Close}
                size={size}
                onClick={onClose}
                disabled={disabled}
            />
        </div>
    );
};

export { ITagProps, Tag as default };
