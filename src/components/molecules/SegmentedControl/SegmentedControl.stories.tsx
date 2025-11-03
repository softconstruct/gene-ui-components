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
        children: "data1",
        selected: true
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
    const [segmentedControls, setSegmentedControls] = useState<ISegmentedControlButtonProps[]>(segmentedControlData);
    const onChangeHandler = (name: string) => {
        setSegmentedControls((prev) => {
            return prev.map((el) => ({ ...el, selected: el.name === name }));
        });
    };

    return (
        <SegmentedControl {...props} onChange={onChangeHandler}>
            {segmentedControls.map(({ name, Icon, children, selected }) => {
                return (
                    <SegmentedControlButton name={name} Icon={Icon} selected={selected}>
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
