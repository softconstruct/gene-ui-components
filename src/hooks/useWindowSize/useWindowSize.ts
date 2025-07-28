import { useEffect, useState } from "react";

import useDebounceCallback from "@hooks/useDebounceCallback";

interface IWindowSize {
    width: number;
    height: number;
}

const useWindowSize = (): IWindowSize => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const handleSize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    const { debouncedCallback, clearDebounce } = useDebounceCallback(handleSize, 100);

    useEffect(() => {
        handleSize();
        window.addEventListener("resize", debouncedCallback);
        return () => {
            window.removeEventListener("resize", debouncedCallback);
            clearDebounce();
        };
    }, []);

    return windowSize;
};

export default useWindowSize;
