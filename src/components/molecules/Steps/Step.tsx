import React, { FC, useContext } from "react";
import classNames from "classnames";

import { ErrorFilled, SuccessFilled } from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import Label from "@components/atoms/Label";
import Loader from "@components/atoms/Loader";
import Text from "@components/atoms/Text";

import { StepsContext } from "./Steps";

interface IPointTypesProps {
    /**
     * If type is numeric you can provide the number.<br>
     * By default starts with 1.
     */
    stepNumber?: number;
    /**
     * Error state for Step.
     */
    error?: boolean;
    /**
     * Loading state for Step.
     */
    loading?: boolean;
    /**
     * Change the icon and styling for step to mention the `Step` state.
     */
    state?: "previous" | "current" | "next";
    /**
     * Marks the Step as completed.<br>
     * When `true` and `state` is not `current`, displays the `SuccessFilled` icon and applies completed styling.<br>
     */
    complete?: boolean;
}

interface IStepProps extends IPointTypesProps {
    /**
     * The label for the Step, describing its purpose.<br>
     * The Label can be clickable on not. For more information see the onChange prop in `Steps` component.
     */
    label?: string;
    /**
     * Extra information displayed with the label of step for clarity or guidance.
     */
    description?: string;
    /**
     * Unique id for Step.
     */
    id?: string | number;
    /**
     * Disable state for Steps.
     */
    disabled?: boolean;
}

type IStepLabelType = {
    changeHandler?: () => void;
} & Pick<IStepProps, "label" | "state" | "disabled">;

const PointTypes: FC<IPointTypesProps> = ({ stepNumber = 1, error, loading, state, complete }) => {
    const { type } = useContext(StepsContext);

    const stepCount = (num: number) => {
        if (!num || num <= 0) return 1;
        if (num > 9) return 9;
        return num;
    };

    if (loading) {
        return <Loader size="small" />;
    }

    if (error) {
        return <ErrorFilled size={24} className="steps__icon" />;
    }

    if (type === "dot") {
        if (complete && state !== "current") {
            return <SuccessFilled size={24} className="steps__icon" />;
        }
        if (state === "current") {
            return <span className="steps__icon steps__dot steps__dot_state_current" />;
        }

        return <span className="steps__icon steps__dot steps__dot_state_empty" />;
    }

    return (
        <span
            className={classNames("steps__icon steps__number", {
                steps__number_success: complete && state !== "current"
            })}
        >
            {complete && state !== "current" ? (
                <SuccessFilled size={24} className="steps__icon" />
            ) : (
                stepCount(stepNumber)
            )}
        </span>
    );
};

const StepLabel: FC<IStepLabelType> = ({ label, changeHandler, state, disabled }) => {
    if (!label) return null;

    return changeHandler !== undefined ? (
        <button
            type="button"
            className="steps__button"
            onClick={changeHandler}
            disabled={disabled || state === "current"}
        >
            <Label text={label} disabled={disabled} />
        </button>
    ) : (
        <Label text={label} disabled={disabled} className="steps__label" />
    );
};

const Step: FC<IStepProps> = (props) => {
    const { id, complete, description, label, loading, stepNumber, disabled, error, state } = props;
    const { direction, onChange } = useContext(StepsContext);
    const changeHandler = () => onChange?.(props);

    return (
        <div
            {...(id && { id: id.toString() })}
            className={classNames("steps__item", {
                steps__item_state_disabled: disabled && !error && !loading,
                steps__item_state_error: error,
                steps__item_state_success: complete,
                steps__item_state_current: state === "current"
            })}
        >
            <div className="steps__indicator">
                <PointTypes
                    stepNumber={stepNumber ?? 1}
                    error={error}
                    loading={loading}
                    complete={complete}
                    state={state}
                />

                <Divider
                    className="steps__divider"
                    direction={direction}
                    appearance={state === "previous" && !disabled ? "brand" : "default"}
                />
            </div>
            <div className="steps__content">
                <StepLabel
                    label={label}
                    state={state}
                    disabled={disabled}
                    {...(onChange !== undefined && { changeHandler })}
                />
                {description && (
                    <Text className="steps__description" as="p" variant="bodyMediumRegular">
                        {description}
                    </Text>
                )}
            </div>
        </div>
    );
};

export { IStepProps, Step as default };
