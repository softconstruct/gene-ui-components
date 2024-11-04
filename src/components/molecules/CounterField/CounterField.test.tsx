import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import CounterField, { ICounterFieldProps } from "./index";

describe("CounterField ", () => {
    let setup: ReactWrapper<ICounterFieldProps>;
    beforeEach(() => {
        setup = mount(<CounterField />);
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
