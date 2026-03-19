import React, { FC, useState } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import OTPField, { IOTPFieldProps } from "./index";

const changeEvent = (index: number, value: string) => {
    return {
        target: { value },
        currentTarget: { dataset: { index: String(index) } }
    };
};

const keyDownEvent = (index: number, key: string) => {
    return {
        key,
        preventDefault: jest.fn(),
        currentTarget: { dataset: { index: String(index) } }
    };
};

const ControlledOTPField: FC<{ initial?: string }> = ({ initial = "" }) => {
    const [value, setValue] = useState<string>(initial);
    return <OTPField value={value} onChange={setValue} />;
};

const mountOTPField = (props: IOTPFieldProps = {}): ReactWrapper<IOTPFieldProps> => {
    return mount<IOTPFieldProps>(<OTPField {...props} />);
};

describe("OTPField", () => {
    const defaultProps: IOTPFieldProps = {};
    let setup: ReactWrapper<IOTPFieldProps>;

    beforeEach(() => {
        jest.clearAllMocks();
        setup = mount(<OTPField {...defaultProps} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders 6 input fields", () => {
        expect(setup.find("input")).toHaveLength(6);
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("focuses first input when autoFocus is true", () => {
        const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus").mockImplementation(() => undefined);
        setup.setProps({ autoFocus: true });
        expect(focusSpy).toHaveBeenCalled();
        focusSpy.mockRestore();
    });

    it("supports uncontrolled defaultValue (string) and maps it to inputs", () => {
        const wrapper = mountOTPField({ defaultValue: "1234" });
        const inputs = wrapper.find("input");
        expect(inputs.at(0).prop("value")).toBe("1");
        expect(inputs.at(1).prop("value")).toBe("2");
        expect(inputs.at(2).prop("value")).toBe("3");
        expect(inputs.at(3).prop("value")).toBe("4");
        expect(inputs.at(4).prop("value")).toBe("");
        expect(inputs.at(5).prop("value")).toBe("");
    });

    it("supports uncontrolled defaultValue (number) and maps it to inputs", () => {
        const wrapper = mountOTPField({ defaultValue: 1234 });
        const inputs = wrapper.find("input");
        expect(inputs.at(0).prop("value")).toBe("1");
        expect(inputs.at(1).prop("value")).toBe("2");
        expect(inputs.at(2).prop("value")).toBe("3");
        expect(inputs.at(3).prop("value")).toBe("4");
        expect(inputs.at(4).prop("value")).toBe("");
        expect(inputs.at(5).prop("value")).toBe("");
    });

    it("calls onComplete when all 6 digits are entered", () => {
        const onComplete = jest.fn();
        setup.setProps({ onComplete });
        const inputs = setup.find("input");

        inputs.at(0).simulate("change", changeEvent(0, "1"));
        inputs.at(1).simulate("change", changeEvent(1, "2"));
        inputs.at(2).simulate("change", changeEvent(2, "3"));
        inputs.at(3).simulate("change", changeEvent(3, "4"));
        inputs.at(4).simulate("change", changeEvent(4, "5"));
        inputs.at(5).simulate("change", changeEvent(5, "6"));

        setup.update();
        expect(onComplete).toHaveBeenCalledWith("123456");
    });

    it("calls onChange with normalized digits string", () => {
        const onChange = jest.fn();
        setup.setProps({ onChange });
        setup.find("input").at(0).simulate("change", changeEvent(0, "1"));
        setup.update();
        expect(onChange).toHaveBeenCalledWith("1");
    });

    it("ignores non-digit input", () => {
        setup.find("input").at(0).simulate("change", changeEvent(0, "a"));
        setup.update();
        expect(setup.find("input").at(0).prop("value")).toBe("");
    });

    it("does nothing when disabled (change and keydown)", () => {
        const onChange = jest.fn();
        const wrapper = mountOTPField({ disabled: true, onChange, defaultValue: "123456" });
        wrapper.find("input").at(0).simulate("change", changeEvent(0, "9"));
        wrapper.find("input").at(0).simulate("keydown", keyDownEvent(0, "Backspace"));
        wrapper.update();
        expect(wrapper.find("input").at(0).prop("value")).toBe("1");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("backspace clears the focused digit first, then moves to previous", () => {
        const wrapper = mountOTPField({ defaultValue: "123456" });
        const inputs = wrapper.find("input");

        inputs.at(2).simulate("keydown", keyDownEvent(2, "Backspace"));
        wrapper.update();
        expect(wrapper.find("input").at(2).prop("value")).toBe("");
        expect(wrapper.find("input").at(5).prop("value")).toBe("6");

        wrapper.find("input").at(2).simulate("keydown", keyDownEvent(2, "Backspace"));
        wrapper.update();
        expect(wrapper.find("input").at(1).prop("value")).toBe("");
    });

    it("ArrowLeft and ArrowRight move focus between inputs", () => {
        const inputs = setup.find("input");

        const focus0 = jest.spyOn(HTMLInputElement.prototype, "focus").mockImplementation(() => undefined);

        inputs.at(3).simulate("keydown", keyDownEvent(3, "ArrowLeft"));
        inputs.at(3).simulate("keydown", keyDownEvent(3, "ArrowRight"));

        expect(focus0).toHaveBeenCalled();
        focus0.mockRestore();
    });

    it("does not shift digits when deleting in the middle in controlled mode", () => {
        const wrapper = mount(<ControlledOTPField initial="123456" />);
        const inputs = wrapper.find("input");

        inputs.at(2).simulate("keydown", keyDownEvent(2, "Backspace"));
        wrapper.update();

        const updatedInputs = wrapper.find("input");
        expect(updatedInputs.at(0).prop("value")).toBe("1");
        expect(updatedInputs.at(1).prop("value")).toBe("2");
        expect(updatedInputs.at(2).prop("value")).toBe("");
        expect(updatedInputs.at(3).prop("value")).toBe("4");
        expect(updatedInputs.at(4).prop("value")).toBe("5");
        expect(updatedInputs.at(5).prop("value")).toBe("6");
    });

    it("renders helperText and timer when timerDuration is provided", () => {
        setup.setProps({ helperText: "Code is valid for", timerDuration: 30 });
        expect(setup.text()).toContain("Code is valid for");
        // timer formatted string exists (MM:SS)
        expect(setup.text()).toMatch(/00:30/);
    });

    it("renders notification when status=error and notification is provided", () => {
        setup.setProps({ status: "error", notification: "Invalid" });
        expect(setup.text()).toContain("Invalid");
    });

    it("sets autocomplete on first input only", () => {
        const inputs = setup.find("input");
        expect(inputs.at(0).prop("autoComplete")).toBe("one-time-code");
        expect(inputs.at(1).prop("autoComplete")).toBe("off");
    });

    it("forwards onFocus and onBlur callbacks", () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        setup.setProps({ onFocus, onBlur });
        const input0 = setup.find("input").at(0);
        input0.simulate("focus", { currentTarget: { select: jest.fn() } });
        input0.simulate("blur");
        expect(onFocus).toHaveBeenCalled();
        expect(onBlur).toHaveBeenCalled();
    });

    it("selects input value on focus/click", () => {
        const selectSpy = jest.spyOn(HTMLInputElement.prototype, "select").mockImplementation(() => undefined);
        setup.setProps({ defaultValue: "1" });
        const input0 = setup.find("input").at(0);

        input0.simulate("focus");
        input0.simulate("click");
        expect(selectSpy).toHaveBeenCalled();
        selectSpy.mockRestore();
    });

    it("pastes digits across inputs", () => {
        setup.find(".otpField__textFieldWrapper").simulate("paste", {
            preventDefault: jest.fn(),
            clipboardData: { getData: () => "12-34 56" }
        });

        setup.update();
        const values = setup
            .find("input")
            .map((node) => node.prop("value"))
            .join("");
        expect(values).toBe("123456");
    });

    it("fires onTimerExpire after countdown reaches zero", () => {
        jest.useFakeTimers();
        const onTimerExpire = jest.fn();

        setup.setProps({ timerDuration: 1, onTimerExpire });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        setup.update();
        // The hook calls onExpire when remaining <= 0 on the next effect tick
        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(onTimerExpire).toHaveBeenCalled();
        jest.useRealTimers();
    });
});
