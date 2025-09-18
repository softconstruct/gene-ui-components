import React, { FC, useContext } from "react";

import { Error, IconProps, Info, Warning, X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import ButtonGroup from "@components/molecules/ButtonGroup";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import { useStateControlled } from "@hooks/index";

// Styles
import "./Banner.scss";

interface IBannerProps {
    /**
     * Text of the banner
     */
    text: string;
    /**
     * Type of banner <br/>
     * Possible values: `informational | warning | error`
     */
    type?: "informational" | "warning" | "error";
    /**
     * Determines is component works with their internal state or the state should be controlled from parent component
     */
    visible?: boolean;
    /**
     * Callback which calls when close button is pressed, in case of controlled mode the hide function should be controlled from parent using this function
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
const Banner: FC<IBannerProps> = ({ type = "informational", text, visible, onClose }) => {
    const [isOpen, setIsOpen] = useStateControlled(visible, true);
    const {
        breakpoint: { currentBreakpoint }
    } = useContext(GeneUIDesignSystemContext);
    const close = () => {
        setIsOpen(false);
        onClose?.();
    };

    if (!isOpen) {
        return null;
    }

    const Icon: FC<IconProps> = typeIcons[type];

    return (
        <div className={`banner banner_state_${type} banner_device_${currentBreakpoint}`}>
            <div className="banner__content">
                <Icon className="banner__icon" />
                <p className="banner__text">{text}</p>
            </div>
            <ButtonGroup className="banner__actions">
                <Button layout="text" size="small" appearance="secondary" className="banner__button">
                    action 1
                </Button>
                <Button layout="text" size="small" appearance="secondary" className="banner__button">
                    action 2
                </Button>
            </ButtonGroup>
            <Button layout="text" size="small" onClick={close} className="banner__button" Icon={X} />
        </div>
    );
};

export { IBannerProps, Banner as default };
