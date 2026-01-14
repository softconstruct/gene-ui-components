import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Image, { IImageProps } from "./index";

describe("Image ", () => {
    let setup: ReactWrapper<IImageProps>;
    beforeEach(() => {
        setup = mount(<Image />);
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
