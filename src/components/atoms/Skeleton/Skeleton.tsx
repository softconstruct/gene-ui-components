import React, { FC } from "react";
// Styles
import "./Skeleton.scss";

interface ISkeletonProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    // isInverse?: boolean;
    width?: number;
    height?: number;
    // isFlexible?: boolean;
    // fill Skeleton component props interface
}

/**
 * Skeleton is a placeholder UI element that mimics the layout of content while it is still loading.
 */

// Border Radius classes
// skeleton_rounded4X, skeleton_rounded3X, skeleton_rounded2X, skeleton_circle

const Skeleton: FC<ISkeletonProps> = ({ height = 40, width = "100%" }) => {
    return (
        // skeleton_backInverse class for inverse
        <div className="skeleton skeleton_flexible skeleton_rounded3X" style={{ width, height }} />
    );
};

export { ISkeletonProps, Skeleton as default };
