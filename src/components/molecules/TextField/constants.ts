// Size mapping objects for Label, Button, IconBefore/IconAfter and HelperText components
const labelSizeMap = {
    large: "medium" as const,
    medium: "medium" as const,
    small: "small" as const
};

const helperTextSizeMap = {
    large: "medium" as const,
    medium: "medium" as const,
    small: "small" as const
};

const iconSizeMap = {
    large: 24 as const,
    medium: 24 as const,
    small: 20 as const
};

const actionButtonSizeMap = {
    large: "small" as const,
    medium: "small" as const,
    small: "smallNudge" as const
};

export { labelSizeMap, helperTextSizeMap, iconSizeMap, actionButtonSizeMap };
