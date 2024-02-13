import { useEffect, useState } from 'react';

const EQUAL_HEIGHT_DIFF = 3;

const useEllipsisDetection = (ref, externalDependencies = []) => {
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (!ref.current) return;
            const { scrollWidth, clientWidth, scrollHeight, clientHeight } = ref.current;
            setIsTruncated(scrollWidth > clientWidth || scrollHeight > clientHeight + EQUAL_HEIGHT_DIFF);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
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
