import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Products.scss";

interface IProductsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Products component props interface
}

/**
 * Products component is a menu-based UI element that allows users to switch between different products or services within an ecosystem.
 */
const Products: FC<IProductsProps> = ({ className }) => {
    return <div className={classNames("products", className)}>Products</div>;
};

export { IProductsProps, Products as default };
