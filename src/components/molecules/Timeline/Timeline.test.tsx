import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Timeline, { ITimelineProps } from "./index";

describe("Timeline ", () => {
    let setup: ReactWrapper<ITimelineProps>;
    beforeEach(() => {
        setup = mount(<Timeline />);
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
