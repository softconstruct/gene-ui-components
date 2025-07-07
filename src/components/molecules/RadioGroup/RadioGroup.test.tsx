import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import RadioGroup, { IRadioGroupProps } from "./index";

describe("RadioGroup ", () => {
    let setup: ReactWrapper<IRadioGroupProps>;
    beforeEach(() => {
        setup = mount(<RadioGroup />);
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
