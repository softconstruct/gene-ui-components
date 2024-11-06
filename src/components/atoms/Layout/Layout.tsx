import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Layout.scss";

interface ILayoutProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Layout component props interface
}

/**
 * Layout is the foundation of systematic visual design. Unlike traditional graphic design, the layout space of a UI interface should be approached from a dynamic and systematic perspective.
 */
const Layout: FC<ILayoutProps> = ({ className }) => {
    return (
        <div className={classNames("layout layout_doubleSidebars", className)}>
            <header className="header" />
            <main className="content" />
            <aside className="sidebar sidebar_left sidebar_left_collapsed sidebar_hasAside">
                <div className="sidebar__aside" />
            </aside>
            <aside className="sidebar sidebar_right" />
        </div>
    );
};

export { ILayoutProps, Layout as default };
