import React, { FC, useContext } from "react";
import classNames from "classnames";

import { ErrorFilled, SuccessFilled } from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import Label from "@components/atoms/Label";
import Loader from "@components/atoms/Loader";

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
} & Pick<IStepProps, "label" | "state" | "disabled" | "loading">;

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
        return <ErrorFilled size={24} className="steps__status_icon" />;
    }

    if (type === "dot") {
        if (complete && state !== "current") {
            return <SuccessFilled size={24} className="step_type steps__status_icon" />;
        }
        if (state === "current") {
            return <span className="step_type steps__status_icon steps__status_dot steps__status_dot_current" />;
        }

        return <span className="step_type steps__status_icon steps__status_dot steps__status_dot_empty" />;
    }

    return (
        <span
            className={classNames("step_type steps__status_icon steps__status_numeric", {
                steps__status_numeric_success: complete && state !== "current"
            })}
        >
            {complete && state !== "current" ? (
                <SuccessFilled size={24} className="step_type steps__status_icon" />
            ) : (
                stepCount(stepNumber)
            )}
        </span>
    );
};

const StepLabel: FC<IStepLabelType> = ({ label, changeHandler, state, disabled, loading }) => {
    if (!label) return null;

    return changeHandler !== undefined ? (
        <button
            type="button"
            className="steps__label"
            onClick={changeHandler}
            disabled={disabled || loading || state === "current"}
        >
            <Label text={label} disabled={disabled || loading} />
        </button>
    ) : (
        <Label text={label} disabled={disabled || loading} className="steps__label" />
    );
};

const Step: FC<IStepProps> = (props) => {
    const { id, complete, description, label, loading, stepNumber, disabled, error, state } = props;
    const { direction, onChange } = useContext(StepsContext);
    const changeHandler = () => onChange?.(props);

    return (
        <div
            {...(id && { id: id.toString() })}
            className={classNames("steps__step", {
                steps__step_disabled: disabled && !error && !loading,
                steps__step_error: error,
                steps__step_success: complete && state !== "next",
                steps__step_current: state === "current"
            })}
        >
            <div className="steps__status">
                <PointTypes
                    stepNumber={stepNumber ?? 1}
                    error={error}
                    loading={loading}
                    complete={complete}
                    state={state}
                />

                <Divider
                    className="steps__status_divider"
                    direction={direction}
                    appearance={state === "previous" && !disabled ? "brand" : "default"}
                />
            </div>
            <div className="steps__content">
                <StepLabel
                    label={label}
                    state={state}
                    disabled={disabled}
                    loading={loading}
                    {...(onChange !== undefined && { changeHandler })}
                />
                {description && <p className="steps__description">{description}</p>}
            </div>
        </div>
    );
};

export { IStepProps, Step as default };
