import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import SegmentedControl, { ISegmentedControlProps } from "./index";

describe("SegmentedControl ", () => {
    let setup: ReactWrapper<ISegmentedControlProps>;
    beforeEach(() => {
        setup = mount(<SegmentedControl />);
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
