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

    // Your tests here
});
