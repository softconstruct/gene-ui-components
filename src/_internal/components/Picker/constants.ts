const PICKER_RANGE_FIELDS = {
    START: "start",
    END: "end"
} as const;

/**
 * Typing reports through `onChange` once the user pauses for this long.
 */
const INPUT_CHANGE_DEBOUNCE_MS = 300;

/**
 * `id` prefix used when the consumer does not provide an `id`.
 */
const DEFAULT_ID_PREFIX = "default-id-";

/**
 * The mask library displays its replacement character in every empty slot, so a single `_` is used
 * for all of them; the rules of the individual slots are enforced by `createMaskTrack`.
 */
const MASK_PLACEHOLDER = "_";

/**
 * Reason `atoms/Popover` reports when it is closed with `Escape`.
 */
const ESCAPE_CLOSE_REASON = "escape-key";

const KEYS = {
    TAB: "Tab",
    ENTER: "Enter",
    SPACE: " ",
    ESCAPE: "Escape",
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    HOME: "Home",
    END: "End",
    PAGE_UP: "PageUp",
    PAGE_DOWN: "PageDown"
} as const;

const textSizeMap = {
    large: "medium",
    medium: "medium",
    small: "small"
} as const;

const headerTextVariantMap = {
    large: "bodyMediumSemibold",
    medium: "bodyMediumSemibold",
    small: "captionLargeSemibold"
} as const;

const pickerShellIconSizeMap = {
    small: "smallNudge",
    medium: "small",
    large: "small"
} as const;

export {
    DEFAULT_ID_PREFIX,
    ESCAPE_CLOSE_REASON,
    headerTextVariantMap,
    INPUT_CHANGE_DEBOUNCE_MS,
    KEYS,
    MASK_PLACEHOLDER,
    PICKER_RANGE_FIELDS,
    pickerShellIconSizeMap,
    textSizeMap
};
