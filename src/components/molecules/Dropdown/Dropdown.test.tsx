import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
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

    it("opens in readOnly mode but does not change value", () => {
        setup.setProps({ readOnly: true, value: "option-1" });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        expect(setup.find(".dropdownItem").exists()).toBeTruthy();

        setup.find(".dropdownItem").at(1).simulate("click");
        setup.update();

        expect(setup.find("input.textField__input").at(0).prop("value")).toBe("Option 1");
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
            jest.advanceTimersByTime(200);
        });

        expect(onSearchChange).toHaveBeenCalledWith("Op");
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
            jest.advanceTimersByTime(200);
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
            jest.advanceTimersByTime(200);
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
            jest.advanceTimersByTime(200);
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
            jest.advanceTimersByTime(200);
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
            jest.advanceTimersByTime(200);
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
            jest.advanceTimersByTime(200);
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
    });
});
