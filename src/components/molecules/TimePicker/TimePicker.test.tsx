import React, { ChangeEvent } from "react";
import { InputMask } from "@react-input/mask";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import { createMaskTrack, INPUT_CHANGE_DEBOUNCE_MS } from "@internal/components/Picker";

// Constants
import {
    EMPTY_TIME_PARTS,
    MASK_SLOT_RULES_12H,
    MASK_SLOT_RULES_24H,
    TIME_PICKER_INPUT_MASK,
    TIME_PICKER_INPUT_MASK_WITH_MERIDIEM
} from "./constants";
// Helpers
import {
    composeTime,
    getNearestAvailableTime,
    isPickerPartDisabled,
    parseTime,
    parseTypedTimeParts,
    resolveLocalization
} from "./helpers";
// Components
import TimePicker, { IRangeTimePickerProps, ISingleTimePickerProps } from "./index";

jest.useFakeTimers();

const changeEvent = (value: string) => ({ target: { value } }) as unknown as ChangeEvent<HTMLInputElement>;

const typeWithoutPause = (setup: ReactWrapper, value: string, index = 0) => {
    act(() => {
        setup.find(InputMask).at(index).prop("onChange")?.(changeEvent(value));
    });
    setup.update();
};

const typeInto = (setup: ReactWrapper, value: string, index = 0) => {
    typeWithoutPause(setup, value, index);

    act(() => {
        jest.advanceTimersByTime(INPUT_CHANGE_DEBOUNCE_MS);
    });
    setup.update();
};

const openPopover = (setup: ReactWrapper, index = 0) => {
    setup.find("input.pickerMaskedInput").at(index).simulate("click");
    setup.update();
};

/**
 * Drives the `onClose` the popover atom would emit, since jsdom has no real outside press or `Escape`.
 */
const closePopover = (setup: ReactWrapper, event: unknown, reason: string) => {
    const { onClose } = setup.find("PickerPopover").props() as { onClose: (e: unknown, r: string) => void };

    act(() => {
        onClose(event, reason);
    });
    setup.update();
};

const columnButtons = (setup: ReactWrapper, columnIndex: number) =>
    setup.find(".timePicker__list").at(columnIndex).find("button");

/**
 * The time strings reported through `onChange`, read from `event.target.value` the way a consumer
 * does.
 */
const changedValues = (onChange: jest.Mock): string[] =>
    onChange.mock.calls.map(([event]: [ChangeEvent<HTMLInputElement>]) => event.target.value);

const lastChangedValue = (onChange: jest.Mock): string | undefined => changedValues(onChange).slice(-1)[0];

/**
 * `defaultValue` is only read when the state is initialized, so tests that need it have to mount
 * a fresh wrapper instead of using `setProps`.
 */
const mountSingle = (props: ISingleTimePickerProps) =>
    mount(<TimePicker {...props} />, { wrappingComponent: GeneUIProvider });
const mountRange = (props: IRangeTimePickerProps) =>
    mount(<TimePicker.Range {...props} />, { wrappingComponent: GeneUIProvider });

