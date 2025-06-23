import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from "react";
import classNames from "classnames";

import { AppGrid } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { Popover, PopoverBody } from "@components/atoms/Popover";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Products.scss";

import { IProductProps } from "./index";

const PRODUCT_GAP_FROM_TARGET = 4;

interface IProductsContext {
    onChange: (product: IProductProps) => void;
}

export const ProductsContext = createContext<IProductsContext>({} as IProductsContext);

interface IProductsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Provide `<ProductsMainSection/>` or `<ProductsSecondarySection/> components to be rendered in the `<Products/>`
     */
    children: ReactNode;
    /**
     * Fires when the user interact with `Product`. Provides the `Product` `id` as a callback's argument.
     */
    onChange?: (event: IProductProps) => void;
}

/**
 * Products component is a menu-based UI element that allows users to switch between different products or services within an ecosystem.
 */
const Products: FC<IProductsProps> = ({ onChange, children }) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const [propsForContent, setPropsForContent] = useState({});

    const isRTL = document.dir === "rtl";

    const memoizedProductsContextValue = useMemo(
        () => ({
            onChange
        }),
        []
    );

    return (
        <ProductsContext.Provider value={memoizedProductsContextValue as IProductsContext}>
            <Popover
                disableReposition={false}
                position={`${isRTL ? "bottom-left" : "bottom-right"}`}
                size="medium"
                setProps={setPropsForContent}
                withArrow={false}
                margin={PRODUCT_GAP_FROM_TARGET}
            >
                <PopoverBody
                    className={classNames("products", {
                        products__mobile: breakpoint?.isMobileBreakpoint
                    })}
                    withPadding={false}
                >
                    <div className="products__container">{children}</div>
                </PopoverBody>
            </Popover>

            <Button Icon={AppGrid} appearance="inverse" layout="text" {...propsForContent} />
        </ProductsContext.Provider>
    );
};

export { IProductsProps, Products as default };
