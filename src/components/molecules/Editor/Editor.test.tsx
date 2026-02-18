import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Editor, { IEditorProps } from "./index";

describe("Editor ", () => {
    let setup: ReactWrapper<IEditorProps>;
    beforeEach(() => {
        setup = mount(<Editor />);
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