describe("TimePicker helpers", () => {
    describe("parseTime", () => {
        it("returns null for incomplete input", () => {
            expect(parseTime("10:3")).toBeNull();
            expect(parseTime("")).toBeNull();
            expect(parseTime(null)).toBeNull();
        });

        it("accepts a single digit hour", () => {
            expect(parseTime("9:30")).toMatchObject({ hours: "09", minutes: "30", seconds: "00" });
        });

        it("converts a 24-hour value to the 12-hour format", () => {
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

        it("converts a 12-hour value to the 24-hour format", () => {
            expect(parseTime("10:30:00 PM", false)).toEqual({
                hours: "22",
                minutes: "30",
                seconds: "00",
                meridiem: undefined
            });
        });

        it("converts noon and midnight to the 24-hour format", () => {
            expect(parseTime("12:15:00 AM", false)).toMatchObject({ hours: "00", minutes: "15" });
            expect(parseTime("12:15:00 PM", false)).toMatchObject({ hours: "12", minutes: "15" });
        });

        it("treats a missing meridiem as incomplete while the user types", () => {
            expect(parseTime("10:30:00", true)).toBeNull();
        });

        it("accepts a single meridiem letter", () => {
            expect(parseTime("10:30:00 P", true)).toMatchObject({ hours: "10", meridiem: "PM" });
            expect(parseTime("10:30:00 a", true)).toMatchObject({ hours: "10", meridiem: "AM" });
        });

        it("keeps an explicit meridiem", () => {
            expect(parseTime("12:00:00 pm", true)).toMatchObject({ hours: "12", meridiem: "PM" });
        });

        it("keeps a valid 12-hour value as it is", () => {
            expect(parseTime("09:30:00 PM", true)).toEqual({
                hours: "09",
                minutes: "30",
                seconds: "00",
                meridiem: "PM"
            });
        });

        it("reads an hour outside 1-12 as a 24-hour time in the 12-hour format, even while the user types", () => {
            expect(parseTime("19:30:00", true)).toEqual({
                hours: "07",
                minutes: "30",
                seconds: "00",
                meridiem: "PM"
            });
            expect(parseTime("00:30:00", true)).toMatchObject({ hours: "12", meridiem: "AM" });
        });

        it("lets a 24-hour hour win over a contradicting meridiem", () => {
            expect(parseTime("19:30:00 AM", true)).toMatchObject({ hours: "07", meridiem: "PM" });
            expect(parseTime("13:00:00 pm", true)).toMatchObject({ hours: "01", meridiem: "PM" });
            expect(parseTime("19:30:00 AM", false)).toMatchObject({ hours: "19", meridiem: undefined });
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

    describe("parseTypedTimeParts", () => {
        it("returns the columns that are typed completely", () => {
            expect(parseTypedTimeParts("0", false)).toEqual({});
            expect(parseTypedTimeParts("09", false)).toEqual({ hours: "09" });
            expect(parseTypedTimeParts("09:3", false)).toEqual({ hours: "09" });
            expect(parseTypedTimeParts("09:30:4", false)).toEqual({ hours: "09", minutes: "30" });
            expect(parseTypedTimeParts("09:30:45", false)).toEqual({ hours: "09", minutes: "30", seconds: "45" });
        });

        it("leaves the meridiem open until it is typed in the 12-hour format", () => {
            expect(parseTypedTimeParts("10:30:00", true)).toEqual({ hours: "10", minutes: "30", seconds: "00" });
            expect(parseTypedTimeParts("10:30:00 p", true)).toMatchObject({ hours: "10", meridiem: "PM" });
        });

        it("derives the meridiem from a 24-hour hour", () => {
            expect(parseTypedTimeParts("19", true)).toEqual({ hours: "07", meridiem: "PM" });
            expect(parseTypedTimeParts("00:3", true)).toEqual({ hours: "12", meridiem: "AM" });
        });

        it("skips empty mask slots", () => {
            expect(parseTypedTimeParts("0_:30:00", false)).toEqual({ minutes: "30", seconds: "00" });
        });

        it("returns the shared empty parts for an empty value", () => {
            expect(parseTypedTimeParts("", false)).toBe(EMPTY_TIME_PARTS);
            expect(parseTypedTimeParts(null, true)).toBe(EMPTY_TIME_PARTS);
        });
    });

    describe("getNearestAvailableTime", () => {
        it("returns the same parts when the time is allowed", () => {
            const parts = { hours: "10", minutes: "30", seconds: "00" };

            expect(getNearestAvailableTime(parts, false)).toBe(parts);
        });

        it("clamps the value to the min bound", () => {
            const nearest = getNearestAvailableTime({ hours: "05", minutes: "00", seconds: "00" }, false, {
                hours: "10",
                minutes: "00",
                seconds: "00"
            });

            expect(nearest).toEqual({ hours: "10", minutes: "00", seconds: "00" });
        });

        it("clamps the value to the max bound", () => {
            const nearest = getNearestAvailableTime({ hours: "18", minutes: "00", seconds: "00" }, false, null, {
                hours: "17",
                minutes: "30",
                seconds: "00"
            });

            expect(nearest).toEqual({ hours: "17", minutes: "30", seconds: "00" });
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

        it("uses the meridiem of the start value for an empty end field", () => {
            const pmStart = { hours: "11", minutes: "00", seconds: "00", meridiem: "PM" as const };

            expect(isPickerPartDisabled("hours", "11", {}, true, "end", pmStart)).toBe(false);
            expect(isPickerPartDisabled("hours", "10", {}, true, "end", pmStart)).toBe(true);
            expect(isPickerPartDisabled("meridiem", "AM", {}, true, "end", pmStart)).toBe(true);
        });
    });

    describe("resolveLocalization", () => {
        it("falls back to the defaults for missing entries", () => {
            expect(resolveLocalization({ hours: "ժամ" })).toMatchObject({ hours: "ժամ", minutes: "minutes" });
        });
    });

    describe("createMaskTrack", () => {
        const track24 = createMaskTrack(TIME_PICKER_INPUT_MASK, MASK_SLOT_RULES_24H);
        const track12 = createMaskTrack(TIME_PICKER_INPUT_MASK_WITH_MERIDIEM, MASK_SLOT_RULES_12H);
        const insert = (data: string, value: string, selectionStart = value.length) =>
            ({ inputType: "insert", data, value, selectionStart, selectionEnd: selectionStart }) as const;

        it("uses underscores as the visible placeholder", () => {
            expect(TIME_PICKER_INPUT_MASK).toBe("__:__:__");
            expect(TIME_PICKER_INPUT_MASK_WITH_MERIDIEM).toBe("__:__:__ __");
        });

        it("rejects characters that do not fit the slot they land in", () => {
            expect(track24(insert("9", ""))).toBe(false);
            expect(track24(insert("7", "1"))).toBe("7");
            expect(track24(insert("6", "17:"))).toBe(false);
            expect(track12(insert("3", "10:30:00 "))).toBe(false);
            expect(track12(insert("p", "10:30:00 "))).toBe("p");
            expect(track12(insert("M", "10:30:00 P"))).toBe("M");
        });

        it("accepts 24-hour hours in the 12-hour format", () => {
            expect(track12(insert("2", ""))).toBe("2");
            expect(track12(insert("9", "1"))).toBe("9");
            expect(track12(insert("3", ""))).toBe(false);
        });

        it("keeps the fitting characters of a pasted value in slot order", () => {
            expect(track24(insert("17:30:45", ""))).toBe("173045");
            expect(track24(insert("30", "1_:", 3))).toBe("30");
        });

        it("leaves deletions untouched", () => {
            expect(
                track24({ inputType: "deleteBackward", data: null, value: "17:30", selectionStart: 4, selectionEnd: 5 })
            ).toBeUndefined();
        });
    });
});

describe("TimePicker", () => {
    let setup: ReactWrapper<ISingleTimePickerProps>;

    beforeEach(() => {
        setup = mount(<TimePicker />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

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

        expect(setup.find("input.pickerMaskedInput").prop("placeholder")).toBe("HH:MM:SS");
    });

    it.each(["small", "medium", "large"] as const)("should have %s size", (size) => {
        setup.setProps({ size });

        expect(setup.find(".pickerShell").hasClass(`pickerShell_size_${size}`)).toBeTruthy();
    });

    it("ties the label to the input with a generated unique id", () => {
        const twoPickers = mount(
            <div>
                <TimePicker label="first" />
                <TimePicker label="second" />
            </div>
        );

        const inputs = twoPickers.find("input.pickerMaskedInput");
        const firstId = inputs.at(0).prop("id");
        const secondId = inputs.at(1).prop("id");

        expect(firstId).toBeTruthy();
        expect(firstId).not.toBe(secondId);
        expect(twoPickers.find("label").at(0).prop("htmlFor")).toBe(firstId);

        twoPickers.unmount();
    });

    it("renders id prop correctly", () => {
        setup.setProps({ id: "custom-id" });

        expect(setup.find("input.pickerMaskedInput").prop("id")).toBe("custom-id");
    });

    it("exposes the combobox accessibility contract on the input", () => {
        setup.setProps({ required: true, status: "error", helperText: "Invalid" });

        const input = setup.find("input.pickerMaskedInput");

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

        const describedBy = setup.find("input.pickerMaskedInput").prop("aria-describedby");

        expect(setup.find(`#${describedBy}`).exists()).toBeTruthy();
    });

    describe("interaction states", () => {
        it("handles disabled state", () => {
            setup.setProps({ disabled: true });

            expect(setup.find(".pickerShell").hasClass("pickerShell_disabled")).toBeTruthy();
            expect(setup.find("input.pickerMaskedInput").prop("disabled")).toBe(true);
        });

        it("handles readOnly state", () => {
            setup.setProps({ readOnly: true });

            expect(setup.find(".pickerShell").hasClass("pickerShell_readOnly")).toBeTruthy();
            expect(setup.find("input.pickerMaskedInput").prop("readOnly")).toBe(true);
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

            expect(setup.find(".pickerShell").hasClass("pickerShell_status_error")).toBeTruthy();
            expect(setup.find("HelperText").prop("status")).toBe("error");
            expect(setup.find(".pickerShell__helperText").first().text()).toBe("Invalid time format");
        });

        it("does not render an error state for a helperText alone", () => {
            setup.setProps({ helperText: "Business hours only" });

            expect(setup.find(".pickerShell").hasClass("pickerShell_status_error")).toBeFalsy();
            expect(setup.find("HelperText").prop("status")).toBe("rest");
        });
    });

    describe("popover", () => {
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

        it("does not open the popover on focus and closes it on blur", () => {
            const onOpenChange = jest.fn();
            setup.setProps({ onOpenChange });

            setup.find("input.pickerMaskedInput").simulate("focus");
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(onOpenChange).not.toHaveBeenCalled();

            openPopover(setup);
            expect(onOpenChange).toHaveBeenLastCalledWith(true);

            setup.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: null });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(onOpenChange).toHaveBeenLastCalledWith(false);
            expect(onOpenChange).toHaveBeenCalledTimes(2);
        });

        it("leaves Enter to the form while the popover is closed", () => {
            const preventDefault = jest.fn();

            setup.find("input.pickerMaskedInput").simulate("keydown", { key: "Enter", preventDefault });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(preventDefault).not.toHaveBeenCalled();
        });

        it("closes the open popover on Enter and keeps the focus on the input", () => {
            const preventDefault = jest.fn();

            openPopover(setup);
            setup.find("input.pickerMaskedInput").simulate("keydown", { key: "Enter", preventDefault });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(preventDefault).toHaveBeenCalled();
        });

        it("does not swallow Space", () => {
            const preventDefault = jest.fn();

            setup.find("input.pickerMaskedInput").simulate("keydown", { key: " ", preventDefault });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(preventDefault).not.toHaveBeenCalled();
        });

        it("keeps the focus on the input when a value is pressed with the mouse", () => {
            openPopover(setup);

            const preventDefault = jest.fn();

            columnButtons(setup, 0).at(3).simulate("mousedown", { preventDefault });

            expect(preventDefault).toHaveBeenCalled();
        });

        it("hands the focus back to the input and closes on Tab inside the popover", () => {
            openPopover(setup);

            const focus = jest.spyOn(setup.find("input.pickerMaskedInput").getDOMNode<HTMLInputElement>(), "focus");

            setup.find(".timePicker__wrapper").simulate("keydown", { key: "Tab" });
            setup.update();

            expect(focus).toHaveBeenCalled();
            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
        });

        it("closes the popover when the focus leaves the clear button", () => {
            setup.setProps({ clearable: true, value: "10:00:00" });
            openPopover(setup);

            const clearButton = setup.find(".pickerShell__append button").first();

            setup.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: clearButton.getDOMNode() });
            setup.update();
            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();

            clearButton.simulate("blur", { relatedTarget: null });
            setup.update();
            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
        });

        it("keeps the popover open when the focus moves into it", () => {
            openPopover(setup);

            const target = columnButtons(setup, 0).at(3).getDOMNode();

            setup.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: target });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        });

        it("closes the popover when the focus leaves it", () => {
            openPopover(setup);

            setup.find(".timePicker__wrapper").simulate("blur", { relatedTarget: null });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
        });

        it("opens the popover on click on the field area", () => {
            setup.find(".pickerShell__append").simulate("click");
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        });

        it("keeps the focus in the input on presses around the inputs, but not on the controls", () => {
            const clearable = mountSingle({ clearable: true, defaultValue: "10:00:00" });
            const pressed = (selector: string) => {
                const preventDefault = jest.fn();

                clearable.find(selector).hostNodes().first().simulate("mousedown", { preventDefault });

                return preventDefault.mock.calls.length;
            };

            expect(pressed(".pickerShell")).toBe(1);
            expect(pressed(".pickerShell__append")).toBe(1);
            expect(pressed(".pickerShell__icon")).toBe(1);
            expect(pressed("input.pickerMaskedInput")).toBe(0);
            expect(pressed(".pickerShell__append button")).toBe(0);

            clearable.unmount();
        });

        it("does not treat a click on the clear button as a click on the field", () => {
            const clearable = mountSingle({ clearable: true, defaultValue: "10:00:00" });

            clearable.find(".pickerShell__append button").first().simulate("click");
            clearable.update();

            expect(clearable.find(".timePicker__wrapper").exists()).toBeFalsy();

            clearable.unmount();
        });

        it("keeps an open popover open on click on the field area", () => {
            openPopover(setup);
            setup.find(".pickerShell__append").simulate("click");
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        });

        it("toggles the popover from the clock icon", () => {
            const onOpenChange = jest.fn();
            setup.setProps({ onOpenChange });

            setup.find(".pickerShell__icon").hostNodes().simulate("click");
            setup.update();
            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();

            setup.find(".pickerShell__icon").hostNodes().simulate("click");
            setup.update();
            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
        });

        it("keeps the typed text when the focus moves into the popover with the keyboard", () => {
            const onBlur = jest.fn();
            const onChange = jest.fn();
            setup.setProps({ onBlur, onChange });

            openPopover(setup);
            typeInto(setup, "09");

            setup
                .find("input.pickerMaskedInput")
                .simulate("blur", { relatedTarget: columnButtons(setup, 0).at(9).getDOMNode() });
            setup.update();

            expect(onBlur).not.toHaveBeenCalled();
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("09");
            expect(columnButtons(setup, 0).at(9).prop("aria-selected")).toBe(true);

            columnButtons(setup, 1).at(30).simulate("click");
            setup.update();

            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("09:30:00");
            expect(lastChangedValue(onChange)).toBe("09:30:00");
        });

        it("leaves the field when the focus goes from the popover to the outside", () => {
            const onBlur = jest.fn();
            const onChange = jest.fn();
            setup.setProps({ onBlur, onChange });

            openPopover(setup);
            typeInto(setup, "09:3");
            setup
                .find("input.pickerMaskedInput")
                .simulate("blur", { relatedTarget: columnButtons(setup, 0).at(9).getDOMNode() });
            setup.update();

            setup.find(".timePicker__wrapper").simulate("blur", { relatedTarget: null });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();
            expect(lastChangedValue(onChange)).toBe("");
            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("");
        });

        it("hands the focus back to the input when an outside press closes the popover while the focus is inside", () => {
            const container = document.body.appendChild(document.createElement("div"));
            const onBlur = jest.fn();
            const onChange = jest.fn();
            const attached = mount(<TimePicker onBlur={onBlur} onChange={onChange} />, {
                wrappingComponent: GeneUIProvider,
                attachTo: container
            });
            const input = () => attached.find("input.pickerMaskedInput");

            openPopover(attached);
            typeInto(attached, "09:3");

            const item = columnButtons(attached, 0).at(9).getDOMNode<HTMLButtonElement>();

            input().simulate("blur", { relatedTarget: item });
            item.focus();
            expect(document.activeElement).toBe(item);

            closePopover(attached, new MouseEvent("mousedown"), "outside-press");

            expect(document.activeElement).toBe(input().getDOMNode());
            expect(onBlur).not.toHaveBeenCalled();
            expect(input().prop("value")).toBe("09:3");

            input().simulate("blur", { relatedTarget: null });
            attached.update();

            expect(lastChangedValue(onChange)).toBe("");
            expect(onBlur).toHaveBeenCalledTimes(1);

            attached.detach();
            container.remove();
        });

        it("does not leave the field when the focus moves to the clear button", () => {
            const onBlur = jest.fn();
            const clearable = mountSingle({ clearable: true, defaultValue: "10:00:00", onBlur });

            typeInto(clearable, "10:3");
            clearable.find("input.pickerMaskedInput").simulate("blur", {
                relatedTarget: clearable.find(".pickerShell__append button").first().getDOMNode()
            });
            clearable.update();

            expect(onBlur).not.toHaveBeenCalled();
            expect(clearable.find("input.pickerMaskedInput").prop("value")).toBe("10:3");

            clearable.find(".pickerShell__append button").first().simulate("blur", { relatedTarget: null });
            clearable.update();

            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(clearable.find("input.pickerMaskedInput").prop("value")).toBe("10:00:00");

            clearable.unmount();
        });

        it("reports onBlur after the committed value", () => {
            const calls: string[] = [];
            setup.setProps({
                onChange: (event: ChangeEvent<HTMLInputElement>) => calls.push(`change:${event.target.value}`),
                onBlur: (time: string) => calls.push(`blur:${time}`)
            });

            typeWithoutPause(setup, "09:30");
            setup.find("input.pickerMaskedInput").simulate("blur");

            expect(calls).toEqual(["change:09:30", "change:09:30:00", "blur:09:30:00"]);
        });

        it("sets the numeric input mode only in the 24-hour format", () => {
            expect(setup.find("input.pickerMaskedInput").prop("inputMode")).toBe("numeric");

            setup.setProps({ format: "12h" });
            expect(setup.find("input.pickerMaskedInput").prop("inputMode")).toBeUndefined();
        });

        it("opens the popover again with ArrowDown after closing with Escape", () => {
            openPopover(setup);

            closePopover(setup, new KeyboardEvent("keydown"), "escape-key");
            expect(setup.find(".timePicker__wrapper").exists()).toBeFalsy();

            setup.find("input.pickerMaskedInput").simulate("keydown", { key: "ArrowDown" });
            setup.update();
            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        });

        it("moves the focus into the open popover on arrow down", () => {
            setup.find("input.pickerMaskedInput").simulate("focus");
            setup.update();
            expect(setup.find("TimePickerPopover").prop("focusOnOpen")).toBe(false);

            setup.find("input.pickerMaskedInput").simulate("keydown", { key: "ArrowDown" });
            setup.update();
            expect(setup.find("TimePickerPopover").prop("focusOnOpen")).toBe(true);

            setup.find("input.pickerMaskedInput").simulate("focus");
            setup.update();
            expect(setup.find("TimePickerPopover").prop("focusOnOpen")).toBe(false);
        });

        it("hides the column scrollbars after opening on a value and shows them when the user scrolls", () => {
            setup.setProps({ value: "17:30:45" });
            openPopover(setup);

            act(() => {
                jest.runAllTicks();
            });
            setup.update();
            expect(setup.find(".timePicker__wrapper").hasClass("timePicker__wrapper_scrollbarsHidden")).toBeTruthy();

            setup.find(".timePicker__wrapper").simulate("wheel");
            expect(setup.find(".timePicker__wrapper").hasClass("timePicker__wrapper_scrollbarsHidden")).toBeFalsy();
        });

        it("shows the column scrollbars when the user navigates a column with the keyboard", () => {
            setup.setProps({ value: "17:30:45" });
            openPopover(setup);
            act(() => {
                jest.runAllTicks();
            });
            setup.update();
            expect(setup.find(".timePicker__wrapper").hasClass("timePicker__wrapper_scrollbarsHidden")).toBeTruthy();

            setup.find('[role="listbox"]').first().simulate("keydown", { key: "ArrowDown" });
            expect(setup.find(".timePicker__wrapper").hasClass("timePicker__wrapper_scrollbarsHidden")).toBeFalsy();
        });

        it("scrolls a column to the value typed into it while the popover is open", () => {
            openPopover(setup);
            act(() => {
                jest.runAllTicks();
            });
            setup.find(".timePicker__wrapper").simulate("wheel");
            expect(setup.find(".timePicker__wrapper").hasClass("timePicker__wrapper_scrollbarsHidden")).toBeFalsy();

            typeInto(setup, "0");
            expect(setup.find(".timePicker__wrapper").hasClass("timePicker__wrapper_scrollbarsHidden")).toBeFalsy();

            typeInto(setup, "09");
            expect(setup.find(".timePicker__wrapper").hasClass("timePicker__wrapper_scrollbarsHidden")).toBeTruthy();
        });

        it("opens with the keyboard", () => {
            setup.find("input.pickerMaskedInput").simulate("keydown", { key: "ArrowDown" });
            setup.update();

            expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        });

        it("does not build the columns while closed", () => {
            expect(setup.find(".timePicker__pickerButton").length).toBe(0);
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

        it("applies custom localization to the headers and keeps the AM/PM texts fixed", () => {
            setup.setProps({
                format: "12h",
                localization: { hours: "H", minutes: "M", seconds: "S" }
            });
            openPopover(setup);

            const headers = setup.find(".timePicker__header");

            expect(headers.at(0).text()).toBe("H");
            expect(headers.at(1).text()).toBe("M");
            expect(headers.at(2).text()).toBe("S");

            const meridiemButtons = setup.find(".timePicker__column_meridiem button");

            expect(meridiemButtons.at(0).text()).toBe("AM");
            expect(meridiemButtons.at(1).text()).toBe("PM");
        });
    });

    describe("value handling", () => {
        it("selects a value from the popover and reports it", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            openPopover(setup);
            columnButtons(setup, 0).at(5).simulate("click");

            expect(changedValues(onChange)).toEqual(["05:00:00"]);
        });

        it("does not call onChange when the same value is selected again", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            openPopover(setup);
            columnButtons(setup, 0).at(5).simulate("click");
            columnButtons(setup, 0).at(5).simulate("click");

            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("applies a selection on top of the text typed while the popover is open", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            openPopover(setup);
            typeWithoutPause(setup, "09:30:00");
            columnButtons(setup, 0).at(5).simulate("click");
            setup.update();

            expect(changedValues(onChange)).toEqual(["09:30:00", "05:30:00"]);
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("05:30:00");
        });

        it("reports a pick that equals the controlled value when it lands on a typed draft", () => {
            const onChange = jest.fn();
            const picker = mountSingle({ value: "10:00:00", onChange });

            openPopover(picker);
            typeWithoutPause(picker, "11:00:00");
            columnButtons(picker, 0).at(10).simulate("click");

            expect(changedValues(onChange)).toEqual(["11:00:00", "10:00:00"]);

            picker.unmount();
        });

        it("calls onFocus and onKeyDown with the event only", () => {
            const onFocus = jest.fn();
            const onKeyDown = jest.fn();
            const picker = mountSingle({ onFocus, onKeyDown });

            picker.find("input.pickerMaskedInput").simulate("focus");
            picker.find("input.pickerMaskedInput").simulate("keydown", { key: "1" });

            expect(onFocus).toHaveBeenCalledTimes(1);
            expect(onFocus.mock.calls[0]).toHaveLength(1);
            expect(onKeyDown).toHaveBeenCalledTimes(1);
            expect(onKeyDown.mock.calls[0]).toHaveLength(1);

            picker.unmount();
        });

        it("reports the input's own change event for typed text", () => {
            const onChange = jest.fn();
            const picker = mountSingle({ name: "time", onChange });

            typeInto(picker, "09:30:00");

            const [event] = onChange.mock.calls[0] as [ChangeEvent<HTMLInputElement>];

            expect(event.target.value).toBe("09:30:00");

            picker.unmount();
        });

        it("reports a pick, a clear and the blur commit as change events carrying the input and the time", () => {
            const onChange = jest.fn();
            const picker = mountSingle({ name: "time", clearable: true, onChange });

            openPopover(picker);
            columnButtons(picker, 0).at(5).simulate("click");

            const [pick] = onChange.mock.calls[0] as [ChangeEvent<HTMLInputElement>];

            expect(pick.type).toBe("click");
            expect(pick.target).toMatchObject({ name: "time", value: "05:00:00" });
            expect(pick.target.id).toBe(picker.find("input.pickerMaskedInput").prop("id"));
            expect(typeof pick.preventDefault).toBe("function");

            typeWithoutPause(picker, "09:30");
            picker.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: null });

            const [commit] = onChange.mock.calls[2] as [ChangeEvent<HTMLInputElement>];

            expect(commit.type).toBe("blur");
            expect(commit.target).toMatchObject({ name: "time", value: "09:30:00" });

            picker.find(".pickerShell__append button").first().simulate("click");

            const [clear] = onChange.mock.calls[3] as [ChangeEvent<HTMLInputElement>];

            expect(clear.type).toBe("click");
            expect(clear.target).toMatchObject({ name: "time", value: "" });

            picker.unmount();
        });

        it("applies a selection on top of a 24-hour time typed in the 12-hour format", () => {
            const picker = mountSingle({ format: "12h" });

            openPopover(picker);
            typeInto(picker, "22:22:22");
            picker.find(".timePicker__column_meridiem button").at(0).simulate("click");
            picker.update();

            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("10:22:22 AM");

            picker.unmount();
        });

        it("drops the typed text when the field is cleared", () => {
            const onChange = jest.fn();
            const clearable = mountSingle({ clearable: true, onChange });

            typeWithoutPause(clearable, "09:30:00");
            clearable.find(".pickerShell__append button").first().simulate("click");
            clearable.update();

            expect(lastChangedValue(onChange)).toBe("");
            expect(clearable.find("input.pickerMaskedInput").prop("value")).toBe("");

            clearable.unmount();
        });

        it("highlights the typed columns in the popover as they are completed", () => {
            const picker = mountSingle({ format: "12h" });
            const selectedIn = (column: number): string[] =>
                columnButtons(picker, column)
                    .filterWhere((button) => button.prop("aria-selected") === true)
                    .map((button) => button.text());
            const selectedMeridiems = (): string[] =>
                picker
                    .find(".timePicker__column_meridiem button")
                    .filterWhere((button) => button.prop("aria-selected") === true)
                    .map((button) => button.text());

            openPopover(picker);

            typeInto(picker, "1");
            expect(selectedIn(0)).toEqual([]);

            typeInto(picker, "10:3");
            expect(selectedIn(0)).toEqual(["10"]);
            expect(selectedIn(1)).toEqual([]);

            typeInto(picker, "10:30:00");
            expect(selectedIn(1)).toEqual(["30"]);
            expect(selectedIn(2)).toEqual(["00"]);
            expect(selectedMeridiems()).toEqual([]);

            typeInto(picker, "10:30:00 P");
            expect(selectedMeridiems()).toEqual(["PM"]);

            picker.unmount();
        });

        it("builds a selection on top of the typed columns", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            openPopover(setup);
            typeInto(setup, "09");
            columnButtons(setup, 1).at(30).simulate("click");
            setup.update();

            expect(lastChangedValue(onChange)).toBe("09:30:00");
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("09:30:00");
        });

        it("reports typed text through onChange after a pause", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeWithoutPause(setup, "1");
            typeWithoutPause(setup, "10");
            typeWithoutPause(setup, "10:");

            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("10:");
            expect(onChange).not.toHaveBeenCalled();

            act(() => {
                jest.advanceTimersByTime(INPUT_CHANGE_DEBOUNCE_MS);
            });

            expect(changedValues(onChange)).toEqual(["10:"]);
        });

        it("reports pending typed text at once when the field is left", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeWithoutPause(setup, "09:30:00");
            expect(onChange).not.toHaveBeenCalled();

            setup.find("input.pickerMaskedInput").simulate("blur");

            expect(changedValues(onChange)).toEqual(["09:30:00"]);
        });

        it("keeps the typed text visible in a controlled component while onChange is pending", () => {
            const onChange = jest.fn();
            setup.setProps({ value: "10:00:00", onChange });

            typeWithoutPause(setup, "10:3");

            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("10:3");
            expect(onChange).not.toHaveBeenCalled();
        });

        it("does not call onChange when the typed text is unchanged", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeInto(setup, "10:3");
            typeInto(setup, "10:3");

            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("reports incomplete input as typed", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeInto(setup, "10:3");

            expect(changedValues(onChange)).toEqual(["10:3"]);
        });

        it("keeps the typed text verbatim while editing and normalizes it on blur", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeInto(setup, "9:30");

            expect(lastChangedValue(onChange)).toBe("9:30");
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("9:30");

            setup.find("input.pickerMaskedInput").simulate("blur");
            setup.update();

            expect(lastChangedValue(onChange)).toBe("09:30:00");
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("09:30:00");
        });

        it("shows the value of a disabled field as a placeholder so it cannot be selected", () => {
            const picker = mountSingle({ disabled: true, defaultValue: "12:30:00" });
            const input = picker.find("input.pickerMaskedInput");

            expect(input.prop("value")).toBe("");
            expect(input.prop("placeholder")).toBe("12:30:00");

            picker.unmount();
        });

        it("applies the disabled state when disabled and readOnly are both set", () => {
            const picker = mountSingle({ disabled: true, readOnly: true });

            expect(picker.find(".pickerShell").hasClass("pickerShell_disabled")).toBeTruthy();
            expect(picker.find(".pickerShell").hasClass("pickerShell_readOnly")).toBeFalsy();
            expect(picker.find("input.pickerMaskedInput").prop("disabled")).toBe(true);
            expect(picker.find("input.pickerMaskedInput").prop("readOnly")).toBe(false);

            picker.unmount();
        });

        describe("12-hour meridiem editing", () => {
            it("does not put the meridiem back while it is being deleted", () => {
                const picker = mountSingle({ format: "12h", defaultValue: "10:30:00 AM" });
                const inputValue = () => picker.find("input.pickerMaskedInput").prop("value");

                expect(inputValue()).toBe("10:30:00 AM");

                typeInto(picker, "10:30:00 A");
                expect(inputValue()).toBe("10:30:00 A");

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

                expect(lastChangedValue(onChange)).toBe("10:30:00 P");

                picker.find("input.pickerMaskedInput").simulate("blur");
                picker.update();

                expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("10:30:00 PM");

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

        describe("24-hour input in the 12-hour format", () => {
            it("keeps the typed 24-hour text while editing and converts it on blur", () => {
                const onChange = jest.fn();
                const picker = mountSingle({ format: "12h", onChange });

                typeInto(picker, "19:30:00");

                expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("19:30:00");
                expect(lastChangedValue(onChange)).toBe("19:30:00");

                picker.find("input.pickerMaskedInput").simulate("blur");
                picker.update();

                expect(lastChangedValue(onChange)).toBe("07:30:00 PM");
                expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("07:30:00 PM");

                picker.unmount();
            });

            it("lets the hour win over a contradicting meridiem", () => {
                const picker = mountSingle({ format: "12h" });

                typeInto(picker, "19:30:00 AM");
                picker.find("input.pickerMaskedInput").simulate("blur");
                picker.update();

                expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("07:30:00 PM");

                picker.unmount();
            });

            it("keeps a valid 12-hour value as typed", () => {
                const onChange = jest.fn();
                const picker = mountSingle({ format: "12h", onChange });

                typeInto(picker, "09:30:00 PM");
                picker.find("input.pickerMaskedInput").simulate("blur");
                picker.update();

                expect(changedValues(onChange)).toEqual(["09:30:00 PM"]);
                expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("09:30:00 PM");

                picker.unmount();
            });

            it("highlights the converted time in the popover while the 24-hour text is still shown", () => {
                const picker = mountSingle({ format: "12h" });

                typeInto(picker, "19:30:00");
                openPopover(picker);

                expect(columnButtons(picker, 0).at(6).prop("aria-selected")).toBe(true);
                expect(picker.find(".timePicker__column_meridiem button").at(1).prop("aria-selected")).toBe(true);

                picker.unmount();
            });
        });

        it("restores the last complete value on blur", () => {
            const onChange = jest.fn();
            const uncontrolled = mountSingle({ defaultValue: "08:15:00", onChange });

            typeInto(uncontrolled, "10:3");
            expect(uncontrolled.find("input.pickerMaskedInput").prop("value")).toBe("10:3");

            uncontrolled.find("input.pickerMaskedInput").simulate("blur");
            uncontrolled.update();

            expect(lastChangedValue(onChange)).toBe("08:15:00");
            expect(uncontrolled.find("input.pickerMaskedInput").prop("value")).toBe("08:15:00");

            uncontrolled.unmount();
        });

        it("empties the field on blur when there is no complete value to restore", () => {
            const onChange = jest.fn();
            setup.setProps({ onChange });

            typeInto(setup, "10:3");
            setup.find("input.pickerMaskedInput").simulate("blur");
            setup.update();

            expect(lastChangedValue(onChange)).toBe("");
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("");
        });

        it("renders defaultValue prop correctly", () => {
            const uncontrolled = mountSingle({ defaultValue: "08:15:00" });

            expect(uncontrolled.find("input.pickerMaskedInput").prop("value")).toBe("08:15:00");

            uncontrolled.unmount();
        });

        it("renders controlled value prop correctly and stays controlled", () => {
            setup.setProps({ value: "10:24:30" });
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("10:24:30");

            typeInto(setup, "11:11:11");
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("11:11:11");

            setup.find("input.pickerMaskedInput").simulate("blur");
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("10:24:30");
        });

        it("normalizes a 24-hour controlled value for the 12-hour format", () => {
            setup.setProps({ value: "18:45:00", format: "12h" });

            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("06:45:00 PM");
        });

        it("does not report an untouched controlled value on blur, even when it is displayed normalized", () => {
            const onChange = jest.fn();
            const onBlur = jest.fn();
            const picker = mountSingle({ value: "18:45", onChange, onBlur });

            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("18:45:00");

            picker.find("input.pickerMaskedInput").simulate("focus");
            picker.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: null });

            expect(onChange).not.toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalledWith("18:45", expect.anything());

            picker.setProps({ value: "18:45:00", format: "12h" });
            picker.find("input.pickerMaskedInput").simulate("focus");
            picker.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: null });

            expect(onChange).not.toHaveBeenCalled();
            expect(onBlur).toHaveBeenLastCalledWith("18:45:00", expect.anything());

            picker.unmount();
        });

        it("still commits typed text on blur after an untouched value was left alone", () => {
            const onChange = jest.fn();
            const picker = mountSingle({ value: "18:45", onChange });

            picker.find("input.pickerMaskedInput").simulate("focus");
            picker.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: null });
            typeWithoutPause(picker, "09:3");
            picker.find("input.pickerMaskedInput").simulate("blur", { relatedTarget: null });

            expect(changedValues(onChange)).toEqual(["09:3", "18:45:00"]);

            picker.unmount();
        });

        it("converts the value from 12-hour to 24-hour format", () => {
            const onChange = jest.fn();
            const picker = mountSingle({ format: "12h", defaultValue: "10:30:00 PM", onChange });

            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("10:30:00 PM");

            picker.setProps({ format: "24h" });
            picker.update();

            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("22:30:00");

            picker.find("input.pickerMaskedInput").simulate("focus");
            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("22:30:00");

            picker.find("input.pickerMaskedInput").simulate("blur");
            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("22:30:00");
            expect(onChange).not.toHaveBeenCalled();

            picker.unmount();
        });

        it("converts the value from 24-hour to 12-hour format", () => {
            const picker = mountSingle({ format: "24h", defaultValue: "14:06:05" });

            picker.setProps({ format: "12h" });
            picker.update();

            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("02:06:05 PM");

            picker.find("input.pickerMaskedInput").simulate("focus");
            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("02:06:05 PM");

            picker.unmount();
        });

        it("keeps the normalized value on focus and shows the typed text while editing", () => {
            const picker = mountSingle({ format: "12h", defaultValue: "18:45:00" });

            picker.find("input.pickerMaskedInput").simulate("focus");
            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("06:45:00 PM");

            typeInto(picker, "06:45:00 P");
            expect(picker.find("input.pickerMaskedInput").prop("value")).toBe("06:45:00 P");

            picker.unmount();
        });

        it("clears the selection when the controlled value is reset", () => {
            setup.setProps({ value: "05:00:00" });
            openPopover(setup);
            expect(columnButtons(setup, 0).at(5).prop("aria-selected")).toBe(true);

            setup.setProps({ value: null });

            expect(columnButtons(setup, 0).at(5).prop("aria-selected")).toBe(false);
            expect(setup.find("input.pickerMaskedInput").prop("value")).toBe("");
        });

        it("clears the value and reports it through onClear and onChange", () => {
            const onClear = jest.fn();
            const onChange = jest.fn();
            const clearable = mountSingle({ clearable: true, defaultValue: "12:00:00", onClear, onChange });

            clearable.find(".pickerShell__append button").first().simulate("click");
            clearable.update();

            expect(onClear).toHaveBeenCalled();
            expect(changedValues(onChange)).toEqual([""]);
            expect(clearable.find("input.pickerMaskedInput").prop("value")).toBe("");

            clearable.unmount();
        });
    });
});

