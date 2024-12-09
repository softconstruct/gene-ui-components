import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import SegmentedControl, { ISegmentedControlProps } from "./index";

const meta: Meta<typeof SegmentedControl> = {
    title: "Atoms/SegmentedControl",
    component: SegmentedControl,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill SegmentedControl component argTypes
    },
    args: {
        // fill SegmentedControl component args
    } as ISegmentedControlProps
};

export default meta;

const Template: FC<ISegmentedControlProps> = (props) => <SegmentedControl {...props} />;

export const Default = Template.bind({});

Default.args = {} as ISegmentedControlProps;
