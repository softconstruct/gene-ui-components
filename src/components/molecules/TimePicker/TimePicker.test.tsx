import React, { ChangeEvent } from "react";
import { InputMask } from "@react-input/mask";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Helpers
import {
    composeTime,
    convertPartsToSeconds,
    convertSecondsToParts,
    getNearestAvailableTime,
    isPickerPartDisabled,
    isTimeDisabled,
    parseTime,
    resolveLocalization
} from "./helpers";
// Components
import TimePicker, { IRangeTimePickerProps, ISingleTimePickerProps } from "./index";

const changeEvent = (value: string) => ({ target: { value } }) as unknown as ChangeEvent<HTMLInputElement>;

const typeInto = (setup: ReactWrapper, value: string, index = 0) => {
    act(() => {
        setup.find(InputMask).at(index).prop("onChange")?.(changeEvent(value));
    });
    setup.update();
};

const openPopover = (setup: ReactWrapper, index = 0) => {
    setup.find("input.pickerInput__input").at(index).simulate("click");
    setup.update();
};

const columnButtons = (setup: ReactWrapper, columnIndex: number) =>
    setup.find(".timePicker__list").at(columnIndex).find("button");

/**
 * `defaultValue` is only read when the state is initialized, so tests that need it have to mount
 * a fresh wrapper instead of using `setProps`.
 */
const mountSingle = (props: ISingleTimePickerProps) => mount(<TimePicker {...props} />);
const mountRange = (props: IRangeTimePickerProps) => mount(<TimePicker.Range {...props} />);

