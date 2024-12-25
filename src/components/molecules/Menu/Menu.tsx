import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Menu.scss";
import { ChevronLeft, ChevronRight } from "@geneui/icons";

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
    return (
        <div className={classNames("menu menu_isMobile menu_isSwappable", className)}>
            {/* For web menu // menu_isWeb // menu_size_large // menu_size_medium // menu_size_small */}
            {/* For mobile menu // menu_isMobile */}
            {/* Add class // menu__list_swipeRight // menu__list_swipeLeft // for menu__item */}
            <div className="menu__list menu__list_current">
                <button type="button" className="menu__header">
                    <ChevronLeft className="menu__icon" size={16} />
                    <p className="menu__headerTitle">Inner Page Title</p>
                </button>
                <div className="menu__content">
                    <button type="button" className="menu__item">
                        <span className="menu__cell">
                            <ChevronRight className="menu__icon" size={20} />
                            <span className="menu__rowTitle">Menu Item</span>
                        </span>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </button>
                    <button type="button" className="menu__item">
                        <span className="menu__cell">
                            <span className="menu__rowTitle">Menu Item</span>
                        </span>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </button>
                    <button type="button" className="menu__item">
                        <span className="menu__cell">
                            <span className="menu__rowTitle">Menu Item</span>
                        </span>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </button>
                    <div className="menu__list menu__list_notCurrent menu__list_swipeRight menu__list_current">
                        <button type="button" className="menu__header">
                            <ChevronLeft className="menu__icon" size={16} />
                            <p className="menu__headerTitle">Inner Page Title</p>
                        </button>
                        <div className="menu__content">
                            <button type="button" className="menu__item">
                                <span className="menu__cell">
                                    <ChevronRight className="menu__icon" size={20} />
                                    <span className="menu__rowTitle">Menu Item</span>
                                </span>
                                <ChevronRight className="menu__rowIcon" size={16} />
                            </button>
                            <button type="button" className="menu__item">
                                <span className="menu__cell">
                                    <span className="menu__rowTitle">Menu Item</span>
                                </span>
                                <ChevronRight className="menu__rowIcon" size={16} />
                            </button>
                            <button type="button" className="menu__item">
                                <span className="menu__cell">
                                    <span className="menu__rowTitle">Menu Item</span>
                                </span>
                                <ChevronRight className="menu__rowIcon" size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { IMenuProps, Menu as default };
