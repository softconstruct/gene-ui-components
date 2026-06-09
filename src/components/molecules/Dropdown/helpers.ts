import { FALLBACK_VISIBLE_ITEMS, MEASURE_SAFETY_OFFSET, TEXT_MEASURE_FALLBACK_CHAR_WIDTH_PX } from "./constants";

export interface ICompactSelectedView {
    visibleText: string;
    suffixText: string;
}

let cachedCanvasContext: CanvasRenderingContext2D | null = null;

const getTextWidth = (text: string, font: string): number => {
    if (typeof document === "undefined") return text.length * TEXT_MEASURE_FALLBACK_CHAR_WIDTH_PX;

    if (!cachedCanvasContext) {
        cachedCanvasContext = document.createElement("canvas").getContext("2d");
    }

    if (!cachedCanvasContext) return text.length * TEXT_MEASURE_FALLBACK_CHAR_WIDTH_PX;

    cachedCanvasContext.font = font;
    return cachedCanvasContext.measureText(text).width;
};

const getInputFont = (inputNode: HTMLInputElement): string => {
    return getComputedStyle(inputNode).font || "400 14px Arial";
};

const getFallbackCompactText = (selectedLabels: string[]): ICompactSelectedView => {
    if (selectedLabels.length <= FALLBACK_VISIBLE_ITEMS) {
        return { visibleText: selectedLabels.join(", "), suffixText: "" };
    }

    const visibleText = selectedLabels.slice(0, FALLBACK_VISIBLE_ITEMS).join(", ");
    const remainingCount = selectedLabels.length - FALLBACK_VISIBLE_ITEMS;
    return { visibleText, suffixText: `+${remainingCount}...` };
};

export const getCompactSelectedView = (
    selectedLabels: string[],
    triggerInputWidth: number,
    inputNode: HTMLInputElement | null
): ICompactSelectedView => {
    if (selectedLabels.length <= 1) return { visibleText: selectedLabels.join(", "), suffixText: "" };
    if (!inputNode || !triggerInputWidth) return getFallbackCompactText(selectedLabels);

    const inputFont = getInputFont(inputNode);
    const availableWidth = Math.max(triggerInputWidth - MEASURE_SAFETY_OFFSET, 0);
    const fullText = selectedLabels.join(", ");

    if (getTextWidth(fullText, inputFont) <= availableWidth) {
        return { visibleText: fullText, suffixText: "" };
    }

    for (let visibleItems = selectedLabels.length - 1; visibleItems > 0; visibleItems--) {
        const remainingCount = selectedLabels.length - visibleItems;
        const visibleText = selectedLabels.slice(0, visibleItems).join(", ");
        const suffixText = `+${remainingCount}...`;
        const requiredWidth = getTextWidth(visibleText, inputFont) + getTextWidth(suffixText, inputFont);

        if (requiredWidth <= availableWidth) {
            return { visibleText, suffixText };
        }
    }

    // Always keep at least one selected item visible and keep the count suffix.
    // The input text will truncate if needed.
    return { visibleText: selectedLabels[0], suffixText: `+${selectedLabels.length - 1}...` };
};
