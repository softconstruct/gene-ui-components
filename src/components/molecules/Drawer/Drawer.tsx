import React, { FC, ReactNode, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { X } from "@geneui/icons";

// Components
import Button, { IButtonProps } from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Tooltip from "@components/molecules/Tooltip";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Drawer.scss";

interface IDrawerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Toggles the padding around the Drawer's content area.
     */
    withPadding?: boolean;
    /**
     * The title text displayed in the Drawer's header.
     */
    title?: string;
    /**
     * Determines whether the close (X) button is displayed in the Drawer's header.
     */
    hasCloseButton?: boolean;
    /**
     * Controls the visibility of the Drawer.
     */
    open?: boolean;
    /**
     * Defines the size of the Drawer, affecting its width or height depending on the position.
     * @default "medium"
     */
    size?: "small" | "medium" | "large";
    /**
     * Specifies the edge of the screen from which the Drawer will appear.
     * 'start' corresponds to the left, 'end' to the right.
     * @default "end"
     */
    position?: "bottom " | "end" | "start";
    /**
     *
     * Callback function triggered when the modal is requested to be closed (e.g., via the close button, Escape key, or overlay click).
     * () => void
     *
     */
    onClose?: () => void;
    /**
     * When `true`, allows the Drawer to be closed by pressing the Escape key.
     * Calls `onClose`.
     * @default true
     */
    shouldCloseOnEscapePress?: boolean;
    /**
     * When `true`, allows the Drawer to be closed by clicking on the semi-transparent background overlay.
     * Calls `onClose`.
     * @default true
     */
    shouldCloseOnOverlayClick?: boolean;
    /**
     * If `true`, disables scrolling on the `body` element when the modal is open.
     * @default false
     */
    lockBodyScroll?: boolean;
    /**
     * The main content of the Drawer, displayed between the header and footer.
     * If provided as a string, it will be wrapped in a paragraph element.
     * Else you can provide any content as children.
     */
    children?: React.ReactNode;
    /**
     * An array of action button objects to display in the drawer's footer.
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
     * Custom content or component to be displayed in the footer, typically to the left of the action buttons.
     */
    footerContent?: ReactNode;
    /**
     * Custom content or component to be displayed in the header, typically to the left of the X button.
     */
    headerContent?: ReactNode;
}

/**
 * Drawer component slides in from the edge of the screen, allowing users to access additional content or actions without leaving the current view. It can be anchored to the left, right, top, or bottom of the screen and typically overlays or pushes the existing content, depending on situation.
 */
const Drawer: FC<IDrawerProps> = ({
    className,
    size = "medium",
    position = "end",
    withPadding = true,
    title,
    hasCloseButton,
    open,
    onClose,
    shouldCloseOnEscapePress = true,
    shouldCloseOnOverlayClick = true,
    lockBodyScroll = false,
    children,
    actions,
    footerContent,
    headerContent
}) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const providerCurrent = geneUIProviderRef.current;
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const isTruncated: boolean = useEllipsisDetection(titleRef);

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

    const drawerContent = (
        <div
            className={classNames(
                `drawer drawer_variant_portal drawer_position_${position} `,
                {
                    drawer_withPadding: withPadding
                },
                className
            )}
            onClick={handleOverlayClick}
            role="presentation"
        >
            <div className={`drawer__wrapper drawer__wrapper_size_${size}`}>
                {(hasCloseButton || title || headerContent) && (
                    <div className="drawer__header">
                        {title && (
                            <Tooltip text={title} isVisible={isTruncated}>
                                <Text
                                    className="drawer__title ellipsis-text"
                                    variant="labelLargeSemibold"
                                    as="h1"
                                    ref={titleRef}
                                >
                                    {title}
                                </Text>
                            </Tooltip>
                        )}
                        {headerContent && <div className="drawer__headerContent">{headerContent}</div>}
                        {hasCloseButton && (
                            <Button
                                size="medium"
                                Icon={X}
                                type="button"
                                layout="text"
                                appearance="secondary"
                                className="drawer__closeButton"
                                onClick={onClose}
                            />
                        )}
                    </div>
                )}
                <div className="drawer__body">
                    <Scrollbar>
                        <div className="drawer__content">
                            {typeof children === "string" ? (
                                <Text variant="bodyLargeMedium" className="drawer__paragraph" as="p">
                                    {children}
                                </Text>
                            ) : (
                                children
                            )}
                        </div>
                    </Scrollbar>
                </div>
                {(actions || footerContent) && (
                    <div className="drawer__footer">
                        {footerContent && <div className="drawer__footerContent">{footerContent}</div>}
                        {actions && actions.length > 0 && (
                            <ButtonGroup className="drawer__buttonGroup" size="medium">
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

    return <>{providerCurrent && open ? createPortal(drawerContent, providerCurrent) : null}</>;
};

export { IDrawerProps, Drawer as default };
