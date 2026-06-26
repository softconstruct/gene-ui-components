import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import Controllers from "@components/molecules/ImagePreview/Controllers/Controllers";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import ImagePreview, { IImagePreviewImage, IImagePreviewProps } from "./index";

const previewImages: IImagePreviewImage[] = [
    { path: "https://example.com/image-1.jpg", title: "Image 1" },
    { path: "https://example.com/image-2.jpg", title: "Image 2" },
    { path: "https://example.com/image-3.jpg", title: "Image 3" }
];

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

    it("renders withOverlay via portal", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(1);
    });

    it("does not apply withOverlay class in inline mode", () => {
        expect(setup.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("does not render overlay when open is false", () => {
        const wrapper = mount(<ImagePreview withOverlay open={false} />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("calls onClose when close button is clicked", () => {
        const onCloseMock = jest.fn();
        const wrapper = mount(<ImagePreview withOverlay onClose={onCloseMock} />, {
            wrappingComponent: GeneUIProvider
        });

        wrapper.find(".imagePreview_withOverlay").find(Button).first().simulate("click");

        expect(onCloseMock).toHaveBeenCalled();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".imagePreview")).toHaveLength(1);
    });

    it("renders open prop correctly", () => {
        const wrapper = mount(<ImagePreview withOverlay open />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview_withOverlay").exists()).toBeTruthy();
    });

    it("renders inline mode when open is false", () => {
        const wrapper = mount(<ImagePreview open={false} />);

        expect(wrapper.find(".imagePreview").exists()).toBeTruthy();
        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("does not render overlay without GeneUIProvider", () => {
        const wrapper = mount(<ImagePreview withOverlay />);

        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("does not render close button in inline mode", () => {
        expect(setup.find(".imagePreview__header").find(Button)).toHaveLength(0);
    });

    it("renders close button in overlay mode", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview__header").find(Button)).toHaveLength(1);
        expect(wrapper.find('.imagePreview__header [aria-label="Close"]').exists()).toBeTruthy();
    });

    it("renders header, body and footer sections", () => {
        expect(setup.find(".imagePreview__header").exists()).toBeTruthy();
        expect(setup.find(".imagePreview__body").exists()).toBeTruthy();
        expect(setup.find(".imagePreview__footer").exists()).toBeTruthy();
    });

    it("renders metadata text", () => {
        const texts = setup.find(Text).map((node) => node.text());

        expect(texts).toContain("2MB 700x394");
    });

    it("does not render title when image title is not provided", () => {
        const wrapper = setup.setProps({ images: { path: previewImages[0].path } });
        const texts = wrapper.find(Text).map((node) => node.text());

        expect(texts).not.toContain("Image 1");
    });

    it("renders title when image title is provided", () => {
        const wrapper = setup.setProps({ images: previewImages[0] });

        expect(wrapper.find(Text).first().text()).toBe("Image 1");
    });

    it("updates title when navigating between images", () => {
        const wrapper = setup.setProps({ images: previewImages });

        wrapper.find(".imagePreview__body").find(Button).at(1).simulate("click");

        expect(wrapper.find(Text).first().text()).toBe("Image 2");
    });

    it("does not render page count when images is not provided", () => {
        expect(setup.find(".imagePreview__count")).toHaveLength(0);
    });

    it("renders Controllers component", () => {
        expect(setup.find(Controllers).exists()).toBeTruthy();
    });

    it("passes withOverlay prop to Controllers", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(Controllers).prop("withOverlay")).toBe(true);
        expect(wrapper.find(".imagePreview__controllers_withOverlay").exists()).toBeTruthy();
    });

    it("applies overlay modifier classes when withOverlay is true", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview__headerInfo_withOverlay").exists()).toBeTruthy();
    });

    it("does not apply overlay modifier classes in inline mode", () => {
        expect(setup.find(".imagePreview__headerInfo_withOverlay")).toHaveLength(0);
        expect(setup.find(".imagePreview__count_withOverlay")).toHaveLength(0);
        expect(setup.find(".imagePreview__controllers_withOverlay")).toHaveLength(0);
    });

    it("does not render navigation buttons when images is not provided", () => {
        expect(setup.find(".imagePreview__body").find(Button)).toHaveLength(0);
    });

    it("handles undefined onClose gracefully", () => {
        const wrapper = mount(<ImagePreview withOverlay onClose={undefined} />, {
            wrappingComponent: GeneUIProvider
        });

        expect(() => {
            wrapper.find(".imagePreview_withOverlay").find(Button).first().simulate("click");
        }).not.toThrow();
    });

    it("renders image from single images object", () => {
        const wrapper = setup.setProps({ images: previewImages[0] });

        expect(wrapper.find(".imagePreview__image").prop("src")).toBe(previewImages[0].path);
    });

    it("renders image from images array", () => {
        const wrapper = setup.setProps({ images: previewImages });

        expect(wrapper.find(".imagePreview__image").prop("src")).toBe(previewImages[0].path);
    });

    it("renders page count for images array", () => {
        const wrapper = setup.setProps({ images: previewImages });

        expect(wrapper.find(".imagePreview__count").text()).toBe("1/3");
    });

    it("does not render page count for single image", () => {
        const wrapper = setup.setProps({ images: previewImages[0] });

        expect(wrapper.find(".imagePreview__count")).toHaveLength(0);
    });

    it("renders navigation buttons only when images is an array with multiple items", () => {
        const singleImageWrapper = mount(<ImagePreview images={previewImages[0]} />);
        const multipleImagesWrapper = mount(<ImagePreview images={previewImages} />);

        expect(singleImageWrapper.find(".imagePreview__body").find(Button)).toHaveLength(0);
        expect(multipleImagesWrapper.find(".imagePreview__body").find(Button)).toHaveLength(2);
    });

    it("navigates to next image on forward button click", () => {
        const wrapper = mount(<ImagePreview images={previewImages} />);

        wrapper.find(".imagePreview__body").find(Button).at(1).simulate("click");

        expect(wrapper.find(".imagePreview__image").prop("src")).toBe(previewImages[1].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("2/3");
    });

    it("navigates to previous image on back button click", () => {
        const wrapper = mount(<ImagePreview images={previewImages} />);

        wrapper.find(".imagePreview__body").find(Button).at(0).simulate("click");

        expect(wrapper.find(".imagePreview__image").prop("src")).toBe(previewImages[2].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("3/3");
    });

    it("resets selected image when images changes", () => {
        const wrapper = mount(<ImagePreview images={previewImages} />);

        wrapper.find(".imagePreview__body").find(Button).at(1).simulate("click");
        wrapper.setProps({ images: previewImages.slice(0, 2) });
        wrapper.update();

        expect(wrapper.find(".imagePreview__image").prop("src")).toBe(previewImages[0].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("1/2");
    });

    it("renders image at defaultIndex", () => {
        const wrapper = mount(<ImagePreview images={previewImages} defaultIndex={2} />);

        expect(wrapper.find(".imagePreview__image").prop("src")).toBe(previewImages[2].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("3/3");
        expect(wrapper.find(Text).first().text()).toBe("Image 3");
    });
});
