import React, { ComponentType, FC, useState } from "react";
import { Meta } from "@storybook/react";

import { Tag } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import {
    ISegmentedControlButtonProps,
    ISegmentedControlProps,
    SegmentedControl,
    SegmentedControlButton
} from "./index";

const segmentedControlData: ISegmentedControlButtonProps[] = [
    {
        name: "data1",
        Icon: Tag,
        children: "data1"
    },
    {
        name: "data2",
        Icon: Tag,
        children: "data2"
    },
    {
        name: "data3",
        Icon: Tag,
        children: "data3"
    },
    {
        name: "data4",
        Icon: Tag,
        children: "data4"
    }
];

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
    const [selectedVal, setSelectedVal] = useState<string>("data2");
    const onChangeHandler = (name: string) => {
        setSelectedVal(name);
    };

    return (
        <SegmentedControl {...props} value={selectedVal} onChange={onChangeHandler}>
            {segmentedControlData.map(({ name, Icon, children }) => {
                return (
                    <SegmentedControlButton name={name} Icon={Icon}>
                        {children}
                    </SegmentedControlButton>
                );
            })}
        </SegmentedControl>
    );
};

export const Default = Template.bind({});

const WithoutText: FC<ISegmentedControlProps> = (props) => {
    return (
        <SegmentedControl {...props}>
            {segmentedControlData.map(({ Icon, name }) => (
                <SegmentedControlButton name={name} Icon={Icon} />
            ))}
        </SegmentedControl>
    );
};
export const OnlyIcon = WithoutText.bind({});
