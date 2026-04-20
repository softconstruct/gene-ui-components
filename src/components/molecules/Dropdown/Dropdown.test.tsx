import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Dropdown, { IDropdownProps } from "./index";

describe("Dropdown ", () => {
    let setup: ReactWrapper<IDropdownProps>;
    beforeEach(() => {
        setup = mount(<Dropdown />);
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
