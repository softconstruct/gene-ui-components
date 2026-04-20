import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Dropdown.scss";

interface IDropdownProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Dropdown component props interface
}

/**
 * Dropdown component presents a list of options when triggered by a user interaction. When expanded, the dropdown reveals a menu that allows users to select a single or multiple options from a predefined set.
 */
const Dropdown: FC<IDropdownProps> = ({ className }) => {
    return <div className={classNames("dropdown", className)}>Dropdown</div>;
};

export { IDropdownProps, Dropdown as default };
