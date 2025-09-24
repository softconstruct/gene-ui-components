import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

// Constants
const INITIAL_TAGS_TO_SHOW = 10;
const TAGS_INCREMENT_STEP = 10;
const MAX_ALLOWED_LINES = 2;

interface ITagVisibilityState {
    visibleCount: number;
    shouldShowToggleButton: boolean;
    overflowStartIndex: number; // Index of the first element that starts wrapping to the 3rd line (MAX_ALLOWED_LINES + 1)
}

interface IUseTagVisibilityProps {
    childrenArray: ReactNode[];
    isExpanded: boolean;
    width: number;
}

export const useTagVisibility = ({ childrenArray, isExpanded, width }: IUseTagVisibilityProps) => {
    const [tagVisibility, setTagVisibility] = useState<ITagVisibilityState>({
        visibleCount: INITIAL_TAGS_TO_SHOW,
        shouldShowToggleButton: false,
        overflowStartIndex: -1
    });

    const containerRef = useRef<HTMLDivElement | null>(null);

    const findOverflowElement = useCallback((container: HTMLElement): number => {
        const firstTagElement = container.firstElementChild as HTMLElement;
        if (!firstTagElement) return -1;

        const firstTagTopPosition = firstTagElement.offsetTop;
        const tagHeight = firstTagElement.offsetHeight;

        if (tagHeight === 0) return -1;

        // Find first element that overflows to MAX_ALLOWED_LINES'th line
        for (let i = 0; i < container.childNodes.length; i++) {
            const childElement = container.childNodes[i] as HTMLElement;
            const elementLineNumber =
                childElement.offsetTop === firstTagTopPosition
                    ? 1
                    : Math.ceil((childElement.offsetTop - firstTagTopPosition) / tagHeight);

            if (elementLineNumber > MAX_ALLOWED_LINES) {
                return i;
            }
        }

        return -1;
    }, []);

    const calculateTagVisibility = useCallback(() => {
        const container = containerRef.current;
        if (!container || isExpanded) return;

        const firstOverflowElementIndex = findOverflowElement(container);

        setTagVisibility((currentState) => {
            const hasOverflow = firstOverflowElementIndex > -1;

            if (hasOverflow) {
                return {
                    visibleCount: currentState.visibleCount,
                    shouldShowToggleButton: true,
                    overflowStartIndex: firstOverflowElementIndex
                };
            }
            return {
                visibleCount: Math.min(childrenArray.length, currentState.visibleCount + TAGS_INCREMENT_STEP),
                shouldShowToggleButton: false,
                overflowStartIndex: -1
            };
        });
    }, [childrenArray.length, isExpanded, findOverflowElement]);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        calculateTagVisibility();
    }, [width, calculateTagVisibility]);

    return {
        tagVisibility,
        containerRef
    };
};
