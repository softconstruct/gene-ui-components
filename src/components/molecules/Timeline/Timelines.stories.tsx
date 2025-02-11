import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";

// Components
import TimelinesComponent, { ITimelinesProps } from "./Timelines";
import TimelinePoint, { ITimelineProps } from "./TimelinePoint";

const meta: Meta = {
    title: "Molecules/Timelines",
    component: TimelinesComponent,
    subcomponents: {
        Timeline: TimelinePoint
    }
};

export default meta;

const inlineData = [
    { title: "Task A", description: "Description A", status: "active" },
    { title: "Task B", description: "Description B", status: "error" },
    { title: "Task C", description: "Description C", status: "pending" },
    { title: "Task D", description: "Description D", status: "default" },
    { title: "Task E", description: "Description E", status: "success" }
] as const;

type Story = StoryObj<ITimelinesProps>;
type StoryTimeline = StoryObj<ITimelineProps>;

export const Timelines: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        position: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        direction: "vertical",
        position: "after"
    },
    render: (props) => {
        return (
            <TimelinesComponent {...props}>
                {inlineData.map((timeline) => {
                    return <TimelinePoint {...timeline} />;
                })}
            </TimelinesComponent>
        );
    }
};

export const Timeline: StoryTimeline = storyObjBuilder({
    argTypes: {
        direction: args({ control: "select", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        status: args({
            control: "select",
            ...propCategory.content,
            options: ["default", "active", "success", "error", "pending"]
        }),
        description: args({ control: "text", ...propCategory.content })
    },
    args: {
        title: "Task A",
        description: "Description A",
        status: "success",
        direction: "vertical"
    },
    render: (props) => {
        const { direction } = props;
        return (
            <TimelinesComponent direction={direction}>
                <TimelinePoint {...props} />
                <TimelinePoint {...props} />
            </TimelinesComponent>
        );
    }
});
