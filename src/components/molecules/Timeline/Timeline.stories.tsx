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
        className: args({ control: "false", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        direction: args({ control: "select", ...propCategory.appearance }),
        position: args({ control: "select", ...propCategory.appearance })
        // fill Timeline component argTypes
    },
    args: {
        title: "Title",
        description: "Description",
        direction: "vertical",
        position: "after"
        // fill Timeline component args
    } as ITimelineProps
};

export default meta;

const Template: FC<ITimelineProps> = (props) => <Timeline {...props} />;

export const Default = Template.bind({});

Default.args = {} as ITimelineProps;
