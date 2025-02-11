import React, { JSX, ReactNode } from "react";

// Input interface for the args function.
// We allow additional properties via the index signature.
export interface ArgOptions extends Record<string, unknown> {
    control?: string;
    options?: unknown[]; // Array of options (could be strings, numbers, etc.)
    category?: string;
    condition?: string; // Typically the name of another arg to watch
    defaultValue?: unknown;
    truthy?: boolean;
    name?: string;
    action?: string;
}

// Output interface for the args function.
// This reflects the shape of the object built in the function.
export interface ArgResult extends Record<string, unknown> {
    control?: string;
    options?: unknown[];
    name?: string;
    table?: {
        category?: string;
        defaultValue?: { summary: unknown };
    };
    if?: {
        arg: string;
        truthy?: boolean;
    };
    action?: string;
}

// A helper function that conditionally builds an object
// for use as Storybook arg types.
export const args = (obj: ArgOptions): ArgResult => {
    const { control, options, category, condition, defaultValue, truthy, name, action, ...rest } = obj;

    const isDefaultProvided = "defaultValue" in obj;
    const isControl = "control" in obj;

    return {
        ...(isControl && { control }),
        ...(options && { options }),
        ...(name && { name }),
        ...((category || isDefaultProvided) && {
            table: {
                ...(category && { category }),
                ...(isDefaultProvided && { defaultValue: { summary: defaultValue } })
            }
        }),
        ...(condition && {
            if: {
                arg: condition,
                ...((truthy === false || truthy) && { truthy })
            }
        }),
        ...(action && { action }),
        ...rest
    };
};

// Prop category mapping with explicit type.
export const propCategory: Record<string, { category: string }> = {
    functionality: { category: "Functionality" },
    validation: { category: "Validation" },
    appearance: { category: "Appearance" },
    content: { category: "Content" },
    action: { category: "Actions" },
    states: { category: "States" },
    others: { category: "Others" }
};

// Component stage constant.
export const componentStage: { experimental: string; deprecated: string } = {
    experimental: "experimental",
    deprecated: "deprecated"
};

// Screenshot delay constant.
export const SCREENSHOT_DELAY: number = 5000;

// Props for the VariantsStoryGrid component.
interface VariantsStoryGridProps {
    children: ReactNode;
}

// A simple layout component to display children in a grid.
export function VariantsStoryGrid({ children }: VariantsStoryGridProps): JSX.Element {
    return <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>{children}</div>;
}
