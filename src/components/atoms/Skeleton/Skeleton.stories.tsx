import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Skeleton, { ISkeletonProps } from "./index";

const meta: Meta<typeof Skeleton> = {
    title: "Atoms/Skeleton",
    component: Skeleton,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Skeleton component argTypes
    },
    args: {
        // fill Skeleton component args
    } as ISkeletonProps
};

export default meta;

const Template: FC<ISkeletonProps> = (props) => <Skeleton {...props} />;

export const Default = Template.bind({});

Default.args = {} as ISkeletonProps;
