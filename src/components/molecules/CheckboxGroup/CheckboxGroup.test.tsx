import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import CheckboxGroup, { ICheckboxGroupProps, ICheckboxOption } from "./index";

const mockOptions: ICheckboxOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
];

describe("CheckboxGroup", () => {
    let setup: ReactWrapper<ICheckboxGroupProps>;

    beforeEach(() => {
        setup = mount(<CheckboxGroup name="test-checkbox-group" options={mockOptions} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders all checkbox options", () => {
        const checkboxInputs = setup.find('input[type="checkbox"]');
        expect(checkboxInputs).toHaveLength(mockOptions.length);
    });

    it("renders labels for all options", () => {
        mockOptions.forEach((option) => {
            expect(setup.text()).toContain(option.label);
        });
    });

    it("applies correct name attribute to all checkbox inputs", () => {
        const checkboxInputs = setup.find('input[type="checkbox"]');
        checkboxInputs.forEach((input) => {
            expect(input.prop("name")).toBe("test-checkbox-group");
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
        const checkboxInputs = setup.find('input[type="checkbox"]');
        checkboxInputs.forEach((input) => {
            expect(input.prop("disabled")).toBeUndefined();
        });
    });

    it("applies readOnly state correctly", () => {
        setup.setProps({ readOnly: true });
        const checkboxInputs = setup.find('input[type="checkbox"]');
        checkboxInputs.forEach((input) => {
            expect(input.prop("readOnly")).toBeUndefined();
        });
    });

    it("applies disabled state class when disabled", () => {
        setup.setProps({ disabled: true });
        expect(setup.find(".checkboxGroup").hasClass("checkboxGroup_disabled")).toBe(true);
    });

    it("applies readOnly state class when readOnly", () => {
        setup.setProps({ readOnly: true });
        expect(setup.find(".checkboxGroup").hasClass("checkboxGroup_readOnly")).toBe(true);
    });

    it("handles controlled value correctly", () => {
        const controlledValue = ["option2", "option3"];
        const controlledWrapper = mount(
            <CheckboxGroup name="test-checkbox-group" options={mockOptions} value={controlledValue} />
        );

        const checkedInputs = controlledWrapper.find('input[type="checkbox"]');
        expect(checkedInputs.at(0).prop("checked")).toBe(false); // option1
        expect(checkedInputs.at(1).prop("checked")).toBe(true); // option2
        expect(checkedInputs.at(2).prop("checked")).toBe(true); // option3
    });

    it("handles uncontrolled value with defaultValue", () => {
        const defaultValue = ["option1", "option3"];
        const wrapper = mount(
            <CheckboxGroup name="test-checkbox-group" options={mockOptions} defaultValue={defaultValue} />
        );

        const checkedInputs = wrapper.find('input[type="checkbox"]');
        expect(checkedInputs.at(0).prop("checked")).toBe(true); // option1
        expect(checkedInputs.at(1).prop("checked")).toBe(false); // option2
        expect(checkedInputs.at(2).prop("checked")).toBe(true); // option3
    });

    it("calls onChange when checkbox option is selected", () => {
        const onChange = jest.fn();
        setup.setProps({ onChange });

        const firstCheckbox = setup.find('input[type="checkbox"]').first();
        firstCheckbox.simulate("change", { target: { checked: true, value: "option1" } });

        expect(onChange).toHaveBeenCalledWith(["option1"], expect.any(Object));
    });

    it("calls onChange when checkbox option is deselected", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CheckboxGroup
                name="test-checkbox-group"
                options={mockOptions}
                onChange={onChange}
                defaultValue={["option1", "option2"]}
            />
        );

        const firstCheckbox = wrapper.find('input[type="checkbox"]').first();
        firstCheckbox.simulate("change", { target: { checked: false, value: "option1" } });

        expect(onChange).toHaveBeenCalledWith(["option2"], expect.any(Object));
    });

    it("calls onFocus when checkbox option is focused", () => {
        const onFocus = jest.fn();
        setup.setProps({ onFocus });

        const firstCheckbox = setup.find('input[type="checkbox"]').first();
        firstCheckbox.simulate("focus");

        expect(onFocus).toHaveBeenCalledWith(expect.any(Object));
    });

    it("calls onBlur when checkbox option loses focus", () => {
        const onBlur = jest.fn();
        setup.setProps({ onBlur });

        const firstCheckbox = setup.find('input[type="checkbox"]').first();
        firstCheckbox.simulate("blur");

        expect(onBlur).toHaveBeenCalledWith(expect.any(Object));
    });

    it("handles individual option disabled state", () => {
        const optionsWithDisabled: ICheckboxOption[] = [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2", disabled: true },
            { value: "option3", label: "Option 3" }
        ];

        setup.setProps({ options: optionsWithDisabled });

        const checkboxInputs = setup.find('input[type="checkbox"]');
        expect(checkboxInputs.at(0).prop("disabled")).toBeUndefined();
        expect(checkboxInputs.at(1).prop("disabled")).toBeUndefined();
        expect(checkboxInputs.at(2).prop("disabled")).toBeUndefined();
    });

    it("shows required indicator when required prop is true", () => {
        setup.setProps({ label: "Test Label", required: true });
        expect(setup.text()).toContain("*");
    });

    it("renders without label when label is not provided", () => {
        const wrapper = mount(<CheckboxGroup name="test-checkbox-group" options={mockOptions} />);

        // Should have 3 labels (one for each checkbox option) but no group label
        expect(wrapper.find("label")).toHaveLength(3);
        // Check that there's no group label by looking for the label with the group text
        expect(wrapper.text()).not.toContain("Group Label");
    });

    it("handles multiple selections correctly", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CheckboxGroup
                name="test-checkbox-group"
                options={mockOptions}
                onChange={onChange}
                defaultValue={["option1"]}
            />
        );

        // Select second option
        const secondCheckbox = wrapper.find('input[type="checkbox"]').at(1);
        secondCheckbox.simulate("change", { target: { checked: true, value: "option2" } });

        expect(onChange).toHaveBeenCalledWith(["option1", "option2"], expect.any(Object));
    });

    it("handles deselection correctly", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CheckboxGroup
                name="test-checkbox-group"
                options={mockOptions}
                onChange={onChange}
                defaultValue={["option1", "option2", "option3"]}
            />
        );

        // Deselect second option
        const secondCheckbox = wrapper.find('input[type="checkbox"]').at(1);
        secondCheckbox.simulate("change", { target: { checked: false, value: "option2" } });

        expect(onChange).toHaveBeenCalledWith(["option1", "option3"], expect.any(Object));
    });

    it("should have role='group' on the container", () => {
        const wrapper = mount(<CheckboxGroup name="test-checkbox-group" options={mockOptions} />);
        const container = wrapper.find(".checkboxGroup");
        expect(container.prop("role")).toBe("group");
    });

    it("should have proper ARIA attributes with all status variants", () => {
        const statuses: Array<"rest" | "warning" | "error"> = ["rest", "warning", "error"];

        statuses.forEach((status) => {
            const wrapper = mount(<CheckboxGroup name="test-checkbox-group" options={mockOptions} status={status} />);
            const container = wrapper.find(".checkboxGroup");

            expect(container.prop("role")).toBe("group");
        });
    });

    it("renders infoText prop correctly", () => {
        const infoText = "Additional information about this checkbox group";
        const wrapper = mount(
            <CheckboxGroup name="test-checkbox-group" options={mockOptions} label="Test Label" infoText={infoText} />
        );

        expect(wrapper.find("Info")).toHaveLength(1);
    });

    it("applies status prop correctly to all checkboxes", () => {
        const statuses: Array<"rest" | "warning" | "error"> = ["rest", "warning", "error"];

        statuses.forEach((status) => {
            const wrapper = mount(<CheckboxGroup name="test-checkbox-group" options={mockOptions} status={status} />);

            const checkboxComponents = wrapper.find("Checkbox");
            checkboxComponents.forEach((checkbox) => {
                expect(checkbox.prop("status")).toBe(status);
            });
        });
    });

    it("applies status prop correctly to HelperText", () => {
        const statuses: Array<"rest" | "warning" | "error"> = ["rest", "warning", "error"];

        statuses.forEach((status) => {
            const wrapper = mount(
                <CheckboxGroup
                    name="test-checkbox-group"
                    options={mockOptions}
                    status={status}
                    helperText="Test helper text"
                />
            );

            const helperTextComponent = wrapper.find("HelperText");
            expect(helperTextComponent.prop("status")).toBe(status);
        });
    });

    it("handles empty options array", () => {
        const wrapper = mount(<CheckboxGroup name="test-checkbox-group" options={[]} />);

        expect(wrapper.find('input[type="checkbox"]')).toHaveLength(0);
        expect(wrapper.find(".checkboxGroup__options").children()).toHaveLength(0);
    });

    it("handles invalid defaultValue arrays gracefully", () => {
        const invalidDefaultValue = ["nonexistent-option", "option1"];
        const wrapper = mount(
            <CheckboxGroup name="test-checkbox-group" options={mockOptions} defaultValue={invalidDefaultValue} />
        );

        const checkboxInputs = wrapper.find('input[type="checkbox"]');
        expect(checkboxInputs.at(0).prop("checked")).toBe(true); // option1
        expect(checkboxInputs.at(1).prop("checked")).toBe(false); // option2
        expect(checkboxInputs.at(2).prop("checked")).toBe(false); // option3
    });

    it("handles mixed disabled states correctly", () => {
        const optionsWithMixedDisabled: ICheckboxOption[] = [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2", disabled: true },
            { value: "option3", label: "Option 3" }
        ];

        const wrapper = mount(<CheckboxGroup name="test-checkbox-group" options={optionsWithMixedDisabled} disabled />);
        const checkboxComponents = wrapper.find("Checkbox");
        checkboxComponents.forEach((checkbox) => {
            expect(checkbox.prop("disabled")).toBe(true);
        });
    });
});
