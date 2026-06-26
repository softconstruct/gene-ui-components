import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import Controllers from "@components/molecules/ImagePreview/Controllers/Controllers";
import GeneUIProvider from "@components/providers/GeneUIProvider";

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

    it("renders title and metadata text", () => {
        const texts = setup.find(Text).map((node) => node.text());

        expect(texts).toContain("Title");
        expect(texts).toContain("2MB 700x394");
    });

    it("renders page count", () => {
        expect(setup.find(".imagePreview__count").text()).toBe("12/23");
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
        expect(wrapper.find(".imagePreview__count_withOverlay").exists()).toBeTruthy();
    });

    it("does not apply overlay modifier classes in inline mode", () => {
        expect(setup.find(".imagePreview__headerInfo_withOverlay")).toHaveLength(0);
        expect(setup.find(".imagePreview__count_withOverlay")).toHaveLength(0);
        expect(setup.find(".imagePreview__controllers_withOverlay")).toHaveLength(0);
    });

    it("renders navigation buttons in body", () => {
        expect(setup.find(".imagePreview__body").find(Button)).toHaveLength(2);
    });

    it("handles undefined onClose gracefully", () => {
        const wrapper = mount(<ImagePreview withOverlay onClose={undefined} />, {
            wrappingComponent: GeneUIProvider
        });

        expect(() => {
            wrapper.find(".imagePreview_withOverlay").find(Button).first().simulate("click");
        }).not.toThrow();
    });
});
