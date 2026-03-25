import React, { FC, ReactNode } from "react";
import classNames from "classnames";

// Components
import Breadcrumb, { IBreadcrumbProps } from "@components/molecules/Breadcrumb";

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
     * Props passed to the `Breadcrumb` component rendered inside the header.
     * When provided, the breadcrumb trail is displayed on the left side of the page header.
     */
    breadcrumbProps?: IBreadcrumbProps;
    /**
     * Extra content rendered on the right side of the header (or below breadcrumbs on mobile).
     * Typical usage: actions, search field, secondary navigation links, etc.
     */
    children?: ReactNode;
    /**
     * If `true`, makes the header sticky (stays at the top of the viewport (relative element) while scrolling).
     * @default false
     */
    sticky?: boolean;
}

/**
 * The Page Header component provides context and navigation aids at the top of a page. It typically includes the page title, breadcrumbs, and optional action buttons, search fields, or secondary navigation links.
 */
const PageHeader: FC<IPageHeaderProps> = ({ className, breadcrumbProps, children, sticky = false }) => {
    const { isMobileDevice } = useDeviceInfo();

    return (
        <div
            className={classNames("pageHeader", className, {
                pageHeader_sticky: sticky,
                pageHeader_device_mobile: isMobileDevice,
                pageHeader_device_desktop: !isMobileDevice
            })}
        >
            {breadcrumbProps && <Breadcrumb {...breadcrumbProps} className="pageHeader__breadcrumb" />}
            {children && <div className="pageHeader__content">{children}</div>}
        </div>
    );
};

export { IPageHeaderProps, PageHeader as default };
