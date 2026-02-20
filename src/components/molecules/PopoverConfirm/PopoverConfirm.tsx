import React, { FC } from "react";

// Components
import Button from "@components/atoms/Button";
import { IPopoverProps, Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "@components/atoms/Popover";

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
    ...popoverProps
}) => {
    return (
        <div className="popoverConfirm">
            <Popover {...popoverProps}>
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
