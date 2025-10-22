import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import { Info } from "@geneui/icons";

// Components
import GeneUIProvider from "../../providers/GeneUIProvider";
import Label, { ILabelProps } from "./index";

describe("Label ", () => {
    let setup: ReactWrapper<ILabelProps>;
    const text = "label";

    beforeEach(() => {
        setup = mount(<Label text={text} />, {
            wrappingComponent: GeneUIProvider
        });
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it.each<ILabelProps["size"]>(["medium", "small"])('should have "%s" size', (size) => {
        const wrapper = setup.setProps({ size });

        expect(wrapper.find(".label__text").hasClass(`label__text_size_${size}`)).toBeTruthy();
    });

    it("renders text prop correctly", () => {
        expect(setup.find(".label").text()).toStrictEqual(text);
    });

    it("renders required prop correctly", () => {
        const wrapper = setup.setProps({ required: true });
        expect(wrapper.find(".label__asterisk").text()).toStrictEqual("*");
    });

    it("renders infoText prop correctly", () => {
        const wrapper = setup.setProps({ infoText: "text" });
        expect(wrapper.find(Info)).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".label__text").hasClass("label__text_disabled")).toBeTruthy();
    });

    it("renders readOnly prop correctly", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ readOnly: true, children });
        // Even with children, readOnly should force div rendering
        expect(wrapper.find("label")).toHaveLength(0);
        expect(wrapper.find("div").first().hasClass("label")).toBeTruthy();
    });

    it("renders loading prop correctly", () => {
        const wrapper = setup.setProps({ loading: true });
        expect(wrapper.find(".label").hasClass("label__text")).toBeFalsy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders children prop correctly", () => {
        const children = <span>test children</span>;
        const wrapper = setup.setProps({ children });

        expect(wrapper.contains("test children")).toBeTruthy();
    });

    it("renders as div when no children provided", () => {
        const wrapper = setup.setProps({});
        expect(wrapper.find("label")).toHaveLength(0);
        expect(wrapper.find("div").first().hasClass("label")).toBeTruthy();
        expect(wrapper.find(".label").hasClass("label_variant_descriptive")).toBeTruthy();
    });

    it("renders as label when children provided", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ children });
        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").hasClass("label")).toBeTruthy();
        expect(wrapper.find(".label").hasClass("label_variant_interactive")).toBeTruthy();
    });

    it("renders as div when readOnly is true even with children", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ readOnly: true, children });
        expect(wrapper.find("label")).toHaveLength(0);
        expect(wrapper.find("div").first().hasClass("label")).toBeTruthy();
        expect(wrapper.find(".label").hasClass("label_variant_descriptive")).toBeTruthy();
    });

    it("renders as div when loading regardless of children", () => {
        const wrapperWithChildren = setup.setProps({ children: <input />, loading: true });
        const wrapperWithoutChildren = setup.setProps({ loading: true });

        expect(wrapperWithChildren.find("label")).toHaveLength(0);
        expect(wrapperWithChildren.find("div").first().hasClass("label")).toBeTruthy();
        expect(wrapperWithoutChildren.find("label")).toHaveLength(0);
        expect(wrapperWithoutChildren.find("div").first().hasClass("label")).toBeTruthy();
    });

    it("shows skeleton content when loading", () => {
        const wrapper = setup.setProps({ loading: true });
        expect(wrapper.find("span").text()).toBe("skeleton");
    });

    it("renders as label with checkbox children", () => {
        const children = <input type="checkbox" />;
        const wrapper = setup.setProps({ children });
        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find(".label").hasClass("label_variant_interactive")).toBeTruthy();
    });

    it("renders as label with radio children", () => {
        const children = <input type="radio" />;
        const wrapper = setup.setProps({ children });
        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find(".label").hasClass("label_variant_interactive")).toBeTruthy();
    });

    it("renders as label with select children", () => {
        const children = (
            <select>
                <option>Test</option>
            </select>
        );
        const wrapper = setup.setProps({ children });
        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find(".label").hasClass("label_variant_interactive")).toBeTruthy();
    });
});
