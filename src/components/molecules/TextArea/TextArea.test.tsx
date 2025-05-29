import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TextArea, { ITextAreaProps } from "./index";

describe("TextArea ", () => {
    let setup: ReactWrapper<ITextAreaProps>;
    beforeEach(() => {
        setup = mount(<TextArea />);
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