describe("Time range picker", () => {
    let setup: ReactWrapper<IRangeTimePickerProps>;

    beforeEach(() => {
        setup = mount(<TimePicker.Range />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders start and end inputs correctly", () => {
        expect(setup.find("input.pickerMaskedInput").length).toBe(2);
    });

    it("gives both inputs an accessible name and unique ids", () => {
        const inputs = setup.find("input.pickerMaskedInput");

        expect(inputs.at(0).prop("aria-label")).toBe("Start time");
        expect(inputs.at(1).prop("aria-label")).toBe("End time");
        expect(inputs.at(0).prop("id")).not.toBe(inputs.at(1).prop("id"));
    });

    it("handles placeholder objects correctly", () => {
        setup.setProps({ placeholder: { start: "Start", end: "End" } });

        const inputs = setup.find("input.pickerMaskedInput");

        expect(inputs.at(0).prop("placeholder")).toBe("Start");
        expect(inputs.at(1).prop("placeholder")).toBe("End");
    });

    it("handles range values correctly", () => {
        setup.setProps({ value: { start: "10:00:00", end: "12:00:00" } });

        const inputs = setup.find("input.pickerMaskedInput");

        expect(inputs.at(0).prop("value")).toBe("10:00:00");
        expect(inputs.at(1).prop("value")).toBe("12:00:00");
    });

    it("switches the active field on click and on focus", () => {
        openPopover(setup, 1);
        expect(setup.find("TimePickerPopover").prop("activeField")).toBe("end");

        setup.find("input.pickerMaskedInput").at(0).simulate("focus");
        setup.update();
        expect(setup.find("TimePickerPopover").prop("activeField")).toBe("start");
    });

    it("keeps the focus on the start field after a click and moves to the end field on Tab", () => {
        const inputs = () => setup.find("input.pickerMaskedInput");

        inputs().at(0).simulate("focus");
        inputs().at(0).simulate("click");
        setup.update();

        expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        expect(setup.find("TimePickerPopover").prop("focusOnOpen")).toBe(false);
        expect(setup.find("TimePickerPopover").prop("activeField")).toBe("start");

        inputs()
            .at(0)
            .simulate("blur", { relatedTarget: inputs().at(1).getDOMNode() });
        inputs().at(1).simulate("focus");
        setup.update();

        expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
        expect(setup.find("TimePickerPopover").prop("activeField")).toBe("end");
    });

    it("opens the popover on click on the separator", () => {
        setup.find(".pickerInput__separator").hostNodes().simulate("click");
        setup.update();

        expect(setup.find(".timePicker__wrapper").exists()).toBeTruthy();
    });

    it("keeps the popover open and switches the active field when the other input is clicked", () => {
        const range = mountRange({ defaultValue: { start: "11:00:00", end: "17:00:00" } });

        openPopover(range, 0);
        expect(range.find("TimePickerPopover").prop("activeField")).toBe("start");

        openPopover(range, 1);
        expect(range.find(".timePicker__wrapper").exists()).toBeTruthy();
        expect(range.find("TimePickerPopover").prop("activeField")).toBe("end");

        range.unmount();
    });

    it("positions the popover on the side of the active field", () => {
        openPopover(setup, 0);
        expect(setup.find("PickerPopover").prop("position")).toBe("bottom-left");

        openPopover(setup, 1);
        expect(setup.find("PickerPopover").prop("position")).toBe("bottom-right");
    });

    it("positions the popover on the opposite side in RTL mode", () => {
        document.dir = "rtl";
        const rtl = mountRange({});

        openPopover(rtl, 0);
        expect(rtl.find("PickerPopover").prop("position")).toBe("bottom-right");

        openPopover(rtl, 1);
        expect(rtl.find("PickerPopover").prop("position")).toBe("bottom-left");

        rtl.unmount();
        document.dir = "";
    });

    it("reports both values when one of them changes", () => {
        const onChange = jest.fn();
        setup.setProps({ onChange });

        typeInto(setup, "10:00:00", 1);

        expect(onChange).toHaveBeenCalledWith(expect.anything(), { start: "", end: "10:00:00" }, "end");
    });

    it("reports the changed input in the change event of a pick", () => {
        const onChange = jest.fn();
        const range = mountRange({ name: "shift", onChange });

        openPopover(range, 1);
        columnButtons(range, 0).at(10).simulate("click");

        const [event, value, field] = onChange.mock.calls[0] as [ChangeEvent<HTMLInputElement>, unknown, string];

        expect(event.target).toMatchObject({ name: "shift-end", value: "10:00:00" });
        expect(value).toEqual({ start: "", end: "10:00:00" });
        expect(field).toBe("end");

        range.unmount();
    });

    it("passes the field to onFocus, onBlur and onKeyDown", () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        const onKeyDown = jest.fn();

        setup.setProps({ onFocus, onBlur, onKeyDown });

        const endInput = setup.find("input.pickerMaskedInput").at(1);

        endInput.simulate("focus");
        endInput.simulate("keydown", { key: "a" });
        endInput.simulate("blur");

        expect(onFocus).toHaveBeenCalledWith(expect.anything(), "end");
        expect(onKeyDown).toHaveBeenCalledWith(expect.anything(), "end");
        expect(onBlur).toHaveBeenCalledWith({ start: "", end: "" }, expect.anything(), "end");
    });

    it("converts both values when the format changes", () => {
        const range = mountRange({ format: "24h", defaultValue: { start: "14:06:05", end: "23:00:00" } });

        range.setProps({ format: "12h" });
        range.update();

        const inputs = range.find("input.pickerMaskedInput");

        expect(inputs.at(0).prop("value")).toBe("02:06:05 PM");
        expect(inputs.at(1).prop("value")).toBe("11:00:00 PM");

        inputs.at(0).simulate("focus");
        expect(range.find("input.pickerMaskedInput").at(0).prop("value")).toBe("02:06:05 PM");

        range.unmount();
    });

    it("keeps the end value after the start value", () => {
        const onChange = jest.fn();
        const bounded = mountRange({ defaultValue: { start: "10:00:00", end: null }, onChange });

        typeInto(bounded, "05:00:00", 1);
        bounded.find("input.pickerMaskedInput").at(1).simulate("blur");

        expect(onChange).toHaveBeenLastCalledWith(expect.anything(), { start: "10:00:00", end: "10:00:00" }, "end");

        bounded.unmount();
    });

    it("clears both fields", () => {
        const onChange = jest.fn();
        const clearable = mountRange({
            clearable: true,
            defaultValue: { start: "10:00:00", end: "12:00:00" },
            onChange
        });

        clearable.find(".pickerShell__append button").first().simulate("click");
        clearable.update();

        const inputs = clearable.find("input.pickerMaskedInput");

        expect(inputs.at(0).prop("value")).toBe("");
        expect(inputs.at(1).prop("value")).toBe("");
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(expect.anything(), { start: "", end: "" }, "start");

        clearable.unmount();
    });

    it("reports the clear once with both fields empty", () => {
        const onChange = jest.fn();
        const clearable = mountRange({ clearable: true, defaultValue: { start: null, end: "12:00:00" }, onChange });

        clearable.find(".pickerShell__append button").first().simulate("click");

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(expect.anything(), { start: "", end: "" }, "start");

        clearable.unmount();
    });

    it("keeps editing the start field while the focus is in the popover and leaves it for the end field", () => {
        const onBlur = jest.fn();
        const onChange = jest.fn();
        setup.setProps({ onBlur, onChange });

        openPopover(setup, 0);
        typeInto(setup, "09", 0);

        const inputs = setup.find("input.pickerMaskedInput");

        inputs.at(0).simulate("blur", { relatedTarget: columnButtons(setup, 0).at(3).getDOMNode() });
        setup.update();
        expect(onBlur).not.toHaveBeenCalled();
        expect(setup.find("input.pickerMaskedInput").at(0).prop("value")).toBe("09");

        setup
            .find("input.pickerMaskedInput")
            .at(0)
            .simulate("blur", { relatedTarget: inputs.at(1).getDOMNode() });
        setup.update();
        expect(onBlur).toHaveBeenCalledWith({ start: "", end: "" }, expect.anything(), "start");
        expect(onChange).toHaveBeenLastCalledWith(expect.anything(), { start: "", end: "" }, "start");
    });
});
