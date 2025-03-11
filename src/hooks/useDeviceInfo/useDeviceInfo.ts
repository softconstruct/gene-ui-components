import { useMemo } from "react";

import { OS } from "@types";

interface IDeviceInfo {
    isMobile: boolean;
    isDesktop: boolean;
    os: OS;
    isWindows: boolean;
    isMacOS: boolean;
    isLinux: boolean;
    isAndroid: boolean;
    isIOS: boolean;
}

// Map of OS detection patterns
const osPatterns: [OS, RegExp][] = [
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
                isMobile: false,
                isDesktop: false,
                os: "Unknown",
                isWindows: false,
                isMacOS: false,
                isLinux: false,
                isAndroid: false,
                isIOS: false
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

        const isMobile = isAndroid || isIOS;
        const isDesktop = isWindows || isMacOS || isLinux;

        return {
            isMobile,
            isDesktop,
            os: detectedOS,
            isWindows,
            isMacOS,
            isLinux,
            isAndroid,
            isIOS
        };
    }, []);
};

export default useDeviceInfo;
