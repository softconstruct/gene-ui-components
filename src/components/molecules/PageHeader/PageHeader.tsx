import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./PageHeader.scss";

interface IPageHeaderProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill PageHeader component props interface
}

/**
 * The Page Header component provides context and navigation aids at the top of a page. It typically includes the page title, breadcrumbs, and optional action buttons, search fields, or secondary navigation links.
 */
const PageHeader: FC<IPageHeaderProps> = ({ className }) => {
    return <div className={classNames("pageHeader", className)}>PageHeader</div>;
};

export { IPageHeaderProps, PageHeader as default };
