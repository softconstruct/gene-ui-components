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
    // fill Skeleton component props interface
}

/**
 * Skeleton is a placeholder UI element that mimics the layout of content while it is still loading.
 */
const Skeleton: FC<ISkeletonProps> = ({ className }) => {
    return <div className={classNames("skeleton", className)}>Skeleton</div>;
};

export { ISkeletonProps, Skeleton as default };
