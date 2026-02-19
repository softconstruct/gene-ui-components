import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

// Styles
import "./ActionButton.scss";

interface IActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Class for editor header action button.
     */
    className?: string;
    /**
     * Children element of editor header action button.
     */
    children: ReactNode;
}

const ActionButton: FC<IActionButtonProps> = ({ className, children, ...restProps }) => {
    return (
        <button type="button" className={classNames("editor__actionButton", className)} {...restProps}>
            {children}
        </button>
    );
};

export default ActionButton;
