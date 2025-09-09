import { useMemo } from "react";

import { OSTypes } from "@types";

export interface IDeviceInfo {
    isMobileDevice: boolean;
    isDesktopDevice: boolean;
    isTouch: boolean;
    os: OSTypes;
    isWindows: boolean;
    isMacOS: boolean;
    isLinux: boolean;
    isAndroid: boolean;
    isIOS: boolean;
    theme: "light" | "dark";
}

// Map of OS detection patterns
const osPatterns: [OSTypes, RegExp][] = [
    ["Windows", /\b(windows nt|win)\b/i],
    ["iOS", /\b(iPhone|iPad|iPod).*?OS \d+/i],
    ["Android", /\bandroid\b/i],
    ["macOS", /\b(mac os|macintosh)\b(?!.*(?:iphone|ipad|ipod))/i],
    ["Linux", /\blinux\b/i]
];

const useDeviceInfo = (): IDeviceInfo => {
    return useMemo<IDeviceInfo>(() => {
        if (typeof navigator === "undefined") {
            return {
                isMobileDevice: false,
                isDesktopDevice: false,
                isTouch: false,
                os: "Unknown",
                isWindows: false,
                isMacOS: false,
                isLinux: false,
                isAndroid: false,
                isIOS: false,
                theme: "light"
            }; // Safe for SSR
        }

        const userAgent = navigator.userAgent?.toLowerCase();

        // Find the first matching OS using destructuring
        const [detectedOS = "Unknown"] = osPatterns.find(([, pattern]) => pattern.test(userAgent)) || [];

        const isWindows = detectedOS === "Windows";
        const isMacOS = detectedOS === "macOS";
        const isLinux = detectedOS === "Linux";
        const isAndroid = detectedOS === "Android";
        const isIOS = detectedOS === "iOS";

        const isTablet =
            /ipad|tablet|kindle|silk|playbook|bb10/i.test(userAgent) || (isAndroid && !/mobile/i.test(userAgent));
        const isMobileDevice = isAndroid || isIOS || isTablet;
        const isDesktopDevice = isWindows || isMacOS || isLinux;

        // Detect touch device
        const isTouch =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
            false;

        const theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

        return {
            isMobileDevice,
            isDesktopDevice,
            isTouch,
            os: detectedOS,
            isWindows,
            isMacOS,
            isLinux,
            isAndroid,
            isIOS,
            theme
        };
    }, []);
};

export default useDeviceInfo;
