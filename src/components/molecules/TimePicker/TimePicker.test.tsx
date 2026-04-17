import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TimePicker, { ISingleTimePickerProps } from "./index";

describe("TimePicker ", () => {
    let setup: ReactWrapper<ISingleTimePickerProps>;
    beforeEach(() => {
        setup = mount(<TimePicker />);
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
