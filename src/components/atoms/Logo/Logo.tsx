import React, { FC, useContext } from "react";
import classNames from "classnames";

import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Logo.scss";

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

/**
 * A logo component displays a SoftConstruct's emblem or trademark by default, as the GeneUI design system made by the SoftConstruct, serving as a visual representation. It reinforces brand identity and recognition, typically placed in prominent locations such as the header, footer, or login page of an application or website. The src of the logo is the Provider component and you can simply pass your own brand logotype and logomark see the `GeneUIProvider` component documentation for details
 */
const Logo: FC<ILogoProps> = ({ size = "medium", type = "logotype", appearance = "brand", className }) => {
    const {
        logo: { logomark, logotype }
    } = useContext(GeneUIDesignSystemContext);

    return (
        <div className={classNames("logo", className)}>
            <div className={`logo__${type} logo__${type}_size_${size} logo__${type}_color_${appearance}`}>
                {type === "logomark" ? logomark : logotype}
            </div>
        </div>
    );
};

export { ILogoProps, Logo as default };
