import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TextField, { ITextFieldProps } from "./index";

describe("TextField ", () => {
    let setup: ReactWrapper<ITextFieldProps>;
    beforeEach(() => {
        setup = mount(<TextField />);
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
