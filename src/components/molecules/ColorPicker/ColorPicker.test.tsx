import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import ColorPicker, { IColorPickerProps } from "./index";

describe("ColorPicker ", () => {
    let setup: ReactWrapper<IColorPickerProps>;
    beforeEach(() => {
        setup = mount(<ColorPicker />);
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
