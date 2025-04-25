import React, { FC } from "react";
import classNames from "classnames";

import { Globe } from "@geneui/icons";

import NavigationColItem from "@components/molecules/Navigation/NavigattionColItem";

// Styles
import "./Navigation.scss";

import { Divider } from "../../../index";

interface INavigationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Open state for Navigation component.
     */
    // open?: boolean;
}

/**
 * Navigation is a vertical component that appears on the left side of a user interface. It provides users with quick access to key features.
 */
const Navigation: FC<INavigationProps> = ({ className }) => {
    return (
        <div className={classNames("navigation", className)} role="navigation">
            <div className="navigation__col">
                <div className="navigation__col_wrapper">
                    <NavigationColItem Icon={Globe} title="Menu Item" />
                </div>
                <Divider className="navigation__divider" vertical />
            </div>
        </div>
    );
};

export { INavigationProps, Navigation as default };
