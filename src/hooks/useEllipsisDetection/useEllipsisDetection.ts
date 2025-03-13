import { RefObject, useEffect, useState } from "react";

import useWindowSize from "@hooks/useWindowSize";

const EQUAL_HEIGHT_DIFF = 3;

interface IUseEllipsisDetection {
    (ref: RefObject<HTMLElement>, externalDependencies?: unknown[]): boolean;
}

const useEllipsisDetection: IUseEllipsisDetection = (ref, externalDependencies = []) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const { width } = useWindowSize();

    const handleResize = () => {
        if (!ref.current) return;
        const { scrollWidth, clientWidth, scrollHeight, clientHeight } = ref.current;
        setIsTruncated(scrollWidth > clientWidth || scrollHeight > clientHeight + EQUAL_HEIGHT_DIFF);
    };

    useEffect(() => {
        handleResize();
    }, [
        width,
        ...externalDependencies,
        ref?.current?.scrollWidth,
        ref?.current?.clientWidth,
        ref?.current?.scrollHeight,
        ref?.current?.clientHeight
    ]);

    return isTruncated;
};

export default useEllipsisDetection;
