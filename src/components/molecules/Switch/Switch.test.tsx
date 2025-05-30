import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import HelperText from "@components/atoms/HelperText";
import Switch, { ISwitchProps } from "@components/molecules/Switch";

describe("Switch", () => {
    let setup: ReactWrapper<ISwitchProps>;
    const onChange = jest.fn();

    beforeEach(() => {
        setup = mount(<Switch onChange={onChange} />);
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
        const label = "Label";
        const wrapper = setup.setProps({ label });
        expect(wrapper.find(".switch__labelText").contains(label)).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "Helper text";
        const wrapper = setup.setProps({ helperText });
        expect(wrapper.find(HelperText).contains(helperText)).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const helperText = "Helper text";
        const wrapper = setup.setProps({ disabled: true, helperText });
        expect(wrapper.find(".switch__input").props().disabled).toBeTruthy();
        expect(wrapper.find(HelperText).props().disabled).toBeTruthy();
    });

    it("renders readOnly prop correctly", () => {
        const wrapper = setup.setProps({ readOnly: true });
        expect(wrapper.find(".switch__input").props().readOnly).toBeTruthy();
    });

    it.each<ISwitchProps["direction"]>(["horizontal", "vertical"])('should have "%s" direction', (direction) => {
        const className = {
            horizontal: "switch_direction_horizontal",
            vertical: "switch_direction_vertical"
        } as const;
        const wrapper = setup.setProps({ direction });
        expect(wrapper.find(".switch").hasClass(className[direction as keyof typeof className])).toBeTruthy();
    });

    it("renders name prop correctly", () => {
        const name = "switch-name";
        const wrapper = setup.setProps({ name });
        expect(wrapper.find(".switch__input").props().name).toBe(name);
    });

    it("renders value prop correctly", () => {
        const value = "test";
        const wrapper = setup.setProps({ value });
        expect(wrapper.find(".switch__input").props().value).toBe(value);
    });

    it("respects defaultChecked in uncontrolled mode", () => {
        const wrapper = mount(<Switch onChange={onChange} defaultChecked />);
        expect(wrapper.find(".switch__input").props().checked).toBe(true);
    });

    it("respects checked in controlled mode", () => {
        const wrapper = setup.setProps({ checked: true });
        expect(wrapper.find(".switch__input").props().checked).toBe(true);
    });

    it("calls onChange handler on click", () => {
        const wrapper = setup.setProps({ onChange });
        wrapper.find("input").simulate("change", { target: { checked: true } });
        expect(onChange).toHaveBeenCalled();
    });

    it("calls onChange on Enter key press", () => {
        const wrapper = setup.setProps({ onChange });
        wrapper.find("input").simulate("keyDown", { key: "Enter", target: { checked: true } });
        expect(onChange).toHaveBeenCalled();
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

    it("renders autoFocus prop correctly", () => {
        const wrapper = setup.setProps({ autoFocus: true });
        expect(wrapper.find(".switch__input").props().autoFocus).toBeTruthy();
    });
});
