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
     * The `alignContent` prop accepts a JSX element that will be displayed alongside the divider
     */
    content?: JSX.Element;
    /**
     * Divider direction <br/>
     * If the `vertical` prop is `true`, the `Divider` will be displayed vertically otherwise the `Divider` will be displayed horizontally
     */
    vertical?: boolean;
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the divider.
     */
    Icon?: FC<IconProps> | null;
    /**
     * Divider label <br/>
     * Text which will be displayed with `Divider`. The position of the `label` depends on `labelPosition` prop
     */
    label?: string;
    /**
     * Divider `label` position <br/>
     * Possible values: `before | after | center`
     */
    labelPosition?: "before" | "after" | "center";
    /**
     * provides space between the edge and the divider
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
    vertical,
    label,
    labelPosition = "before",
    content,
    inset = false,
    className
}) => {
    return (
        <div
            className={classNames(
                `divider divider_${inset ? "inset" : "block"} divider_color_${appearance}  `,
                className,
                {
                    divider_horizontal: !vertical,
                    divider_vertical: vertical,
                    [` divider_withLabel_${labelPosition}`]: (label || Icon) && !vertical
                }
            )}
        >
            {!vertical && (
                <>
                    {content && <div className="divider__element">{content}</div>}
                    {(label || Icon) && (
                        <div className="divider__label">
                            {label && <span className="divider__text ellipsis-text">{label}</span>}
                            {Icon && <Icon className="divider__icon" size={20} />}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export { IDividerProps, Divider as default };