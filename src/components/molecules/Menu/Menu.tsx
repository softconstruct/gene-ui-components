import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Menu.scss";

interface IMenuProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Menu component props interface
}

/**
 * Menu component provides a list of options or actions available to the user within a specific context. Menus are used to offer additional functionality without cluttering the interface, allowing users to access commands, navigate to different sections, or modify settings quickly and efficiently.
 */
const Menu: FC<IMenuProps> = ({ className }) => {
    return <div className={classNames("menu", className)}>Menu</div>;
};

export { IMenuProps, Menu as default };
