import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Image, { IImageProps } from "./index";

describe("Image ", () => {
    let setup: ReactWrapper<IImageProps>;
    beforeEach(() => {
        setup = mount(<Image src="" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders title prop correctly", () => {
        const title = "Testing";
        const wrapper = setup.setProps({ title });

        expect(wrapper.find(Image).props().title).toBe(title);
    });

    it("renders description prop correctly", () => {
        const description = "Testing";
        const wrapper = setup.setProps({ description });

        expect(wrapper.find(Image).props().description).toBe(description);
    });

    it("renders loading prop correctly", () => {
        const wrapper = setup.setProps({ loading: true });

        expect(wrapper.find(".image__loader").exists());
    });

    it("renders loadingText prop correctly", () => {
        const loadingText = "Test loading";
        const wrapper = setup.setProps({ loading: true, loadingText });

        expect(wrapper.find(Image).props().loadingText).toBe(loadingText);
    });
});
