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
            const { currentBreakpoint } = useBreakpoint(breakpoints);
            return <div>{currentBreakpoint}</div>;
        }

        const wrapper = mount(<Component />);

        expect(wrapper.text()).toBe("mobile");
    });

    it("should return 'tablet' when window width is within tablet breakpoint range", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 800 });

        function Component() {
            const { currentBreakpoint } = useBreakpoint(breakpoints);
            return <div>{currentBreakpoint}</div>;
        }

        const wrapper = mount(<Component />);

        expect(wrapper.text()).toBe("tablet");
    });

    it("should return 'desktop' when window width is above desktop breakpoint", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 1300 });

        function Component() {
            const { currentBreakpoint } = useBreakpoint(breakpoints);
            return <div>{currentBreakpoint}</div>;
        }

        const wrapper = mount(<Component />);

        expect(wrapper.text()).toBe("desktop");
    });

    it("should update breakpoint when window size changes", () => {
        const mockUseWindowSize = useWindowSize as jest.Mock;

        mockUseWindowSize.mockReturnValue({ width: 500 });

        function Component() {
            const { currentBreakpoint } = useBreakpoint(breakpoints);
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

    it("should return correct boolean values for breakpoints", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 500 });

        function Component() {
            const { isMobileBreakpoint, isTabletBreakpoint, isDesktopBreakpoint } = useBreakpoint(breakpoints);
            return (
                <div>
                    <span data-testid="isMobile">{isMobileBreakpoint ? "true" : "false"}</span>
                    <span data-testid="isTablet">{isTabletBreakpoint ? "true" : "false"}</span>
                    <span data-testid="isDesktop">{isDesktopBreakpoint ? "true" : "false"}</span>
                </div>
            );
        }

        const wrapper = mount(<Component />);

        expect(wrapper.find('[data-testid="isMobile"]').text()).toBe("true");
        expect(wrapper.find('[data-testid="isTablet"]').text()).toBe("false");
        expect(wrapper.find('[data-testid="isDesktop"]').text()).toBe("false");

        // Simulate window resize to tablet
        (useWindowSize as jest.Mock).mockReturnValue({ width: 900 });
        wrapper.setProps({}); // Force re-render

        expect(wrapper.find('[data-testid="isMobile"]').text()).toBe("false");
        expect(wrapper.find('[data-testid="isTablet"]').text()).toBe("true");
        expect(wrapper.find('[data-testid="isDesktop"]').text()).toBe("false");

        // Simulate window resize to desktop
        (useWindowSize as jest.Mock).mockReturnValue({ width: 1300 });
        wrapper.setProps({}); // Force re-render

        expect(wrapper.find('[data-testid="isMobile"]').text()).toBe("false");
        expect(wrapper.find('[data-testid="isTablet"]').text()).toBe("false");
        expect(wrapper.find('[data-testid="isDesktop"]').text()).toBe("true");
    });
});
