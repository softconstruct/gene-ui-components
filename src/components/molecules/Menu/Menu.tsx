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
        <div className={classNames("menu menu_isWeb menu_size_large", className)}>
            {/* For web menu // menu_isWeb // menu_size_large // menu_size_medium // menu_size_small */}
            {/* For mobile menu // menu_isMobile // menu_size_mobile */}
            {/* Add class // menu__item_swipeRight // menu__item_swipeLeft // for menu__item */}
            <div className="menu__item">
                <div className="menu__header">
                    <ChevronLeft className="menu__headerIcon" size={16} />
                    <p className="menu__headerTitle">Inner Page Title</p>
                </div>
                <div className="menu__content">
                    <div className="menu__row menu__row_selected">
                        <div className="menu__cell">
                            <ChevronRight className="menu__rowIcon" size={20} />
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                </div>
            </div>
            <div className="menu__item">
                <div className="menu__content">
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                </div>
            </div>
            <div className="menu__item menu__item_current">
                <div className="menu__header">
                    <ChevronLeft className="menu__headerIcon" size={16} />
                    <p className="menu__headerTitle">Inner Page Title</p>
                </div>
                <div className="menu__content">
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                    <div className="menu__row">
                        <div className="menu__cell">
                            <p className="menu__rowTitle">Menu Item</p>
                        </div>
                        <ChevronRight className="menu__rowIcon" size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { IMenuProps, Menu as default };
