import React, { Children, cloneElement, FC, ReactNode } from "react";
import classNames from "classnames";

// Styles
import "./Steps.scss";

// Types
import { IStepProps } from "./Step";

interface IStepsProps {
    /**
     * Provide `<Step/>` components to be rendered in the `<Steps/>`
     */
    children: ReactNode;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Steps direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     * Steps type <br/>
     * Possible values: `dot | numeric`
     */
    type?: "dot" | "numeric";
    /**
     * This prop for label click ability. If true the labels are interactive else informative.
     */
    isLinear?: boolean;
    /**
     * Fires when the user interact with Step label. Provides the Step id as a callback's argument.
     */
    onChange?: (e: string | number) => void;
}

/**
 * Step component is used to guide users through a sequential process by breaking it down into distinct steps. It is commonly employed in multi-step forms, checkout processes, or workflows that require users to complete tasks in a specific order.
 */
const Steps: FC<IStepsProps> = ({ direction = "horizontal", type, isLinear, className, children, onChange }) => {
    return (
        <div className={classNames(`steps steps_direction_${direction}`, { steps_linear: isLinear }, className)}>
            {Children.map(children, (step, i) => {
                if (!React.isValidElement<IStepProps>(step)) return step;

                return cloneElement(step, {
                    direction,
                    onChange,
                    label: step.props.label,
                    error: step.props.error,
                    state: step.props.state,
                    isLoading: step.props.isLoading,
                    stepNumber: step.props.stepNumber || i + 1,
                    type: step.props.type || type,
                    description: step.props.description,
                    disabled: step.props.disabled,
                    id: step.props.id || i + 1
                });
            })}
        </div>
    );
};

export { IStepsProps, Steps as default };
