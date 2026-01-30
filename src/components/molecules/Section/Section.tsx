import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Section.scss";

interface ISectionProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Section component props interface
}

/**
 * The Section component organizes content into meaningful groups, breaking down complex pages into manageable, logically arranged areas. It consists of three key parts: a header, a body, and a footer.
 */
const Section: FC<ISectionProps> = ({ className }) => {
    return <div className={classNames("section", className)}>Section</div>;
};

export { ISectionProps, Section as default };
