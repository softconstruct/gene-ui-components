import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Breadcrumb.scss";

interface IBreadcrumbProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Breadcrumb component props interface
}

/**
 * Breadcrumb component is a navigational aid that displays the user's current location within a website or application. It provides a trail of links back to the starting or entry point, allowing users to easily navigate through the hierarchical structure of the site. Breadcrumbs enhance usability by offering a clear path for users to trace their steps and return to previous sections.
 */
const Breadcrumb: FC<IBreadcrumbProps> = ({ className }) => {
    return <div className={classNames("breadcrumb", className)}>Breadcrumb</div>;
};

export { IBreadcrumbProps, Breadcrumb as default };
