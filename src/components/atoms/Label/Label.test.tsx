import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import { Info } from "@geneui/icons";

import Text from "@components/atoms/Text";

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
        const expectedVariant = size === "medium" ? "labelMediumMedium" : "labelSmallMedium";
        expect(wrapper.find(Text).prop("variant")).toBe(expectedVariant);
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
        // readOnly should still render as label but with readOnly class on label
        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").hasClass("label_readOnly")).toBeTruthy();
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

    it("renders as label when readOnly is true even with children", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ readOnly: true, children });
        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").hasClass("label")).toBeTruthy();
        expect(wrapper.find("label").hasClass("label_readOnly")).toBeTruthy();
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

    it("renders as label when labelFor is provided without children", () => {
        const id = "input-id";
        const wrapper = setup.setProps({ labelFor: id });

        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").prop("htmlFor")).toBe(id);
        expect(wrapper.find(".label").hasClass("label_variant_interactive")).toBeTruthy();
    });

    it("renders as label when readOnly is true even with labelFor", () => {
        const wrapper = setup.setProps({ readOnly: true, labelFor: "some-id" });

        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").hasClass("label_readOnly")).toBeTruthy();
    });

    it("does not set htmlFor when labelFor is not provided", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ children });

        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").prop("htmlFor")).toBeUndefined();
    });

    it("prevents click events when readOnly is true", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ readOnly: true, children });
        const clickEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

        wrapper.find("label").simulate("click", clickEvent);

        expect(clickEvent.preventDefault).toHaveBeenCalled();
        expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });

    it("prevents mousedown events when readOnly is true", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ readOnly: true, children });
        const mouseDownEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

        wrapper.find("label").simulate("mouseDown", mouseDownEvent);

        expect(mouseDownEvent.preventDefault).toHaveBeenCalled();
        expect(mouseDownEvent.stopPropagation).toHaveBeenCalled();
    });

    it("prevents click events when disabled is true", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ disabled: true, children });
        const clickEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

        wrapper.find("label").simulate("click", clickEvent);

        expect(clickEvent.preventDefault).toHaveBeenCalled();
        expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });

    it("prevents mousedown events when disabled is true", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ disabled: true, children });
        const mouseDownEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

        wrapper.find("label").simulate("mouseDown", mouseDownEvent);

        expect(mouseDownEvent.preventDefault).toHaveBeenCalled();
        expect(mouseDownEvent.stopPropagation).toHaveBeenCalled();
    });

    it("renders as a label element when readOnly is true and has children", () => {
        const children = <input type="text" />;
        const wrapper = setup.setProps({ readOnly: true, children });

        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").hasClass("label_readOnly")).toBeTruthy();
    });

    it("renders as a label element when readOnly is true and has labelFor", () => {
        const wrapper = setup.setProps({ readOnly: true, labelFor: "input-id" });

        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").hasClass("label_readOnly")).toBeTruthy();
    });
});
