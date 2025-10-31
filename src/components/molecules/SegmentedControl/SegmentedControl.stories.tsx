import React, { ComponentType, FC } from "react";
import { Meta } from "@storybook/react";

import { Tag } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import { ISegmentedControlProps, SegmentedControl, SegmentedControlButton } from "./index";

const meta: Meta<typeof SegmentedControl> = {
    title: "Molecules/SegmentedControl",
    component: SegmentedControl,
    argTypes: {
        required: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        onChange: args({ control: "false", ...propCategory.action }),
        status: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        helperText: "helperText",
        label: "label",
        size: "medium"
    },
    subcomponents: { SegmentedControlButton: SegmentedControlButton as ComponentType<unknown> }
};

export default meta;

const Template: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props}>
            <SegmentedControlButton name="data1" Icon={Tag}>
                Data1
            </SegmentedControlButton>
            <SegmentedControlButton name="data2" Icon={Tag} selected>
                Data2
            </SegmentedControlButton>
            <SegmentedControlButton name="data3" Icon={Tag}>
                Data3
            </SegmentedControlButton>
        </SegmentedControl>
    );
};

export const Default = Template.bind({});

const WithoutText: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props}>
            <SegmentedControlButton name="data1" selected Icon={Tag} />
            <SegmentedControlButton name="data2" Icon={Tag} />
            <SegmentedControlButton name="data3" Icon={Tag} />
        </SegmentedControl>
    );
};
export const OnlyIcon = WithoutText.bind({});

const WithoutIcons: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props}>
            <SegmentedControlButton name="data1">Data1</SegmentedControlButton>
            <SegmentedControlButton name="data2" selected>
                Data2
            </SegmentedControlButton>
            <SegmentedControlButton name="data3">Data3 </SegmentedControlButton>
        </SegmentedControl>
    );
};
export const OnlyText = WithoutIcons.bind({});
