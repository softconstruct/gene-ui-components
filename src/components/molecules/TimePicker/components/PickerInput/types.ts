import { FC, FocusEvent, HTMLAttributes, Ref } from "react";
import { Track } from "@react-input/mask";

// Icons
import { IconProps } from "@geneui/icons";

// Types
import { TimePickerSizes, TimePickerStatus } from "../../types";

export interface IPickerInputBaseProps {
    /**
     * ClassName for picker input wrapper.
     */
    className?: string;
    /**
     * The size of the input field.
     * @default "medium"
     */
    size?: TimePickerSizes;
    /**
     * Validation state of the field.
     * @default "rest"
     */
    status?: TimePickerStatus;
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
     * Whether the field is mandatory.
     */
    required?: boolean;
    /**
     * Icon to display at the end of the input field.
     */
    EndIcon?: FC<IconProps>;
    /**
     * The mask of the input field.
     */
    mask: string;
    /**
     * The characters the mask placeholder accepts.
     */
    maskReplacement: Record<string, RegExp>;
    /**
     * Validates every typed character against the rule of the slot it lands in.
     */
    maskTrack: Track;
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
     * Callback for clicks on the field around the inputs (icons, padding), which behave like a click
     * on the input.
     */
    onAreaClick?: () => void;
    /**
     * Callback for focus leaving the field, including its clear button.
     */
    onFocusOut?: (event: FocusEvent<HTMLDivElement>) => void;
    /**
     * Whether the field should display a clear button to clear the input value.
     */
    clearable?: boolean;
    /**
     * Used for accessibility, determines whether the picker popover is open/expanded.
     */
    isExpanded: boolean;
    /**
     * `id` of the popover controlled by the input(s).
     */
    popoverId: string;
    /**
     * `HTML` `name` attribute for the `input` element.
     */
    name?: string;
}
