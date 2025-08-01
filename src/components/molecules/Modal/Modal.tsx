import React, { FC, ReactNode, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { ErrorFilled, Info, TriangleAlert, X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Modal.scss";

interface IModalProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Controls the visibility of the modal. Set to `true` to show and `false` to hide.
     */
    open?: boolean;
    /**
     * Determines whether the close (X) button is displayed in the modal's header.
     * @default false
     */
    hasCloseButton?: boolean;
    /**
     * Callback function triggered when the modal is requested to be closed (e.g., via the close button, Escape key, or overlay click).
     */
    onClose?: () => void;
    /**
     * When `true`, allows the modal to be closed by pressing the Escape key.
     * Calls `onClose`.
     * @default false
     */
    shouldCloseOnEscapePress?: boolean;
    /**
     * When `true`, allows the modal to be closed by clicking on the semi-transparent background overlay.
     * Calls `onClose`.
     * @default false
     */
    shouldCloseOnOverlayClick?: boolean;
    title?: string;
    status?: "informative" | "warning" | "error";
    children?: ReactNode;
}

const STATUS_ICONS = {
    informative: Info,
    warning: TriangleAlert,
    error: ErrorFilled
};

/**
 * Modal component displays content in a layer above the main application, effectively focusing the user's attention on a specific task or information. It is often used for actions that require user input, such as confirmation dialogs, forms, or important notifications.
 */
const Modal: FC<IModalProps> = ({
    className,
    open,
    title,
    hasCloseButton,
    shouldCloseOnEscapePress = false,
    shouldCloseOnOverlayClick = false,
    onClose,
    status,
    children
}) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const providerCurrent = geneUIProviderRef.current;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (shouldCloseOnEscapePress && event.key === "Escape") {
                onClose?.();
            }
        };

        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [open, shouldCloseOnEscapePress, onClose]);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (shouldCloseOnOverlayClick && event.target === event.currentTarget) {
            onClose?.();
        }
    };

    const IconComponent = status ? STATUS_ICONS[status] : null;

    const modalContent = (
        <div
            className={classNames("modal modal_view_mobile modal_size_mobile_xxLarge", className)}
            onClick={handleOverlayClick}
            role="presentation"
        >
            {/* modal_size_desktop_xxLarge */}
            {/* modal_size_desktop_xLarge */}
            {/* modal_size_desktop_large */}
            {/* modal_size_desktop_small */}
            {/* modal_size_mobile_xxLarge */}
            {/* modal_size_mobile_small */}
            <div className="modal__wrapper modal_withPadding">
                {(hasCloseButton || title) && (
                    <div className="modal__header">
                        <div className="modal__headerContent">
                            {title && (
                                <>
                                    {IconComponent && <IconComponent className={`modal_status_${status}`} size={20} />}

                                    <Text variant="labelLargeSemibold" className="modal__title" as="h1">
                                        {title}
                                    </Text>
                                </>
                            )}
                        </div>
                        {hasCloseButton && (
                            <Button
                                size="small"
                                Icon={X}
                                type="button"
                                layout="text"
                                appearance="secondary"
                                onClick={onClose}
                            />
                        )}
                    </div>
                )}
                <div className="modal__body">
                    <Scrollbar>
                        <div className="modal__content">
                            {typeof children === "string" ? (
                                <Text variant="bodyLargeMedium" className="modal__paragraph" as="p">
                                    {children}
                                </Text>
                            ) : (
                                children
                            )}
                        </div>
                    </Scrollbar>
                </div>
                <div className="modal__footer">
                    {/* Any component can be placed here */}
                    <ButtonGroup className="modal__buttonGroup" size="medium">
                        <Button appearance="secondary">Secondary</Button>
                        <Button appearance="primary">Primary</Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
    if (!open) return null;

    if (providerCurrent) {
        return createPortal(modalContent, providerCurrent);
    }
    return null;
};

export { IModalProps, Modal as default };
