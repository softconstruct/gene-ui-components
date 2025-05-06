import React, { FC, useContext } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Components
import Badge from "@components/atoms/Badge";
import Text from "@components/atoms/Text";

import { ProductsContext } from "./Products";

interface IProductProps {
    /**
     * Unique id for `Product`.
     */
    id?: string | number;
    /**
     * The text displayed as the `title` for the `Product`, describing its purpose.<br>
     */
    title: string;
    /**
     * Configuration settings for the `Badge` component displayed with the `Product`.
     * If provided, the `product` will be wrapped inside a `Badge`.
     */
    withBadge?: boolean;
    /**
     * The `Icon` prop accepts a JSX element that will be rendered within the `Product`.
     */
    Icon: FC<IconProps>;
    /**
     * Indicates whether the `Product` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const ProductButton: FC<Omit<IProductProps, "withBadge">> = (props) => {
    const { title, Icon, disabled, className } = props;
    const { onClick } = useContext(ProductsContext);

    return (
        <button
            type="button"
            disabled={disabled}
            className={classNames("products__item", className, { products__item_disabled: disabled })}
            onClick={() => onClick(props)}
        >
            <span className="products__item_logo">
                <Icon size={48} />
            </span>
            <Text as="span" className="products__item_title" alignment="center">
                {title}
            </Text>
        </button>
    );
};

const Product: FC<IProductProps> = (props) => {
    const { withBadge } = props;

    return withBadge ? (
        <Badge className="products__badge">
            <ProductButton {...props} />
        </Badge>
    ) : (
        <ProductButton {...props} />
    );
};

export { IProductProps, Product as default };
