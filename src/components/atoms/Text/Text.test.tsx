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

    it.each<ITextProps["as"]>(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"])('should have "%s" as', (as) => {
        const wrapper = setup.setProps({ as });
        expect(wrapper.find(as).exists()).toBeTruthy();
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

    it.each<ITextProps["alignment"]>(["start", "center", "end"])('should have "%s" alignment', (alignment) => {
        const wrapper = setup.setProps({ alignment });

        expect(wrapper.find(`.text_alignment_${alignment}`).exists()).toBeTruthy();
    });
});
