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

        setup.find(".dropdown__footer button").at(0).simulate("click");
        setup.update();

        expect(setup.find("input.textField__input").at(0).prop("value")).toBe("");
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
        setup.setProps({ searchable: true, onSearchChange, searchDebounceMs: 300 });
        setup.find(".dropdown__trigger .textField__wrapper").simulate("click");
        setup.update();

        setup
            .find(".dropdown__search input.textField__input")
            .simulate("change", { target: { value: "Op" } } as React.ChangeEvent<HTMLInputElement>);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(onSearchChange).toHaveBeenCalledWith("Op");
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
