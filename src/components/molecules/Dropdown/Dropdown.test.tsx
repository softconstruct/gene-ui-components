import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import Checkbox from "@components/molecules/Checkbox";

import { DEFAULT_SEARCH_DEBOUNCE_MS } from "./constants";
import Dropdown, { IDropdownProps } from "./index";
// Types
import { IDropdownOption } from "./types";

const options: IDropdownOption[] = [
    { id: 1, label: "Option 1", value: "option-1" },
    { id: 2, label: "Option 2", value: "option-2" },
    { id: 3, label: "Option 3", value: "option-3" }
];

const getTriggerField = (wrapper: ReactWrapper<IDropdownProps>) => wrapper.find(".dropdown .textField").at(0);
const getTriggerWrapper = (wrapper: ReactWrapper<IDropdownProps>) =>
    getTriggerField(wrapper).find(".textField__wrapper");
const getTriggerInput = (wrapper: ReactWrapper<IDropdownProps>) =>
    getTriggerField(wrapper).find("input.textField__input");
const openDropdown = (wrapper: ReactWrapper<IDropdownProps>) => {
    getTriggerWrapper(wrapper).simulate("click");
    wrapper.update();
};

describe("Dropdown ", () => {
    let setup: ReactWrapper<IDropdownProps>;
    beforeEach(() => {
        setup = mount(<Dropdown options={options} label="Label" />);
    });
    afterEach(() => {
        if (setup && setup.exists()) {
            setup.unmount();
        }
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("selects value in single mode and closes popover", () => {
        openDropdown(setup);
        setup.find(".dropdownItem__action").at(1).simulate("click");
        setup.update();

        expect(getTriggerInput(setup).prop("value")).toBe("Option 2");
    });

    it("supports multiselect and clear", () => {
        setup.setProps({ variant: "multi" });
        openDropdown(setup);

        setup.find(".dropdownItem__action").at(0).simulate("click");
        setup.find(".dropdownItem__action").at(1).simulate("click");
        setup.update();
        expect(getTriggerInput(setup).prop("value")).toBe("Option 1, Option 2");

        setup.find(".dropdown__actions button").at(0).simulate("click");
        setup.update();

        expect(getTriggerInput(setup).prop("value")).toBe("");
    });

    it("marks select all checkbox indeterminate when some options are selected", () => {
        setup.setProps({ variant: "multi", values: ["option-1"] });
        openDropdown(setup);

        let selectAllCheckbox = setup.find(".dropdown__actions").find(Checkbox).at(0);
        expect(selectAllCheckbox.prop("checked")).toBe(false);
        expect(selectAllCheckbox.prop("indeterminate")).toBe(true);

        setup.setProps({ values: ["option-1", "option-2", "option-3"] });
        setup.update();

        selectAllCheckbox = setup.find(".dropdown__actions").find(Checkbox).at(0);
        expect(selectAllCheckbox.prop("checked")).toBe(true);
        expect(selectAllCheckbox.prop("indeterminate")).toBe(false);
    });

    it("preserves selections outside search when select all is checked", () => {
        setup.setProps({ variant: "multi", searchable: true });
        openDropdown(setup);

        setup.find(".dropdownItem__action").at(0).simulate("click");
        setup.update();

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Option 2" } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        setup
            .find(".dropdown__actions")
            .find(Checkbox)
            .find("input")
            .simulate("change", { target: { checked: true } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        expect(getTriggerInput(setup).prop("value")).toBe("Option 1, Option 2");

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        const selectAllCheckbox = setup.find(".dropdown__actions").find(Checkbox).at(0);
        expect(selectAllCheckbox.prop("checked")).toBe(false);
        expect(selectAllCheckbox.prop("indeterminate")).toBe(true);
        expect(getTriggerInput(setup).prop("value")).toBe("Option 1, Option 2");
    });

    it("preserves selections outside search when select all is unchecked", () => {
        setup.setProps({ variant: "multi", searchable: true });
        openDropdown(setup);

        setup.find(".dropdownItem__action").at(0).simulate("click");
        setup.update();

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Option 2" } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        const selectAllInput = setup.find(".dropdown__actions").find(Checkbox).find("input");
        selectAllInput.simulate("change", { target: { checked: true } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();
        selectAllInput.simulate("change", { target: { checked: false } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        expect(getTriggerInput(setup).prop("value")).toBe("Option 1");

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        const selectAllCheckbox = setup.find(".dropdown__actions").find(Checkbox).at(0);
        expect(selectAllCheckbox.prop("checked")).toBe(false);
        expect(selectAllCheckbox.prop("indeterminate")).toBe(true);
        expect(getTriggerInput(setup).prop("value")).toBe("Option 1");
    });

    it("renders info as a focusable button sibling to the option action", () => {
        setup.setProps({
            variant: "multi",
            searchable: true,
            options: [{ id: 1, label: "Option 1", value: "option-1", infoText: "Extra details" }]
        });
        openDropdown(setup);

        const optionAction = setup.find(".dropdownItem__action");
        const infoButton = setup.find(".dropdownItem__info button");

        expect(optionAction.exists()).toBeTruthy();
        expect(infoButton.exists()).toBeTruthy();
        expect(infoButton.closest("button.dropdownItem__action").exists()).toBeFalsy();
    });

    it("opens in readOnly mode but does not change value", () => {
        setup.setProps({ readOnly: true, value: "option-1" });
        openDropdown(setup);

        expect(setup.find(".dropdownItem").exists()).toBeTruthy();

        setup.find(".dropdownItem__action").at(1).simulate("click");
        setup.update();

        expect(getTriggerInput(setup).prop("value")).toBe("Option 1");
    });

    it("renders a presentational trigger input when search is disabled", () => {
        setup.setProps({ searchable: false });
        setup.update();

        const triggerInput = getTriggerInput(setup);
        expect(triggerInput.prop("readOnly")).toBe(true);
        expect(triggerInput.prop("role")).toBe("presentation");
        expect(getTriggerWrapper(setup).hasClass("textField__wrapper_readOnly")).toBe(false);
    });

    it("renders trigger semantics on trigger input when search is enabled", () => {
        setup.setProps({ searchable: true });
        setup.update();

        const triggerInput = getTriggerInput(setup);
        const triggerWrapper = getTriggerWrapper(setup);
        expect(triggerInput.prop("readOnly")).toBe(true);
        expect(triggerInput.prop("role")).toBe("presentation");
        expect(triggerInput.prop("tabIndex")).toBe(-1);
        expect(triggerWrapper.prop("role")).toBe("button");
        expect(triggerWrapper.prop("tabIndex")).toBe(0);
    });

    it("shows compact selected text with +N suffix in multiselect", () => {
        setup.setProps({
            variant: "multi",
            values: ["option-1", "option-2", "option-3"]
        });
        setup.update();

        expect(getTriggerInput(setup).prop("value")).toBe("Option 1, Option 2");
        expect(getTriggerField(setup).find(".textField__suffix").text()).toBe("+1...");
    });

    it("calls onSearchChange in debounced mode", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({ searchable: true, onSearchChange });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Op" } } as React.ChangeEvent<HTMLInputElement>);

        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS - 1);
        });

        expect(onSearchChange).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(onSearchChange).toHaveBeenCalledWith("Op");
    });

    it("keeps search input editable when filter yields no matches", () => {
        setup.setProps({ searchable: true });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "no-match" } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        expect(setup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(false);
        expect(setup.find(".dropdownItem").length).toBe(0);
    });

    it("keeps search input editable when external options are cleared after a search", () => {
        setup.setProps({ searchable: true, filterFn: false as const });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "query" } } as React.ChangeEvent<HTMLInputElement>);
        setup.setProps({ options: [] });
        setup.update();

        expect(setup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(false);
    });

    it("allows typing in external search mode when options start empty", () => {
        setup.setProps({ searchable: true, filterFn: false as const, options: [] });
        openDropdown(setup);

        expect(setup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(false);
    });

    it("keeps search input editable when options start empty", () => {
        const emptySetup = mount(<Dropdown options={[]} searchable label="Label" />);
        openDropdown(emptySetup);

        expect(emptySetup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(false);
        emptySetup.unmount();
    });

    it("filters internally even when onSearchChange is provided (analytics-safe)", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({ searchable: true, onSearchChange });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Option 2" } } as React.ChangeEvent<HTMLInputElement>);
        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS);
        });
        setup.update();

        const items = setup.find(".dropdownItem");
        expect(items.length).toBe(1);
        expect(items.at(0).text()).toContain("Option 2");
    });

    it("does not filter internally when filterFn={false}", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({
            searchable: true,
            onSearchChange,
            filterFn: false as const
        });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Option 2" } } as React.ChangeEvent<HTMLInputElement>);

        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS);
        });
        setup.update();

        expect(setup.find(".dropdownItem").length).toBe(options.length);
        expect(onSearchChange).toHaveBeenCalledWith("Option 2");
    });

    it("respects a custom filterFn function", () => {
        jest.useFakeTimers();
        const startsWith = (option: IDropdownOption, term: string) => option.label.toLowerCase().startsWith(term);
        setup.setProps({ searchable: true, filterFn: startsWith });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "option 1" } } as React.ChangeEvent<HTMLInputElement>);
        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS);
        });
        setup.update();

        const items = setup.find(".dropdownItem");
        expect(items.length).toBe(1);
        expect(items.at(0).text()).toContain("Option 1");
    });

    it("emits onSearchChange and filters from first character", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({
            searchable: true,
            onSearchChange
        });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "2" } } as React.ChangeEvent<HTMLInputElement>);

        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS);
        });

        expect(onSearchChange).toHaveBeenCalledWith("2");
        expect(setup.find(".dropdownItem").length).toBe(1);
    });

    it("emits empty string on clear", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({
            searchable: true,
            onSearchChange,
            defaultSearchValue: "Option 1"
        });
        openDropdown(setup);

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);

        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS);
        });

        expect(onSearchChange).toHaveBeenCalledWith("");
    });

    it("clears search and emits '' when popover closes if resetSearchOnClose=true", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({
            searchable: true,
            onSearchChange,
            resetSearchOnClose: true
        });

        openDropdown(setup);
        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Option 1" } } as React.ChangeEvent<HTMLInputElement>);
        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS);
        });
        setup.update();

        onSearchChange.mockClear();

        setup.find(".dropdownItem__action").at(0).simulate("click");
        setup.update();

        expect(onSearchChange).toHaveBeenCalledWith("");

        openDropdown(setup);
        const searchInput = setup.find(".dropdown__search input.textField__input");
        expect(searchInput.prop("value")).toBe("");
    });

    it("renders loading and empty states", () => {
        setup.setProps({ loading: true, loadingText: "Loading info" });
        openDropdown(setup);
        expect(setup.find(".loader").exists()).toBeTruthy();

        setup.setProps({ loading: false, options: [], emptyText: "No records" });
        setup.update();
        expect(setup.find(".empty").exists()).toBeTruthy();
        expect(setup.find(".dropdown__stateScrollbar").exists()).toBeTruthy();
    });

    it("opens and focuses first option with ArrowDown from trigger", () => {
        setup.setProps({ searchable: false });

        getTriggerWrapper(setup).simulate("keyDown", { key: "ArrowDown" });
        act(() => undefined);
        setup.update();

        const firstOption = setup.find(".dropdownItem__action").at(0).getDOMNode() as HTMLButtonElement;
        expect(document.activeElement).toBe(firstOption);
    });

    it("closes on Escape when opened", () => {
        setup.setProps({ searchable: true });
        openDropdown(setup);
        expect(setup.find(".dropdownItem").exists()).toBeTruthy();

        setup.find(".dropdown__search input.textField__input").simulate("keyDown", { key: "Escape" });
        setup.update();

        expect(setup.find(".dropdownItem").exists()).toBeFalsy();
    });

    it("focuses first option on ArrowDown from search input", () => {
        jest.useFakeTimers();
        setup.setProps({ searchable: true });
        openDropdown(setup);

        setup.find(".dropdown__search input.textField__input").simulate("keyDown", { key: "ArrowDown" });
        act(() => {
            jest.advanceTimersByTime(0);
        });
        setup.update();

        const firstOption = setup.find(".dropdownItem__action").at(0).getDOMNode() as HTMLButtonElement;
        expect(document.activeElement).toBe(firstOption);
    });
});
