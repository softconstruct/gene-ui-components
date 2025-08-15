import React, { FC, ReactNode, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { ErrorFilled, Info, TriangleAlert, X } from "@geneui/icons";

// Components
import Button, { IButtonProps } from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Tooltip from "@components/molecules/Tooltip";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

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
     * @default true
     */
    shouldCloseOnEscapePress?: boolean;
    /**
     * When `true`, allows the modal to be closed by clicking on the semi-transparent background overlay.
     * Calls `onClose`.
     * @default true
     */
    shouldCloseOnOverlayClick?: boolean;
    /**
     * The title text displayed in the modal's header.
     */
    title?: string;
    /**
     * Adds a corresponding status icon next to the title.
     */
    status?: "informative" | "warning" | "error";
    /**
     * The main content of the modal, displayed between the header and footer.
     */
    children?: ReactNode;
    /**
     * Defines the width of the modal. The effective size adapts for mobile viewports:
     * - 'large' and 'medium' sizes become 'small' on mobile.
     * - 'xLarge' becomes 'xxLarge' on mobile.
     * @default "medium"
     */
    size?: "xxLarge" | "xLarge" | "large" | "medium" | "small";
    /**
     * Toggles the padding around the modal's content area.
     * @default true
     */
    withPadding?: boolean;
    /**
     * Sets the vertical alignment of the modal in the viewport.
     * @default "center"
     */
    position?: "top" | "center";
    /**
     * Custom content or component to be displayed in the footer, typically to the left of the action buttons.
     */
    footerContent?: ReactNode;
    /**
     * An array of action button objects to display in the modal's footer.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each object conforms to the `IButtonProps` interface, allowing full customization of each button.
     * @example
     * actions={[
     * { children: 'Cancel', appearance: 'secondary', onClick: handleCancel },
     * { children: 'Submit', appearance: 'primary', onClick: handleSubmit }
     * ]}
     */
    actions?: IButtonProps[];
    /**
     * If `true`, disables scrolling on the `body` element when the modal is open.
     * @default false
     */
    lockBodyScroll?: boolean;
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
    shouldCloseOnEscapePress = true,
    shouldCloseOnOverlayClick = true,
    onClose,
    status,
    children,
    size = "medium",
    withPadding = true,
    position = "center",
    footerContent,
    actions,
    lockBodyScroll
}) => {
    const { geneUIProviderRef, breakpoint } = useContext(GeneUIDesignSystemContext);
    const providerCurrent = geneUIProviderRef.current;
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;
    const isTruncated: boolean = useEllipsisDetection(titleRef);

    const sizeMap = {
        xxLarge: "xxLarge",
        xLarge: isMobileBreakpoint ? "xxLarge" : "xLarge",
        large: isMobileBreakpoint ? "small" : "large",
        medium: isMobileBreakpoint ? "small" : "medium",
        small: "small"
    } as const;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (shouldCloseOnEscapePress && event.key === "Escape") {
                onClose?.();
            }
        };

        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            if (lockBodyScroll) {
                document.body.style.overflow = "hidden";
            }
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (lockBodyScroll) {
                document.body.style.overflow = "unset";
            }
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
            className={classNames(
                `modal modal_device_${isMobileBreakpoint ? "mobile" : "desktop"} modal_size_${sizeMap[size]} `,
                `modal_position_${isMobileBreakpoint && (size === "xxLarge" || size === "xLarge") ? "center" : position}`,
                className
            )}
            onClick={handleOverlayClick}
            role="presentation"
        >
            <div
                className={classNames("modal__wrapper", { modal_withPadding: withPadding })}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
            >
                {(hasCloseButton || title) && (
                    <div className="modal__header">
                        <div className="modal__headerContent">
                            {title && (
                                <>
                                    {IconComponent && (
                                        <IconComponent className={`modal_status_${status} modal__icon`} size={20} />
                                    )}
                                    <Tooltip text={title} isVisible={isTruncated}>
                                        <Text
                                            id="modal-title"
                                            variant="labelLargeSemibold"
                                            className="modal__title ellipsis-text"
                                            as="h1"
                                            ref={titleRef}
                                        >
                                            {title}
                                        </Text>
                                    </Tooltip>
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
                {(actions || footerContent) && (
                    <div className="modal__footer">
                        {footerContent && <div className="modal__footerContent">{footerContent}</div>}
                        {actions && actions.length > 0 && (
                            <ButtonGroup className="modal__buttonGroup" size="medium">
                                {actions.map((action: IButtonProps) => {
                                    const { children: buttonChildren } = action;
                                    const key = `action-${buttonChildren}`;
                                    return buttonChildren ? (
                                        <Button key={key} {...action}>
                                            {buttonChildren}
                                        </Button>
                                    ) : null;
                                })}
                            </ButtonGroup>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return <>{providerCurrent && open ? createPortal(modalContent, providerCurrent) : null}</>;
};

export { IModalProps, Modal as default };
