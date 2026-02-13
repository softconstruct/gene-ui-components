import React, { forwardRef } from "react";
import { IMaskInput } from "react-imask";

import MASKED_INPUT_DEFAULT_BLOCKS from "./constants";

type ValidMaskType = React.ComponentProps<typeof IMaskInput>["mask"];

interface IMaskedInputProps extends Omit<React.ComponentProps<typeof IMaskInput>, "mask" | "onChange"> {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     *  The pattern mask to apply to the input.
     */
    format?: ValidMaskType;
    /**
     * Current value of the input.
     */
    value?: string;
    /**
     * Whether the field is disabled
     */
    disabled?: boolean;
    /**
     * Whether the filed is read-only
     */
    readOnly?: boolean;
    /**
     * If true, the mask placeholder is hidden until the user focuses or types.
     */
    lazy?: boolean;
    /**
     * Input placeholder text.
     */
    placeholder?: string;
    /**
     * Custom block definitions for the mask pattern.
     */
    blocks?: Record<string, unknown>;
    /**
     * Triggered when the input gains focus.
     */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /**
     * Triggered when the input loses focus.
     */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /**
     * Triggered when the input value changes and is accepted by the mask.
     */
    onChange?: (value: string) => void;
    /**
     * Triggered when the input is clicked.
     */
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const MaskedInput = forwardRef<HTMLInputElement, IMaskedInputProps>(
    (
        {
            format,
            blocks,
            value,
            disabled,
            onChange,
            onClick,
            placeholder,
            className,
            readOnly,
            onFocus,
            onBlur,
            ...props
        },
        ref
    ) => {
        const getMaskOptions = () => {
            const isTime = format && String(format).includes(":");

            const mergedBlocks = { ...MASKED_INPUT_DEFAULT_BLOCKS, ...blocks };

            if (isTime && format && String(format).includes("mm") && !String(format).includes("MM")) {
                mergedBlocks.mm = MASKED_INPUT_DEFAULT_BLOCKS.mm_time;
            }

            return {
                mask: format,
                blocks: mergedBlocks,
                lazy: false,
                overwrite: true,
                autofix: true
            };
        };

        const inputPlaceholder = placeholder || (typeof format === "string" ? format : undefined);

        return (
            <IMaskInput
                {...getMaskOptions()}
                value={value}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                onClick={onClick}
                inputRef={ref}
                onAccept={(val: string) => onChange?.(val)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={inputPlaceholder}
                {...props}
            />
        );
    }
);

export default MaskedInput;
