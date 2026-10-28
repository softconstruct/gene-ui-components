import React, { FC, MouseEvent, MutableRefObject, ReactNode, useCallback } from "react";
import classNames from "classnames";

// Icons
import { X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";

// Constants
import { pickerShellIconSizeMap, textSizeMap } from "../../constants";
// Types
import { TimePickerSizes, TimePickerStatus } from "../../types";
import { IPickerInputBaseProps } from "./types";

interface IPickerShellProps
    extends Pick<
        IPickerInputBaseProps,
        | "className"
        | "helperText"
        | "disabled"
        | "readOnly"
        | "EndIcon"
        | "onClear"
        | "clearLabel"
        | "anchorProps"
        | "anchorRef"
        | "shellRef"
        | "onAreaClick"
        | "onFocusOut"
    > {
    size: TimePickerSizes;
    status: TimePickerStatus;
    mode: "single" | "range";
    children: ReactNode;
    helperTextId: string;
    showClearButton: boolean;
}

const isControlTarget = (target: EventTarget): boolean =>
    target instanceof Element && !!target.closest("input, button");

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

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (!isControlTarget(event.target)) event.preventDefault();
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!isControlTarget(event.target)) onAreaClick?.();
    };

    return (
        <>
            <div
                {...anchorProps}
                ref={setShellRef}
                role="presentation"
                className={classNames(
                    "pickerInput",
                    className,
                    `pickerInput_mode_${mode}`,
                    `pickerInput_size_${size}`,
                    {
                        pickerInput_state_error: status === "error",
                        pickerInput_state_warning: status === "warning",
                        pickerInput_state_disabled: disabled,
                        pickerInput_state_readOnly: readOnly
                    }
                )}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onBlur={onFocusOut}
            >
                {children}
                {(showClearButton || EndIcon) && (
                    <div className="pickerInput__append">
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
                        {EndIcon && <EndIcon size={20} className="pickerInput__icon" aria-hidden="true" />}
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
                        className="pickerInput__errorMessage"
                    />
                </div>
            )}
        </>
    );
};

export { IPickerShellProps, PickerShell as default };
