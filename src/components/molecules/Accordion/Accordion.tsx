import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Accordion.scss";

interface IAccordionProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Accordion component props interface
}

/**
 * Accordion component organizes content into expandable and collapsible sections, allowing users to reveal or hide detailed information as needed. Each section, or "panel," typically includes a header that summarizes the content and can be clicked to expand or collapse the corresponding panel.
 */
const Accordion: FC<IAccordionProps> = ({ className }) => {
    return <div className={classNames("accordion", className)}>Accordion</div>;
};

export { IAccordionProps, Accordion as default };
