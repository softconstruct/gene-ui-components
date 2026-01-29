import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Image, { IImageProps } from "./index";

describe("Image ", () => {
    let setup: ReactWrapper<IImageProps>;
    beforeEach(() => {
        setup = mount(<Image src="" />);
    });

    const mockFn = jest.fn();

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

    it("applies correct aspect ratio classes", () => {
        const wrapper = setup.setProps({ src: "./image.png", aspectRatio: "1:1" });
        expect(wrapper.find(".image_size_1x1").exists()).toBe(true);

        const wrapper3b2 = setup.setProps({ src: "./image.png", aspectRatio: "3:2" });
        expect(wrapper3b2.find(".image_size_3x2").exists()).toBe(true);

        const wrapper2b1 = setup.setProps({ src: "./image.png", aspectRatio: "2:1" });
        expect(wrapper2b1.find(".image_size_2x1").exists()).toBe(true);
    });

    it("hides img and shows loader when loading is true", () => {
        const wrapper = setup.setProps({ src: "/img.png", loading: true });
        expect(wrapper.find("img.image__img").exists()).toBe(false);
        expect(wrapper.find(".image__loader").exists()).toBe(true);
    });

    it("adds image_failed root class when failed prop is true and shows failed icon", () => {
        const wrapper = setup.setProps({ src: "/img.png", failed: true });
        expect(wrapper.find(".image__failed").exists()).toBe(true);
    });

    it("renders a button preview when interactive and calls onImageClick with id", () => {
        const wrapper = mount(<Image id="my-id" src="/img.png" onImageClick={mockFn} />);
        const preview = wrapper.find(".image__preview");
        // interactive preview should be a button element
        expect(preview.getDOMNode().nodeName).toBe("BUTTON");
        preview.simulate("click");
        expect(mockFn).toHaveBeenCalled();
        const [[firstArg]] = mockFn.mock.calls;
        expect(firstArg).toBe("my-id");
    });

    it("renders checkbox when onCheckboxChange provided and forwards change", () => {
        const wrapper = mount(<Image src="/img.png" onCheckboxChange={mockFn} />);
        const input = wrapper.find(".image__checkbox input");
        expect(input.exists()).toBe(true);
        input.simulate("change", { target: { checked: true } });
        expect(mockFn).toHaveBeenCalled();
    });

    it("renders action buttons and triggers their callbacks", () => {
        const actions = [{ id: "a1", label: "Do", onActionItemClick: mockFn }];
        const wrapper = mount(<Image src="/img.png" actions={actions} />);
        const btn = wrapper.find(".image__actions button");
        expect(btn.exists()).toBe(true);
        btn.simulate("click");
        expect(mockFn).toHaveBeenCalled();
    });
});
