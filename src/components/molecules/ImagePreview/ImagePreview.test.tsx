import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import ImagePreview, { IImagePreviewProps } from "./index";

describe("ImagePreview ", () => {
    let setup: ReactWrapper<IImagePreviewProps>;
    beforeEach(() => {
        setup = mount(<ImagePreview />);
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
