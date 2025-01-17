import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Tabs, { ITabsProps } from "./index";
import Tab from "./Tab";

describe("Tabs ", () => {
    let setup: ReactWrapper<ITabsProps>;
    beforeEach(() => {
        setup = mount(
            <Tabs>
                <Tab> 123</Tab>
            </Tabs>
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