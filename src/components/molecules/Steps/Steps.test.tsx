import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Steps, { IStepsProps } from "./index";

describe("Steps ", () => {
    let setup: ReactWrapper<IStepsProps>;
    beforeEach(() => {
        setup = mount(<Steps />);
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
