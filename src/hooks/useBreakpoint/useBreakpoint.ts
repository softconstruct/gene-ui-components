import { useEffect, useState } from "react";

import useWindowSize from "@hooks/useWindowSize";

import { BreakpointsTypes, DeviceTypes } from "@types";

export interface IBreakpoint {
    currentBreakpoint: string;
    isMobileBreakpoint: boolean;
    isTabletBreakpoint: boolean;
    isDesktopBreakpoint: boolean;
}

function getBreakpoint(width: number, breakpoints: BreakpointsTypes): DeviceTypes {
    if (width <= breakpoints.mobile) return "mobile";
    if (width <= breakpoints.tablet) return "tablet";

    return "desktop";
}

const useBreakpoint = (breakpoints: BreakpointsTypes): IBreakpoint => {
    const { width } = useWindowSize();
    const [currentBreakpoint, setCurrentBreakpoint] = useState(getBreakpoint(width, breakpoints));

    useEffect(() => {
        setCurrentBreakpoint(getBreakpoint(width, breakpoints));
    }, [width]);

    return {
        currentBreakpoint,
        isMobileBreakpoint: currentBreakpoint === "mobile",
        isTabletBreakpoint: currentBreakpoint === "tablet",
        isDesktopBreakpoint: currentBreakpoint === "desktop"
    };
};

export default useBreakpoint;
