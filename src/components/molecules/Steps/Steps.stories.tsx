import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";

// Components
import StepsComponent, { IStepsProps } from "./Steps";
import StepComponent, { IStepProps } from "./Step";

const meta: Meta = {
    title: "Molecules/Steps",
    component: StepsComponent,
    subcomponents: {
        Step: StepComponent
    }
};

export default meta;

const testSteps = [
    { label: "Step 1", description: "description 1", id: 1, state: "complete" },
    { label: "Step 2", description: "description 2", id: 2, state: "complete" },
    { label: "Step 3", description: "description 3", id: 3, state: "current" },
    { label: "Step 4", id: 4, isLoading: false }
];

type Story = StoryObj<IStepsProps>;
type StoryStep = StoryObj<IStepProps>;

export const Steps: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        isLinear: args({ control: "boolean", ...propCategory.functionality }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        direction: "vertical",
        isLinear: false
    },
    render: (props) => {
        return (
            <StepsComponent {...props}>
                {testSteps.map((step) => {
                    return <StepComponent {...step} key={step.id} />;
                })}
            </StepsComponent>
        );
    }
};
export const Step: StoryStep = storyObjBuilder({
    argTypes: {
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        error: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        id: args({ control: "false", ...propCategory.content }),
        state: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        stepNumber: args({ control: "number", ...propCategory.content }),
        onChange: args({ control: "false", ...propCategory.functionality })
    },
    args: {
        label: "Label",
        description: "Description"
    },
    render: (props) => {
        const { direction } = props;
        return (
            <StepsComponent direction={direction}>
                <StepComponent {...props} id={11} />
                <StepComponent {...props} id={12} />
            </StepsComponent>
        );
    }
});
