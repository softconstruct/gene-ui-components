import React from "react";
import { mount } from "enzyme";

import useWindowSize from "@hooks/useWindowSize";

import useBreakpoint from "./index";

// Mock useWindowSize hook
jest.mock("@hooks/useWindowSize", () => ({
    __esModule: true,
    default: jest.fn()
}));

describe("useBreakpoint", () => {
    const breakpoints = {
        mobile: 767,
        tablet: 1199,
        desktop: 1200
    };

    it("should return 'mobile' when window width is below mobile breakpoint", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 500 });

        function Component() {
            const currentBreakpoint = useBreakpoint(breakpoints);
            return <div>{currentBreakpoint}</div>;
        }

        const wrapper = mount(<Component />);

        expect(wrapper.text()).toBe("mobile");
    });

    it("should return 'tablet' when window width is within tablet breakpoint range", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 800 });

        function Component() {
            const currentBreakpoint = useBreakpoint(breakpoints);
            return <div>{currentBreakpoint}</div>;
        }

        const wrapper = mount(<Component />);

        expect(wrapper.text()).toBe("tablet");
    });

    it("should return 'desktop' when window width is above desktop breakpoint", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 1300 });

        function Component() {
            const currentBreakpoint = useBreakpoint(breakpoints);
            return <div>{currentBreakpoint}</div>;
        }

        const wrapper = mount(<Component />);

        expect(wrapper.text()).toBe("desktop");
    });

    it("should update breakpoint when window size changes", () => {
        const mockUseWindowSize = useWindowSize as jest.Mock;

        mockUseWindowSize.mockReturnValue({ width: 500 });

        function Component() {
            const currentBreakpoint = useBreakpoint(breakpoints);
            return <div>{currentBreakpoint}</div>;
        }

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe("mobile");

        // Simulate a window resize event
        mockUseWindowSize.mockReturnValue({ width: 900 });
        wrapper.setProps({}); // Force re-render

        expect(wrapper.text()).toBe("tablet");

        // Simulate another window resize event
        mockUseWindowSize.mockReturnValue({ width: 1300 });
        wrapper.setProps({}); // Force re-render

        expect(wrapper.text()).toBe("desktop");
    });
});
