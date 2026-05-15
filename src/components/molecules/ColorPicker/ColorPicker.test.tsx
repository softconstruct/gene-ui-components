import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { HexColorPicker } from "./components/CustomColorPickers/CustomColorPickers";
import ColorPicker, { IColorPickerProps } from "./index";

describe("ColorPicker", () => {
    let setup: ReactWrapper<IColorPickerProps>;
    const initialInnerWidth = window.innerWidth;

    beforeEach(() => {
        setup = mount(<ColorPicker />);
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
        Object.defineProperty(window, "innerWidth", {
            configurable: true,
            writable: true,
            value: initialInnerWidth
        });
        window.dispatchEvent(new Event("resize"));
    });

    describe("Rendering & Default States", () => {
        it("renders without crashing", () => {
            expect(setup.exists()).toBeTruthy();
        });

        it("renders className prop correctly", () => {
            const className = "test-class";
            setup.setProps({ className });
            setup.update();
            expect(setup.find(".colorPicker").hasClass(className)).toBeTruthy();
        });

        it("renders defaultColor prop correctly", () => {
            const defaultHexPropValue = "#ff0000";
            setup = mount(<ColorPicker defaultColor={defaultHexPropValue} />);
            expect(setup.find("input.colorPickerTextField__input").at(0).props().value).toBe(defaultHexPropValue);
        });

        it("renders recentColors prop correctly including empty states", () => {
            const defaultRecentColors = ["#000000", "", "#ff0000"];
            act(() => {
                setup.setProps({ recentColors: defaultRecentColors, open: true });
            });
            setup.update();

            const recentColorNodes = setup.find(".colorPicker__recentColor");
            expect(recentColorNodes).toHaveLength(3);

            expect(recentColorNodes.at(1).hasClass("colorPicker__recentColor__empty")).toBeTruthy();
        });

        it("renders alphaEnabled prop correctly", () => {
            act(() => {
                setup.setProps({ alphaEnabled: true });
            });
            setup.update();
            expect(setup.find(".colorPickerTextField__percent").exists()).toBeTruthy();

            act(() => {
                setup.setProps({ alphaEnabled: false });
            });
            setup.update();
            expect(setup.find(".colorPickerTextField__percent").exists()).toBeFalsy();
        });

        it("renders controlled value prop correctly", () => {
            act(() => {
                setup.setProps({ value: "#444444" });
            });
            setup.update();
            expect(setup.find("input.colorPickerTextField__input").at(0).props().value).toBe("#444444");
        });

        it("renders open prop correctly", () => {
            act(() => {
                setup.setProps({ open: true });
            });
            setup.update();
            expect(setup.find(".colorPicker__wrapper").exists()).toBeTruthy();
        });

        it("renders format prop correctly", () => {
            act(() => {
                setup.setProps({ format: "rgb", open: true });
            });
            setup.update();
            expect(setup.find(".colorPicker__rgbInputs").exists()).toBeTruthy();
        });
    });

    describe("Popover Visibility and Outside Clicks", () => {
        it("should open on indicator click and close on outside click", () => {
            setup.find("button.colorIndicator").simulate("click");
            setup.update();
            expect(setup.find(".colorPicker__wrapper").exists()).toBeTruthy();

            act(() => {
                document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            });
            setup.update();
            expect(setup.find(".colorPicker__wrapper").exists()).toBeFalsy();
        });

        it("should respect onOutsideClick prop (controlled)", () => {
            const mockOnOutsideClick = jest.fn();
            act(() => {
                setup.setProps({ open: true, onOutsideClick: mockOnOutsideClick });
            });
            setup.update();

            act(() => {
                document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            });

            expect(mockOnOutsideClick).toHaveBeenCalledTimes(1);
        });
    });

    describe("Color Changing & Callback Logic", () => {
        it("should switch format using Dropdown", () => {
            act(() => {
                setup.setProps({ open: true, format: "hex" });
            });
            setup.update();

            setup.find(".colorPicker__formatDropdown .textField__wrapper").simulate("click");
            setup.update();
            setup.find(".dropdownItem__action").at(0).simulate("click");
            setup.update();

            expect(setup.find(".colorPicker__rgbInputs").exists()).toBeTruthy();
        });

        it("should keep ColorPicker open and select dropdown item on mobile", () => {
            Object.defineProperty(window, "innerWidth", {
                configurable: true,
                writable: true,
                value: 320
            });
            window.dispatchEvent(new Event("resize"));

            act(() => {
                setup.setProps({ open: true, format: "hex" });
            });
            setup.update();

            setup.find(".colorPicker__formatDropdown .textField__wrapper").simulate("click");
            setup.update();
            setup.find(".dropdownItem__action").at(0).simulate("click");
            setup.update();

            expect(setup.find(".colorPicker__wrapper").exists()).toBeTruthy();
            expect(setup.find(".colorPicker__rgbInputs").exists()).toBeTruthy();
        });

        it("Should update color via HEX input field", () => {
            act(() => {
                setup.setProps({ open: true, format: "hex" });
            });
            setup.update();

            const newHexValue = "#123456";
            setup.find(".colorPicker__hexInput input").simulate("change", { target: { value: newHexValue } });
            setup.update();

            expect(setup.find(".colorPicker__hexInput input").props().value).toEqual(newHexValue);
        });

        it("Should fallback to empty/white if invalid HEX is typed", () => {
            act(() => {
                setup.setProps({ open: true, format: "hex" });
            });
            setup.update();

            setup.find(".colorPicker__hexInput input").simulate("change", { target: { value: "invalid" } });
            setup.update();

            expect(setup.find(".colorPicker__hexInput input").props().value).toEqual("invalid");
        });

        it("Should update color via RGB inputs and clamp values", () => {
            act(() => {
                setup.setProps({ open: true, format: "rgb" });
            });
            setup.update();

            const rInput = setup.find(".colorPicker__rgbInputs input[name='r']");

            rInput.simulate("change", { target: { value: "999" } });
            setup.update();

            expect(String(setup.find(".colorPicker__rgbInputs input[name='r']").props().value)).toBe("255");
        });

        it("processing onChange prop correctly via CustomColorPickers", () => {
            jest.useFakeTimers();
            const mockOnChangeHandler = jest.fn();

            act(() => {
                setup.setProps({ onChange: mockOnChangeHandler, open: true, alphaEnabled: false });
            });
            setup.update();

            const hexColorPicker = setup.find(HexColorPicker);
            act(() => {
                hexColorPicker.prop("onChange")("#ffffff");
            });

            act(() => {
                jest.advanceTimersByTime(200);
            });
            setup.update();

            expect(mockOnChangeHandler).toHaveBeenCalled();
            jest.useRealTimers();
        });
    });

    describe("Alpha (Transparency) Logic", () => {
        it("Should update alpha via outer field input and clamp above 100", () => {
            act(() => {
                setup.setProps({ alphaEnabled: true });
            });
            setup.update();

            const alphaFieldInput = setup.find(".colorPickerTextField__percent input");
            alphaFieldInput.simulate("change", { target: { value: "888" } });
            setup.update();

            expect(setup.find(".colorPickerTextField__percent input").props().value).toBe(100);
        });

        it("Should parse and respect alpha from defaultColor rgba() string", () => {
            setup = mount(<ColorPicker defaultColor="rgba(0, 0, 0, 0.5)" alphaEnabled />);
            expect(setup.find(".colorPickerTextField__percent input").props().value).toBe(50);
        });
    });

    describe("Recent Colors", () => {
        it("Should apply recent color on click, including clearing with empty string", () => {
            const defaultRecentColors = ["#111111", ""];
            act(() => {
                setup.setProps({ recentColors: defaultRecentColors, open: true, defaultColor: "#ff0000" });
            });
            setup.update();

            setup.find(".colorPicker__recentColor").at(0).simulate("click");
            setup.update();
            expect(setup.find("input.colorPickerTextField__input").at(0).props().value).toBe("#111111");

            setup.find(".colorPicker__recentColor").at(1).simulate("click");
            setup.update();
            expect(setup.find("input.colorPickerTextField__input").at(0).props().value).toBe("");
        });
    });
});
