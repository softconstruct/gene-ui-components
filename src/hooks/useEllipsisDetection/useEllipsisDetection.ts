import { useEffect, useState, RefObject } from "react";
import useDebouncedCallback from "../useDebounceCallback";

const EQUAL_HEIGHT_DIFF = 3;

interface IUseEllipsisDetection {
    (ref: RefObject<HTMLElement>, externalDependencies?: unknown[]): boolean;
}

const useEllipsisDetection: IUseEllipsisDetection = (ref, externalDependencies = []) => {
    const [isTruncated, setIsTruncated] = useState(false);

    const handleResize = () => {
        if (!ref.current) return;
        const { scrollWidth, clientWidth, scrollHeight, clientHeight } = ref.current;
        setIsTruncated(scrollWidth > clientWidth || scrollHeight > clientHeight + EQUAL_HEIGHT_DIFF);
    };

    useEffect(() => handleResize(), [...externalDependencies]);

    const { debouncedCallback } = useDebouncedCallback(handleResize, 100);

    useEffect(() => {
        window.addEventListener("resize", debouncedCallback);

        return () => window.removeEventListener("resize", debouncedCallback);
    }, [ref?.current?.scrollWidth, ref?.current?.clientWidth, ref?.current?.scrollHeight, ref?.current?.clientHeight]);

    return isTruncated;
};

export default useEllipsisDetection;
