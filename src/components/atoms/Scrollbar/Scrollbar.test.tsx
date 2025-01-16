import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Scrollbar, { IScrollbarProps } from "./index";

describe("Scrollbar ", () => {
    let setup: ReactWrapper<IScrollbarProps>;
    const TestComponent = () => <span>test</span>;
    beforeEach(() => {
        setup = mount(
            <Scrollbar>
                <TestComponent />
            </Scrollbar>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders customHeight prop correctly", () => {
        const customHeight = "100px";
        const wrapper = setup.setProps({ customHeight });

        expect(wrapper.find(".scrollbar").first().props().style).toHaveProperty("height", customHeight);
    });

    it("renders customWidth prop correctly", () => {
        const customWidth = "100px";
        const wrapper = setup.setProps({ customWidth });

        expect(wrapper.find(".scrollbar").first().props().style).toHaveProperty("width", customWidth);
    });

    it("renders children prop correctly", () => {
        const children = <span>test children</span>;
        const wrapper = setup.setProps({ children });

        expect(wrapper.contains("test children")).toBeTruthy();
    });

    it("renders autoScrollLeftTo and autoScrollTopTo props correctly", () => {
        const autoScrollLeftTo = 200;
        const autoScrollTopTo = 200;

        const scrollToMock = jest.fn();
        Object.defineProperty(HTMLElement.prototype, "scrollTo", { value: scrollToMock });

        setup.setProps({ autoScrollLeftTo, autoScrollTopTo });

        expect(scrollToMock).toHaveBeenCalledWith(
            expect.objectContaining({
                top: autoScrollTopTo,
                left: autoScrollLeftTo,
                behavior: "smooth"
            })
        );
    });
});