describe("TimePicker helpers", () => {
    describe("convertSecondsToParts", () => {
        it("returns seconds within a minute", () => {
            expect(convertSecondsToParts(37801, false)).toEqual({
                hours: "10",
                minutes: "30",
                seconds: "01",
                meridiem: undefined
            });
        });

        it("round trips through convertPartsToSeconds", () => {
            const parts = convertSecondsToParts(45296, false);

            expect(convertPartsToSeconds(parts, false)).toBe(45296);
        });

        it("normalizes values outside of a single day", () => {
            expect(convertSecondsToParts(-1, false)).toEqual({
                hours: "23",
                minutes: "59",
                seconds: "59",
                meridiem: undefined
            });
        });

        it("converts midnight and noon correctly in the 12-hour format", () => {
            expect(convertSecondsToParts(0, true)).toMatchObject({ hours: "12", meridiem: "AM" });
            expect(convertSecondsToParts(12 * 3600, true)).toMatchObject({ hours: "12", meridiem: "PM" });
        });
    });

    describe("parseTime", () => {
        it("returns null for incomplete input", () => {
            expect(parseTime("10:3")).toBeNull();
            expect(parseTime("")).toBeNull();
            expect(parseTime(null)).toBeNull();
        });

        it("accepts a single digit hour", () => {
            expect(parseTime("9:30")).toMatchObject({ hours: "09", minutes: "30", seconds: "00" });
        });

        it("converts a 24-hour value to the 12-hour format instead of truncating it", () => {
            expect(parseTime("18:45:00", true, { allow24HourInput: true })).toEqual({
                hours: "06",
                minutes: "45",
                seconds: "00",
                meridiem: "PM"
            });
        });

        it("maps midnight to 12 AM in the 12-hour format", () => {
            expect(parseTime("00:30:00", true, { allow24HourInput: true })).toEqual({
                hours: "12",
                minutes: "30",
                seconds: "00",
                meridiem: "AM"
            });
        });

        it("treats a missing meridiem as incomplete while the user types", () => {
            // Without this the meridiem could never be deleted: `10:30:00` would be read back as a
            // 24-hour time and completed to `10:30:00 AM` on the next render.
            expect(parseTime("10:30:00", true)).toBeNull();
        });

        it("accepts a single meridiem letter", () => {
            expect(parseTime("10:30:00 P", true)).toMatchObject({ hours: "10", meridiem: "PM" });
            expect(parseTime("10:30:00 a", true)).toMatchObject({ hours: "10", meridiem: "AM" });
        });

        it("keeps an explicit meridiem", () => {
            expect(parseTime("12:00:00 pm", true)).toMatchObject({ hours: "12", meridiem: "PM" });
        });

        it("clamps out of range parts", () => {
            expect(parseTime("29:99:99")).toEqual({
                hours: "23",
                minutes: "59",
                seconds: "59",
                meridiem: undefined
            });
        });

        it("rejects an invalid meridiem", () => {
            expect(parseTime("10:00:00 AA", true)).toBeNull();
        });
    });

    describe("isTimeDisabled", () => {
        const minParts = { hours: "10", minutes: "00", seconds: "00" };

        it("respects the min bound", () => {
            expect(isTimeDisabled({ hours: "05", minutes: "00", seconds: "00" }, false, undefined, minParts)).toBe(
                true
            );
        });

        it("keeps respecting the bounds when shouldDisableTime is provided", () => {
            expect(isTimeDisabled({ hours: "05", minutes: "00", seconds: "00" }, false, () => false, minParts)).toBe(
                true
            );
        });

        it("respects shouldDisableTime", () => {
            const shouldDisableTime = (type: string, value: string) => type === "hours" && value === "05";

            expect(isTimeDisabled({ hours: "05", minutes: "00", seconds: "00" }, false, shouldDisableTime)).toBe(true);
        });
    });

    describe("getNearestAvailableTime", () => {
        it("returns the same parts when the time is allowed", () => {
            const parts = { hours: "10", minutes: "30", seconds: "00" };

            expect(getNearestAvailableTime(parts, false)).toBe(parts);
        });

        it("clamps to the min bound with valid parts", () => {
            const nearest = getNearestAvailableTime({ hours: "05", minutes: "00", seconds: "00" }, false, undefined, {
                hours: "10",
                minutes: "00",
                seconds: "00"
            });

            expect(nearest).toEqual({ hours: "10", minutes: "00", seconds: "00" });
        });

        it("moves to the closest allowed hour", () => {
            const nearest = getNearestAvailableTime(
                { hours: "09", minutes: "30", seconds: "00" },
                false,
                (type, value) => type === "hours" && parseInt(value, 10) < 12
            );

            expect(nearest).toEqual({ hours: "12", minutes: "30", seconds: "00", meridiem: undefined });
        });

        it("returns null when nothing is available", () => {
            expect(
                getNearestAvailableTime({ hours: "09", minutes: "30", seconds: "00" }, false, () => true)
            ).toBeNull();
        });

        it("calls shouldDisableTime a bounded number of times", () => {
            const shouldDisableTime = jest.fn((type: string, value: string) => type === "hours" && value === "09");

            getNearestAvailableTime({ hours: "09", minutes: "30", seconds: "00" }, false, shouldDisableTime);

            expect(shouldDisableTime.mock.calls.length).toBeLessThan(500);
        });
    });

    describe("composeTime", () => {
        it("omits the meridiem in the 24-hour format", () => {
            expect(composeTime({ hours: "10", minutes: "30", seconds: "00", meridiem: "AM" }, false)).toBe("10:30:00");
        });

        it("appends the meridiem in the 12-hour format", () => {
            expect(composeTime({ hours: "10", minutes: "30", seconds: "00", meridiem: "PM" }, true)).toBe(
                "10:30:00 PM"
            );
        });
    });

    describe("isPickerPartDisabled", () => {
        const partsStart = { hours: "10", minutes: "30", seconds: "00" };

        it("disables hours before the start of the range for the end field", () => {
            expect(isPickerPartDisabled("hours", "09", partsStart, false, "end", partsStart)).toBe(true);
            expect(isPickerPartDisabled("hours", "11", partsStart, false, "end", partsStart)).toBe(false);
        });

        it("disables minutes before the start of the range within the same hour", () => {
            const parts = { hours: "10", minutes: "30", seconds: "00" };

            expect(isPickerPartDisabled("minutes", "29", parts, false, "end", partsStart)).toBe(true);
            expect(isPickerPartDisabled("minutes", "31", parts, false, "end", partsStart)).toBe(false);
        });
    });

    describe("resolveLocalization", () => {
        it("falls back to the defaults for missing entries", () => {
            expect(resolveLocalization({ hours: "ժամ" })).toMatchObject({ hours: "ժամ", minutes: "minutes" });
        });
    });
});

