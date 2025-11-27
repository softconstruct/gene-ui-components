import React, { FC } from "react";
import classNames from "classnames";

import { Globe } from "@geneui/icons";

import Label from "@components/atoms/Label";
import Pill from "@components/atoms/Pill";
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./InteractiveCard.scss";

import { Text } from "../../../index";

interface IInteractiveCardProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill InteractiveCard component props interface
}

/**
 * Interactive Card component displays information and engage users through actionable content. Unlike static cards, Interactive Cards respond to user interactions, such as clicks or hovers, triggering actions or revealing additional information.
 */
const InteractiveCard: FC<IInteractiveCardProps> = ({ className }) => {
    // Add size classNames for interactiveCard - "interactiveCard_size_large / interactiveCard_size_medium / interactiveCard_size_small"
    // Add className - "interactiveCard_withIcon" - for interactiveCard, when there is an icon
    // Add className - "interactiveCard_withCheckbox" - for interactiveCard, when there are pill and checkbox (not pill and Switcher)
    // Add className - "interactiveCard_disabled" - for interactiveCard, to make it disabled
    // Add className - "interactiveCard_interactive" - for interactiveCard, to make it button
    return (
        <>
            {/* Interactive */}
            <button
                type="button"
                className={classNames(
                    "interactiveCard interactiveCard_size_large interactiveCard_interactive interactiveCard_withIcon interactiveCard_withCheckbox",
                    className
                )}
            >
                <span className="interactiveCard__main">
                    <Globe className="interactiveCard__icon" size={32} />
                    <span className="interactiveCard__content">
                        <Label text="Label" infoText="Label" />
                        <Text className="interactiveCard__description" as="span" variant="labelMediumMedium">
                            Description
                        </Text>
                    </span>
                </span>
                <span className="interactiveCard__actions">
                    <Pill size="small" withDot={false} text="Pill" filled />
                    <Checkbox name="test" value="test" />
                </span>
            </button>

            {/* Non Interactive */}
            <div
                className={classNames(
                    "interactiveCard interactiveCard_size_large interactiveCard_withIcon interactiveCard_withCheckbox",
                    className
                )}
            >
                <span className="interactiveCard__main">
                    <Globe className="interactiveCard__icon" size={32} />
                    <span className="interactiveCard__content">
                        <Label text="Label" infoText="Label" />
                        <Text className="interactiveCard__description" as="span" variant="labelMediumMedium">
                            Description
                        </Text>
                    </span>
                </span>
                <span className="interactiveCard__actions">
                    <Pill size="small" withDot={false} text="Pill" filled />
                    <Checkbox name="test" value="test" />
                </span>
            </div>
        </>
    );
};

export { IInteractiveCardProps, InteractiveCard as default };
