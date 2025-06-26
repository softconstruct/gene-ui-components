import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Info, X } from "@geneui/icons";

import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Text from "@components/atoms/Text";

// Components
import TextField, { ITextFieldProps } from "./index";

describe("TextField ", () => {
    const jestFn = jest.fn();
    let setup: ReactWrapper<ITextFieldProps>;
    beforeEach(() => {
        setup = mount(<TextField />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders inputId prop correctly", () => {
        const inputId = "test-id";
        const wrapper = setup.setProps({ inputId });

        expect(wrapper.find("input").prop("id")).toEqual(inputId);
    });

    it("renders inputName prop correctly", () => {
        const inputName = "test-name";
        const wrapper = setup.setProps({ inputName });

        expect(wrapper.find("input").prop("name")).toEqual(inputName);
    });

    it.each<ITextFieldProps["size"]>(["large", "medium", "small"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".textField__wrapper").hasClass(`textField__wrapper_size_${size}`)).toBeTruthy();
    });

    it.each<ITextFieldProps["type"]>(["text", "password"])("should have %s type", (type) => {
        const wrapper = setup.setProps({ type });
        expect(wrapper.find("input").prop("type")).toEqual(type);
    });

    it("renders value prop correctly", () => {
        const value = "test-value";
        const wrapper = setup.setProps({ value });
        wrapper.update();
        expect(wrapper.find("input").prop("value")).toEqual(value);
    });

    it("renders placeholder correctly", () => {
        const placeholder = "test placeholder";
        const wrapper = setup.setProps({ placeholder });
        expect(wrapper.find("input").prop("placeholder")).toEqual(placeholder);
    });

    it("renders Icon prop correctly", () => {
        const wrapper = setup.setProps({ Icon: Info });
        expect(wrapper.find(Info).exists()).toBeTruthy();
    });

    it("renders onChange prop correctly", () => {
        const wrapper = setup.setProps({ onChange: jestFn });
        const value = "testValue";
        wrapper.find(".textField__input").simulate("change", { target: { name: "value", value } });
        expect(wrapper.find("input").prop("value")).toEqual(value);
    });

    it("renders readOnly prop correctly", () => {
        const readOnly = true;
        const wrapper = setup.setProps({ readOnly });

        expect(wrapper.find(".textField__wrapper").hasClass("textField__wrapper_readOnly")).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const disabled = true;
        const wrapper = setup.setProps({ disabled });

        expect(wrapper.find(".textField__wrapper").hasClass("textField__wrapper_disabled")).toBeTruthy();
    });

    it("renders required prop correctly", () => {
        const required = true;
        const label = {
            text: "Label"
        };
        const wrapper = setup.setProps({ required, label });

        expect(wrapper.find(".label__asterisk").exists()).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = {
            text: "Label"
        };
        const wrapper = setup.setProps({ label });

        expect(wrapper.find(Label).exists()).toBeTruthy();
    });

    it("renders characterLimit prop correctly", () => {
        const characterLimit = {
            length: 100
        };
        const wrapper = setup.setProps({ characterLimit });

        expect(wrapper.find(Text).exists()).toBeTruthy();
    });

    it("renders validationStatus prop correctly", () => {
        const validationStatus: ITextFieldProps["validationStatus"] = {
            type: "error",
            text: "some error text"
        };
        const wrapper = setup.setProps({ validationStatus });

        expect(wrapper.find(HelperText).exists()).toBeTruthy();
    });

    it("renders clearable prop correctly", () => {
        const clearable = true;
        const value = "test value";
        const wrapper = setup.setProps({ clearable, value });
        wrapper.update();
        expect(wrapper.find(X).exists()).toBeTruthy();
    });
});
