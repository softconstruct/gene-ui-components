import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

// Constants
const INITIAL_TAGS_TO_SHOW = 10;
const TAGS_INCREMENT_STEP = 10;
const MAX_ALLOWED_LINES = 2;

interface ITagVisibilityState {
    visibleCount: number;
    shouldShowToggleButton: boolean;
}

interface IUseTagVisibilityProps {
    childrenArray: ReactNode[];
    isExpanded: boolean;
    width: number;
}

export const useTagVisibility = ({ childrenArray, isExpanded, width }: IUseTagVisibilityProps) => {
    const [tagVisibility, setTagVisibility] = useState<ITagVisibilityState>({
        visibleCount: INITIAL_TAGS_TO_SHOW,
        shouldShowToggleButton: false
    });

    const containerRef = useRef<HTMLDivElement | null>(null);

    const calculateOptimalTagDisplay = useCallback(() => {
        const container = containerRef.current;
        if (!container || isExpanded) return;

        const firstTagElement = container.firstElementChild as HTMLElement;
        const lastTagElement = container.lastElementChild as HTMLElement;

        if (!firstTagElement || !lastTagElement) return;

        const firstTagTopPosition = firstTagElement.offsetTop;
        const lastTagTopPosition = lastTagElement.offsetTop;
        const singleLineHeight = lastTagElement.offsetHeight;

        const currentLineCount =
            lastTagTopPosition === firstTagTopPosition
                ? 1
                : Math.floor((lastTagTopPosition - firstTagTopPosition) / singleLineHeight) + 1;

        setTagVisibility((currentState) => {
            if (currentLineCount > MAX_ALLOWED_LINES) {
                return { ...currentState, shouldShowToggleButton: true };
            }
            return {
                visibleCount: Math.min(childrenArray.length, currentState.visibleCount + TAGS_INCREMENT_STEP),
                shouldShowToggleButton:
                    childrenArray.length > currentState.visibleCount || currentLineCount > MAX_ALLOWED_LINES
            };
        });
    }, [childrenArray.length, isExpanded]);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        calculateOptimalTagDisplay();
    }, [width, calculateOptimalTagDisplay]);

    return {
        tagVisibility,
        containerRef
    };
};
