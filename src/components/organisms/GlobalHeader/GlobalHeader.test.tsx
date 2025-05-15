import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import GlobalHeader, { IGlobalHeaderProps } from "./index";

describe("GlobalHeader ", () => {
    let setup: ReactWrapper<IGlobalHeaderProps>;
    beforeEach(() => {
        setup = mount(<GlobalHeader />);
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
