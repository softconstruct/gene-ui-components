import React, { Dispatch, FC, MutableRefObject, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { ReferenceType } from "@floating-ui/react";
import classNames from "classnames";

import { ErrorFilled, IconProps, TriangleAlert } from "@geneui/icons";

// Components
import {
    IPopoverFooterActionProps,
    IPopoverProps,
    IPopoverRef,
    Popover,
    PopoverBody,
    PopoverFooter
} from "@components/atoms/Popover";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./PopoverConfirm.scss";

interface IPopoverConfirmProps {
    /**
     * Title displayed in the popover header. Required for PopoverConfirm.
     */
    title: string;
    /**
     * The content displayed inside the popover.
     */
    children: ReactNode;
    /**
     * Text label for the primary button.
     * @default "Confirm"
     */
    primaryButtonText?: string;
    /**
     * Text label for the secondary button.
     * @default "Cancel"
     */
    secondaryButtonText?: string;
    /**
     * Callback fired when the primary button is clicked.
     */
    onConfirm?: () => void;
    /**
     * Callback fired when the secondary button is clicked.
     */
    onCancel?: () => void;
    /**
     * Callback fired when the open state changes (e.g. outside click).
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Visual status of the confirm dialog. Changes the header icon and the primary button appearance.<br/>
     * Possible values: `error | warning`
     * @default "warning"
     */
    status?: "error" | "warning";
    /**
     * Whether the popover is open initially. Defaults value is `false`.
     */
    defaultOpen?: boolean;
    /**
     * Define width and height of the popover.<br>
     * Possible values: `medium | small`
     * @default "medium"
     */
    size?: "medium" | "small";
    /**
     * Position of the popover, relative to the reference (trigger, anchor) element.<br><br>
     * Possible values: `bottom-center | bottom-left | bottom-right | left-bottom | left-center` <br> `left-top | right-bottom | right-center | right-top | top-center | top-left | top-right | auto`
     * @default "bottom-center"
     */
    position?: IPopoverProps["position"];
    /**
     * Margin between the popover and its reference (trigger, anchor) element.
     * @default 4
     */
    margin?: number;
    /**
     * Function to update popover props dynamically.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    /**
     * Show or hide arrows
     * @default true
     */
    withArrow?: boolean;
    /**
     * If `true`, disables automatic repositioning of the popover when it would otherwise
     * overflow or collide with a window boundary. By default, the popover will attempt
     * to reposition itself (e.g., flip to another side) to remain visible.
     *
     * When `disableReposition` is enabled, the popover will instead remain in its
     * original placement, even if that causes it to overflow the viewport.
     * This can be useful when you want to handle overflow behavior manually or
     * maintain consistent placement.
     *
     * Note: Even with repositioning disabled, the component still provides
     * `nudgedLeft` and `nudgedTop` values, which can be used to handle content overflow.
     */
    disableReposition?: boolean;
    /**
     * Controls the open state of the popover externally.
     *
     * If `open` is provided, the component becomes a controlled component,
     * and its visibility will be dictated by the parent.
     * If `open` is not provided, the component manages its own open/close
     * state internally via user interaction (e.g., clicks).
     *
     * This allows the component to be used both in controlled and uncontrolled modes.
     */
    open?: boolean;
    /**
     * Determines how the popover is triggered.
     * Can be either "click" or "hover".
     * @default "click"
     */
    trigger?: "click" | "hover";
    /**
     * Custom action buttons to display in the footer.
     * If provided, this will override the default secondary/primary button behavior.
     * If appearance is not specified for an action, it defaults to "primary".
     * @example
     * actions={[
     *   { text: "Delete", appearance: "danger", onClick: handleDelete }
     * ]}
     * @example
     * actions={[
     *   { text: "Cancel", onClick: handleCancel },
     *   { text: "Confirm", onClick: handleConfirm }
     * ]}
     */
    actions?: IPopoverFooterActionProps[];
}

/**
 * PopoverConfirm is designed to request and capture user confirmation for actions
 * in a visually prominent yet non-intrusive manner. It overlays the primary content
 * to present a confirmation dialog that includes clear options for users to confirm
 * or cancel the action.
 */
const PopoverConfirm: FC<IPopoverConfirmProps> = ({
    children,
    title,
    primaryButtonText = "Confirm",
    secondaryButtonText = "Cancel",
    onConfirm,
    onCancel,
    onOpenChange,
    open: controlledOpen,
    defaultOpen = false,
    status = "warning",
    size = "medium",
    position = "bottom-center",
    margin = 4,
    setProps,
    withArrow = true,
    disableReposition = false,
    trigger = "click",
    actions
}) => {
    const [isOpenState, setIsOpenState] = useState(defaultOpen);

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null } as MutableRefObject<ReferenceType | null>,
        referenceElement: { current: null } as MutableRefObject<ReferenceType | null>
    });

    useEffect(() => {
        if (controlledOpen !== undefined) {
            setIsOpenState(controlledOpen);
        }
    }, [controlledOpen]);

    useClickOutside(
        (e) => {
            const onReferenceClick =
                e.target instanceof Node &&
                popoverRef.current.referenceElement?.current instanceof Node &&
                popoverRef.current.referenceElement.current.contains(e.target as Node);

            if (!onReferenceClick && isOpenState) {
                setIsOpenState(false);
                onOpenChange?.(false);
            }
        },
        [popoverRef.current.floatingElement]
    );

    const primaryButtonAppearance = status === "error" ? "danger" : "primary";

    const IconComponent = status === "error" ? ErrorFilled : TriangleAlert;
    const headerIcon: FC<IconProps> = ({ className, ...props }: IconProps) => (
        <IconComponent {...props} className={classNames(className, `popoverConfirm__titleIcon_${status}`)} size={20} />
    );

    const footerActions = React.useMemo((): IPopoverFooterActionProps[] => {
        if (actions) {
            return actions.map((action, index) => {
                let allowedAppearance = action.appearance || (status === "error" ? "danger" : "primary");
                if (actions.length === 2) {
                    if (index === 0) {
                        allowedAppearance = "secondary";
                    } else {
                        allowedAppearance = status === "error" ? "danger" : "primary";
                    }
                } else if (status === "error" && allowedAppearance !== "secondary") {
                    allowedAppearance = "danger";
                } else if (status === "warning" && allowedAppearance !== "secondary") {
                    allowedAppearance = "primary";
                }

                return {
                    ...action,
                    appearance: allowedAppearance
                };
            });
        }
        const defaultActions: IPopoverFooterActionProps[] = [
            {
                text: secondaryButtonText,
                appearance: "secondary",
                onClick: onCancel
            },
            {
                text: primaryButtonText,
                appearance: primaryButtonAppearance,
                onClick: onConfirm
            }
        ];
        return defaultActions;
    }, [actions, status, secondaryButtonText, primaryButtonText, primaryButtonAppearance, onCancel, onConfirm]);

    return (
        <div className="popoverConfirm">
            <Popover
                ref={popoverRef}
                open={isOpenState}
                defaultOpen={defaultOpen}
                size={size}
                position={position}
                margin={margin}
                setProps={setProps}
                title={title}
                withArrow={withArrow}
                disableReposition={disableReposition}
                trigger={trigger}
                hasCloseButton={false}
                Icon={headerIcon}
            >
                <PopoverBody>{children}</PopoverBody>
                <PopoverFooter actions={footerActions} />
            </Popover>
        </div>
    );
};

export { IPopoverConfirmProps, PopoverConfirm as default };
