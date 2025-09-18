import React, { FC, ReactNode } from "react";

import Divider from "@components/atoms/Divider";

interface IProductsSecondarySectionProps {
    /**
     * Provided `<Product/>` components will be rendered in the second section of the popover body
     */
    children: ReactNode;
}

const ProductsSecondarySection: FC<IProductsSecondarySectionProps> = ({ children }) => {
    return (
        <>
            <Divider />
            <div className="products__list">{children}</div>
        </>
    );
};

export { IProductsSecondarySectionProps, ProductsSecondarySection as default };
