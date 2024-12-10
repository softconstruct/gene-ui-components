import React, { FC } from "react";
import classNames from "classnames";
import { Close, TagOutline, WarningFill, ErrorAlertFill } from "@geneui/icons";

// Styles
import "./Tag.scss";

// Components
import Button from "../../atoms/Button/Button";

const icons = {
    rest: TagOutline,
    warning: WarningFill,
    error: ErrorAlertFill,
    disabled: TagOutline
};

interface ITagProps {
    /**
     * Tag content text
     */
    text: string;
    /**
     * Tag state <br/>
     * Possible values: `rest | error | warning | disabled`
     */
    state?: "rest" | "error" | "warning" | "disabled";
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
const Tag: FC<ITagProps> = ({ className, text, state = "rest", size = "medium", withIcon = true, onClose }) => {
    const Icon = icons[state];
    return (
        <div
            className={classNames(
                "tag",
                `tag_state_${state}`,
                `tag_size_${size}`,
                { tag_withIcon: withIcon },
                className
            )}
        >
            {withIcon && <Icon className="tag__icon" size={20} />}
            <span className="tag__text">{text}</span>
            <Button
                className="tag__button"
                appearance="secondary"
                displayType="text"
                Icon={Close}
                size={size}
                onClick={onClose}
                disabled={state === "disabled"}
            />
        </div>
    );
};

export { ITagProps, Tag as default };
