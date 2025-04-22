import React, { FC, useEffect } from "react";
import { mount } from "enzyme";

import useDeviceInfo, { IDeviceInfo } from "../useDeviceInfo";

const defaultDeviceInfo: IDeviceInfo = {
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
};

describe("useDeviceInfo Hook", () => {
    const mockNavigator = (userAgent: string): void => {
        Object.defineProperty(window.navigator, "userAgent", {
            value: userAgent,
            configurable: true,
            writable: true
        });
    };

    const mockTouchSupport = (isTouch: boolean = false) => {
        Object.defineProperty(window, "ontouchstart", {
            value: isTouch ? jest.fn() : undefined,
            configurable: true
        });

        Object.defineProperty(navigator, "maxTouchPoints", {
            value: isTouch ? 5 : 0,
            configurable: true
        });

        if (typeof window.matchMedia !== "function") {
            Object.defineProperty(window, "matchMedia", {
                value: jest.fn().mockImplementation((query) => ({
                    matches: isTouch && query === "(pointer: coarse)",
                    media: query,
                    onchange: null,
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn()
                })),
                configurable: true
            });
        }
    };

    interface TestComponentProps {
        callback: (deviceInfo: IDeviceInfo) => void;
    }

    const TestComponent: FC<TestComponentProps> = ({ callback }) => {
        const deviceInfo = useDeviceInfo();

        useEffect(() => {
            callback(deviceInfo);
        }, [deviceInfo, callback]);

        return null;
    };

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return default values in SSR", () => {
        jest.spyOn(global, "navigator", "get").mockImplementation(() => ({}) as Navigator);

        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            ...defaultDeviceInfo
        });
    });

    it("should detect Windows OS", () => {
        mockNavigator("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            ...defaultDeviceInfo,
            isDesktopDevice: true,
            os: "Windows",
            isWindows: true
        });
    });

    it("should detect macOS", () => {
        mockNavigator("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            ...defaultDeviceInfo,
            isDesktopDevice: true,
            os: "macOS",
            isMacOS: true
        });
    });

    it("should detect Linux OS", () => {
        mockNavigator("Mozilla/5.0 (X11; Linux x86_64)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            ...defaultDeviceInfo,
            isDesktopDevice: true,
            os: "Linux",
            isLinux: true
        });
    });

    it("should detect Android OS", () => {
        mockNavigator("Mozilla/5.0 (Linux; Android 10; SM-G975F)");
        mockTouchSupport(true); // Android is usually a touch device

        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            ...defaultDeviceInfo,
            isMobileDevice: true,
            isTouch: true, // Should be true
            os: "Android",
            isAndroid: true
        });
    });

    it("should detect iOS", () => {
        mockNavigator("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)");
        mockTouchSupport(true); // iOS is a touch device

        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            ...defaultDeviceInfo,
            isMobileDevice: true,
            isTouch: true, // Should be true
            os: "iOS",
            isIOS: true
        });
    });
});
