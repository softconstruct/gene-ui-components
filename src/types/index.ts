export type OSTypes = "iOS" | "Android" | "Windows" | "macOS" | "Linux" | "Unknown";

export type DeviceTypes = "mobile" | "tablet" | "desktop";

export type ThemesTypes = "light" | "dark" | "system";

export type BreakpointsTypes = Record<DeviceTypes, number>;

/**
 * Used to represent DOM API's where users can either pass
 * true or false as a boolean or as its equivalent strings.
 */
export type Booleanish = boolean | "true" | "false";

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
