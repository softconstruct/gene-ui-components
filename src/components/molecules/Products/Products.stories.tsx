import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Products, { IProductsProps } from "./index";

const meta: Meta<typeof Products> = {
    title: "Molecules/Products",
    component: Products,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Products component argTypes
    },
    args: {
        // fill Products component args
    } as IProductsProps
};

export default meta;

const Template: FC<IProductsProps> = (props) => <Products {...props} />;

export const Default = Template.bind({});

Default.args = {} as IProductsProps;
