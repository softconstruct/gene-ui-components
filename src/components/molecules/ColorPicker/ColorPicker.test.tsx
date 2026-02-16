import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { HexColorPicker } from "react-colorful";
import { act } from "react-dom/test-utils";

import { Popover } from "@components/atoms/Popover";
import TextField from "@components/molecules/TextField";

// Components
import ColorPicker, { IColorPickerProps } from "./index";

// Utility to flush asynchronous Floating UI calculations
const flushAsyncUpdates = async () => {
    await act(async () => {
        await new Promise<void>((resolve) => {
            setTimeout(resolve, 0);
        });
    });
};

describe("ColorPicker", () => {
    let setup: ReactWrapper<IColorPickerProps>;
    const mockOnChange = jest.fn();
    let mountedWrappers: ReactWrapper[] = [];

    // Helper to keep track of all wrappers to safely unmount them
    const safeMount = (node: React.ReactElement) => {
        /** @ts-expect-error: Todo check and remove this */
        const wrapper = mount(node);
        mountedWrappers.push(wrapper);
        return wrapper;
    };

    beforeEach(() => {
        mockOnChange.mockClear();
        setup = safeMount(<ColorPicker onChange={mockOnChange} />);
    });

    afterEach(async () => {
        // 1. Wait for pending layout effects (Floating UI) to finish
        await flushAsyncUpdates();

        // 2. Unmount ALL component instances created in the test to prevent leaks
        mountedWrappers.forEach((wrapper) => {
            if (wrapper.exists()) {
                wrapper.unmount();
            }
        });
        mountedWrappers = [];
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.find(".colorPicker").hasClass(className)).toBeTruthy();
    });

    it("opens the popover when the text field receives focus", () => {
        expect(setup.find(Popover).prop("open")).toBeFalsy();

        setup.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        setup.update();

        expect(setup.find(Popover).prop("open")).toBeTruthy();
    });

    it("handles the open prop correctly", () => {
        const wrapper = safeMount(<ColorPicker open />);
        expect(wrapper.find(Popover).prop("open")).toBeTruthy();
    });

    it("updates color when value prop changes", () => {
        setup.setProps({ value: "#ff00ff" });
        setup.update();

        setup.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        setup.update();

        expect(setup.find(HexColorPicker).prop("color")).toBe("#ff00ff");
    });

    it("updates alpha when alphaValue prop changes", () => {
        const wrapper = safeMount(<ColorPicker alphaEnabled alphaValue={50} />);
        wrapper.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        wrapper.update();

        // The third TextField is the Alpha input when alphaEnabled is true
        expect(wrapper.find(TextField).at(2).prop("value")).toBe(50);

        wrapper.setProps({ alphaValue: 80 });
        wrapper.update();

        expect(wrapper.find(TextField).at(2).prop("value")).toBe(80);
    });

    it("passes colorPickerProps to the picker component", () => {
        const colorPickerProps = { className: "custom-picker-class" };
        const wrapper = safeMount(<ColorPicker colorPickerProps={colorPickerProps} />);

        wrapper.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        wrapper.update();

        expect(wrapper.find(HexColorPicker).hasClass("custom-picker-class")).toBeTruthy();
    });

    it("applies selected recent color on click", () => {
        const recentColors = ["#111111", "#222222"];
        const wrapper = safeMount(<ColorPicker recentColors={recentColors} onChange={mockOnChange} />);

        wrapper.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        wrapper.update();

        const recentColorBtn = wrapper.find(".colorPicker__recents__color").first();
        recentColorBtn.simulate("click");

        expect(mockOnChange).toHaveBeenCalledWith("#111111", { r: 17, g: 17, b: 17 }, 100);
    });

    it("handles hex text input changes correctly (alphaEnabled: true)", () => {
        const wrapper = safeMount(<ColorPicker alphaEnabled onChange={mockOnChange} />);
        wrapper.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        wrapper.update();

        // Second text field is the Hex input when alphaEnabled is true
        wrapper.find(TextField).at(1).invoke("onChange")({
            target: { value: "#abcdef" }
        } as React.ChangeEvent<HTMLInputElement>);

        expect(mockOnChange).toHaveBeenCalledWith("#abcdef", { r: 171, g: 205, b: 239 }, 100);
    });

    it("handles alpha input changes correctly", () => {
        const wrapper = safeMount(<ColorPicker alphaEnabled onChange={mockOnChange} />);
        wrapper.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        wrapper.update();

        // Third text field is the Alpha input when alphaEnabled is true
        wrapper.find(TextField).at(2).invoke("onChange")({
            target: { value: "50" }
        } as React.ChangeEvent<HTMLInputElement>);

        expect(mockOnChange).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ a: 0.5 }), 50);
    });

    it("closes popover when clicking outside", () => {
        const map: Record<string, (e: { target: EventTarget }) => void> = {};
        document.addEventListener = jest.fn((event, cb) => {
            map[event] = cb as (e: { target: EventTarget }) => void;
        });

        const wrapper = safeMount(<ColorPicker />);

        // Open Popover
        wrapper.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        wrapper.update();

        expect(wrapper.find(Popover).prop("open")).toBeTruthy();

        // Simulate outside click
        map.mousedown({ target: document.createElement("div") });
        wrapper.update();

        expect(wrapper.find(Popover).prop("open")).toBeFalsy();
    });

    it("does not close popover when clicking inside the container", () => {
        const map: Record<string, (e: { target: EventTarget }) => void> = {};
        document.addEventListener = jest.fn((event, cb) => {
            map[event] = cb as (e: { target: EventTarget }) => void;
        });

        const wrapper = safeMount(<ColorPicker />);

        wrapper.find(TextField).first().invoke("onFocus")({} as React.FocusEvent<HTMLInputElement>);
        wrapper.update();

        // Simulate click inside the component wrapper
        act(() => {
            map.mousedown({ target: wrapper.getDOMNode() });
        });
        wrapper.update();

        // Should still be open
        expect(wrapper.find(Popover).prop("open")).toBeTruthy();
    });
});
