import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import Timeline, { ITimelinesProps } from "./Timeline";
import TimelinePoint, { ITimelinePointProps } from "./TimelinePoint";

const meta: Meta = {
    title: "Molecules/Timeline",
    component: Timeline,
    subcomponents: {
        "Timeline Point": TimelinePoint
    }
};

const inlineData = [
    { title: "Task A", description: "Description A", status: "active" },
    { title: "Task B", description: "Description B", status: "error" },
    { title: "Task C", description: "Description C", status: "pending" },
    { title: "Task D", description: "Description D", status: "default" },
    { title: "Task E", description: "Description E", status: "success" }
] as const;

const TimelineStory: StoryObj<ITimelinesProps> = {
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
            <Timeline {...props}>
                {inlineData.map((timeline) => {
                    return <TimelinePoint {...timeline} />;
                })}
            </Timeline>
        );
    }
};

const TimelinePointStory: StoryObj<ITimelinePointProps> = storyObjBuilder({
    argTypes: {
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
        status: "success"
    },
    render: (props) => {
        return (
            <Timeline>
                <TimelinePoint {...props} />
            </Timeline>
        );
    }
});

export default meta;
export { TimelineStory as Timeline, TimelinePointStory as TimelinePoint };
