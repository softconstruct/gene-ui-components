import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Section, { ISectionProps } from "./index";

describe("Section ", () => {
    let setup: ReactWrapper<ISectionProps>;
    beforeEach(() => {
        setup = mount(<Section />);
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
