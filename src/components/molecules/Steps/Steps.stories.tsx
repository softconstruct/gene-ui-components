import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import Step, { IStepProps } from "./Step";
// Components
import Steps, { IStepsProps } from "./Steps";

const meta: Meta<IStepsProps> = {
    title: "Molecules/Steps",
    component: Steps,
    subcomponents: {
        Step
    }
};

const stepsMockData: IStepProps[] = [
    { label: "Step 1", description: "description 1", id: 1, state: "complete" },
    { label: "Step 2", description: "description 2", id: 2, state: "complete" },
    { label: "Step 3", description: "description 3", id: 3, state: "current", isLoading: true },
    { label: "Step 4", id: 4, isLoading: false, state: "incomplete", disabled: true }
];

type Story = StoryObj<IStepsProps>;
type StoryStep = StoryObj<IStepProps>;

const StepsStory: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        isLinear: args({ control: "boolean", ...propCategory.functionality }),
        onChange: args({ control: "false", ...propCategory.action }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        direction: "vertical",
        isLinear: false,
        type: "dot"
    },
    render: (props) => {
        return (
            <Steps {...props}>
                {stepsMockData.map((step) => {
                    return <Step {...step} key={step.id} />;
                })}
            </Steps>
        );
    }
};

const StepStory: StoryStep = storyObjBuilder({
    argTypes: {
        isLoading: args({ control: "boolean", ...propCategory.states }),
        error: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        label: args({ control: "text", ...propCategory.content }),
        stepNumber: args({ control: "number", ...propCategory.content }),
        id: args({ control: "false", ...propCategory.others }),
        description: args({ control: "text", ...propCategory.content }),
        state: args({ control: "select", ...propCategory.appearance, options: ["incomplete", "current", "complete"] })
    },
    args: {
        state: "incomplete",
        label: "Label",
        description: "description"
    },
    render: (props) => {
        return (
            <Steps>
                <Step id={0} {...props} />
                <Step id={1} {...props} />
            </Steps>
        );
    }
});

export default meta;
export { StepsStory as Steps, StepStory as Step };
