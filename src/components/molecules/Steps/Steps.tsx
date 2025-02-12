import React, { Children, createContext, FC, isValidElement, ReactNode, useMemo } from "react";
import classNames from "classnames";

// Styles
import "./Steps.scss";

// Types
import { IStepProps } from "./Step";

interface IStepsContextProps {
    /**
     * Steps direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     * Fires when the user interact with Step label. Provides the Step id as a callback's argument.
     */
    onChange?: (e: string | number) => void;
    /**
     * Steps type <br/>
     * Possible values: `dot | numeric`
     */
    type?: "dot" | "numeric";
}

interface IStepsProps extends IStepsContextProps {
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
     * This prop for label click ability. If true the labels are interactive else informative.
     */
    isLinear?: boolean;
}

export const StepsContext = createContext<IStepsContextProps>({} as IStepsContextProps);

/**
 * Step component is used to guide users through a sequential process by breaking it down into distinct steps. It is commonly employed in multi-step forms, checkout processes, or workflows that require users to complete tasks in a specific order.
 */
const Steps: FC<IStepsProps> = ({
    direction = "horizontal",
    type = "dot",
    isLinear,
    className,
    children,
    onChange
}) => {
    const memoizedStepsContextValue = useMemo(
        () => ({
            direction,
            onChange,
            type
        }),
        [direction, type]
    );

    return (
        <StepsContext.Provider value={memoizedStepsContextValue as IStepsContextProps}>
            <div className={classNames(`steps steps_direction_${direction}`, { steps_linear: isLinear }, className)}>
                {Children.toArray(children).map((child, i) => {
                    if (!isValidElement<IStepProps>(child)) return child;

                    const stepProps: Partial<IStepProps> = {
                        stepNumber: child.props.stepNumber ?? i + 1,
                        id: child.props.id ?? i + 1
                    };

                    return <child.type {...child.props} {...stepProps} key={child.props.id || i} />;
                })}
            </div>
        </StepsContext.Provider>
    );
};

export { IStepsProps, Steps as default };