describe("TimePicker", () => {
    let setup: ReactWrapper<ISingleTimePickerProps>;

    beforeEach(() => {
        setup = mount(<TimePicker />);
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

    describe("Rendering and basic props", () => {
        it("renders without crashing", () => {
            expect(setup.exists()).toBeTruthy();
        });

        it("renders className prop correctly", () => {
            const className = "test-class";
            setup.setProps({ className });

            expect(setup.find(".timePicker").hasClass(className)).toBeTruthy();
        });

        it("renders label and required indicator correctly", () => {
            setup.setProps({ label: "Select Time", required: true });

            const labelNode = setup.find("Label");

            expect(labelNode.prop("text")).toBe("Select Time");
            expect(labelNode.prop("required")).toBe(true);
        });

        it("renders placeholder prop correctly", () => {
            setup.setProps({ placeholder: "HH:MM:SS" });

            expect(setup.find("input.pickerInput__input").prop("placeholder")).toBe("HH:MM:SS");
        });

        it.each(["small", "medium", "large"] as const)("should have %s size", (size) => {
            setup.setProps({ size });

            expect(setup.find(".pickerInput").hasClass(`pickerInput_size_${size}`)).toBeTruthy();
        });

        it("ties the label to the input with a generated unique id", () => {
            const twoPickers = mount(
                <div>
                    <TimePicker label="first" />
                    <TimePicker label="second" />
                </div>
            );

            const inputs = twoPickers.find("input.pickerInput__input");
            const firstId = inputs.at(0).prop("id");
            const secondId = inputs.at(1).prop("id");

            expect(firstId).toBeTruthy();
            expect(firstId).not.toBe(secondId);
            expect(twoPickers.find("label").at(0).prop("htmlFor")).toBe(firstId);

            twoPickers.unmount();
        });

        it("renders id prop correctly", () => {
            setup.setProps({ id: "custom-id" });

            expect(setup.find("input.pickerInput__input").prop("id")).toBe("custom-id");
        });

        it("exposes the combobox accessibility contract on the input", () => {
            setup.setProps({ required: true, status: "error", helperText: "Invalid" });

            const input = setup.find("input.pickerInput__input");

            expect(input.prop("role")).toBe("combobox");
            expect(input.prop("aria-expanded")).toBe(false);
            expect(input.prop("aria-haspopup")).toBe("dialog");
            expect(input.prop("aria-invalid")).toBe(true);
            expect(input.prop("aria-required")).toBe(true);
            expect(input.prop("aria-controls")).toBe(`${input.prop("id")}-popover`);
            expect(input.prop("aria-describedby")).toBe(`${input.prop("id")}-helper-text`);
        });

        it("points aria-describedby at the rendered helper text", () => {
            setup.setProps({ helperText: "Business hours only" });

            const describedBy = setup.find("input.pickerInput__input").prop("aria-describedby");

            expect(setup.find(`#${describedBy}`).exists()).toBeTruthy();
        });
    });

    describe("Interaction states", () => {
        it("handles disabled state", () => {
            setup.setProps({ disabled: true });

            expect(setup.find(".pickerInput").hasClass("pickerInput_state_disabled")).toBeTruthy();
            expect(setup.find("input.pickerInput__input").prop("disabled")).toBe(true);
        });

        it("handles readOnly state", () => {
            setup.setProps({ readOnly: true });

            expect(setup.find(".pickerInput").hasClass("pickerInput_state_readOnly")).toBeTruthy();
            expect(setup.find("input.pickerInput__input").prop("readOnly")).toBe(true);
        });

        it("does not open the popover when disabled or readOnly", () => {
            setup.setProps({ readOnly: true });
            openPopover(setup);
            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();

            setup.setProps({ readOnly: false, disabled: true });
            openPopover(setup);
            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
        });

        it("does not change the value from the popover when readOnly", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            openPopover(setup);
            setup.setProps({ readOnly: true });

            columnButtons(setup, 0).at(5).simulate("click");

            expect(onChange).not.toHaveBeenCalled();
        });

        it("renders status and helperText correctly", () => {
            setup.setProps({ status: "error", helperText: "Invalid time format" });

            expect(setup.find(".pickerInput").hasClass("pickerInput_state_error")).toBeTruthy();
            expect(setup.find("HelperText").prop("status")).toBe("error");
            expect(setup.find(".pickerInput__errorMessage").first().text()).toBe("Invalid time format");
        });

        it("keeps supporting the deprecated error and errorMessage props", () => {
            setup.setProps({ error: true, errorMessage: "Legacy message" });

            expect(setup.find(".pickerInput").hasClass("pickerInput_state_error")).toBeTruthy();
            expect(setup.find(".pickerInput__errorMessage").first().text()).toBe("Legacy message");
        });

        it("does not render an error state for a helperText alone", () => {
            setup.setProps({ helperText: "Business hours only" });

            expect(setup.find(".pickerInput").hasClass("pickerInput_state_error")).toBeFalsy();
            expect(setup.find("HelperText").prop("status")).toBe("rest");
        });
    });

    describe("Popover", () => {
        it("opens on input click and reports it once", () => {
            const onOpenChange = jest.fn();
            setup.setProps({ onOpenChange });

            openPopover(setup);
            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
            expect(onOpenChange).toHaveBeenCalledTimes(1);
            expect(onOpenChange).toHaveBeenCalledWith(true);

            openPopover(setup);
            expect(onOpenChange).toHaveBeenCalledTimes(1);
        });

        it("closes on outside click and reports it once", () => {
            const onOpenChange = jest.fn();
            setup.setProps({ onOpenChange });

            openPopover(setup);

            act(() => {
                document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(onOpenChange).toHaveBeenCalledTimes(2);
            expect(onOpenChange).toHaveBeenLastCalledWith(false);
        });

        it("opens with the keyboard", () => {
            setup.find("input.pickerInput__input").simulate("keydown", { key: "ArrowDown" });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        });

        it("does not build the columns while closed", () => {
            const shouldDisableTime = jest.fn(() => false);
            setup.setProps({ shouldDisableTime });

            expect(setup.find(".timePicker__pickerButton").length).toBe(0);
            expect(shouldDisableTime).not.toHaveBeenCalled();
        });

        it("renders the AM/PM column only in the 12-hour format", () => {
            openPopover(setup);
            expect(setup.find(".timePicker__column_meridiem").exists()).toBeFalsy();

            setup.setProps({ format: "12h" });
            expect(setup.find(".timePicker__column_meridiem").exists()).toBeTruthy();
        });

        it("exposes listbox semantics with a single tab stop per column", () => {
            setup.setProps({ value: "05:00:00" });
            openPopover(setup);

            const hoursColumn = setup.find(".timePicker__list").at(0);
            const buttons = hoursColumn.find("button");

            expect(hoursColumn.prop("role")).toBe("listbox");
            expect(buttons.at(5).prop("aria-selected")).toBe(true);
            expect(buttons.at(5).prop("tabIndex")).toBe(0);
            expect(buttons.at(6).prop("tabIndex")).toBe(-1);
            expect(buttons.filterWhere((button) => button.prop("tabIndex") === 0).length).toBe(1);
        });

        it("applies custom localization to the headers and the AM/PM buttons", () => {
            setup.setProps({
                format: "12h",
                localization: { hours: "H", minutes: "M", seconds: "S", am: "Day", pm: "Night" }
            });
            openPopover(setup);

            const headers = setup.find(".timePicker__header");

            expect(headers.at(0).text()).toBe("H");
            expect(headers.at(1).text()).toBe("M");
            expect(headers.at(2).text()).toBe("S");

            const meridiemButtons = setup.find(".timePicker__column_meridiem button");

            expect(meridiemButtons.at(0).text()).toBe("Day");
            expect(meridiemButtons.at(1).text()).toBe("Night");
        });

        it("disables specific time values using shouldDisableTime", () => {
            setup.setProps({ shouldDisableTime: (type, value) => type === "hours" && parseInt(value, 10) < 10 });
            openPopover(setup);

            const buttons = columnButtons(setup, 0);

            expect(buttons.at(9).prop("disabled")).toBe(true);
            expect(buttons.at(10).prop("disabled")).toBe(false);
        });
    });

    describe("Value handling", () => {
        it("selects a value from the popover and reports the change context", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            openPopover(setup);
            columnButtons(setup, 0).at(5).simulate("click");

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith("05:00:00", {
                source: "select",
                parts: { hours: "05", minutes: "00", seconds: "00", meridiem: undefined }
            });
        });

        it("does not commit a selection when no allowed time exists", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange, shouldDisableTime: () => true });

            openPopover(setup);
            columnButtons(setup, 0).at(5).simulate("click");

            expect(onChange).not.toHaveBeenCalled();
        });

        it("reports incomplete input with a null parts context", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeInto(setup, "10:3");

            expect(onChange).toHaveBeenCalledWith("10:3", { source: "input", parts: null });
        });

        it("keeps the typed text verbatim while editing and normalizes it on blur", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeInto(setup, "9:30");

            expect(onChange).toHaveBeenLastCalledWith("9:30", {
                source: "input",
                parts: { hours: "09", minutes: "30", seconds: "00", meridiem: undefined }
            });
            expect(setup.find("input.pickerInput__input").prop("value")).toBe("9:30");

            setup.find("input.pickerInput__input").simulate("blur");
            setup.update();

            expect(onChange).toHaveBeenLastCalledWith("09:30:00", {
                source: "input",
                parts: { hours: "09", minutes: "30", seconds: "00", meridiem: undefined }
            });
            expect(setup.find("input.pickerInput__input").prop("value")).toBe("09:30:00");
        });

        it("clamps a disabled typed value on blur", () => {
            const onChange = jest.fn();
            const picker = mountSingle({
                shouldDisableTime: (type, value) => type === "hours" && parseInt(value, 10) < 12,
                onChange
            });

            typeInto(picker, "09:30:00");
            picker.find("input.pickerInput__input").simulate("blur");

            expect(onChange).toHaveBeenLastCalledWith("12:30:00", {
                source: "input",
                parts: { hours: "12", minutes: "30", seconds: "00", meridiem: undefined }
            });

            picker.unmount();
        });

        describe("12-hour meridiem editing", () => {
            it("does not put the meridiem back while it is being deleted", () => {
                const picker = mountSingle({ format: "12h", defaultValue: "10:30:00 AM" });
                const inputValue = () => picker.find("input.pickerInput__input").prop("value");

                expect(inputValue()).toBe("10:30:00 AM");

                typeInto(picker, "10:30:00 A");
                expect(inputValue()).toBe("10:30:00 A");

                // Used to snap straight back to `10:30:00 AM`, so the meridiem could not be
                // deleted and the value looked stuck.
                typeInto(picker, "10:30:00 ");
                expect(inputValue()).toBe("10:30:00 ");

                typeInto(picker, "10:30:0");
                expect(inputValue()).toBe("10:30:0");

                picker.unmount();
            });

            it("switches the meridiem from a single typed letter", () => {
                const onChange = jest.fn();
                const picker = mountSingle({ format: "12h", defaultValue: "10:30:00 AM", onChange });

                typeInto(picker, "10:30:00 P");

                expect(onChange).toHaveBeenLastCalledWith("10:30:00 P", {
                    source: "input",
                    parts: { hours: "10", minutes: "30", seconds: "00", meridiem: "PM" }
                });

                picker.find("input.pickerInput__input").simulate("blur");
                picker.update();

                expect(picker.find("input.pickerInput__input").prop("value")).toBe("10:30:00 PM");

                picker.unmount();
            });

            it("highlights the typed meridiem in the popover", () => {
                const picker = mountSingle({ format: "12h", defaultValue: "10:30:00 AM" });

                typeInto(picker, "10:30:00 P");
                openPopover(picker);

                const meridiemButtons = picker.find(".timePicker__column_meridiem button");

                expect(meridiemButtons.at(0).prop("aria-selected")).toBe(false);
                expect(meridiemButtons.at(1).prop("aria-selected")).toBe(true);

                picker.unmount();
            });
        });

        it("restores the last complete value on blur", () => {
            const onChange = jest.fn();
            const uncontrolled = mountSingle({ defaultValue: "08:15:00", onChange });

            typeInto(uncontrolled, "10:3");
            expect(uncontrolled.find("input.pickerInput__input").prop("value")).toBe("10:3");

            uncontrolled.find("input.pickerInput__input").simulate("blur");
            uncontrolled.update();

            expect(onChange).toHaveBeenLastCalledWith("08:15:00", {
                source: "input",
                parts: { hours: "08", minutes: "15", seconds: "00", meridiem: undefined }
            });
            expect(uncontrolled.find("input.pickerInput__input").prop("value")).toBe("08:15:00");

            uncontrolled.unmount();
        });

        it("empties the field on blur when there is no complete value to restore", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeInto(setup, "10:3");
            setup.find("input.pickerInput__input").simulate("blur");
            setup.update();

            expect(onChange).toHaveBeenLastCalledWith("", { source: "input", parts: null });
            expect(setup.find("input.pickerInput__input").prop("value")).toBe("");
        });

        it("renders defaultValue prop correctly", () => {
            const uncontrolled = mount(<TimePicker defaultValue="08:15:00" />);

            expect(uncontrolled.find("input.pickerInput__input").prop("value")).toBe("08:15:00");

            uncontrolled.unmount();
        });

        it("renders controlled value prop correctly and stays controlled", () => {
            setup.setProps({ value: "10:24:30" });
            expect(setup.find("input.pickerInput__input").prop("value")).toBe("10:24:30");

            typeInto(setup, "11:11:11");
            expect(setup.find("input.pickerInput__input").prop("value")).toBe("10:24:30");
        });

        it("normalizes a 24-hour controlled value for the 12-hour format", () => {
            setup.setProps({ value: "18:45:00", format: "12h" });

            expect(setup.find("input.pickerInput__input").prop("value")).toBe("06:45:00 PM");
        });

        it("clears the selection when the controlled value is reset", () => {
            setup.setProps({ value: "05:00:00" });
            openPopover(setup);
            expect(columnButtons(setup, 0).at(5).prop("aria-selected")).toBe(true);

            setup.setProps({ value: null });

            expect(columnButtons(setup, 0).at(5).prop("aria-selected")).toBe(false);
            expect(setup.find("input.pickerInput__input").prop("value")).toBe("");
        });

        it("clears the value and reports it through onClear and onChange", () => {
            const onClear = jest.fn();
            const onChange = jest.fn();
            const clearable = mountSingle({ clearable: true, defaultValue: "12:00:00", onClear, onChange });

            clearable.find(".pickerInput__append button").first().simulate("click");
            clearable.update();

            expect(onClear).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith("", { source: "clear", parts: null });
            expect(clearable.find("input.pickerInput__input").prop("value")).toBe("");

            clearable.unmount();
        });
    });
});

