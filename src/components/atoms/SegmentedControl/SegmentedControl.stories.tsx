import React, { ComponentType, FC } from "react";
import { Meta } from "@storybook/react";
import { TagOutline } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import SegmentedControl, { ISegmentedControlProps, SegmentedControlItem } from "./index";

const meta: Meta<typeof SegmentedControl> = {
    title: "Atoms/SegmentedControl",
    component: SegmentedControl,
    argTypes: {
        required: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: false, ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        onChange: args({ control: false, ...propCategory.action })
    },
    args: {
        helperText: "helperText",
        label: "label",
        size: "medium"
    },
    subcomponents: { SegmentedControlItem: SegmentedControlItem as ComponentType<unknown> }
};

export default meta;

const Template: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props}>
            <SegmentedControlItem name="data1" Icon={TagOutline}>
                Data1
            </SegmentedControlItem>
            <SegmentedControlItem name="data2" Icon={TagOutline} selected>
                Data2
            </SegmentedControlItem>
            <SegmentedControlItem name="data3" Icon={TagOutline}>
                Data3
            </SegmentedControlItem>
        </SegmentedControl>
    );
};

export const Default = Template.bind({});

Default.args = {};

const WithoutText: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props}>
            <SegmentedControlItem name="data1" selected Icon={TagOutline} />
            <SegmentedControlItem name="data2" Icon={TagOutline} />
            <SegmentedControlItem name="data3" Icon={TagOutline} />
        </SegmentedControl>
    );
};
export const OnlyIcon = WithoutText.bind({});

const WithoutIcons: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props}>
            <SegmentedControlItem name="data1">Data1</SegmentedControlItem>
            <SegmentedControlItem name="data2" selected>
                Data2
            </SegmentedControlItem>
            <SegmentedControlItem name="data3">Data3 </SegmentedControlItem>
        </SegmentedControl>
    );
};
export const OnlyText = WithoutIcons.bind({});
