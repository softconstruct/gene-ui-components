import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Minus, Plus } from "@geneui/icons";

import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import TextField from "@components/molecules/TextField";

// Components
import CounterField, { ICounterFieldProps } from "./index";

describe("CounterField", () => {
    let setup: ReactWrapper<ICounterFieldProps>;
    beforeEach(() => {
        setup = mount(<CounterField />);
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
        const label = "Counter Label";
        const wrapper = setup.setProps({ label });

        expect(wrapper.find(Label).exists()).toBeTruthy();
        expect(wrapper.find(Label).first().props().text).toBe(label);
    });

    it("renders infoText prop correctly", () => {
        const infoText = "Additional info";
        const wrapper = setup.setProps({ label: "Label", infoText });

        expect(wrapper.find(Label).first().props().infoText).toBe(infoText);
    });

    it("renders required prop correctly", () => {
        const wrapper = setup.setProps({ label: "Label", required: true });

        expect(wrapper.find(Label).first().props().required).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "Helper text";
        const wrapper = setup.setProps({ helperText });

        expect(wrapper.find(HelperText).exists()).toBeTruthy();
        expect(wrapper.find(HelperText).props().text).toBe(helperText);
    });

    it.each<ICounterFieldProps["size"]>(["small", "medium", "large"])('should have "%s" size', (size) => {
        const wrapper = setup.setProps({ size });

        expect(wrapper.find(Button).first().props().size).toBe(size);
        expect(wrapper.find(TextField).props().size).toBe(size);
    });

    it.each<ICounterFieldProps["status"]>(["rest", "warning", "error"])('should have "%s" status', (status) => {
        const wrapper = setup.setProps({ status, helperText: "test" });

        expect(wrapper.find(".counterField").hasClass(`counterField_status_${status}`)).toBeTruthy();
        expect(wrapper.find(TextField).props().status).toBe(status);
        expect(wrapper.find(HelperText).props().status).toBe(status);
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });

        expect(wrapper.find(".counterField").hasClass("counterField_disabled")).toBeTruthy();
        expect(wrapper.find(Button).at(0).props().disabled).toBeTruthy();
        expect(wrapper.find(Button).at(1).props().disabled).toBeTruthy();
        expect(wrapper.find(TextField).props().disabled).toBeTruthy();
    });

    it("renders disabled prop on Label correctly", () => {
        const wrapper = setup.setProps({ label: "Label", disabled: true });

        expect(wrapper.find(Label).first().props().disabled).toBeTruthy();
    });

    it("renders disabled prop on HelperText correctly", () => {
        const wrapper = setup.setProps({ helperText: "test", disabled: true });

        expect(wrapper.find(HelperText).props().disabled).toBeTruthy();
    });

    it("renders readOnly prop correctly", () => {
        const wrapper = setup.setProps({ readOnly: true });

        expect(wrapper.find(".counterField").hasClass("counterField_readOnly")).toBeTruthy();
        expect(wrapper.find(Button).at(0).props().disabled).toBeTruthy();
        expect(wrapper.find(Button).at(1).props().disabled).toBeTruthy();
        expect(wrapper.find(TextField).props().readOnly).toBeTruthy();
    });

    it("renders readOnly prop on Label correctly", () => {
        const wrapper = setup.setProps({ label: "Label", readOnly: true });

        expect(wrapper.find(Label).first().props().readOnly).toBeTruthy();
    });

    it("renders value prop correctly in controlled mode", () => {
        const value = 10;
        const wrapper = setup.setProps({ value });

        expect(wrapper.find(TextField).props().value).toBe(String(value));
    });

    it("updates value correctly in controlled mode", () => {
        const wrapper = setup.setProps({ value: 5 });
        expect(wrapper.find(TextField).props().value).toBe("5");

        wrapper.setProps({ value: 10 });
        expect(wrapper.find(TextField).props().value).toBe("10");
    });

    it("respects defaultValue in uncontrolled mode", () => {
        const wrapper = mount(<CounterField defaultValue={7} />);

        expect(wrapper.find(TextField).props().value).toBe("7");
    });

    it("defaults to 0 when no defaultValue is provided in uncontrolled mode", () => {
        expect(setup.find(TextField).props().value).toBe("0");
    });

    it("respects min boundary", () => {
        const min = 5;
        const wrapper = setup.setProps({ min, value: min });

        expect(wrapper.find(TextField).props().value).toBe(String(min));
    });

    it("disables decrement button when value equals min", () => {
        const wrapper = setup.setProps({ value: 0, min: 0 });

        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeTruthy();
    });

    it("does not disable decrement button when value is above min", () => {
        const wrapper = setup.setProps({ value: 5, min: 0 });

        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeFalsy();
    });

    it("increments by default step of 1", () => {
        const onChange = jest.fn();
        const wrapper = mount(<CounterField value={5} onChange={onChange} />);

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith(6, expect.any(Object));
    });

    it("decrements by default step of 1", () => {
        const onChange = jest.fn();
        const wrapper = mount(<CounterField value={5} min={0} onChange={onChange} />);

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith(4, expect.any(Object));
    });

    it("increments by custom step", () => {
        const onChange = jest.fn();
        const wrapper = mount(<CounterField value={5} step={3} onChange={onChange} />);

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith(8, expect.any(Object));
    });

    it("decrements by custom step", () => {
        const onChange = jest.fn();
        const wrapper = mount(<CounterField value={10} min={0} step={3} onChange={onChange} />);

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith(7, expect.any(Object));
    });

    it("calls onChange when increment button is clicked", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalled();
    });

    it("calls onChange when decrement button is clicked", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, onChange });

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalled();
    });

    it("renders Plus icon on increment button", () => {
        const incrementButton = setup.find(Button).at(1);
        expect(incrementButton.props().Icon).toBe(Plus);
    });

    it("renders Minus icon on decrement button", () => {
        const decrementButton = setup.find(Button).at(0);
        expect(decrementButton.props().Icon).toBe(Minus);
    });

    it("passes numericOnly prop to TextField", () => {
        expect(setup.find(TextField).props().numericOnly).toBeTruthy();
    });

    it("increment button is not disabled by default", () => {
        const incrementButton = setup.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeFalsy();
    });

    it("increment button is disabled when component is disabled", () => {
        const wrapper = setup.setProps({ disabled: true });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeTruthy();
    });

    it("increment button is disabled when component is readOnly", () => {
        const wrapper = setup.setProps({ readOnly: true });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeTruthy();
    });

    it("decrement button is disabled when disabled prop is true", () => {
        const wrapper = setup.setProps({ disabled: true });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeTruthy();
    });

    it("decrement button is disabled when readOnly prop is true", () => {
        const wrapper = setup.setProps({ readOnly: true });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeTruthy();
    });

    it("decrement button is disabled when value equals min", () => {
        const wrapper = setup.setProps({ value: 10, min: 10 });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeTruthy();
    });

    it("should have aria-required attribute when required is true", () => {
        const wrapper = setup.setProps({ required: true });
        expect(wrapper.find(".counterField").prop("aria-required")).toBe(true);
    });

    it("should have aria-invalid='true' when status is 'error'", () => {
        const wrapper = setup.setProps({ status: "error" });
        expect(wrapper.find(".counterField").prop("aria-invalid")).toBe(true);
    });

    it("should have aria-invalid='false' when status is 'rest'", () => {
        const wrapper = setup.setProps({ status: "rest" });
        expect(wrapper.find(".counterField").prop("aria-invalid")).toBe(false);
    });

    it("should have aria-invalid='false' when status is 'warning'", () => {
        const wrapper = setup.setProps({ status: "warning" });
        expect(wrapper.find(".counterField").prop("aria-invalid")).toBe(false);
    });

    it("should have aria-label on decrement button", () => {
        const decrementButton = setup.find(Button).at(0);
        expect(decrementButton.props()["aria-label"]).toBe("Decrement value");
    });

    it("should have aria-label on increment button", () => {
        const incrementButton = setup.find(Button).at(1);
        expect(incrementButton.props()["aria-label"]).toBe("Increment value");
    });

    it("buttons should have secondary appearance", () => {
        const decrementButton = setup.find(Button).at(0);
        const incrementButton = setup.find(Button).at(1);

        expect(decrementButton.props().appearance).toBe("secondary");
        expect(incrementButton.props().appearance).toBe("secondary");
    });

    it("buttons should have fill layout", () => {
        const decrementButton = setup.find(Button).at(0);
        const incrementButton = setup.find(Button).at(1);

        expect(decrementButton.props().layout).toBe("fill");
        expect(incrementButton.props().layout).toBe("fill");
    });

    it("does not update internal state in controlled mode", () => {
        const onChange = jest.fn();
        const wrapper = mount(<CounterField value={5} onChange={onChange} />);

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(wrapper.find(TextField).props().value).toBe("5");
        expect(onChange).toHaveBeenCalledWith(6, expect.any(Object));
    });
});
