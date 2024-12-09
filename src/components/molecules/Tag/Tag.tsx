import React, { FC } from "react";
import classNames from "classnames";
import { Close, TagOutline, WarningFill, ErrorAlertFill } from "@geneui/icons";

// Styles
import "./Tag.scss";
import Button from "../../atoms/Button/Button";

const icons = {
    rest: TagOutline,
    warning: WarningFill,
    error: ErrorAlertFill,
    disabled: TagOutline
};

interface ITagProps {
    text: string;
    state?: "rest" | "error" | "warning" | "disabled";
    size?: "medium" | "small";
    onClose: () => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Tag component props interface
}

/**
 * Tag component
 */
const Tag: FC<ITagProps> = ({ className, text, state = "rest", size = "medium", onClose }) => {
    const Icon = icons[state];
    return (
        <div
            className={classNames(
                "tag",
                `tag_state_${state}`,
                `tag_size_${size}`,
                `tag_icon_${size === "small"}`,
                className
            )}
        >
            <Icon size={20} />
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
