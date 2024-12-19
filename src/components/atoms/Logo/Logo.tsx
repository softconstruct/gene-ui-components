import React, { FC, ReactElement, SVGProps } from "react";
import classNames from "classnames";

// Styles
import "./Logo.scss";

interface ILogoProps {
    /**
     * Specifies the SVG icon to render.<br/>
     * Accepts a valid SVG element or its name as a string.
     */
    svg: ReactElement<SVGProps<SVGSVGElement>>;
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

/**
 * A logo component displays a Gene UI’s emblem or trademark, serving as a visual representation. It reinforces brand identity and recognition, typically placed in prominent locations such as the header, footer, or login page of an application or website.
 */
const Logo: FC<ILogoProps> = ({ svg, size = "medium", type = "logotype", appearance = "brand", className }) => {
    return (
        <div className={classNames("logo", className)}>
            <div className={`logo__${type} logo__${type}_size_${size} logo__${type}_color_${appearance}`}>{svg}</div>
        </div>
    );
};

export { ILogoProps, Logo as default };
