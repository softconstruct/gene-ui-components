import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Steps.scss";
import { ErrorAlertFill, SuccessFill, UnavailableOutline } from "@geneui/icons";
import Divider from "../../atoms/Divider";
import Loader from "../../atoms/Loader";

interface IStepsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Steps label
     */
    label?: string;
    /**
     * Steps description <br/>
     * Possible values: <br/>
     * Text - string
     */
    description?: string;
    /**
     * Steps direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     */
    style?: "dot" | "numeric";
    /**
     */
    isLinear?: boolean;
    // fill Steps component props interface
}

/**
 * Step component is used to guide users through a sequential process by breaking it down into distinct steps. It is commonly employed in multi-step forms, checkout processes, or workflows that require users to complete tasks in a specific order.
 */
const Steps: FC<IStepsProps> = ({ label, description, direction, style, isLinear, className }) => {
    return (
        <div className={classNames(`steps steps_direction_${direction} ${isLinear ? "steps_linear" : ""}`, className)}>
            <div className="steps__wrapper">
                {/* todo: 'Incomplete' state of step element */}
                <div className="steps__step">
                    <div className="steps__status">
                        {/* todo: change icon to "Circle-Dashed" after adding icon to gene-ui-icons package */}
                        {style === "dot" && <UnavailableOutline size={24} className="steps__status_icon" />}

                        {/* todo: change '0' to current stem number */}
                        {style === "numeric" && <span className="steps__status_icon steps__status_numeric">0</span>}

                        <Divider className="steps__status_divider" vertical={direction === "vertical"} />
                    </div>
                    <div className="steps__content">
                        <button type="button" className="steps__label">
                            {label}
                        </button>
                        <p className="steps__description">{description}</p>

                        {/* todo: 'swap' component for 'vertical' direction */}
                        {direction === "vertical" && (
                            <div className="steps__swap">{/* todo: place for 'swap' component */}</div>
                        )}
                    </div>
                </div>

                {/* todo: 'Disabled' state of step element, added className 'steps__step_disabled' */}
                <div className="steps__step steps__step_disabled">
                    <div className="steps__status">
                        {/* todo: change icon to "Circle-Dashed" after adding icon to gene-ui-icons package */}
                        {style === "dot" && <UnavailableOutline size={24} className="steps__status_icon" />}

                        {/* todo: change '0' to current stem number */}
                        {style === "numeric" && <span className="steps__status_icon steps__status_numeric">0</span>}

                        <Divider className="steps__status_divider" vertical={direction === "vertical"} />
                    </div>
                    <div className="steps__content">
                        <button type="button" className="steps__label">
                            {label}
                        </button>
                        <p className="steps__description">{description}</p>
                    </div>
                </div>

                {/* todo: 'Current' state of step element, added className 'steps__step_current' */}
                <div className="steps__step steps__step_current">
                    <div className="steps__status">
                        {/* todo: change icon to "Circle-Half" after adding icon to gene-ui-icons package */}
                        {style === "dot" && <UnavailableOutline size={24} className="steps__status_icon" />}

                        {/* todo: change '0' to current stem number */}
                        {style === "numeric" && <span className="steps__status_icon steps__status_numeric">0</span>}

                        <Divider
                            className="steps__status_divider"
                            vertical={direction === "vertical"}
                            appearance="brand"
                        />
                    </div>
                    <div className="steps__content">
                        <button type="button" className="steps__label">
                            {label}
                        </button>
                        <p className="steps__description">{description}</p>
                    </div>
                </div>

                {/* todo: 'Complete' state of step element, added className 'steps__step_success' */}
                <div className="steps__step steps__step_success">
                    <div className="steps__status">
                        <SuccessFill size={24} className="steps__status_icon" />
                        <Divider
                            className="steps__status_divider"
                            vertical={direction === "vertical"}
                            appearance="brand"
                        />
                    </div>
                    <div className="steps__content">
                        <button type="button" className="steps__label">
                            {label}
                        </button>
                        <p className="steps__description">{description}</p>
                    </div>
                </div>

                {/* todo: 'Error' state of step element, added className 'steps__step_error' */}
                <div className="steps__step steps__step_error">
                    <div className="steps__status">
                        <ErrorAlertFill size={24} className="steps__status_icon" />
                        <Divider className="steps__status_divider" vertical={direction === "vertical"} />
                    </div>
                    <div className="steps__content">
                        <button type="button" className="steps__label">
                            {label}
                        </button>
                        <p className="steps__description">{description}</p>
                    </div>
                </div>

                {/* todo: 'Loading' state of step element */}
                <div className="steps__step">
                    <div className="steps__status">
                        <Loader size="small" />
                        <Divider className="steps__status_divider" vertical={direction === "vertical"} />
                    </div>
                    <div className="steps__content">
                        <button type="button" className="steps__label">
                            {label}
                        </button>
                        <p className="steps__description">{description}</p>
                    </div>
                </div>
            </div>

            {/* todo: 'swap' component for 'horizontal' direction */}
            {direction === "horizontal" && <div className="steps__swap">{/* todo: place for 'swap' component */}</div>}
        </div>
    );
};

export { IStepsProps, Steps as default };
