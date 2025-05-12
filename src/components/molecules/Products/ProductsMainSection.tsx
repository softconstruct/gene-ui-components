import React, { Children, cloneElement, FC, ReactNode } from "react";

// Components
import { IProductProps } from "./index";

interface IProductsMainSectionProps {
    /**
     * Provide `<Product/>` components to be rendered in the `<ProductsMainSection/>`
     */
    children: ReactNode;
}

const ProductsMainSection: FC<IProductsMainSectionProps> = ({ children }) => {
    return (
        <div className="products__list">
            {Children.map(children, (product, i) => {
                if (!React.isValidElement<IProductProps>(product)) return product;

                return cloneElement(product, {
                    id: product.props.id || i + 1,
                    title: product.props.title,
                    Icon: product.props.Icon
                });
            })}
        </div>
    );
};

export { IProductsMainSectionProps, ProductsMainSection as default };
