import React, {
    FC,
    FocusEvent,
    HTMLAttributes,
    MouseEvent,
    MutableRefObject,
    ReactNode,
    Ref,
    SyntheticEvent,
    useCallback
} from "react";
import classNames from "classnames";

// Icons
import { IconProps, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";

// Constants
import { pickerShellIconSizeMap, textSizeMap } from "../../constants";
// Types
import { TimePickerSizes, TimePickerStatus } from "../../types";

// Styles
import "./PickerShell.scss";

interface IPickerShellProps {
    /**
     * ClassName for picker input wrapper.
     */
    className?: string;
    /**
     * Helper text rendered below the field, styled according to `status`.
     */
    helperText?: string;
    /**
     * Whether the field should be displayed as disabled.
     */
    disabled?: boolean;
    /**
     * Whether the field should be read-only.
     */
    readOnly?: boolean;
    /**
     * Icon to display at the end of the input field.
     */
    EndIcon?: FC<IconProps>;
    /**
     * Callback function which triggers when the field value is getting cleared with the clear button.
     */
    onClear?: () => void;
    /**
     * Accessible label of the clear button.
     */
    clearLabel: string;
    /**
     * Props `Popover` assigns to its reference element (ARIA attributes and handlers), without the
     * `ref`, which is passed separately as `anchorRef`.
     */
    anchorProps?: HTMLAttributes<HTMLDivElement>;
    /**
     * `Popover` positioning ref, merged into the field element together with `shellRef`.
     */
    anchorRef?: (node: HTMLElement | null) => void;
    /**
     * Reference to the field element, used to tell presses inside the field apart from outside ones.
     */
    shellRef?: Ref<HTMLDivElement>;
    /**
     * Callback for clicks on the field around the inputs (padding, separator), which behave like a
     * click on the input.
     */
    onAreaClick?: () => void;
    /**
     * Callback for clicks on the end icon, which toggles the popover instead of only opening it.
     */
    onIconClick?: () => void;
    /**
     * Callback for focus leaving the field, including its clear button.
     */
    onFocusOut?: (event: FocusEvent<HTMLDivElement>) => void;
    /**
     * The size of the field: sets its height, paddings and corner radius, and the sizes of the clear button
     * and the helper text.
     */
    size: TimePickerSizes;
    /**
     * Validation state of the field: `rest`, `warning` or `error`. `error` colors the border, and the state
     * is passed to the helper text.
     */
    status: TimePickerStatus;
    /**
     * Whether the field holds one input (`single`) or a start and end input (`range`). Added to the root as
     * a `pickerShell_mode_*` modifier.
     */
    mode: "single" | "range";
    /**
     * The input or inputs rendered inside the field, before the clear button and `EndIcon`.
     */
    children: ReactNode;
    /**
     * `id` of the element that wraps the helper text, so the inputs can reference it in `aria-describedby`.
     */
    helperTextId: string;
    /**
     * Whether to display the clear button at the end of the field.
     */
    showClearButton: boolean;
}

/**
 * Whether an event was raised on the element that handles it, and not on one of its children. The
 * field reacts to presses on its own surface only, so the inputs and the clear button keep their
 * behaviour without any event being stopped.
 */
const isOwnTarget = (event: SyntheticEvent): boolean => event.target === event.currentTarget;

/**
 * Presses on the field around the inputs keep the focus where it is.
 */
const keepFocus = (event: MouseEvent<HTMLElement | SVGElement>) => {
    event.preventDefault();
};

const PickerShell: FC<IPickerShellProps> = ({
    className,
    mode,
    size,
    children,
    status,
    helperText,
    helperTextId,
    disabled,
    readOnly,
    EndIcon,
    onClear,
    showClearButton,
    clearLabel,
    anchorProps,
    anchorRef,
    shellRef,
    onAreaClick,
    onIconClick,
    onFocusOut
}) => {
    const setShellRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (typeof shellRef === "function") {
                shellRef(node);
            } else if (shellRef) {
                // eslint-disable-next-line no-param-reassign
                (shellRef as MutableRefObject<HTMLDivElement | null>).current = node;
            }

            anchorRef?.(node);
        },
        [shellRef, anchorRef]
    );

    const handleAreaMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (isOwnTarget(event)) keepFocus(event);
    };

    const handleAreaClick = (event: MouseEvent<HTMLDivElement>) => {
        if (isOwnTarget(event)) onAreaClick?.();
    };

    return (
        <>
            <div
                {...anchorProps}
                ref={setShellRef}
                role="presentation"
                className={classNames(
                    "pickerShell",
                    className,
                    `pickerShell_mode_${mode}`,
                    `pickerShell_size_${size}`,
                    `pickerShell_status_${status}`,
                    {
                        pickerShell_disabled: disabled,
                        pickerShell_readOnly: readOnly
                    }
                )}
                onMouseDown={handleAreaMouseDown}
                onClick={handleAreaClick}
                onBlur={onFocusOut}
            >
                {children}
                {(showClearButton || EndIcon) && (
                    <div
                        role="presentation"
                        className="pickerShell__append"
                        onMouseDown={handleAreaMouseDown}
                        onClick={handleAreaClick}
                    >
                        {showClearButton && (
                            <Button
                                onClick={onClear}
                                Icon={X}
                                appearance="secondary"
                                aria-label={clearLabel}
                                size={pickerShellIconSizeMap[size]}
                                layout="text"
                            />
                        )}
                        {EndIcon && (
                            <EndIcon
                                size={20}
                                className="pickerShell__icon"
                                aria-hidden="true"
                                onMouseDown={keepFocus}
                                onClick={onIconClick}
                            />
                        )}
                    </div>
                )}
            </div>
            {helperText && (
                <div id={helperTextId}>
                    <HelperText
                        size={textSizeMap[size]}
                        text={helperText}
                        status={status}
                        disabled={disabled}
                        className="pickerShell__helperText"
                    />
                </div>
            )}
        </>
    );
};

export { IPickerShellProps, PickerShell as default };
