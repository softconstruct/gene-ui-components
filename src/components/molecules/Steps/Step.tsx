import React, { FC, useContext } from "react";
import classNames from "classnames";

import { Error, SuccessFilled, Unavailable } from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import Label, { ILabelProps } from "@components/atoms/Label";
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
     * Change the icon for step to mention the Step state.
     */
    state?: "incomplete" | "current" | "complete";
}

interface IStepProps extends IPointTypesProps {
    /**
     * The label for the Step, describing its purpose.<br>
     * The Label can be clickable on not. For more information see the onChange prop in `Steps` component.
     */
    label?: ILabelProps;
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
} & Pick<IStepProps, "label" | "disabled" | "loading">;

const PointTypes: FC<IPointTypesProps> = ({ stepNumber = 1, error, loading, state }) => {
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
        return <Error size={24} className="steps__status_icon" />;
    }

    if (type === "dot") {
        if (state === "current") {
            return <Unavailable size={24} className="step_type steps__status_icon steps__status_dot" />;
        }
        if (state === "complete") {
            return <SuccessFilled size={24} className="step_type steps__status_icon steps__status_dot" />;
        }
        return <Unavailable size={24} className="step_type steps__status_icon" />;
    }

    return <span className="step_type steps__status_icon steps__status_numeric">{stepCount(stepNumber)}</span>;
};

const StepLabel: FC<IStepLabelType> = ({ label, changeHandler, disabled, loading }) => {
    if (!label) return null;

    return changeHandler !== undefined ? (
        <button type="button" className="steps__label" onClick={changeHandler} disabled={disabled || loading}>
            <Label {...label} />
        </button>
    ) : (
        <Label {...label} className="steps__label" />
    );
};

const Step: FC<IStepProps> = (props) => {
    const { id, description, label, loading, stepNumber, disabled, error, state = "incomplete" } = props;
    const { direction, onChange } = useContext(StepsContext);
    const changeHandler = () => onChange?.(props);

    return (
        <div
            {...(id && { id: id.toString() })}
            className={classNames("steps__step", {
                steps__step_disabled: disabled && !error && !loading,
                steps__step_error: error,
                steps__step_success: state === "complete",
                steps__step_current: state === "current"
            })}
        >
            <div className="steps__status">
                <PointTypes stepNumber={stepNumber ?? 1} error={error} loading={loading} state={state} />

                <Divider
                    className="steps__status_divider"
                    direction={direction}
                    appearance={state === "complete" && !disabled ? "brand" : "default"}
                />
            </div>
            <div className="steps__content">
                <StepLabel
                    label={label}
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
