import React, { FC, ReactNode } from "react";

interface IProductsMainSectionProps {
    /**
     * Provided `<Product/>` components will be rendered in the first section of the popover body
     */
    children: ReactNode;
}

const ProductsMainSection: FC<IProductsMainSectionProps> = ({ children }) => {
    return <div className="products__list">{children}</div>;
};

export { IProductsMainSectionProps, ProductsMainSection as default };
