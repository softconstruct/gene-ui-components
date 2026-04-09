import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import ActionableList, { IActionableListProps } from "./index";

describe("ActionableList ", () => {
    let setup: ReactWrapper<IActionableListProps>;
    beforeEach(() => {
        setup = mount(<ActionableList />);
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
