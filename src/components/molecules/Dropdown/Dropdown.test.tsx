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
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();
        setup.find(".dropdownItem").at(1).simulate("click");
        setup.update();

        expect(setup.find("input.textField__input").at(0).prop("value")).toBe("Option 2");
    });

    it("supports multiselect and clear", () => {
        setup.setProps({ variant: "multi" });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        setup.find(".dropdownItem").at(0).simulate("click");
        setup.find(".dropdownItem").at(1).simulate("click");
        setup.update();
        expect(setup.find("input.textField__input").at(0).prop("value")).toBe("Option 1, Option 2");

        setup.find(".dropdown__actions button").at(0).simulate("click");
        setup.update();

        expect(setup.find("input.textField__input").at(0).prop("value")).toBe("");
    });

    it("marks select all checkbox indeterminate when some options are selected", () => {
        setup.setProps({ variant: "multi", values: ["option-1"] });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        let selectAllCheckbox = setup.find(".dropdown__actions").find(Checkbox).at(0);
        expect(selectAllCheckbox.prop("checked")).toBe(false);
        expect(selectAllCheckbox.prop("indeterminate")).toBe(true);

        setup.setProps({ values: ["option-1", "option-2", "option-3"] });
        setup.update();

        selectAllCheckbox = setup.find(".dropdown__actions").find(Checkbox).at(0);
        expect(selectAllCheckbox.prop("checked")).toBe(true);
        expect(selectAllCheckbox.prop("indeterminate")).toBe(false);
    });

    it("opens in readOnly mode but does not change value", () => {
        setup.setProps({ readOnly: true, value: "option-1" });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        expect(setup.find(".dropdownItem").exists()).toBeTruthy();

        setup.find(".dropdownItem").at(1).simulate("click");
        setup.update();

        expect(setup.find("input.textField__input").at(0).prop("value")).toBe("Option 1");
    });

    it("renders a presentational trigger input when search is disabled", () => {
        setup.setProps({ searchable: false });
        setup.update();

        const triggerInput = setup.find(".dropdown__trigger input.textField__input").at(0);
        expect(triggerInput.prop("readOnly")).toBe(true);
        expect(triggerInput.prop("role")).toBe("presentation");
        expect(setup.find(".dropdown__trigger .textField__wrapper").at(0).hasClass("textField__wrapper_readOnly")).toBe(
            false
        );
    });

    it("renders trigger semantics on trigger input when search is enabled", () => {
        setup.setProps({ searchable: true });
        setup.update();

        const triggerInput = setup.find(".dropdown__trigger input.textField__input").at(0);
        const triggerWrapper = setup.find(".dropdown__trigger .textField__wrapper").at(0);
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

        expect(setup.find("input.textField__input").at(0).prop("value")).toBe("Option 1, Option 2");
        expect(setup.find(".textField__suffix").at(0).text()).toBe("+1...");
    });

    it("calls onSearchChange in debounced mode", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({ searchable: true, onSearchChange });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

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
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "no-match" } } as React.ChangeEvent<HTMLInputElement>);
        setup.update();

        expect(setup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(false);
        expect(setup.find(".dropdownItem").length).toBe(0);
    });

    it("keeps search input editable when external options are cleared after a search", () => {
        setup.setProps({ searchable: true, filterFn: false as const });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "query" } } as React.ChangeEvent<HTMLInputElement>);
        setup.setProps({ options: [] });
        setup.update();

        expect(setup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(false);
    });

    it("allows typing in external search mode when options start empty", () => {
        setup.setProps({ searchable: true, filterFn: false as const, options: [] });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        expect(setup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(false);
    });

    it("marks search input readOnly when there is no original data and no search value", () => {
        const emptySetup = mount(<Dropdown options={[]} searchable label="Label" />);
        emptySetup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        emptySetup.update();

        expect(emptySetup.find(".dropdown__search input.textField__input").prop("readOnly")).toBe(true);
        emptySetup.unmount();
    });

    it("filters internally even when onSearchChange is provided (analytics-safe)", () => {
        jest.useFakeTimers();
        const onSearchChange = jest.fn();
        setup.setProps({ searchable: true, onSearchChange });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

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
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

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
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

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
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

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
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

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

        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();
        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Option 1" } } as React.ChangeEvent<HTMLInputElement>);
        act(() => {
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE_MS);
        });
        setup.update();

        onSearchChange.mockClear();

        setup.find(".dropdownItem").at(0).simulate("click");
        setup.update();

        expect(onSearchChange).toHaveBeenCalledWith("");

        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();
        const searchInput = setup.find(".dropdown__search input.textField__input");
        expect(searchInput.prop("value")).toBe("");
    });

    it("renders loading and empty states", () => {
        setup.setProps({ loading: true, loadingText: "Loading info" });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();
        expect(setup.find(".loader").exists()).toBeTruthy();

        setup.setProps({ loading: false, options: [], emptyText: "No records" });
        setup.update();
        expect(setup.find(".empty").exists()).toBeTruthy();
        expect(setup.find(".dropdown__stateScrollbar").exists()).toBeTruthy();
    });

    it("opens and focuses first option with ArrowDown from trigger", () => {
        setup.setProps({ searchable: false });

        setup.find(".dropdown__trigger .textField__wrapper").simulate("keyDown", { key: "ArrowDown" });
        act(() => undefined);
        setup.update();

        const firstOption = setup.find(".dropdownItem").at(0).getDOMNode() as HTMLButtonElement;
        expect(document.activeElement).toBe(firstOption);
    });

    it("closes on Escape when opened", () => {
        setup.setProps({ searchable: true });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();
        expect(setup.find(".dropdownItem").exists()).toBeTruthy();

        setup.find(".dropdown__search input.textField__input").simulate("keyDown", { key: "Escape" });
        setup.update();

        expect(setup.find(".dropdownItem").exists()).toBeFalsy();
    });

    it("focuses first option on ArrowDown from search input", () => {
        jest.useFakeTimers();
        setup.setProps({ searchable: true });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        setup.find(".dropdown__search input.textField__input").simulate("keyDown", { key: "ArrowDown" });
        act(() => {
            jest.advanceTimersByTime(0);
        });
        setup.update();

        const firstOption = setup.find(".dropdownItem").at(0).getDOMNode() as HTMLButtonElement;
        expect(document.activeElement).toBe(firstOption);
    });
});
