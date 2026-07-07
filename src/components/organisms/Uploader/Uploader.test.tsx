import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Uploader, { IUploaderProps } from "./index";

describe("Uploader ", () => {
    let setup: ReactWrapper<IUploaderProps>;
    beforeEach(() => {
        setup = mount(<Uploader />);
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
