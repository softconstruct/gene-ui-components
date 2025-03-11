import React, { FC, useEffect } from "react";
import { mount } from "enzyme";

import useDeviceInfo from "../useDeviceInfo";

type DeviceInfo = ReturnType<typeof useDeviceInfo>;

describe("useDeviceInfo Hook", () => {
    const mockNavigator = (userAgent: string): void => {
        Object.defineProperty(window.navigator, "userAgent", {
            value: userAgent,
            configurable: true,
            writable: true
        });
    };

    interface TestComponentProps {
        callback: (deviceInfo: DeviceInfo) => void;
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
            isMobile: false,
            isDesktop: false,
            os: "Unknown",
            isWindows: false,
            isMacOS: false,
            isLinux: false,
            isAndroid: false,
            isIOS: false
        });
    });

    it("should detect Windows OS", () => {
        mockNavigator("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            isMobile: false,
            isDesktop: true,
            os: "Windows",
            isWindows: true,
            isMacOS: false,
            isLinux: false,
            isAndroid: false,
            isIOS: false
        });
    });

    it("should detect macOS", () => {
        mockNavigator("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            isMobile: false,
            isDesktop: true,
            os: "macOS",
            isWindows: false,
            isMacOS: true,
            isLinux: false,
            isAndroid: false,
            isIOS: false
        });
    });

    it("should detect Linux OS", () => {
        mockNavigator("Mozilla/5.0 (X11; Linux x86_64)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            isMobile: false,
            isDesktop: true,
            os: "Linux",
            isWindows: false,
            isMacOS: false,
            isLinux: true,
            isAndroid: false,
            isIOS: false
        });
    });

    it("should detect Android OS", () => {
        mockNavigator("Mozilla/5.0 (Linux; Android 10; SM-G975F)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            isMobile: true,
            isDesktop: false,
            os: "Android",
            isWindows: false,
            isMacOS: false,
            isLinux: false,
            isAndroid: true,
            isIOS: false
        });
    });

    it("should detect iOS", () => {
        mockNavigator("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)");
        const callback = jest.fn();
        mount(<TestComponent callback={callback} />);

        expect(callback).toHaveBeenCalledWith({
            isMobile: true,
            isDesktop: false,
            os: "iOS",
            isWindows: false,
            isMacOS: false,
            isLinux: false,
            isAndroid: false,
            isIOS: true
        });
    });
});
