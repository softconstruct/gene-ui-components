import React, { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { ReferenceType } from "@floating-ui/react";

// Components
import Button from "@components/atoms/Button";
import {
    IPopoverProps,
    IPopoverRef,
    Popover,
    PopoverBody,
    PopoverFooter,
    PopoverFooterActions
} from "@components/atoms/Popover";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./PopoverConfirm.scss";

interface IPopoverConfirmProps extends IPopoverProps {
    /**
     * Text label for the confirm button.
     * @default "Confirm"
     */
    confirmText?: string;
    /**
     * Text label for the cancel button.
     * @default "Cancel"
     */
    cancelText?: string;
    /**
     * Callback fired when the confirm button is clicked.
     */
    onConfirm?: () => void;
    /**
     * Callback fired when the cancel button is clicked.
     */
    onCancel?: () => void;
    /**
     * Callback fired when the open state changes (e.g. outside click).
     */
    onOpenChange?: (isOpen: boolean) => void;
}

/**
 * PopoverConfirm is designed to request and capture user confirmation for actions
 * in a visually prominent yet non-intrusive manner. It overlays the primary content
 * to present a confirmation dialog that includes clear options for users to confirm
 * or cancel the action.
 */
const PopoverConfirm: FC<IPopoverConfirmProps> = ({
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    onOpenChange,
    onClose,
    open: controlledOpen,
    defaultOpen = false,
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
                onClose?.();
            }
        },
        [popoverRef.current.floatingElement]
    );
    return (
        <div className="popoverConfirm">
            <Popover {...popoverProps} ref={popoverRef} open={isOpenState} hasCloseButton={false}>
                <PopoverBody>{children}</PopoverBody>
                <PopoverFooter>
                    <PopoverFooterActions>
                        <Button size="small" appearance="secondary" onClick={onCancel}>
                            {cancelText}
                        </Button>
                        <Button size="small" appearance="primary" onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    </PopoverFooterActions>
                </PopoverFooter>
            </Popover>
        </div>
    );
};

export { IPopoverConfirmProps, PopoverConfirm as default };
