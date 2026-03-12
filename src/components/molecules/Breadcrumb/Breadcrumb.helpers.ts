import {
    MAX_TRUNCATED_VISIBLE_ITEMS,
    MAX_VISIBLE_BREADCRUMB_ITEMS,
    MAX_VISIBLE_ITEMS_PER_SIDE
} from "./Breadcrumb.constants";

export type VisibilityConfig = {
    fitAll: boolean;
    firstCount: number;
    lastCount: number;
};

const FIT_ALL_CONFIG: VisibilityConfig = { fitAll: true, firstCount: 0, lastCount: 1 };

export type VisibilityMeasurements = {
    availableWidth: number;
    gap: number;
    itemWidths: number[];
    ellipsisWidth: number;
    itemsCount: number;
};

/**
 * Extracts width measurements from the measurement DOM for visibility calculation.
 * Returns null if measurement is not possible (e.g. DOM not ready).
 */
export const getVisibilityMeasurements = (
    container: HTMLElement | null,
    measureList: HTMLElement | null,
    itemsCount: number
): VisibilityMeasurements | null => {
    if (!container || !measureList || itemsCount <= 1) return null;

    const listItems = measureList.querySelectorAll<HTMLLIElement>("li");
    if (listItems.length < itemsCount + 1) return null;

    const listStyles = getComputedStyle(measureList);
    const gap = parseFloat(listStyles.gap) || 0;
    const itemWidths = Array.from({ length: itemsCount }, (_, i) => listItems[i].offsetWidth);
    const ellipsisWidth = listItems[itemsCount].offsetWidth;

    return {
        availableWidth: container.clientWidth,
        gap,
        itemWidths,
        ellipsisWidth,
        itemsCount
    };
};

/**
 * Determines if breadcrumb items must be truncated to fit the container.
 */
export const mustTruncate = (measurements: VisibilityMeasurements): boolean => {
    const { availableWidth, gap, itemWidths, itemsCount } = measurements;
    const totalItemsWidth = itemWidths.reduce((a, b) => a + b, 0);
    const totalWithGaps = totalItemsWidth + gap * (itemsCount - 1);
    return itemsCount > MAX_VISIBLE_BREADCRUMB_ITEMS || totalWithGaps > availableWidth;
};

/**
 * Generates (last, first) pairs to try, ordered by preference (more balanced first).
 * For total=4: tries (2,2), (1,3), (3,1), (4,0) etc.
 */
const getFirstLastCandidates = (total: number): Array<[number, number]> => {
    const center = Math.ceil(total / 2);
    const lower = Array.from({ length: center }, (_, i) => center - i);
    const upper = Array.from({ length: total - center }, (_, i) => center + 1 + i);
    const lastOrder = [...lower, ...upper];
    return lastOrder.map((last) => [total - last, last] as [number, number]);
};

/**
 * Finds the best (firstCount, lastCount) split that fits within available width.
 * Prefers showing more items, with a balance between first and last.
 */
const findBestVisibilitySplit = (
    measurements: VisibilityMeasurements
): {
    firstCount: number;
    lastCount: number;
} => {
    const { availableWidth, gap, itemWidths, ellipsisWidth, itemsCount } = measurements;
    const overflowMax = itemsCount > MAX_VISIBLE_BREADCRUMB_ITEMS;
    const maxTotal = overflowMax ? MAX_TRUNCATED_VISIBLE_ITEMS : Math.min(MAX_VISIBLE_BREADCRUMB_ITEMS, itemsCount - 1);

    const totalsToTry = Array.from({ length: maxTotal }, (_, i) => maxTotal - i);

    const fitsInWidth = ([first, last]: [number, number]) => {
        const sumFirst = itemWidths.slice(0, first).reduce((a, b) => a + b, 0);
        const sumLast = itemWidths.slice(-last).reduce((a, b) => a + b, 0);
        const requiredWidth = sumFirst + ellipsisWidth + sumLast + gap * (first + last);
        return requiredWidth <= availableWidth;
    };

    const result = totalsToTry.reduce<[number, number] | null>((acc, total) => {
        if (acc) return acc;
        const candidates = getFirstLastCandidates(total);
        const found = candidates.find(
            ([first, last]) =>
                first + last < itemsCount &&
                first <= MAX_VISIBLE_ITEMS_PER_SIDE &&
                last <= MAX_VISIBLE_ITEMS_PER_SIDE &&
                fitsInWidth([first, last])
        );
        return found ?? null;
    }, null);

    const [bestFirst, bestLast] = result ?? [0, 1];
    return { firstCount: bestFirst, lastCount: bestLast };
};

/**
 * Calculates which breadcrumb items should be visible based on container width.
 */
export const calculateVisibilityConfig = (
    container: HTMLElement | null,
    measureList: HTMLElement | null,
    itemsCount: number
): VisibilityConfig => {
    const measurements = getVisibilityMeasurements(container, measureList, itemsCount);
    if (!measurements) return FIT_ALL_CONFIG;
    if (!mustTruncate(measurements)) return FIT_ALL_CONFIG;

    const { firstCount, lastCount } = findBestVisibilitySplit(measurements);
    return { fitAll: false, firstCount, lastCount };
};
