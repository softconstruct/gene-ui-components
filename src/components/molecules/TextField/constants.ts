// Size mapping objects for Label, Button, IconBefore/IconAfter and HelperText components

const textSizeMap = {
    large: "medium",
    medium: "medium",
    small: "small"
} as const;

const labelSizeMap = textSizeMap;
const helperTextSizeMap = textSizeMap;

const iconSizeMap = {
    large: 24,
    medium: 24,
    small: 20
} as const;

const actionButtonSizeMap = {
    large: "small",
    medium: "small",
    small: "smallNudge"
} as const;
export { labelSizeMap, helperTextSizeMap, iconSizeMap, actionButtonSizeMap };
