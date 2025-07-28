import React, { FC, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { CircleInfo, X } from "@geneui/icons";

// Components
import Button, { IButtonProps } from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Notification.scss";

interface INotificationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Controls the visibility of the notification. Set to `true` to show and `false` to hide.
     */
    open?: boolean;
    /**
     * Determines the rendering style of the notification.
     * - `toast`: A floating, temporary notification that appears on top of other content (rendered via a portal).
     * - `sectionMessage`: An inline notification that is part of the page's content flow.
     */
    variant?: "toast" | "sectionMessage";
    /**
     * Defines the semantic meaning and visual style (color, icon) of the notification.
     * Note: The `insight` status is a special case and should only be used with the `sectionMessage` variant.
     */
    status?: "informative" | "success" | "warning" | "error" | "insight";
    /**
     * The main heading or title for the notification.
     */
    title?: string;
    /**
     * The main body content or description of the notification.
     */
    description?: string;
    /**
     * The size to be applied to the action buttons within the notification.
     * Possible values: `large | medium | small | "smallNudge"`
     */
    actionsButtonsSize?: IButtonProps["size"];
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
     * Callback function triggered when the close (X) button is clicked.
     */
    onClose?: () => void;
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

/**
 * Notification component encompasses various types of messages, including toast notifications and section messages, to provide feedback to users in a clear and structured manner. Notifications inform users about system events, updates, or the status of their actions, ensuring that important information is communicated effectively.
 */
const Notification: FC<INotificationProps> = ({
    className,
    open,
    variant = "toast",
    onClose,
    status = "informative",
    title,
    description,
    primaryActionText,
    secondaryActionText,
    onPrimaryActionClick,
    onSecondaryActionClick,
    actionsButtonsSize
}) => {
    const [show, setShow] = useState(false);
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    useEffect(() => {
        setShow(!!open);
    }, [open]);

    const onCloseHandler = () => {
        setShow(false);
        onClose?.();
    };

    const finalStatus = variant === "toast" && status === "insight" ? "informative" : status;

    const notificationContent = (
        <div
            className={classNames(
                `notification notification_variant_${variant} notification_status_${finalStatus}`,
                className
            )}
        >
            <div className="notification__wrapper">
                <div className="notification__content">
                    <CircleInfo className="notification__icon" />
                    <div className="notification__textGroup">
                        {title && <p className="notification__title">{title}</p>}
                        {description && (
                            <Text as="p" variant="bodyMediumMedium" className="notification__description">
                                {description}
                            </Text>
                        )}
                    </div>
                </div>
                <Button
                    appearance="secondary"
                    layout="text"
                    size="small"
                    className="notification__button"
                    onClick={onCloseHandler}
                    Icon={X}
                />
            </div>
            <ButtonGroup className="notification__actions" size={actionsButtonsSize}>
                {!!secondaryActionText && (
                    <Button appearance="secondary" className="notification__button" onClick={onSecondaryActionClick}>
                        {secondaryActionText}
                    </Button>
                )}
                {!!primaryActionText && (
                    <Button appearance="primary" className="notification__button" onClick={onPrimaryActionClick}>
                        {primaryActionText}
                    </Button>
                )}
            </ButtonGroup>
        </div>
    );

    if (!show) return null;

    if (variant === "toast") {
        if (geneUIProviderRef.current) {
            return createPortal(notificationContent, geneUIProviderRef.current);
        }
        return null;
    }
    if (variant === "sectionMessage") {
        return notificationContent;
    }
    return null;
};

export { INotificationProps, Notification as default };
