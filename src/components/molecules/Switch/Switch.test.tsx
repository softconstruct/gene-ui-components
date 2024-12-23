import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Switch, { ISwitchProps } from "./index";

describe("Switch ", () => {
    let setup: ReactWrapper<ISwitchProps>;
    beforeEach(() => {
        setup = mount(<Switch />);
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
