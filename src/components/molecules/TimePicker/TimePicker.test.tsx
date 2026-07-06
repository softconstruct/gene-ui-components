import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TimePicker, { ISingleTimePickerProps } from "./index";

describe("TimePicker", () => {
    let setup: ReactWrapper<ISingleTimePickerProps>;

    beforeEach(() => {
        setup = mount(<TimePicker />);
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

    describe("Rendering and Basic Props", () => {
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
            expect(labelNode.exists()).toBeTruthy();
            expect(labelNode.prop("text")).toBe("Select Time");
            expect(labelNode.prop("required")).toBe(true);
        });

        it("renders placeholder correctly", () => {
            setup.setProps({ placeholder: "HH:MM:SS" });
            const input = setup.find("input.pickerInput__input");
            expect(input.prop("placeholder")).toBe("HH:MM:SS");
        });

        it("applies size classes correctly", () => {
            setup.setProps({ size: "large" });
            expect(setup.find(".pickerInput").hasClass("pickerInput_size_large")).toBeTruthy();
        });
    });

    describe("Interaction States", () => {
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

        it("displays error state and error message", () => {
            setup.setProps({ error: true, errorMessage: "Invalid time format" });
            expect(setup.find(".pickerInput").hasClass("pickerInput_state_error")).toBeTruthy();
            expect(setup.find(".pickerInput__errorMessage").first().text()).toBe("Invalid time format");
        });
    });

    describe("Functionality and Events", () => {
        it("toggles popover and fires onPopoverToggle on input click", () => {
            const onPopoverToggleMock = jest.fn();
            setup.setProps({ onPopoverToggle: onPopoverToggleMock });

            setup.find("input.pickerInput__input").simulate("click");
            expect(onPopoverToggleMock).toHaveBeenCalledWith(true);
        });

        it("fires onTimeInputChange when typing in the input", () => {
            const onTimeInputChangeMock = jest.fn();
            setup.setProps({ onTimeInputChange: onTimeInputChangeMock });

            setup.find("input.pickerInput__input").simulate("change", { target: { value: "10:30:00" } });

            expect(onTimeInputChangeMock).toHaveBeenCalled();
            expect(onTimeInputChangeMock.mock.calls[0][0]).toBe("10:30:00");
        });

        it("clears value and fires onClear when clear button is clicked", () => {
            const onClearMock = jest.fn();
            setup.setProps({ clearable: true, value: "12:00:00", onClear: onClearMock });

            setup.update();

            const clearButton = setup.find(".pickerInput__append button").first();
            expect(clearButton.exists()).toBeTruthy();

            clearButton.simulate("click");
            expect(onClearMock).toHaveBeenCalled();
        });
    });

    describe("Corner Cases: 12-Hour Mode and Customizations", () => {
        it("renders AM/PM column when is12Hour is true", () => {
            setup.setProps({ timeFormat: "12h" });

            setup.find("input.pickerInput__input").simulate("click");
            setup.update();

            expect(setup.find(".timePicker__column_meridiem").exists()).toBeTruthy();
        });

        it("applies custom texts to headers and meridiem buttons", () => {
            setup.setProps({
                timeFormat: "12h",
                texts: { hours: "H", minutes: "M", seconds: "S", amText: "Day", pmText: "Night" }
            });
            setup.find("input.pickerInput__input").simulate("click");

            const headers = setup.find(".timePicker__header p");
            expect(headers.at(0).text()).toBe("H");
            expect(headers.at(1).text()).toBe("M");
            expect(headers.at(2).text()).toBe("S");

            const amBtn = setup.find(".timePicker__column_meridiem PickerButton").at(0);
            const pmBtn = setup.find(".timePicker__column_meridiem PickerButton").at(1);

            expect(amBtn.text()).toBe("Day");
            expect(pmBtn.text()).toBe("Night");
        });

        it("disables specific time blocks using shouldDisableTime", () => {
            const shouldDisableTimeMock = (type: string, value: string) => {
                if (type === "hours") return parseInt(value, 10) < 10;
                return false;
            };

            setup.setProps({ shouldDisableTime: shouldDisableTimeMock });
            setup.find("input.pickerInput__input").simulate("click");

            const hourButtons = setup.find(".timePicker__column").at(0).find("PickerButton");

            expect(hourButtons.at(9).prop("disabled")).toBe(true);
            expect(hourButtons.at(10).prop("disabled")).toBe(false);
        });
    });
});

describe("TimePicker.Range", () => {
    let setup: ReactWrapper;

    beforeEach(() => {
        setup = mount(<TimePicker.Range />);
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

    it("renders start and end inputs correctly", () => {
        const inputs = setup.find("input.pickerInput__input");
        expect(inputs.length).toBe(2);
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

    it("switches active popover target depending on clicked input", () => {
        const inputs = setup.find("input.pickerInput__input");

        inputs.at(0).simulate("click");

        inputs.at(1).simulate("click");

        expect(setup.find("PickerPopover").prop("open")).toBe(true);
    });
});
