import React, { createContext, FC, ReactNode, useMemo } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { ChevronRight, Globe, IconProps, Tag, ThreeDotsHorizontal } from "@geneui/icons";

import BreadcrumbItem, { IBreadcrumbItemProps } from "@components/molecules/Breadcrumb/BreadCrumbItem";

// Styles
import "./Breadcrumb.scss";

export type IBreadcrumbRender = (linkData: {
    path?: string;
    title?: string;
    isActive?: boolean;
    Icon?: FC<IconProps>;
}) => ReactNode;

interface IBreadcrumbProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Custom render function for breadcrumb links.
     */
    render?: IBreadcrumbRender;
    /**
     * Called when a breadcrumb item is clicked.
     */
    onClick?: (item: IBreadcrumbItemProps) => void;
    breadCrumbsData: IBreadcrumbItemProps[];
    iconOnly?: boolean;
}

interface IBreadcrumbContextProps {
    iconOnly?: boolean;
    isLastItem?: boolean;
    render?: IBreadcrumbRender;
    onClick?: (item: IBreadcrumbItemProps) => void;
}

export const BreadcrumbContext = createContext<IBreadcrumbContextProps>({} as IBreadcrumbContextProps);

interface BreadcrumbItemWrapperProps {
    props: IBreadcrumbItemProps;
    iconOnly: boolean;
    isLastItem: boolean;
    render?: IBreadcrumbRender;
    onClick?: (item: IBreadcrumbItemProps) => void;
}

const BreadcrumbItemWrapper: FC<BreadcrumbItemWrapperProps> = ({ props, iconOnly, isLastItem, render, onClick }) => {
    const itemContextValue: IBreadcrumbContextProps = useMemo(
        () => ({
            iconOnly,
            isLastItem,
            render,
            onClick
        }),
        [iconOnly, isLastItem, render, onClick]
    );

    return (
        <BreadcrumbContext.Provider value={itemContextValue}>
            <BreadcrumbItem {...props} />
        </BreadcrumbContext.Provider>
    );
};

/**
 * Breadcrumb component is a navigational aid that displays the user's current location within a website or application. It provides a trail of links back to the starting or entry point, allowing users to easily navigate through the hierarchical structure of the site. Breadcrumbs enhance usability by offering a clear path for users to trace their steps and return to previous sections.
 */
const Breadcrumb: FC<IBreadcrumbProps> = ({ className, breadCrumbsData, iconOnly = false, render, onClick }) => {
    return (
        <>
            <div className={classNames("breadcrumb", className)}>
                <nav aria-label="breadcrumb navigation">
                    <ul className="breadcrumb__list">
                        {breadCrumbsData &&
                            breadCrumbsData.map((props, index) => {
                                const isLastItem = index === breadCrumbsData.length - 1;
                                const key = nanoid();

                                return (
                                    <BreadcrumbItemWrapper
                                        key={key}
                                        props={props}
                                        iconOnly={iconOnly}
                                        isLastItem={isLastItem}
                                        render={render}
                                        onClick={onClick}
                                    />
                                );
                            })}
                    </ul>
                </nav>
            </div>
            <div className={classNames("breadcrumb", className)}>
                <nav aria-label="breadcrumb navigation">
                    <ul className="breadcrumb__list">
                        <li className="breadcrumb__item">
                            {/* todo: add the next classNames for icon alignment: "breadcrumb__link_iconBefore" */}
                            <button
                                className="breadcrumb__link breadcrumb__link_iconBefore"
                                tabIndex={0}
                                onClick={() => {}}
                                type="button"
                            >
                                <Globe size={20} className="breadcrumb__icon" />
                                <span className="breadcrumb__text">Nav Item</span>
                            </button>

                            {/* todo: change "ChevronRight" Icon to "/" as in design file */}
                            {/* <ChevronRight size={24} /> */}
                            <span>/</span>
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
        </>
    );
};

export { IBreadcrumbProps, Breadcrumb as default };
