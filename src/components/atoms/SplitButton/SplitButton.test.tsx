import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import SplitButton, { ISplitButtonProps } from "./index";

describe("SplitButton ", () => {
    let setup: ReactWrapper<ISplitButtonProps>;
    beforeEach(() => {
        setup = mount(<SplitButton appearance="primary" type="outline" onPrimaryButtonClick={() => {}} />);
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
