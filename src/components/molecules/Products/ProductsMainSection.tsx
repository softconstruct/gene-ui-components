import React, { Children, cloneElement, FC, ReactNode } from "react";
import classNames from "classnames";

// Components
import { IProductProps } from "./index";

interface IProductsMainSectionProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Provide `<Product/>` components to be rendered in the `<ProductsMainSection/>`
     */
    children: ReactNode;
}

const ProductsMainSection: FC<IProductsMainSectionProps> = ({ children, className }) => {
    return (
        <div className={classNames(className, `products__list`)}>
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
