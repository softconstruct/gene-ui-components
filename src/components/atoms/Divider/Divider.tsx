import React, { FC, JSX } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Styles
import "./Divider.scss";

interface IDividerProps {
    /**
     * Divider visual style <br/>
     * Possible values: `default | strong | brand | inverse`
     */
    appearance?: "default" | "strong" | "brand" | "inverse";
    /**
     * Divider content <br/>
     * The prop accepts a JSX element that will be displayed alongside the divider
     */
    swappableElement?: JSX.Element;
    /**
     * Divider direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the divider.
     */
    Icon?: FC<IconProps> | null;
    /**
     * Divider text <br/>
     * Text which will be displayed with `Divider`. The position of the `text` depends on `contentPosition` prop
     */
    text?: string;
    /**
     * Divider `text` and `icon` positions <br/>
     * Possible values: `before | after | center`
     */
    contentPosition?: "before" | "after" | "center";
    /**
     * Provides space between the edge and the divider
     */
    inset?: boolean;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * A divider separates sections of content to establish visual rhythm and hierarchy. Combine dividers with appropriate spacing and text hierarchy to effectively organize content within your layout.
 */
const Divider: FC<IDividerProps> = ({
    appearance = "default",
    Icon,
    direction = "horizontal",
    text,
    contentPosition = "before",
    swappableElement,
    inset = false,
    className
}) => {
    return (
        <div
            className={classNames(
                `divider divider_${inset ? "inset" : "block"} divider_color_${appearance}`,
                className,
                {
                    divider_horizontal: direction === "horizontal",
                    divider_vertical: direction === "vertical",
                    [` divider_withLabel_${contentPosition}`]: (text || Icon) && direction === "horizontal"
                }
            )}
        >
            {direction === "horizontal" && (
                <>
                    {swappableElement && <div className="divider__element">{swappableElement}</div>}
                    {(text || Icon) && (
                        <div className="divider__label">
                            {text && <span className="divider__text ellipsis-text">{text}</span>}
                            {Icon && <Icon className="divider__icon" size={20} />}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export { IDividerProps, Divider as default };
