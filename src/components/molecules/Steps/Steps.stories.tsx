import React, { ChangeEvent, FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import Button from "@components/atoms/Button";
import Checkbox from "@components/molecules/Checkbox";
import Modal from "@components/molecules/Modal";
import Notification from "@components/molecules/Notification";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import { Divider } from "../../../index";
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
        current: args({ control: "false", ...propCategory.content })
    },
    render: (props) => <StepsTemplate {...props} />
};

const steps = [
    { label: "Step 1", description: "description 1", complete: false, id: 1 },
    {
        label: "Step 2",
        description: "description 2",
        complete: false,
        id: 2
    },
    { label: "Step 3", description: "description 3", complete: false, id: 3 },
    {
        label: "Step 4",
        description: "description 4",
        complete: false,
        id: 4
    },
    { label: "Step 5", description: "description 5", complete: false, id: 5 }
];

const StepsWizardTemplate: FC<IStepsProps> = () => {
    const [stepsData, setStepsData] = useState(steps);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const notificationToggleHandler = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    const onStepChange = (step: IStepProps) => {
        const stepId = step.id && +step.id;
        if (stepId) {
            setCurrentStep(stepId - 1);
        }
    };

    const modalToggle = () => {
        setIsModalOpen((prev) => !prev);
        if (isModalOpen) {
            setCurrentStep(0);
        }
    };

    const onCheckBoxChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setStepsData((prev) =>
            prev.map((item, index) =>
                index === currentStep
                    ? {
                          ...item,
                          complete: e.currentTarget.checked
                      }
                    : item
            )
        );
    };

    const handlePrev = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleFinish = () => {
        setIsModalOpen(false);
        notificationToggleHandler();
        setCurrentStep(0);
    };

    const isLastStep = currentStep === stepsData.length - 1;

    const nextButtonHandler = () => {
        if (isLastStep) {
            handleFinish();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    return (
        <>
            <Button onClick={modalToggle}>Open Wizard Modal</Button>
            <Modal
                open={isModalOpen}
                title="Wizard"
                size="large"
                hasCloseButton
                shouldCloseOnOverlayClick
                onClose={modalToggle}
                actions={[
                    { children: "Cancel", appearance: "secondary", onClick: modalToggle },
                    {
                        children: isLastStep ? "Finish" : "Next",
                        appearance: "primary",
                        onClick: nextButtonHandler,
                        disabled: !stepsData[currentStep].complete
                    }
                ]}
                footerContent={
                    <Button disabled={currentStep === 0} onClick={handlePrev}>
                        Prev
                    </Button>
                }
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    <Steps current={currentStep} direction="horizontal" type="numeric" onChange={onStepChange}>
                        {stepsData.map((step, index) => {
                            return (
                                <Step
                                    id={step.id}
                                    label={{ text: step.label }} // todo: must change structure
                                    description={step.description}
                                    disabled={index === currentStep || (!step.complete && index !== currentStep)} // todo: component must handle
                                    complete={step.complete && index < currentStep} // todo: investigate the case when all complete and yo go step 1
                                />
                            );
                        })}
                    </Steps>
                    <Divider />
                    <Checkbox
                        label={`confirm Step ${currentStep + 1}`}
                        onChange={onCheckBoxChangeHandler}
                        checked={stepsData[currentStep].complete}
                    />
                </div>
            </Modal>
            <Notification
                open={isNotificationOpen}
                title="All steps completed successfully"
                onClose={notificationToggleHandler}
            />
        </>
    );
};

const StepsWizard: Story = {
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
    render: (props) => <StepsWizardTemplate {...props} />
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
export { StepsStory as Steps, StepsWizard, StepStory as Step };
