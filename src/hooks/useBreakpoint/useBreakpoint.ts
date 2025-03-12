import { useEffect, useState } from "react";

import useWindowSize from "@hooks/useWindowSize";

import { BreakpointsTypes, DeviceTypes } from "@types";

function getBreakpoint(width: number, breakpoints: BreakpointsTypes): DeviceTypes {
    if (width <= breakpoints.mobile) return "mobile";
    if (width <= breakpoints.tablet) return "tablet";

    return "desktop";
}

const useBreakpoint = (breakpoints: BreakpointsTypes): DeviceTypes => {
    const { width } = useWindowSize();
    const [currentBreakpoint, setCurrentBreakpoint] = useState(getBreakpoint(width, breakpoints));

    useEffect(() => {
        setCurrentBreakpoint(getBreakpoint(width, breakpoints));
    }, [width]);

    return currentBreakpoint;
};

export default useBreakpoint;
