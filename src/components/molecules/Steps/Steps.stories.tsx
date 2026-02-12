import React, { ChangeEvent, FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Checkbox from "@components/molecules/Checkbox";
import Modal from "@components/molecules/Modal";
import Notification from "@components/molecules/Notification";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
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
    { label: "Step 1", description: "description 1", complete: true, id: 1 },
    { label: "Step 2", description: "description 2", complete: true, id: 2 },
    { label: "Step 3", description: "description 3", id: 3, loading: true },
    { label: "Step 4", id: 4, loading: false, disabled: true }
];

type Story = StoryObj<IStepsProps>;
type StoryStep = StoryObj<IStepProps>;

const argTypes = {
    className: args({ control: "false", ...propCategory.appearance }),
    direction: args({ control: "select", ...propCategory.appearance }),
    type: args({ control: "select", ...propCategory.appearance }),
    onChange: args({ control: "false", ...propCategory.action }),
    current: args({ control: "false", ...propCategory.states }),
    children: args({ control: "false", ...propCategory.content })
};

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
    argTypes: { ...argTypes },
    args: {
        direction: "horizontal",
        type: "dot",
        current: 2
    },
    render: (props) => <StepsTemplate {...props} />
};

const steps = [
    { label: "Step 1", description: "description 1", complete: false, touched: false, error: false, id: 1 },
    {
        label: "Step 2",
        description: "description 2",
        complete: false,
        touched: false,
        error: false,
        id: 2
    },
    { label: "Step 3", description: "description 3", complete: false, touched: false, error: false, id: 3 },
    {
        label: "Step 4",
        description: "description 4",
        complete: false,
        touched: false,
        error: false,
        id: 4
    },
    { label: "Step 5", description: "description 5", complete: false, touched: false, error: false, id: 5 }
];

const StepsWizardTemplate: FC<IStepsProps> = (props) => {
    const [stepsData, setStepsData] = useState(steps);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const notificationToggleHandler = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    const onStepChange = (step: IStepProps) => {
        const stepId = step.id && +step.id;
        setStepsData((prev) => {
            const newData = [...prev];
            newData[currentStep] = { ...newData[currentStep], touched: true };
            return newData;
        });
        if (stepId) {
            const targetStepIndex = stepId - 1;
            setCurrentStep(targetStepIndex);
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
            prev.map((item, index) => {
                if (index === currentStep) {
                    return {
                        ...item,
                        complete: e.currentTarget.checked
                    };
                }
                return item;
            })
        );
    };

    const handlePrev = () => {
        onStepChange(stepsData[currentStep - 1]);
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
            onStepChange(stepsData[currentStep + 1]);
        }
    };

    const getErrorStepIndices = () =>
        stepsData
            .map((item, index) => (item.touched && !item.complete && index !== currentStep ? index : null))
            .filter((item) => item !== null);

    const isStepEnabled = () =>
        stepsData.map((item, index) => (item.touched || stepsData[index - 1]?.complete || index === 0 ? index : null));

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
                lockBodyScroll={false}
                actions={[
                    { children: "Cancel", appearance: "secondary", onClick: modalToggle },
                    {
                        children: isLastStep ? "Finish" : "Next",
                        appearance: "primary",
                        onClick: nextButtonHandler,
                        disabled:
                            (!isStepEnabled().includes(currentStep + 1) && !isLastStep) ||
                            (isLastStep && getErrorStepIndices().length > 0) ||
                            (isLastStep && !stepsData[stepsData.length - 1].complete)
                    }
                ]}
                footerContent={
                    <Button disabled={currentStep === 0} onClick={handlePrev}>
                        Prev
                    </Button>
                }
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    <Steps {...props} current={currentStep} onChange={onStepChange}>
                        {stepsData.map((step, index) => {
                            return (
                                <Step
                                    key={step.id}
                                    id={step.id}
                                    label={step.label}
                                    description={step.description}
                                    disabled={!isStepEnabled().includes(index)}
                                    error={getErrorStepIndices().includes(index)}
                                    complete={step.complete}
                                />
                            );
                        })}
                    </Steps>
                    <Divider />
                    <Checkbox
                        label={`confirm Step ${currentStep + 1}`}
                        onChange={onCheckBoxChangeHandler}
                        required
                        status={stepsData[currentStep].touched && !stepsData[currentStep].complete ? "error" : "rest"}
                        checked={stepsData[currentStep].complete}
                        helperText={
                            stepsData[currentStep].touched && !stepsData[currentStep].complete
                                ? "This filed is required!"
                                : ""
                        }
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

const StepsWizard: StoryObj<IStepsProps> = {
    argTypes: { ...argTypes },
    args: {
        current: 2,
        direction: "horizontal",
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
