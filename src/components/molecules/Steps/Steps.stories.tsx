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

const testSteps = [
    { label: "Step 1", description: "description 1", id: 1, state: "complete" },
    { label: "Step 2", description: "description 2", id: 2, state: "complete" },
    { label: "Step 3", description: "description 3", id: 3, state: "current" },
    { label: "Step 4", id: 4, isLoading: false }
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
        isLinear: false
    },
    render: (props) => {
        return (
            <Steps {...props}>
                {testSteps.map((step) => {
                    return <Step {...step} key={step.id} />;
                })}
            </Steps>
        );
    }
};

const StepStory: StoryStep = storyObjBuilder({
    argTypes: {
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        error: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        id: args({ control: "false", ...propCategory.content }),
        state: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        stepNumber: args({ control: "number", ...propCategory.content })
    },
    args: {
        label: "Label",
        description: "Description"
    },
    render: (props) => {
        const { direction } = props;
        return (
            <Steps direction={direction}>
                <Step {...props} id={11} />
                <Step {...props} id={12} />
            </Steps>
        );
    }
});

export default meta;
export { StepsStory as Steps, StepStory as Step };
