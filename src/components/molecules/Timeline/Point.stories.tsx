import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import TimelinePoint, { ITimelineProps } from "./TimelinePoint";
import Timelines from "./Timelines";

const meta: Meta<typeof TimelinePoint> = {
    title: "Molecules/Timeline",
    component: TimelinePoint,
    argTypes: {
        direction: args({ control: "select", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content })
    },
    args: {
        title: "Task A",
        description: "Description A",
        status: "active",
        direction: "vertical"
    } as ITimelineProps
};

export default meta;

const Template: FC<ITimelineProps> = (props) => {
    const { direction } = props;
    return (
        <Timelines direction={direction}>
            <TimelinePoint {...props} />
            <TimelinePoint {...props} />
        </Timelines>
    );
};
export const SinglePoint = Template.bind({});
