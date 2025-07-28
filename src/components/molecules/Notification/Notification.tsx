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
    open?: boolean;
    variant?: "toast" | "sectionMessage";
    status?: "informative" | "success" | "warning" | "error" | "insight";
    title?: string;
    description?: string;
    actionsButtonsSize?: IButtonProps["size"];
    primaryActionText?: string;
    secondaryActionText?: string;
    onClose?: () => void;
    onPrimaryActionClick?: () => void;
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
