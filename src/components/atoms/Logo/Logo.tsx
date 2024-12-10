import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Logo.scss";

interface ILogoProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Logo component props interface
}

/**
 * A logo component displays a Gene UI’s emblem or trademark, serving as a visual representation. It reinforces brand identity and recognition, typically placed in prominent locations such as the header, footer, or login page of an application or website.
 */
const Logo: FC<ILogoProps> = ({ className }) => {
    return <div className={classNames("logo", className)}>Logo</div>;
};

export { ILogoProps, Logo as default };
