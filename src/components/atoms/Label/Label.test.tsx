import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import { InfoOutline } from "@geneui/icons";
import Label, { ILabelProps } from "./index";
import GeneUIProvider from "../../providers/GeneUIProvider";

describe("Label ", () => {
    let setup: ReactWrapper<ILabelProps>;
    const labelText = "label";

    beforeEach(() => {
        setup = mount(<Label labelText={labelText} />, {
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

    it("renders labelText prop correctly", () => {
        expect(setup.find("label").text()).toStrictEqual(labelText);
    });

    it("renders required prop correctly", () => {
        const wrapper = setup.setProps({ required: true });
        expect(wrapper.find(".label__asterisk").text()).toStrictEqual("*");
    });

    it("renders infoText prop correctly", () => {
        const wrapper = setup.setProps({ infoText: "text" });
        expect(wrapper.find(InfoOutline)).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".label__text").hasClass("label__text_disabled")).toBeTruthy();
    });

    it("renders readOnly prop correctly", () => {
        const wrapper = setup.setProps({ readOnly: true });
        expect(wrapper.find(".label__container").hasClass("label__container_readOnly")).toBeTruthy();
    });

    it("renders isLoading prop correctly", () => {
        const wrapper = setup.setProps({ isLoading: true });
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
});
