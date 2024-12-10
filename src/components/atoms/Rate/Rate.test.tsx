import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Rate, { IRateProps } from "./index";

describe("Rate ", () => {
    let setup: ReactWrapper<IRateProps>;
    beforeEach(() => {
        setup = mount(<Rate />);
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
