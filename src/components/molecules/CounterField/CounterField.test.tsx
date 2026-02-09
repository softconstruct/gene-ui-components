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
        expect(wrapper.find(TextField).props().readOnly).toBeTruthy();
    });

    it("does not apply readOnly class when disabled is true", () => {
        const wrapper = setup.setProps({ readOnly: true, disabled: true });
        expect(wrapper.find(Button).at(0).props().disabled).toBeTruthy();
        expect(wrapper.find(Button).at(1).props().disabled).toBeTruthy();
        expect(wrapper.find(TextField).props().disabled).toBeTruthy();
    });

    it("passes readOnly prop to TextField correctly", () => {
        const wrapper = setup.setProps({ readOnly: true });
        expect(wrapper.find(TextField).props().readOnly).toBeTruthy();
    });

    it("passes readOnly prop to Label correctly", () => {
        const wrapper = setup.setProps({ label: "Label", readOnly: true });
        expect(wrapper.find(Label).first().props().readOnly).toBeTruthy();
    });

    it("disables increment button when readOnly is true", () => {
        const wrapper = setup.setProps({ readOnly: true });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeTruthy();
    });

    it("disables decrement button when readOnly is true", () => {
        const wrapper = setup.setProps({ readOnly: true });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeTruthy();
    });

    it("does not call onChange when increment button is clicked in readOnly mode", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, readOnly: true, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).not.toHaveBeenCalled();
    });

    it("does not call onChange when decrement button is clicked in readOnly mode", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, readOnly: true, onChange });

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).not.toHaveBeenCalled();
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

    it("clamps value to max when incrementing exceeds max", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, max: 10, step: 100, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("10", expect.any(Object));
    });

    it("disables increment button when value equals max", () => {
        const wrapper = setup.setProps({ value: 10, max: 10 });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeTruthy();
    });

    it("disables increment button when value exceeds max", () => {
        const wrapper = setup.setProps({ value: 15, max: 10 });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeTruthy();
    });

    it("enables increment button when value is below max", () => {
        const wrapper = setup.setProps({ value: 5, max: 10 });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeFalsy();
    });

    it("increment button is enabled when max is not provided", () => {
        const wrapper = setup.setProps({ value: 100 });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeFalsy();
    });

    it("decrement button remains enabled when value is at max", () => {
        const wrapper = setup.setProps({ value: 10, max: 10 });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeFalsy();
    });

    it("handles max with decimal step correctly", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 8, max: 10, step: 2.5, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("10", expect.any(Object));
    });

    it("clamps to max when incrementing from value close to max", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 9.5, max: 10, step: 1, onChange });

        const incrementButton = wrapper.find(Button).at(1);
        incrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("10", expect.any(Object));
    });

    it("clamps value to min when decrementing exceeds min", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, min: 0, step: 100, onChange });

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("0", expect.any(Object));
    });

    it("disables decrement button when value equals min", () => {
        const wrapper = setup.setProps({ value: 0, min: 0 });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeTruthy();
    });

    it("disables decrement button when value is below min", () => {
        const wrapper = setup.setProps({ value: -5, min: 0 });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeTruthy();
    });

    it("enables decrement button when value is above min", () => {
        const wrapper = setup.setProps({ value: 5, min: 0 });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeFalsy();
    });

    it("decrement button is enabled when min is not provided", () => {
        const wrapper = setup.setProps({ value: -100 });
        const decrementButton = wrapper.find(Button).at(0);
        expect(decrementButton.props().disabled).toBeFalsy();
    });

    it("increment button remains enabled when value is at min", () => {
        const wrapper = setup.setProps({ value: 0, min: 0 });
        const incrementButton = wrapper.find(Button).at(1);
        expect(incrementButton.props().disabled).toBeFalsy();
    });

    it("handles min with decimal step correctly", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 2, min: 0, step: 2.5, onChange });

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("0", expect.any(Object));
    });

    it("clamps to min when decrementing from value close to min", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 0.5, min: 0, step: 1, onChange });

        const decrementButton = wrapper.find(Button).at(0);
        decrementButton.simulate("click");

        expect(onChange).toHaveBeenCalledWith("0", expect.any(Object));
    });

    it("clamps value to max on blur when user types value above max", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ max: 10, onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "100" } });
        input.simulate("blur", { target: { value: "100" } });

        expect(onChange).toHaveBeenCalledWith("10", expect.any(Object));
    });

    it("clamps value to min on blur when user types value below min", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ min: 0, onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "-50" } });
        input.simulate("blur", { target: { value: "-50" } });

        expect(onChange).toHaveBeenCalledWith("0", expect.any(Object));
    });

    it("clamps value to both min and max on blur when outside bounds", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ min: 0, max: 10, onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "100" } });
        input.simulate("blur", { target: { value: "100" } });

        expect(onChange).toHaveBeenCalledWith("10", expect.any(Object));
    });

    it("does not clamp value on blur when within bounds", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ min: 0, max: 10, onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "5" } });
        input.simulate("blur", { target: { value: "5" } });

        expect(onChange).toHaveBeenCalledWith("5", expect.any(Object));
    });

    it("clamps to max on blur in controlled mode", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ value: 5, max: 10, onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "100" } });
        input.simulate("blur", { target: { value: "100" } });

        expect(onChange).toHaveBeenCalledWith("10", expect.any(Object));
    });

    it("clamps to min on blur in uncontrolled mode", () => {
        const onChange = jest.fn();
        const wrapper = mount(<CounterField min={0} defaultValue={5} onChange={onChange} />);

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "-50" } });
        input.simulate("blur", { target: { value: "-50" } });

        expect(onChange).toHaveBeenCalledWith("0", expect.any(Object));
        expect(wrapper.find(TextField).props().value).toBe("0");
    });

    it("allows typing values outside bounds before blur", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ max: 10, onChange });

        const input = wrapper.find(TextField).find("input");
        input.simulate("change", { target: { value: "100" } });
        expect(onChange).toHaveBeenCalledWith("100", expect.any(Object));
        input.simulate("blur", { target: { value: "100" } });
        expect(onChange).toHaveBeenLastCalledWith("10", expect.any(Object));
    });

    it("calls onInputBlur after clamping on blur", () => {
        const onInputBlur = jest.fn();
        const wrapper = setup.setProps({ max: 10, onInputBlur });

        const input = wrapper.find(TextField).find("input");
        input.simulate("blur", { target: { value: "100" } });

        expect(onInputBlur).toHaveBeenCalled();
    });

    it("renders autoFocus prop correctly", () => {
        const wrapper = setup.setProps({ autoFocus: true });

        expect(wrapper.find(TextField).props().autoFocus).toBe(true);
    });

    it("does not auto focus when autoFocus is false", () => {
        const wrapper = setup.setProps({ autoFocus: false });

        expect(wrapper.find(TextField).props().autoFocus).toBe(false);
    });

    it("does not auto focus when autoFocus is not provided", () => {
        const wrapper = setup.setProps({});

        expect(wrapper.find(TextField).props().autoFocus).toBeUndefined();
    });
    it("clamps defaultValue to max when defaultValue exceeds max", () => {
        const wrapper = mount(<CounterField defaultValue={100} max={10} />);

        expect(wrapper.find(TextField).props().value).toBe("10");
    });

    it("clamps defaultValue to min when defaultValue is below min", () => {
        const wrapper = mount(<CounterField defaultValue={-50} min={0} />);

        expect(wrapper.find(TextField).props().value).toBe("0");
    });

    it("clamps defaultValue to both min and max when outside bounds", () => {
        const wrapper = mount(<CounterField defaultValue={100} min={0} max={10} />);

        expect(wrapper.find(TextField).props().value).toBe("10");
    });

    it("does not clamp defaultValue when within bounds", () => {
        const wrapper = mount(<CounterField defaultValue={5} min={0} max={10} />);

        expect(wrapper.find(TextField).props().value).toBe("5");
    });

    it("clamps value prop to max when value exceeds max in controlled mode", () => {
        const wrapper = mount(<CounterField value={100} max={10} />);

        expect(wrapper.find(TextField).props().value).toBe("10");
    });

    it("clamps value prop to min when value is below min in controlled mode", () => {
        const wrapper = mount(<CounterField value={-50} min={0} />);

        expect(wrapper.find(TextField).props().value).toBe("0");
    });

    it("clamps value prop to both min and max when outside bounds in controlled mode", () => {
        const wrapper = mount(<CounterField value={100} min={0} max={10} />);

        expect(wrapper.find(TextField).props().value).toBe("10");
    });

    it("does not clamp value prop when within bounds in controlled mode", () => {
        const wrapper = mount(<CounterField value={5} min={0} max={10} />);

        expect(wrapper.find(TextField).props().value).toBe("5");
    });

    it("clamps string value prop to max in controlled mode", () => {
        const wrapper = mount(<CounterField value="100" max={10} />);

        expect(wrapper.find(TextField).props().value).toBe("10");
    });

    it("clamps string value prop to min in controlled mode", () => {
        const wrapper = mount(<CounterField value="-50" min={0} />);

        expect(wrapper.find(TextField).props().value).toBe("0");
    });
});
