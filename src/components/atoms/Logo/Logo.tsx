import React, { FC } from "react";
import classNames from "classnames";

import LogoMark from "./LogoMark";
import LogoType from "./LogoType";
// Styles
import "./Logo.scss";

const LogoComponent = {
    logomark: LogoMark,
    logotype: LogoType
};

interface ILogoProps {
    /**
     * Defines the size of the Logo.<br/>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Specifies the type of the Logo. <br>
     * Possible values: `logomark | logotype`.
     */
    type?: "logomark" | "logotype";
    /**
     * Defines the appearance of the Logo.<br>
     * Possible values: `brand | secondary | inverse`.
     */
    appearance?: "brand" | "secondary" | "inverse";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

type LogoComponentProps = Omit<ILogoProps, "className" | "type">;

/**
 * A logo component displays a Gene UI’s emblem or trademark, serving as a visual representation. It reinforces brand identity and recognition, typically placed in prominent locations such as the header, footer, or login page of an application or website.
 */
const Logo: FC<ILogoProps> = ({ size = "medium", type = "logotype", appearance = "brand", className }) => {
    const LogoSVG: FC<LogoComponentProps> = LogoComponent[type];

    return (
        <div className={classNames("logo", className)}>
            <LogoSVG size={size} appearance={appearance} />
        </div>
    );
};

export { ILogoProps, LogoComponentProps, Logo as default };
