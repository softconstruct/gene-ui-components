import React, { Dispatch, FC, FocusEvent, KeyboardEvent, MouseEvent, ReactNode, Ref, SetStateAction } from "react";

// Components
import { IPopoverProps, IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";

// Constants
import { KEYS } from "../../constants";
// Types
import { PickerPosition } from "../../types";

interface IPickerPopoverProps {
    /**
     * `id` of the popover content, referenced by the input through `aria-controls`.
     */
    id: string;
    /**
     * Controls whether the popover is open. The content is only rendered while it is.
     */
    open?: boolean;
    /**
     * Popover placement position.
     */
    position?: PickerPosition;
    /**
     * Controls the popover height mode on mobile.
     */
    mobileHeightMode?: "fit" | "full";
    /**
     * Reference to the popover element.
     */
    popoverRef?: Ref<IPopoverRef>;
    /**
     * Popover positioning props passed to the underlying popover component.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    /**
     * Callback invoked when the popover should be closed.
     */
    onClose?: IPopoverProps["onClose"];
    /**
     * Callback invoked when the focus leaves an element inside the popover; the owner decides
     * whether it went outside the picker.
     */
    onFocusOut?: (event: FocusEvent<HTMLDivElement>) => void;
    /**
     * Callback invoked on `Tab` while the focus is inside the popover, before the browser moves it,
     * so the owner can hand the focus back to the field and let `Tab` continue from there. Leave it
     * out when the content moves the focus between its own controls.
     */
    onTabOut?: () => void;
    /**
     * The content of the popover.
     */
    children: ReactNode;
}

/**
 * Presses inside the popover must not move the focus away from the input: the field keeps the caret
 * while values are picked with the mouse, and `Tab` continues from the field afterwards.
 */
const keepReferenceFocus = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
};

/**
 * The popover of a picker field: positioned under the field, rendered only while open, and wired
 * to the field's focus handling.
 */
const PickerPopover: FC<IPickerPopoverProps> = ({
    id,
    open,
    position,
    mobileHeightMode,
    popoverRef,
    setProps,
    onClose,
    onFocusOut,
    onTabOut,
    children
}) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === KEYS.TAB) onTabOut?.();
    };

    return (
        <Popover
            size="fitContent"
            open={open}
            position={position}
            setProps={setProps}
            onClose={onClose}
            ref={popoverRef}
            mobileHeightMode={mobileHeightMode}
            withArrow={false}
        >
            <PopoverBody withPadding={false}>
                {open && (
                    <div
                        id={id}
                        role="presentation"
                        className="pickerPopover"
                        onBlur={onFocusOut}
                        onKeyDown={handleKeyDown}
                        onMouseDown={keepReferenceFocus}
                    >
                        {children}
                    </div>
                )}
            </PopoverBody>
        </Popover>
    );
};

export { IPickerPopoverProps, PickerPopover as default };
