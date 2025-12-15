import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import Step, { IStepProps } from "./Step";
import Steps, { IStepsProps } from "./Steps";

const meta: Meta<IStepsProps> = {
    title: "Molecules/Steps",
    component: Steps,
    subcomponents: {
        Step
    }
};

const stepsMockData: IStepProps[] = [
    { label: { text: "Step 1" }, description: "description 1", complete: true, id: 1 },
    { label: { text: "Step 2" }, description: "description 2", complete: true, id: 2 },
    { label: { text: "Step 3" }, description: "description 3", id: 3, loading: true },
    { label: { text: "Step 4" }, id: 4, loading: false, disabled: true }
];

type Story = StoryObj<IStepsProps>;
type StoryStep = StoryObj<IStepProps>;

const StepsTemplate: FC<IStepsProps> = (props) => {
    const { current } = props;
    const [currentStep, setCurrentStep] = useState<number | undefined>(current);
    const onStepChange = (step: IStepProps) => {
        const changingStep = stepsMockData.find((item) => item.id === step.id);
        if (!changingStep) return;

        const currentIndex = stepsMockData.indexOf(changingStep);
        setCurrentStep(currentIndex);
    };

    return (
        <Steps {...props} current={currentStep} onChange={onStepChange}>
            {stepsMockData.map((step) => {
                return <Step {...step} key={step.id} />;
            })}
        </Steps>
    );
};

const StepsStory: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.action }),
        current: args({ control: "number", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        current: 2,
        direction: "vertical",
        type: "dot"
    },
    render: (props) => <StepsTemplate {...props} />
};

const StepStory: StoryStep = storyObjBuilder({
    argTypes: {
        loading: args({ control: "boolean", ...propCategory.states }),
        error: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        label: args({ control: "text", ...propCategory.content }),
        stepNumber: args({ control: "false", ...propCategory.content }),
        id: args({ control: "false", ...propCategory.others }),
        description: args({ control: "text", ...propCategory.content }),
        complete: args({ control: "boolean", ...propCategory.content }),
        state: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        label: "Label",
        description: "description"
    },
    render: (props) => {
        return (
            <Steps current={0}>
                <Step id={0} {...props} />
                <Step id={1} {...props} />
            </Steps>
        );
    }
});

export default meta;
export { StepsStory as Steps, StepStory as Step };
