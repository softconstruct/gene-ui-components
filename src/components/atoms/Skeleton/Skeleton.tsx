import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Skeleton.scss";

interface ISkeletonProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Set color to inverse appearance
     */
    inverse?: boolean;
    /**
     * This prop defines the width for the component <br/>
     */
    width?: number;
    /**
     * This prop defines the height for the component <br/>
     */
    height?: number;
    /**
     * This prop defines the rounded for the component <br/>
     * possible values rounded4X | rounded3X | rounded2X | circle
     */
    rounded?: "rounded4X" | "rounded3X" | "rounded2X" | "circle";
    /**
     * Defines whether the row should be flexible or not <br/>
     */
    flexible?: boolean;
}

const Skeleton: FC<ISkeletonProps> = ({
    height = 40,
    width = "100%",
    inverse,
    rounded = "rounded2X",
    flexible,
    className
}) => {
    return (
        <div
            className={classNames("skeleton", className, {
                skeleton_backInverse: inverse,
                [`skeleton_${rounded}`]: rounded,
                skeleton_flexible: flexible
            })}
            style={{ width, height }}
        />
    );
};

export { ISkeletonProps, Skeleton as default };
