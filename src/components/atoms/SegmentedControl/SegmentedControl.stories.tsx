import React, { FC } from "react";
import { Meta } from "@storybook/react";
import { TagOutline } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import SegmentedControl, { ISegmentedControlProps } from "./index";
import Control from "./Control";
import { IGlobalProps } from "./types";

const meta: Meta<typeof SegmentedControl> = {
    title: "Atoms/SegmentedControl",
    component: SegmentedControl,
    argTypes: {
        disabled: args({ control: "boolean", ...propCategory.states }),
        iconBefore: args({ control: "boolean", ...propCategory.states }),
        isSelected: args({ control: "boolean", ...propCategory.appearance }),
        helperText: args({ control: "text", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.appearance }),
        Icon: args({ control: false, ...propCategory.content }),
        children: args({ control: false, ...propCategory.content }),
        onChange: args({ control: false, ...propCategory.action })
    },
    args: {
        disabled: false,
        helperText: "helperText",
        label: "label",
        iconBefore: true,
        isSelected: true,
        size: "medium"
    } as IGlobalProps & ISegmentedControlProps
};

export default meta;

const Template: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props} Icon={TagOutline}>
            <Control name="data1" isSelected>
                Data1
            </Control>
            <Control name="data2"> Data2</Control>
            <Control name="data3">Data3 </Control>
        </SegmentedControl>
    );
};

export const Default = Template.bind({});

Default.args = {
    id: "default-id",
    className: "default-class",
    style: { backgroundColor: "lightgray" },
    label: "Default Label",
    helperText: "Default Helper Text"
};

const WithoutText: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props} Icon={TagOutline}>
            <Control name="data1" isSelected />
            <Control name="data2" />
            <Control name="data3" />
        </SegmentedControl>
    );
};
export const OnlyIcon = WithoutText.bind({});
