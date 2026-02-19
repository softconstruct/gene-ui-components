import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import PopoverConfirm, { IPopoverConfirmProps } from "./index";

describe("PopoverConfirm ", () => {
    let setup: ReactWrapper<IPopoverConfirmProps>;
    beforeEach(() => {
        setup = mount(<PopoverConfirm />);
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
