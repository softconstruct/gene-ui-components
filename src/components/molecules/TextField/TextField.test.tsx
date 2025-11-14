import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Info, X } from "@geneui/icons";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

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

    it("renders id prop correctly", () => {
        const id = "test-id";
        const wrapper = setup.setProps({ id });

        expect(wrapper.find("input").prop("id")).toEqual(id);
    });

    it("renders name prop correctly", () => {
        const name = "test-name";
        const wrapper = setup.setProps({ name });

        expect(wrapper.find("input").prop("name")).toEqual(name);
    });

    it("renders autoComplete prop correctly", () => {
        const wrapper = setup.setProps({ autoComplete: "email" });

        expect(wrapper.find("input").prop("autoComplete")).toEqual("email");
    });

    it("renders autoFocus prop correctly", () => {
        const wrapper = setup.setProps({ autoFocus: true });

        expect(wrapper.find("input").prop("autoFocus")).toEqual(true);
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

    it("renders IconBefore prop correctly", () => {
        const wrapper = setup.setProps({ IconBefore: Info });
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
        const wrapper = setup.setProps({ required: true, label: "Label" });

        expect(wrapper.find(".label__asterisk").exists()).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const wrapper = setup.setProps({ label: "Label" });

        expect(wrapper.find(Label).exists()).toBeTruthy();
    });

    it("renders infoText prop correctly", () => {
        const infoText = "infoText";
        const label = "test-label";
        const wrapper = setup.setProps({ infoText, label });
        expect(wrapper.find(Label).props().infoText).toBe(infoText);
    });

    it("renders characterLimit prop correctly", () => {
        const characterLimit = 100;
        const value = "1";

        const wrapper = setup.setProps({ characterLimit, value });
        wrapper.update();

        const characterCounter = wrapper.find(".textField__characterLimit").filter("span");
        expect(characterCounter.text()).toEqual(`${value.length} / ${characterLimit}`);
    });

    it("renders clearable prop correctly", () => {
        const clearable = true;
        const value = "test value";
        const wrapper = setup.setProps({ clearable, value });
        wrapper.update();
        expect(wrapper.find(X).exists()).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "test";
        const wrapper = setup.setProps({ helperText });

        expect(wrapper.find(HelperText).text()).toStrictEqual(helperText);
    });

    it.each<ITextFieldProps["status"]>(["rest", "warning", "error"])('should have "%s" status', (status) => {
        const wrapper = setup.setProps({ status, helperText: "test helper text" });

        expect(wrapper.find(HelperText).props().status).toEqual(status);
    });

    it("fires onClear when the clear button is clicked", () => {
        const onClear = jest.fn();
        const onChange = jest.fn();

        const wrapper = mount(<TextField value="text" onClear={onClear} onChange={onChange} clearable />);

        wrapper.find("button").simulate("click");

        expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("should block non-digit characters when numericOnly is true", () => {
        const onChange = jest.fn();
        const wrapper = mount(<TextField numericOnly onChange={onChange} />);

        // Try typing "abc123"
        wrapper.find("input").simulate("change", {
            target: { value: "abc123" }
        });

        // Only digits should be passed
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: "123" })
            })
        );
    });

    it.each<ITextFieldProps["inputMode"]>(["numeric", "decimal", "tel", "text", "search", "email", "url"])(
        'should have "%s" inputMode',
        (inputMode) => {
            const wrapper = setup.setProps({ inputMode });

            expect(wrapper.find(".textField__input").props().inputMode).toEqual(inputMode);
        }
    );
});
