import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import { CheckMark, MinusOutline } from "@geneui/icons";
import Checkbox, { ICheckboxProps } from "./index";
import { HelperText, Label } from "../../../index";

describe("Checkbox ", () => {
    let setup: ReactWrapper<ICheckboxProps>;
    beforeEach(() => {
        setup = mount(<Checkbox />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = "test label";
        const wrapper = setup.setProps({ label });
        expect(wrapper.find(Label).props().labelText).toBe(label);
    });

    it("renders required prop correctly", () => {
        const wrapper = setup.setProps({ required: true });
        expect(wrapper.find(Label).props().required).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".checkbox").hasClass(`checkbox_disabled`)).toBeTruthy();
    });

    it("renders readOnly prop correctly", () => {
        const wrapper = setup.setProps({ readOnly: true });
        expect(wrapper.find(".checkbox").hasClass(`checkbox_readOnly`)).toBeTruthy();
    });

    it("renders vertical prop correctly", () => {
        const wrapper = setup.setProps({ vertical: true });
        expect(wrapper.find(".checkbox").hasClass(`checkbox_labelTop`)).toBeTruthy();
    });

    it("renders autoFocus prop correctly", () => {
        const wrapper = setup.setProps({ autoFocus: true });
        expect(wrapper.find(".checkbox__input").props().autoFocus).toBeTruthy();
    });

    it("renders name prop correctly", () => {
        const name = "name";
        const wrapper = setup.setProps({ name });
        expect(wrapper.find(".checkbox__input").name()).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "test";
        const wrapper = setup.setProps({ helperText });

        expect(wrapper.find(HelperText).text()).toStrictEqual(helperText);
    });

    it("renders defaultChecked prop correctly", () => {
        const wrapper = setup.setProps({ defaultChecked: true });

        expect(wrapper.find(CheckMark)).toBeTruthy();
    });

    it("renders infoText prop correctly", () => {
        const infoText = "infoText";
        const wrapper = setup.setProps({ infoText });
        expect(wrapper.find(Label).props().infoText).toBe(infoText);
    });

    it("renders indeterminate prop correctly", () => {
        const wrapper = setup.setProps({ indeterminate: true });
        expect(wrapper.find(MinusOutline)).toBeTruthy();
    });

    it("renders checked prop correctly", () => {
        const wrapper = setup.setProps({ checked: true });
        expect(wrapper.find(CheckMark)).toBeTruthy();
    });

    it("calls onChange when the checkbox state changes", () => {
        const onChangeMock = jest.fn();
        const wrapper = setup.setProps({ onChange: onChangeMock });

        wrapper.find("input").simulate("change", { target: { checked: true } });

        expect(wrapper.find("input").props().checked).toBeTruthy();
    });

    it("calls onFocus when the checkbox state changes", () => {
        const onFocusMock = jest.fn();
        const wrapper = setup.setProps({ onFocus: onFocusMock });

        wrapper.find("input").simulate("focus");

        expect(onFocusMock).toHaveBeenCalled();
    });

    it("calls onBlur when the checkbox state changes", () => {
        const onBlurMock = jest.fn();
        const wrapper = setup.setProps({ onBlur: onBlurMock });

        wrapper.find("input").simulate("blur");

        expect(onBlurMock).toHaveBeenCalled();
    });

    it.each<ICheckboxProps["type"]>(["rest", "warning", "error"])('should have "%s" type', (type) => {
        const wrapper = setup.setProps({ type });

        expect(wrapper.find(".checkbox").hasClass(`checkbox_${type}`)).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
