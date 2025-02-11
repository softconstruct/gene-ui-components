import React, { Children, FC, isValidElement, ReactNode } from "react";
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
            {Children.toArray(children).map((child, i) => {
                if (!isValidElement<IStepProps>(child)) return child;

                const stepProps: Partial<IStepProps> = {
                    direction,
                    stepNumber: child.props.stepNumber ?? i + 1,
                    type: child.props.type ?? type,
                    id: child.props.id ?? i + 1,
                    onChange
                };

                return <child.type {...child.props} {...stepProps} />;
            })}
        </div>
    );
};

export { IStepsProps, Steps as default };
