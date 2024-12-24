import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Timeline, { ITimelineProps } from "./index";

const meta: Meta<typeof Timeline> = {
    title: "Molecules/Timeline",
    component: Timeline,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Timeline component argTypes
    },
    args: {
        // fill Timeline component args
    } as ITimelineProps
};

export default meta;

const Template: FC<ITimelineProps> = (props) => <Timeline {...props} />;

export const Default = Template.bind({});

Default.args = {} as ITimelineProps;
