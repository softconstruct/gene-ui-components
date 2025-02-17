import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Text, { ITextProps } from "./index";

describe("Text ", () => {
    let setup: ReactWrapper<ITextProps>;
    beforeEach(() => {
        setup = mount(<Text as="h1">content</Text>);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders `as` prop correctly", () => {
        const wrapper = setup.setProps({ as: "h1" });
        expect(wrapper.find("h1").exists()).toBeTruthy();
    });

    it.each<ITextProps["variant"]>([
        "headingXLargeSemibold",
        "headingLargeSemibold",
        "headingMediumSemibold",
        "headingSmallSemibold",
        "headingXSmallSemibold",
        "subheadingLargeSemibold",
        "subheadingMediumSemibold",
        "labelLargeSemibold",
        "labelLargeMedium",
        "labelMediumSemibold",
        "labelMediumMedium",
        "labelSmallSemibold",
        "labelSmallMedium",
        "bodyLargeSemibold",
        "bodyLargeMedium",
        "bodyLargeRegular",
        "bodyMediumSemibold",
        "bodyMediumMedium",
        "bodyMediumRegular",
        "captionLargeSemibold",
        "captionLargeMedium",
        "captionLargeRegular",
        "captionMediumMedium",
        "captionMediumRegular"
    ])('should have "%s" variant', (variant) => {
        const wrapper = setup.setProps({ variant });

        expect(wrapper.find(`.text_variant_${variant}`).exists()).toBeTruthy();
    });

    it.each<ITextProps["alignment"]>(["left", "center", "right"])('should have "%s" alignment', (alignment) => {
        const wrapper = setup.setProps({ alignment });

        expect(wrapper.find(`.text_alignment_${alignment}`).exists()).toBeTruthy();
    });
});
