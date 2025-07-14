import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Copy, CurrencyGlobal, Globe, HamburgerMenu, LightBulb } from "@geneui/icons";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import { IProductProps, IProductsProps, Product, Products, ProductsMainSection, ProductsSecondarySection } from ".";

const meta: Meta<IProductsProps> = {
    title: "Molecules/Products",
    component: Products,
    subcomponents: {
        Product
    }
};
type Story = StoryObj<IProductsProps>;
type StoryProduct = StoryObj<IProductProps>;

const testMainProducts: IProductProps[] = [
    {
        id: 1,
        title: "Backoffice",
        withBadge: true,
        Icon: Globe,
        disabled: false,
        selected: true
    },
    {
        id: 2,
        title: "BME",
        withBadge: true,
        Icon: CurrencyGlobal,
        disabled: false
    },
    {
        id: 3,
        title: "Affiliate",
        Icon: Copy,
        disabled: false
    },
    {
        id: 4,
        title: "Translation Tool",
        Icon: HamburgerMenu,
        disabled: true
    }
];

const testSecondaryProducts: IProductProps[] = [
    {
        id: 5,
        title: "CMS",
        Icon: Globe
    },
    {
        id: 6,
        title: "Umbrella",
        withBadge: true,
        Icon: CurrencyGlobal
    },
    {
        id: 7,
        title: "Agent",
        Icon: Copy
    },
    {
        id: 8,
        title: "Spring",
        withBadge: true,
        Icon: HamburgerMenu
    },
    {
        id: 9,
        title: "Poker",
        Icon: Globe
    },
    {
        id: 10,
        title: "Data Spot",
        Icon: Copy
    },
    {
        id: 11,
        title: "SRMT",
        Icon: Globe
    },
    {
        id: 12,
        title: "CRMT",
        Icon: LightBulb
    },
    {
        id: 13,
        title: "LCRMT",
        withBadge: true,
        Icon: Globe
    },
    {
        id: 14,
        title: "FRMT",
        Icon: Globe
    },
    {
        id: 15,
        title: "AML & RG",
        withBadge: true,
        Icon: Globe
    }
];

const ProductsStory: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.action }),
        children: args({ control: "false", ...propCategory.content })
    },
    render: (props) => {
        return (
            <div style={{ justifyContent: "end", display: "flex", backgroundColor: "#262627" }}>
                <Products {...props}>
                    <ProductsMainSection>
                        {testMainProducts.map((product) => (
                            <Product key={product.id} {...product} />
                        ))}
                    </ProductsMainSection>
                    <ProductsSecondarySection>
                        {testSecondaryProducts.map((product) => (
                            <Product key={product.id} {...product} />
                        ))}
                    </ProductsSecondarySection>
                </Products>
            </div>
        );
    }
};

const ProductStory: StoryProduct = storyObjBuilder({
    argTypes: {
        title: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        withBadge: args({ control: "boolean", ...propCategory.content }),
        selected: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        title: "BackOffice",
        Icon: Globe,
        withBadge: true
    },
    render: (props) => {
        const onProductClick = () => {};
        return (
            <div style={{ position: "fixed", insetInlineEnd: 30, top: 30, backgroundColor: "#262627" }}>
                <Products onChange={onProductClick}>
                    <ProductsMainSection>
                        <Product title="Backoffice" Icon={Globe} {...props} />
                    </ProductsMainSection>
                </Products>
            </div>
        );
    }
});

export default meta;

export { ProductsStory as Products, ProductStory as Product };
