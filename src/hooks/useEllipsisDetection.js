import { useEffect, useState } from 'react';

const EQUAL_HEIGHT_DIFF = 3;

const useEllipsisDetection = (ref, externalDependencies = []) => {
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        let timeoutId;
        const handleResize = () => {
            if (!ref.current) return;
            const { scrollWidth, clientWidth, scrollHeight, clientHeight } = ref.current;
            setIsTruncated(scrollWidth > clientWidth || scrollHeight > clientHeight + EQUAL_HEIGHT_DIFF);
        };

        const debounceResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 100);
        };

        window.addEventListener('resize', debounceResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', debounceResize);
            clearTimeout(timeoutId);
        };
    }, [
        ref,
        ref?.current?.scrollWidth,
        ref?.current?.clientWidth,
        ref?.current?.scrollHeight,
        ref?.current?.clientHeight,
        ...externalDependencies
    ]);

    return isTruncated;
};

export default useEllipsisDetection;
