import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface IUseContainerSizeProps {
    /**
     * Whether to observe resize changes
     * @default true
     */
    observeResize?: boolean;
}

export interface IContainerSize {
    width: number;
    height: number;
}

/**
 * Hook to measure container dimensions and observe resize changes
 *
 * @param observeResize - Whether to observe resize changes
 * @returns Object containing containerRef and size measurements
 *
 * @example
 * ```tsx
 * const { containerRef, sizes } = useContainerSize();
 *
 * return (
 *   <div ref={containerRef}>
 *     Container width: {sizes.width}px
 *   </div>
 * );
 * ```
 */
const useContainerSize = <T extends HTMLElement = HTMLElement>({ observeResize = true }: IUseContainerSizeProps = {}): {
    containerRef: RefObject<T>;
    sizes: IContainerSize;
} => {
    const containerRef = useRef<T>(null);
    const [sizes, setSizes] = useState<IContainerSize>({ width: 0, height: 0 });

    const updateSize = useCallback(() => {
        if (!containerRef.current) return;

        const { offsetWidth, offsetHeight } = containerRef.current;
        setSizes({ width: offsetWidth, height: offsetHeight });
    }, []);

    useEffect(() => {
        updateSize();

        if (!observeResize || !containerRef.current) return () => {};

        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [observeResize, updateSize]);

    return {
        containerRef,
        sizes
    };
};

export default useContainerSize;
