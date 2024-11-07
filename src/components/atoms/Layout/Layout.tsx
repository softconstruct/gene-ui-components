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
        <div className="testWrapper">
            <div style={{ display: "none" }} className={classNames("layout layout_noSidebar", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
            </div>
            <div className={classNames("layout layout_leftSidebar", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
                <aside
                    className="sidebar sidebar_left sidebar_left_collapsed sidebar_hasAside"
                    style={{ backgroundColor: "#E9BFD7" }}
                >
                    Left Sider
                </aside>
            </div>
            <div style={{ display: "none" }} className={classNames("layout layout_leftSidebarOverlay", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
                <aside
                    className="sidebar sidebar_left sidebar_left_collapsed sidebar_hasAside"
                    style={{ backgroundColor: "#E9BFD7" }}
                >
                    Left Sider
                    <div className="sidebar__aside" style={{ backgroundColor: "#DFA3C7" }}>
                        Slider Overlay
                    </div>
                </aside>
                <aside className="sidebar sidebar_right" style={{ backgroundColor: "#E9BFD7" }}>
                    Right Sider
                </aside>
            </div>
            <div style={{ display: "none" }} className={classNames("layout layout_doubleSidebars", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
                <aside
                    className="sidebar sidebar_left sidebar_left_collapsed sidebar_hasAside"
                    style={{ backgroundColor: "#E9BFD7" }}
                >
                    Left Sider
                </aside>
                <aside className="sidebar sidebar_right" style={{ backgroundColor: "#E9BFD7" }}>
                    Right Sider
                </aside>
            </div>
            <div style={{ display: "none" }} className={classNames("layout layout_doubleSidebarsOverlay", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
                <aside
                    className="sidebar sidebar_left sidebar_left_collapsed sidebar_hasAside"
                    style={{ backgroundColor: "#E9BFD7" }}
                >
                    Left Sider
                </aside>
                <aside className="sidebar sidebar_right" style={{ backgroundColor: "#E9BFD7" }}>
                    Right Sider
                </aside>
            </div>
            <div style={{ display: "none" }} className={classNames("layout layout_rightSidebar", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
                <aside className="sidebar sidebar_right" style={{ backgroundColor: "#E9BFD7" }}>
                    Right Sider
                </aside>
            </div>
            <div style={{ display: "none" }} className={classNames("layout layout_rightSidebarOverlay", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
                <aside className="sidebar sidebar_right" style={{ backgroundColor: "#E9BFD7" }}>
                    Right Sider
                </aside>
            </div>
            <div style={{ display: "none" }} className={classNames("layout layout_doubleSidebarsOverlay", className)}>
                <header className="header" style={{ backgroundColor: "#F6E5EF" }}>
                    Header
                </header>
                <main className="content" style={{ backgroundColor: "#F1D9E7" }}>
                    Content
                </main>
                <aside
                    className="sidebar sidebar_left sidebar_left_collapsed sidebar_hasAside"
                    style={{ backgroundColor: "#E9BFD7" }}
                >
                    Left Sider
                    <div className="sidebar__aside" style={{ backgroundColor: "#DFA3C7" }}>
                        Slider Overlay
                    </div>
                </aside>
                <aside className="sidebar sidebar_right" style={{ backgroundColor: "#E9BFD7" }}>
                    Right Sider
                </aside>
            </div>
        </div>
    );
};

export { ILayoutProps, Layout as default };
