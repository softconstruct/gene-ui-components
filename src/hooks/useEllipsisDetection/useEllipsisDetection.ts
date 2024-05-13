import { useEffect, useState, RefObject } from 'react';
import useDebounce from '../useDebounce';

const EQUAL_HEIGHT_DIFF = 3;

interface IUseEllipsisDetection {
    (ref: RefObject<HTMLElement>, externalDependencies?: any[]): boolean;
}

const useEllipsisDetection: IUseEllipsisDetection = (ref, externalDependencies = []) => {
    const [isTruncated, setIsTruncated] = useState<boolean>(false);

    const { debounceCallback, clearDebounce } = useDebounce();

    const handleResize = () => {
        if (!ref.current) return;
        const { scrollWidth, clientWidth, scrollHeight, clientHeight } = ref.current;
        setIsTruncated(scrollWidth > clientWidth || scrollHeight > clientHeight + EQUAL_HEIGHT_DIFF);
    };

    useEffect(() => handleResize(), []);

    useEffect(() => {
        const debounce = () => debounceCallback(handleResize, 100);
        window.addEventListener('resize', debounce);

        return () => {
            clearDebounce();
            window.removeEventListener('resize', debounce);
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
