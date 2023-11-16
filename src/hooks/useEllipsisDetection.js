import { useEffect, useState } from 'react';

const useEllipsisDetection = (ref, externalDependencies = []) => {
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (!ref.current) return;
            const { scrollWidth, clientWidth } = ref.current;
            setIsTruncated(scrollWidth > clientWidth);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [ref, ref?.current?.scrollWidth, ref?.current?.clientWidth, ...externalDependencies]);

    return isTruncated;
};

export default useEllipsisDetection;
