import React, { FC } from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight, InfoFill, TagOutline } from "@geneui/icons";

// Styles
import "./Tabs.scss";

// Components
import Button from "../../atoms/Button";

interface ITabsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Tabs direction <br/>
     * Possible values: `horizontal | vertical`
     */
    direction?: "horizontal" | "vertical";
    /**
     * Tabs button size <br/>
     * Possible values: `large | medium`
     */
    size?: "large" | "medium";
    /**
     * Tabs style <br/>
     * Possible values: `line | contained`
     */
    style?: "line" | "contained";
}

/**
 * Editor is an interactive tool designed for creating, editing, and formatting text content within a user interface. It allows users to input text and apply various styles or structures to their content, offering both simple and advanced text manipulation capabilities.
 */
const Tabs: FC<ITabsProps> = ({ className, direction = "vertical", size = "large", style = "line" }) => {
    return (
        <div className={classNames(`tabs tabs_${direction} tabs_${style}`, className, direction, style)}>
            <div className="tabs__nav" role="tablist" aria-label="Sample Tabs">
                {/* todo: use button only for 'horizontal' direction */}
                <Button
                    className="tabs__nav_button"
                    Icon={ChevronLeft}
                    size={size}
                    appearance="secondary"
                    displayType="text"
                    disabled
                    onClick={() => {}}
                />

                <button
                    type="button"
                    role="tab"
                    tabIndex={0}
                    className={classNames(`tabs__button tabs__button_selected tabs__button_${size}`, size)}
                >
                    <TagOutline className="tabs__button_icon" size={24} />
                    <span className="tabs__button_text">Tab</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    tabIndex={0}
                    className={classNames(`tabs__button tabs__button_${size}`, size)}
                >
                    <TagOutline className="tabs__button_icon" size={24} />
                    <span className="tabs__button_text">Tab</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    tabIndex={0}
                    className={classNames(`tabs__button tabs__button_${size}`, size)}
                >
                    <TagOutline className="tabs__button_icon" size={24} />
                    <span className="tabs__button_text">Tab</span>

                    {/* todo: use element only if has a 'slot' content */}
                    <div className="tabs__button_slot" />
                </button>
                <button
                    type="button"
                    role="tab"
                    tabIndex={0}
                    className={classNames(`tabs__button tabs__button_error tabs__button_${size}`, size)}
                >
                    <TagOutline className="tabs__button_icon" size={24} />
                    <span className="tabs__button_text">Tab</span>

                    {/* todo: use icon only for 'state: error' */}
                    <InfoFill className="tabs__button_iconError" size={24} />
                </button>
                <button
                    type="button"
                    role="tab"
                    tabIndex={0}
                    className={classNames(`tabs__button tabs__button_disabled tabs__button_${size}`, size)}
                >
                    <TagOutline className="tabs__button_icon" size={24} />
                    <span className="tabs__button_text">Tab</span>
                </button>

                {/* todo: use button only for 'horizontal' direction */}
                <Button
                    className="tabs__nav_button"
                    Icon={ChevronRight}
                    size={size}
                    appearance="secondary"
                    displayType="text"
                    onClick={() => {}}
                />
            </div>

            <div className="tabs__stage" />
        </div>
    );
};

export { ITabsProps, Tabs as default };
