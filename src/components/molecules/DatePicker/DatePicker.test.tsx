import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import DatePicker, { IDatePickerProps } from "./index";

describe("DatePicker ", () => {
    let setup: ReactWrapper<IDatePickerProps>;
    beforeEach(() => {
        setup = mount(<DatePicker />);
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
