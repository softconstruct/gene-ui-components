import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import ProgressBar, { IProgressBarProps } from "./index";

describe("ProgressBar ", () => {
    let setup: ReactWrapper<IProgressBarProps>;
    beforeEach(() => {
        setup = mount(<ProgressBar />);
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
