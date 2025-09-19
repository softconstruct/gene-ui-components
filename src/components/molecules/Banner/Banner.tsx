import React, { FC, useContext } from "react";

import { Error, IconProps, Info, Warning, X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Banner.scss";

interface IBannerProps {
    /**
     * Text of the banner
     */
    text: string;
    /**
     * Controls the visibility of the banner. Set to `true` to show and `false` to hide.
     */
    open?: boolean;
    /**
     * Type of banner <br/>
     * Possible values: `informational | warning | error`
     */
    type?: "informational" | "warning" | "error";
    /**
     * Callback function triggered when the close (X) button is clicked.
     */
    onClose?: () => void;
}

const typeIcons: Record<Exclude<IBannerProps["type"], undefined>, React.FC<IconProps>> = {
    error: Error,
    warning: Warning,
    informational: Info
} as const;

/**
 * Banner component is a prominent, horizontally-oriented message box designed to capture the user's attention and convey important information across the top of a page. It is used for announcements, alerts, promotions, or updates that need to be immediately visible to users.
 */
const Banner: FC<IBannerProps> = ({ type = "informational", text, onClose, open }) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const currentBreakpoint = breakpoint?.currentBreakpoint || "desktop";
    const close = () => {
        onClose?.();
    };

    if (!open) {
        return null;
    }

    const Icon: FC<IconProps> = typeIcons[type];

    return (
        <div className={`banner banner_state_${type}`}>
            <div className="banner__content">
                <Icon className="banner__icon" size={20} />
                <Text as="p" variant="bodyMediumMedium" className="banner__text">
                    {text}
                </Text>
            </div>
            <ButtonGroup size="small" className={`banner__actions banner__actions_${currentBreakpoint}`}>
                <Button layout="text" size="small" appearance="transparent" className="banner__button">
                    action 1
                </Button>
                <Button layout="text" size="small" appearance="transparent" className="banner__button">
                    action 2
                </Button>
            </ButtonGroup>
            <Button
                layout="text"
                size="small"
                appearance="transparent"
                className="banner__button"
                Icon={X}
                onClick={close}
            />
        </div>
    );
};

export { IBannerProps, Banner as default };
