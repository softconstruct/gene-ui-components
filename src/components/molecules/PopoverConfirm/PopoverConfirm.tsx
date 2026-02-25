import React, { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { ReferenceType } from "@floating-ui/react";
import classNames from "classnames";

import { ErrorFilled, IconProps, TriangleAlert } from "@geneui/icons";

// Components
import { IPopoverProps, IPopoverRef, Popover, PopoverBody, PopoverFooter } from "@components/atoms/Popover";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./PopoverConfirm.scss";

interface IPopoverConfirmProps extends Omit<IPopoverProps, "title"> {
    /**
     * Title displayed in the popover header. Required for PopoverConfirm.
     */
    title: string;
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
     */
    status?: "error" | "warning";
}

/**
 * PopoverConfirm is designed to request and capture user confirmation for actions
 * in a visually prominent yet non-intrusive manner. It overlays the primary content
 * to present a confirmation dialog that includes clear options for users to confirm
 * or cancel the action.
 */
const PopoverConfirm: FC<IPopoverConfirmProps> = ({
    children,
    primaryButtonText = "Confirm",
    secondaryButtonText = "Cancel",
    onConfirm,
    onCancel,
    onOpenChange,
    open: controlledOpen,
    defaultOpen = false,
    status = "warning",
    ...popoverProps
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
        <IconComponent {...props} className={classNames(className, `popoverConfirm__title_icon_${status}`)} size={20} />
    );

    return (
        <div className="popoverConfirm">
            <Popover {...popoverProps} ref={popoverRef} open={isOpenState} hasCloseButton={false} Icon={headerIcon}>
                <PopoverBody>{children}</PopoverBody>
                <PopoverFooter
                    actions={[
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
                    ]}
                />
            </Popover>
        </div>
    );
};

export { IPopoverConfirmProps, PopoverConfirm as default };
