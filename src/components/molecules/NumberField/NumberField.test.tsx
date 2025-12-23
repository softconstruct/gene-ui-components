import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import NumberField, { INumberFieldProps } from "./index";

describe("NumberField ", () => {
    let setup: ReactWrapper<INumberFieldProps>;
    beforeEach(() => {
        setup = mount(<NumberField />);
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
