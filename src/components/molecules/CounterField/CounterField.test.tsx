import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Minus, Plus } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import CounterField, { ICounterFieldProps } from "@components/molecules/CounterField/CounterField";
import TextField from "@components/molecules/TextField";

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

    it("increments by default step of 1", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("6", expect.any(Object));
    });

    it("decrements by default step of 1", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, onChange });

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("4", expect.any(Object));
    });

    it("increments by custom step", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, step: 3, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("8", expect.any(Object));
    });

    it("decrements by custom step", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 10, step: 3, onChange });

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("7", expect.any(Object));
    });

    it("renders Plus icon on increment button", () => {
        const incrementButton = setup.find(Button).at(1);
        expect(incrementButton.props().Icon).toBe(Plus);
    });

    it("renders Minus icon on decrement button", () => {
        const decrementButton = setup.find(Button).at(0);
        expect(decrementButton.props().Icon).toBe(Minus);
    });

    it("passes type='number' prop to TextField", () => {
        expect(setup.find(TextField).props().type).toBe("number");
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

    it("decrement button is disabled when disabled prop is true", () => {
        const wrapper = setup.setProps({ disabled: true });
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

    it("should have aria-invalid='false' when status is not 'error'", () => {
        const wrapperRest = setup.setProps({ status: "rest" });
        expect(wrapperRest.find(".counterField").prop("aria-invalid")).toBe(false);

        const wrapperWarning = setup.setProps({ status: "warning" });
        expect(wrapperWarning.find(".counterField").prop("aria-invalid")).toBe(false);
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
        const wrapper = setup.setProps({ value: 5, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(wrapper.find(TextField).props().value).toBe("5");
        expect(onChange).toHaveBeenCalledWith("6", expect.any(Object));
    });

    it("calls onChange with string value when user types in input", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "12" } });

        expect(onChange).toHaveBeenCalledWith("12", expect.any(Object));
    });

    it("calls onChange with intermediate string states like '-'", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "-" } });

        expect(onChange).toHaveBeenCalledWith("-", expect.any(Object));
    });

    it("calls onChange with intermediate string states like '.'", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "." } });

        expect(onChange).toHaveBeenCalledWith(".", expect.any(Object));
    });

    it("calls onChange with intermediate string states and decimal values", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ onChange });

        const input = wrapper.find(TextField).find("input");

        input.simulate("change", { target: { value: "-5" } });
        expect(onChange).toHaveBeenCalledWith("-5", expect.any(Object));

        input.simulate("change", { target: { value: "12.5" } });
        expect(onChange).toHaveBeenCalledWith("12.5", expect.any(Object));
    });

    it("calls onChange with event object containing correct type", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("6", expect.objectContaining({ type: "click" }));

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "10" } });

        expect(onChange).toHaveBeenCalledWith("10", expect.objectContaining({ type: "change" }));
    });

    it("handles negative numbers correctly in controlled mode", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: -5, onChange });

        expect(wrapper.find(TextField).props().value).toBe("-5");

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("-4", expect.any(Object));
    });

    it("handles decimal numbers correctly in controlled mode", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5.5, onChange });

        expect(wrapper.find(TextField).props().value).toBe("5.5");

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("6.5", expect.any(Object));
    });

    it("accepts string value prop in controlled mode", () => {
        const wrapper = setup.setProps({ value: "10" });
        expect(wrapper.find(TextField).props().value).toBe("10");
    });
});
