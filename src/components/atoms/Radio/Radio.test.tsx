import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import { CircleFilled } from "@geneui/icons";

import HelperText from "../HelperText";
import Label from "../Label";
import Radio, { IRadioProps } from "./index";

describe("Radio ", () => {
    let setup: ReactWrapper<IRadioProps>;
    beforeEach(() => {
        setup = mount(<Radio name="test" value="test" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = "test label";
        const wrapper = setup.setProps({ label });
        expect(wrapper.find(Label).props().text).toBe(label);
    });

    it("renders required prop correctly", () => {
        const wrapper = setup.setProps({ required: true });
        expect(wrapper.find(Label).props().required).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".radio").hasClass(`radio_disabled`)).toBeTruthy();
    });

    it("renders readOnly prop correctly", () => {
        const wrapper = setup.setProps({ readOnly: true });
        expect(wrapper.find(".radio").hasClass(`radio_readOnly`)).toBeTruthy();
    });

    it("renders vertical prop correctly", () => {
        const wrapper = setup.setProps({ direction: "vertical" });
        expect(wrapper.find(".radio").hasClass(`radio_labelTop`)).toBeTruthy();
    });

    it("renders autoFocus prop correctly", () => {
        const wrapper = setup.setProps({ autoFocus: true });
        expect(wrapper.find(".radio__input").props().autoFocus).toBeTruthy();
    });

    it("renders name prop correctly", () => {
        const name = "name";
        const wrapper = setup.setProps({ name });
        expect(wrapper.find(".radio__input").name()).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "test";
        const wrapper = setup.setProps({ helperText });

        expect(wrapper.find(HelperText).text()).toStrictEqual(helperText);
    });

    it("renders defaultChecked prop correctly", () => {
        const wrapper = setup.setProps({ defaultChecked: true });

        expect(wrapper.find(CircleFilled)).toBeTruthy();
    });

    it("renders infoText prop correctly", () => {
        const infoText = "infoText";
        const wrapper = setup.setProps({ infoText });
        expect(wrapper.find(Label).props().infoText).toBe(infoText);
    });

    it("renders checked prop correctly", () => {
        const wrapper = setup.setProps({ checked: true });
        expect(wrapper.find(CircleFilled)).toBeTruthy();
    });

    it("calls onChange when the radio state changes", () => {
        const onChangeMock = jest.fn();
        const wrapper = setup.setProps({ onChange: onChangeMock });

        wrapper.find("input").simulate("change", { target: { checked: true } });

        expect(wrapper.find("input").props().checked).toBeTruthy();
    });

    it("calls onFocus when the radio state changes", () => {
        const onFocusMock = jest.fn();
        const wrapper = setup.setProps({ onFocus: onFocusMock });

        wrapper.find("input").simulate("focus");

        expect(onFocusMock).toHaveBeenCalled();
    });

    it("calls onBlur when the radio state changes", () => {
        const onBlurMock = jest.fn();
        const wrapper = setup.setProps({ onBlur: onBlurMock });

        wrapper.find("input").simulate("blur");

        expect(onBlurMock).toHaveBeenCalled();
    });

    it.each<IRadioProps["status"]>(["rest", "warning", "error"])('should have "%s" status', (status) => {
        const wrapper = setup.setProps({ status });

        expect(wrapper.find(".radio").hasClass(`radio_${status}`)).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders value prop correctly", () => {
        const value = "test-value";
        const wrapper = setup.setProps({ value });

        expect(wrapper.find("input").props().value).toBe(value);
    });
});
