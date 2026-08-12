import Highcharts from "highcharts";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Deep-merges Highcharts options. Arrays from `override` replace `base` arrays.
 */
export const mergeChartOptions = (base: Highcharts.Options, override?: Highcharts.Options): Highcharts.Options => {
    if (!override) {
        return base;
    }

    const mergeDeep = (target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> => {
        const result: Record<string, unknown> = { ...target };

        Object.keys(source).forEach((key) => {
            const sourceValue = source[key];
            const targetValue = target[key];

            if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
                result[key] = mergeDeep(targetValue, sourceValue);
            } else {
                result[key] = sourceValue;
            }
        });

        return result;
    };

    return mergeDeep(base as Record<string, unknown>, override as Record<string, unknown>) as Highcharts.Options;
};
