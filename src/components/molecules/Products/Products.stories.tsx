import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Copy, CurrencyGlobal, Globe, HamburgerMenu } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import { IProductProps, IProductsProps, Product, Products, ProductsMainSection, ProductsSecondarySection } from ".";

const meta: Meta<IProductsProps> = {
    title: "Molecules/Products",
    component: Products,
    subcomponents: {
        Product
    },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.action }),
        children: args({ control: "false", ...propCategory.content })
    }
};

type Story = StoryObj<IProductsProps>;

const testMainProducts: IProductProps[] = [
    { id: 1, title: "Backoffice", withBadge: true, Icon: Globe, path: "/backoffice" },
    { id: 2, title: "BME", withBadge: true, Icon: CurrencyGlobal, path: "/bme" },
    { id: 3, title: "Affiliate", Icon: Copy, path: "/affiliate" }
];

const testSecondaryProducts: IProductProps[] = [
    { id: 5, title: "CMS", Icon: Globe, path: "/cms" },
    { id: 4, title: "Translation Tool", Icon: HamburgerMenu, disabled: true, path: "/translation" }
];

export default meta;

const StoryComponent: FC<IProductsProps> = (props) => {
    const [products, setProducts] = useState([...testMainProducts, ...testSecondaryProducts]);

    const handleProductChange = (productData: IProductProps) => {
        setProducts((prevProducts) => prevProducts.map((p) => ({ ...p, selected: p.id === productData.id })));
    };

    return (
        <div
            style={{
                justifyContent: "end",
                display: "flex",
                backgroundColor: "#262627",
                padding: "1rem",
                colorScheme: "light"
            }}
        >
            <Products {...props} onChange={handleProductChange}>
                <ProductsMainSection>
                    {products.slice(0, 3).map((product) => (
                        <Product key={product.id} {...product} />
                    ))}
                </ProductsMainSection>
                <ProductsSecondarySection>
                    {products.slice(3).map((product) => (
                        <Product key={product.id} {...product} />
                    ))}
                </ProductsSecondarySection>
            </Products>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryComponent {...props} />
};

const WithRenderStoryComponent: FC<IProductsProps> = (props) => {
    const [activeId, setActiveId] = useState<string | number | null>(1);

    const handleProductChange = (productData: IProductProps) => {
        setActiveId(productData.id);
    };

    return (
        <div
            style={{
                justifyContent: "end",
                display: "flex",
                backgroundColor: "#262627",
                padding: "1rem",
                colorScheme: "light"
            }}
        >
            <Products {...props} onChange={handleProductChange}>
                <ProductsMainSection>
                    {testMainProducts.map((product) => (
                        <Product
                            key={product.id}
                            {...product}
                            selected={product.id === activeId}
                            render={() => (
                                <a href={product.path} aria-label={product.title} onClick={(e) => e.preventDefault()} />
                            )}
                        />
                    ))}
                </ProductsMainSection>
            </Products>
        </div>
    );
};

export const WithRender: Story = {
    render: (props) => <WithRenderStoryComponent {...props} />
};
