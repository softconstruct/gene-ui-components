import React, { FC, useContext } from "react";

import { Error, IconProps, Info, Warning, X } from "@geneui/icons";

// components
import Button, { IButtonProps } from "@components/atoms/Button";
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
     *  Defines the semantic meaning and visual style (color, icon) of the notification.
     *  Possible values: `informative | warning | error`
     */
    status?: "informative" | "warning" | "error";
    /**
     * Callback function triggered when the close (X) button is clicked.
     */
    onClose?: () => void;
    /**
     * The text to display on the primary action button.
     * **Note: The primary action button will not be rendered if this prop is not provided.**
     */
    primaryActionText?: string;
    /**
     * The text to display on the secondary action button.
     * **Note: The secondary action button will not be rendered if this prop is not provided.**
     */
    secondaryActionText?: string;
    /**
     * Callback function for the primary action button.
     * This is only relevant if `primaryActionText` is also provided.
     */
    onPrimaryActionClick?: () => void;
    /**
     * Callback function for the secondary action button.
     * This is only relevant if `secondaryActionText` is also provided.
     */
    onSecondaryActionClick?: () => void;
}

type BannerStatus = Exclude<IBannerProps["status"], undefined>;

const bannerConfig: Record<
    BannerStatus,
    {
        icon: React.FC<IconProps>;
        buttonAppearance: Exclude<IButtonProps["appearance"], undefined>;
    }
> = {
    error: {
        icon: Error,
        buttonAppearance: "inverse"
    },
    warning: {
        icon: Warning,
        buttonAppearance: "secondary"
    },
    informative: {
        icon: Info,
        buttonAppearance: "inverse"
    }
} as const;

/**
 * Banner component is a prominent, horizontally-oriented message box designed to capture the user's attention and convey important information across the top of a page. It is used for announcements, alerts, promotions, or updates that need to be immediately visible to users.
 */
const Banner: FC<IBannerProps> = ({
    status = "informative",
    text,
    onClose,
    open,
    primaryActionText,
    secondaryActionText,
    onPrimaryActionClick,
    onSecondaryActionClick
}) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const currentBreakpoint = breakpoint?.currentBreakpoint || "desktop";
    const close = () => {
        onClose?.();
    };

    if (!open) {
        return null;
    }

    const config = bannerConfig[status];
    const Icon: FC<IconProps> = config.icon;

    return (
        <div className={`banner banner_state_${status}`}>
            <div className="banner__content">
                <Icon className="banner__icon" size={20} />
                <Text as="p" variant="bodyMediumMedium" className="banner__text">
                    {text}
                </Text>
            </div>
            {primaryActionText || secondaryActionText ? (
                <ButtonGroup size="small" className={`banner__actions banner__actions_${currentBreakpoint}`}>
                    {primaryActionText && (
                        <Button
                            layout="text"
                            size="small"
                            appearance={config.buttonAppearance}
                            className="banner__button"
                            onClick={onPrimaryActionClick}
                        >
                            {primaryActionText}
                        </Button>
                    )}
                    {secondaryActionText && (
                        <Button
                            layout="text"
                            size="small"
                            appearance={config.buttonAppearance}
                            className="banner__button"
                            onClick={onSecondaryActionClick}
                        >
                            {secondaryActionText}
                        </Button>
                    )}
                </ButtonGroup>
            ) : null}
            <Button
                layout="text"
                size="small"
                appearance={config.buttonAppearance}
                className="banner__button"
                Icon={X}
                onClick={close}
            />
        </div>
    );
};

export { IBannerProps, Banner as default };
