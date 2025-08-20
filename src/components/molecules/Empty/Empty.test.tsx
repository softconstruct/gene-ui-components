import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Empty, { IEmptyProps } from "./index";

describe("Empty ", () => {
    let setup: ReactWrapper<IEmptyProps>;
    beforeEach(() => {
        setup = mount(<Empty />);
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
