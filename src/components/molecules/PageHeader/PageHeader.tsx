import React, { FC, ReactElement, ReactNode } from "react";
import classNames from "classnames";

// Components
import Breadcrumb from "@components/molecules/Breadcrumb";

// Hooks
import useDeviceInfo from "@hooks/useDeviceInfo";

// Styles
import "./PageHeader.scss";

interface IPageHeaderProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Optional Breadcrumb component shown above header content.
     */
    breadcrumb?: ReactElement<typeof Breadcrumb>;
    /**
     * Optional header content such as title, subtitle, actions, or custom layout.
     */
    children?: ReactNode;
    /**
     * Makes the component sticky and applies raised shadow style when `true`.
     */
    fixed?: boolean;
}

/**
 * The Page Header component provides context and navigation aids at the top of a page. It typically includes the page title, breadcrumbs, and optional action buttons, search fields, or secondary navigation links.
 */
const PageHeader: FC<IPageHeaderProps> = ({ className, breadcrumb, children, fixed = false }) => {
    const { isMobileDevice } = useDeviceInfo();

    return (
        <div
            className={classNames("pageHeader", className, {
                pageHeader_fixed: fixed,
                pageHeader_mobile: isMobileDevice
            })}
        >
            {breadcrumb && <div className="pageHeader__breadcrumb">{breadcrumb}</div>}
            {children && <div className="pageHeader__content">{children}</div>}
        </div>
    );
};

export { IPageHeaderProps, PageHeader as default };
