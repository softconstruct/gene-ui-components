import React, { FC } from "react";
import classNames from "classnames";
import { Close, TagOutline, WarningFill, ErrorAlertFill } from "@geneui/icons";

// Styles
import "./Tag.scss";
import Button from "../../atoms/Button/Button";

const icons = {
    info: TagOutline,
    warning: WarningFill,
    error: ErrorAlertFill
};

interface ITagProps {
    text: string;
    type?: "error" | "warning" | "info";
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
const Tag: FC<ITagProps> = ({ className, text, type = "info", size = "medium", onClose }) => {
    const Icon = icons[type];
    return (
        <div className={classNames("tag", className, { size })}>
            <Icon />
            {text}
            <Button Icon={Close} onClick={onClose} />
        </div>
    );
};

export { ITagProps, Tag as default };