describe("TimePicker.Range", () => {
    let setup: ReactWrapper<IRangeTimePickerProps>;

    beforeEach(() => {
        setup = mount(<TimePicker.Range />);
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders start and end inputs correctly", () => {
        expect(setup.find("input.pickerInput__input").length).toBe(2);
    });

    it("gives both inputs an accessible name and unique ids", () => {
        const inputs = setup.find("input.pickerInput__input");

        expect(inputs.at(0).prop("aria-label")).toBe("Start time");
        expect(inputs.at(1).prop("aria-label")).toBe("End time");
        expect(inputs.at(0).prop("id")).not.toBe(inputs.at(1).prop("id"));
    });

    it("handles placeholder objects correctly", () => {
        setup.setProps({ placeholder: { start: "Start", end: "End" } });

        const inputs = setup.find("input.pickerInput__input");

        expect(inputs.at(0).prop("placeholder")).toBe("Start");
        expect(inputs.at(1).prop("placeholder")).toBe("End");
    });

    it("handles range values correctly", () => {
        setup.setProps({ value: { start: "10:00:00", end: "12:00:00" } });

        const inputs = setup.find("input.pickerInput__input");

        expect(inputs.at(0).prop("value")).toBe("10:00:00");
        expect(inputs.at(1).prop("value")).toBe("12:00:00");
    });

    it("switches the active field on click and on focus", () => {
        openPopover(setup, 1);
        expect(setup.find("PickerPopover").prop("activeField")).toBe("end");

        setup.find("input.pickerInput__input").at(0).simulate("focus");
        setup.update();
        expect(setup.find("PickerPopover").prop("activeField")).toBe("start");
    });

    it("reports which field changed", () => {
        const onChange = jest.fn();
        setup.setProps({ onChange });

        typeInto(setup, "10:00:00", 1);

        expect(onChange).toHaveBeenCalledWith("10:00:00", {
            field: "end",
            source: "input",
            parts: { hours: "10", minutes: "00", seconds: "00", meridiem: undefined }
        });
    });

    it("keeps the end field after the start one", () => {
        const onChange = jest.fn();
        const bounded = mountRange({ defaultValue: { start: "10:00:00", end: null }, onChange });

        typeInto(bounded, "05:00:00", 1);
        bounded.find("input.pickerInput__input").at(1).simulate("blur");

        expect(onChange).toHaveBeenLastCalledWith("10:00:00", {
            field: "end",
            source: "input",
            parts: { hours: "10", minutes: "00", seconds: "00", meridiem: undefined }
        });

        bounded.unmount();
    });

    it("keeps the range bounds while shouldDisableTime is provided", () => {
        const onChange = jest.fn();
        const bounded = mountRange({
            defaultValue: { start: "10:00:00", end: null },
            shouldDisableTime: () => false,
            onChange
        });

        typeInto(bounded, "05:00:00", 1);
        bounded.find("input.pickerInput__input").at(1).simulate("blur");

        expect(onChange).toHaveBeenLastCalledWith("10:00:00", expect.objectContaining({ field: "end" }));

        bounded.unmount();
    });

    it("clears both fields", () => {
        const onChange = jest.fn();
        const clearable = mountRange({
            clearable: true,
            defaultValue: { start: "10:00:00", end: "12:00:00" },
            onChange
        });

        clearable.find(".pickerInput__append button").first().simulate("click");
        clearable.update();

        const inputs = clearable.find("input.pickerInput__input");

        expect(inputs.at(0).prop("value")).toBe("");
        expect(inputs.at(1).prop("value")).toBe("");
        expect(onChange).toHaveBeenCalledWith("", { field: "start", source: "clear", parts: null });

        clearable.unmount();
    });
});
