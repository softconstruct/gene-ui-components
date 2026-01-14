import React, { FC } from "react";
import classNames from "classnames";

import { ChevronRight, Globe, Tag, ThreeDotsHorizontal } from "@geneui/icons";

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
    return (
        <div className={classNames("breadcrumb", className)}>
            <nav aria-label="breadcrumb navigation">
                <ul className="breadcrumb__list">
                    <li className="breadcrumb__item">
                        {/* todo: add the next classNames for icon alignment: "breadcrumb__link_iconBefore" */}
                        <a className="breadcrumb__link breadcrumb__link_iconBefore" href="#" tabIndex={0}>
                            <Globe size={20} className="breadcrumb__icon" />
                            <span className="breadcrumb__text">Nav Item</span>
                        </a>

                        {/* todo: change "ChevronRight" Icon to "/" as in design file */}
                        <ChevronRight size={24} />
                    </li>
                    <li className="breadcrumb__item">
                        {/* todo: add the next classNames for icon alignment: "breadcrumb__link_iconOnly" */}
                        <a className="breadcrumb__link breadcrumb__link_iconOnly" href="#" tabIndex={0}>
                            <Tag size={20} className="breadcrumb__icon" />
                        </a>

                        {/* todo: change "ChevronRight" Icon to "/" as in design file */}
                        <ChevronRight size={24} />
                    </li>
                    <li className="breadcrumb__item">
                        {/* todo: add the next classNames for disabled state: "breadcrumb__link_disabled" */}
                        <a className="breadcrumb__link breadcrumb__link_disabled" href="#" tabIndex={-1}>
                            <span className="breadcrumb__text">Nav Item</span>
                        </a>

                        {/* todo: change "ChevronRight" Icon to "/" as in design file */}
                        <ChevronRight size={24} />
                    </li>
                    <li className="breadcrumb__item">
                        {/* todo: add the next classNames for icon alignment: "breadcrumb__link_iconOnly" */}
                        <span className="breadcrumb__link breadcrumb__link_iconOnly">
                            <ThreeDotsHorizontal size={20} className="breadcrumb__icon" />

                            {/* todo: import "Menu" component */}
                        </span>

                        {/* todo: change "ChevronRight" Icon to "/" as in design file */}
                        <ChevronRight size={24} />
                    </li>
                    <li className="breadcrumb__item">
                        <a className="breadcrumb__link" href="#" tabIndex={0}>
                            <span className="breadcrumb__text">Nav Item</span>
                        </a>

                        {/* todo: change "ChevronRight" Icon to "/" as in design file */}
                        <ChevronRight size={24} />
                    </li>
                    <li className="breadcrumb__item" aria-current="page">
                        {/* todo: add the next classNames for active state: "breadcrumb__link_active" */}
                        <span className="breadcrumb__link breadcrumb__link_active">
                            <span className="breadcrumb__text">Nav Item</span>
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export { IBreadcrumbProps, Breadcrumb as default };
