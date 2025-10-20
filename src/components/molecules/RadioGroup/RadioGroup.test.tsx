import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import RadioGroup, { IRadioGroupProps, IRadioOption } from "./index";

const mockOptions: IRadioOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
];

describe("RadioGroup", () => {
    let setup: ReactWrapper<IRadioGroupProps>;

    beforeEach(() => {
        setup = mount(<RadioGroup name="test-radio-group" options={mockOptions} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders all radio options", () => {
        const radioInputs = setup.find('input[type="radio"]');
        expect(radioInputs).toHaveLength(mockOptions.length);
    });

    it("renders labels for all options", () => {
        mockOptions.forEach((option) => {
            expect(setup.text()).toContain(option.label);
        });
    });

    it("applies correct name attribute to all radio inputs", () => {
        const radioInputs = setup.find('input[type="radio"]');
        radioInputs.forEach((input) => {
            expect(input.prop("name")).toBe("test-radio-group");
        });
    });

    it("renders group label when provided", () => {
        const label = "Test Group Label";
        setup.setProps({ label });
        expect(setup.text()).toContain(label);
    });

    it("renders helper text when provided", () => {
        const helperText = "Test helper text";
        setup.setProps({ helperText });
        expect(setup.text()).toContain(helperText);
    });

    it("applies disabled state correctly", () => {
        setup.setProps({ disabled: true });
        const radioInputs = setup.find('input[type="radio"]');
        radioInputs.forEach((input) => {
            expect(input.prop("disabled")).toBe(true);
        });
    });

    it("applies readOnly state correctly", () => {
        setup.setProps({ readOnly: true });
        const radioInputs = setup.find('input[type="radio"]');
        radioInputs.forEach((input) => {
            expect(input.prop("readOnly")).toBe(true);
        });
    });

    it("applies disabled state class when disabled", () => {
        setup.setProps({ disabled: true });
        expect(setup.find(".radioGroup").hasClass("radioGroup_disabled")).toBe(true);
    });

    it("applies readOnly state class when readOnly", () => {
        setup.setProps({ readOnly: true });
        expect(setup.find(".radioGroup").hasClass("radioGroup_readOnly")).toBe(true);
    });

    it("handles controlled value correctly", () => {
        const controlledValue = "option2";
        const controlledWrapper = mount(
            <RadioGroup name="test-radio-group" options={mockOptions} value={controlledValue} />
        );

        const checkedInput = controlledWrapper.find(`input[value="${controlledValue}"]`);
        expect(checkedInput.prop("checked")).toBe(true);
    });

    it("handles uncontrolled value with defaultValue", () => {
        const defaultValue = "option1";
        const wrapper = mount(<RadioGroup name="test-radio-group" options={mockOptions} defaultValue={defaultValue} />);

        const checkedInput = wrapper.find(`input[value="${defaultValue}"]`);
        expect(checkedInput.prop("checked")).toBe(true);
    });

    it("calls onChange when radio option is selected", () => {
        const onChange = jest.fn();
        setup.setProps({ onChange });

        const firstRadio = setup.find('input[type="radio"]').first();
        firstRadio.simulate("change", { target: { value: "option1" } });

        expect(onChange).toHaveBeenCalledWith("option1", expect.any(Object));
    });

    it("calls onFocus when radio option is focused", () => {
        const onFocus = jest.fn();
        setup.setProps({ onFocus });

        const firstRadio = setup.find('input[type="radio"]').first();
        firstRadio.simulate("focus");

        expect(onFocus).toHaveBeenCalledWith(expect.any(Object));
    });

    it("calls onBlur when radio option loses focus", () => {
        const onBlur = jest.fn();
        setup.setProps({ onBlur });

        const firstRadio = setup.find('input[type="radio"]').first();
        firstRadio.simulate("blur");

        expect(onBlur).toHaveBeenCalledWith(expect.any(Object));
    });

    it("handles individual option disabled state", () => {
        const optionsWithDisabled: IRadioOption[] = [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2", disabled: true },
            { value: "option3", label: "Option 3" }
        ];

        setup.setProps({ options: optionsWithDisabled });

        const radioInputs = setup.find('input[type="radio"]');
        expect(radioInputs.at(0).prop("disabled")).toBeFalsy();
        expect(radioInputs.at(1).prop("disabled")).toBe(true);
        expect(radioInputs.at(2).prop("disabled")).toBeFalsy();
    });

    it("shows required indicator when required prop is true", () => {
        setup.setProps({ label: "Test Label", required: true });
        expect(setup.text()).toContain("*");
    });

    it("renders without label when label is not provided", () => {
        const wrapper = mount(<RadioGroup name="test-radio-group" options={mockOptions} />);

        // Should have 3 labels (one for each radio option) but no group label
        expect(wrapper.find("label")).toHaveLength(3);
        // Check that there's no group label by looking for the label with the group text
        expect(wrapper.text()).not.toContain("Group Label");
    });
});
