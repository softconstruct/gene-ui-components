import React, { cloneElement, FC, isValidElement, ReactNode, useContext } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Components
import Badge from "@components/atoms/Badge";
import Text from "@components/atoms/Text";

import { ProductsContext } from "./Products";

export interface IProductProps {
    /**
     * Unique id for `Product`.
     */
    id?: string | number;
    /**
     * The text displayed as the `title` for the `Product`.
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
     * Indicates whether the `Product` is `disabled`.
     */
    disabled?: boolean;
    /**
     * Indicates whether the `Product` is currently selected.
     */
    selected?: boolean;
    /**
     * The navigation path for the product, used by the render prop.
     */
    path?: string;
    /**
     * Custom render function for the product link.<br />
     * Example usage:
     * ```render={() => <a href={product.path} aria-label={product.title} />}```
     */
    render?: () => ReactNode;
}

const ProductButton: FC<IProductProps> = (props) => {
    const { title, Icon, disabled, selected, render } = props;
    const { onChange } = useContext(ProductsContext);

    const onClickHandler = () => {
        if (onChange && !disabled) {
            onChange(props);
        }
    };

    const productContent = (
        <>
            <span className="products__item_logo">
                <Icon size={48} />
            </span>
            <Text as="span" className="products__item_title" alignment="center">
                {title}
            </Text>
        </>
    );

    const commonProps = {
        className: classNames("products__item", {
            products__item_disabled: disabled,
            products__item_selected: selected
        }),
        disabled
    };

    const interactiveElement = (() => {
        if (render) {
            const renderedElement = render();
            if (isValidElement(renderedElement)) {
                const originalOnClick = (renderedElement.props as { onClick?: (event: React.MouseEvent) => void })
                    .onClick;

                const propsToApply = {
                    ...commonProps,
                    className: classNames(commonProps.className, renderedElement.props.className),
                    onClick: (event: React.MouseEvent) => {
                        originalOnClick?.(event);
                        onClickHandler();
                    }
                };
                return cloneElement(renderedElement, propsToApply, productContent);
            }
        }

        return (
            <button type="button" {...commonProps} onClick={onClickHandler}>
                {productContent}
            </button>
        );
    })();

    return interactiveElement;
};

const Product: FC<IProductProps> = (props) => {
    const { withBadge } = props;

    return withBadge ? (
        <Badge className="products__badge" withBorder>
            <ProductButton {...props} />
        </Badge>
    ) : (
        <ProductButton {...props} />
    );
};

export { Product as default };
