import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { HexColorPicker } from "react-colorful";
import { act } from "react-dom/test-utils";

// Components
import ColorPicker, { IColorPickerProps } from "./index";

describe("ColorPicker", () => {
    let setup: ReactWrapper<IColorPickerProps>;

    beforeEach(() => {
        setup = mount(<ColorPicker />);
    });

    afterEach(() => {
        setup.unmount();
    });

    describe("Rendering & Default States", () => {
        it("renders without crashing", () => {
            expect(setup.exists()).toBeTruthy();
        });

        it("renders className prop correctly", () => {
            const className = "test-class";
            const wrapper = setup.setProps({ className });

            expect(wrapper.hasClass(className)).toBeTruthy();
        });

        it("renders defaultColor prop correctly", () => {
            const defaultHexPropValue = "#000000";
            const wrapper = setup.setProps({ defaultColor: defaultHexPropValue });

            setup.update();

            expect(wrapper.find(".colorPicker__textField").at(0).props().value).toBe(defaultHexPropValue);
        });

        it("renders recentColors prop correctly", () => {
            const defaultRecentColors = ["#000000", "#ffff00", "#ff0000"];

            const wrapper = setup.setProps({ recentColors: defaultRecentColors, open: true });
            setup.update();

            expect(wrapper.find(".colorPicker__recentColor")).toHaveLength(3);
        });

        it("renders alphaEnabled prop correctly", () => {
            const wrapper = setup.setProps({ alphaEnabled: true });

            expect(wrapper.find(".colorPicker__alphaField").exists()).toBeTruthy();
        });

        it("renders alphaValue prop correctly", () => {
            const wrapper = setup.setProps({ alphaEnabled: true, alphaValue: 40 });
            setup.update();

            expect(wrapper.find(".colorPicker__alphaField").at(0).props().value).toBe(40);
        });

        it("renders value prop correctly", () => {
            const wrapper = setup.setProps({ value: "#444444" });
            setup.update();
            expect(wrapper.find(".colorPicker__textField").at(0).props().value).toBe("#444444");
        });

        it("renders open prop correctly", () => {
            const wrapper = setup.setProps({ open: true });
            setup.update();

            expect(wrapper.find(".colorPicker__wrapper").exists()).toBeTruthy();
        });

        it("renders format prop correctly", () => {
            const wrapper = setup.setProps({ format: "rgb", open: true });
            setup.update();

            expect(wrapper.find(".colorPicker__rgbInputs").exists()).toBeTruthy();
        });

        it("processing onchange prop correctly", () => {
            const mockOnChangeHandler = jest.fn();
            const wrapper = setup.setProps({ onChange: mockOnChangeHandler, open: true });
            wrapper.update();
            const newColor = "#ffffff";

            const colorPicker = wrapper.find(HexColorPicker);

            act(() => {
                colorPicker.prop("onChange")!(newColor);
            });

            setup.update();
            expect(mockOnChangeHandler).toHaveBeenCalledTimes(1);
        });

        it("propcessing onOutsideClick prop correctly", () => {
            const mockOnOutsideClickHandler = jest.fn();
            const wrapper = setup.setProps({ onOutsideClick: mockOnOutsideClickHandler, open: true });
            wrapper.update();

            const outsideClickEvent = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true
            });

            act(() => {
                document.dispatchEvent(outsideClickEvent);
            });

            wrapper.update();
            expect(mockOnOutsideClickHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe("Popover Visibility and Outside Clicks", () => {
        it("should close on outside click", () => {
            setup.find("input").at(0).simulate("focus");
            setup.update();
            const outsideClickEvent = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true
            });

            act(() => {
                document.dispatchEvent(outsideClickEvent);
            });

            setup.update();
            expect(setup.find(".colorPicker__wrapper").exists()).toBeFalsy();
        });

        it("should respect open prop (controlled)", () => {
            const wrapper = setup.setProps({ open: false });
            wrapper.find("input").at(0).simulate("focus");
            wrapper.update();
            expect(wrapper.find(".colorPicker__wrapper").exists()).toBeFalsy();
        });
    });

    describe("Color Changing & Callback Logic", () => {
        it("Should update color via HEX input", () => {
            const wrapper = setup.setProps({ open: true, format: "hex" });
            wrapper.update();
            const hexInput = wrapper.find(".colorPicker__hexInput").find("input").at(0);
            const newHexValue = "#000000";

            hexInput.simulate("change", { target: { value: newHexValue } });

            const updatedHexInput = wrapper.find(".colorPicker__hexInput").at(0);
            wrapper.update();
            expect(updatedHexInput.props().value).toEqual(newHexValue);
        });

        it("Should update color via RGB input", () => {
            setup.setProps({ open: true, format: "rgb" });
            setup.update();

            const rgbInputs = setup.find(".colorPicker__rgbInputs input");
            rgbInputs.forEach((input) => input.simulate("change", { target: { value: 255 } }));

            setup.update();
            const hexToRgbValue = "#ffffff";
            expect(setup.find(".colorPicker__textField").at(0).prop("value")).toBe(hexToRgbValue);
        });

        it("Should clamp RGB values", () => {
            setup.setProps({ open: true, format: "rgb" });
            setup.update();

            const rgbInputs = setup.find(".colorPicker__rgbInputs input");
            rgbInputs.forEach((input) => input.simulate("change", { target: { value: 999 } }));

            setup.update();
            const hexToRgbValue = "#ffffff";
            expect(setup.find(".colorPicker__textField").at(0).prop("value")).toBe(hexToRgbValue);
        });
    });

    describe("Alpha (Transparency) Logic", () => {
        it("Hide alpha value field if prop is set to false", () => {
            setup.setProps({ alphaEnabled: false });
            expect(setup.find(".colorPicker__alphaField").exists()).toBeFalsy();
        });

        it("Should update alpha via outer field input", () => {
            const wrapper = setup.setProps({ alphaEnabled: true });
            const alphaFieldInput = wrapper.find(".colorPicker__alphaField input").at(0);
            alphaFieldInput.simulate("change", { target: { value: 10 } });
            wrapper.update();
            expect(wrapper.find(".colorPicker__alphaField input").at(0).props().value).toBe("10");
        });

        it("Should update alpha via inner field input", () => {
            const wrapper = setup.setProps({ alphaEnabled: true, open: true });
            wrapper.update();
            const alphaFieldInput = wrapper.find(".colorPicker__alphaInput input").at(0);
            alphaFieldInput.simulate("change", { target: { value: 88 } });
            wrapper.update();
            expect(wrapper.find(".colorPicker__alphaField input").at(0).props().value).toBe("88");
        });

        it("Should clamp alpha values", () => {
            const wrapper = setup.setProps({ alphaEnabled: true });
            const alphaFieldInput = wrapper.find(".colorPicker__alphaField input").at(0);
            alphaFieldInput.simulate("change", { target: { value: 888 } });
            wrapper.update();
            expect(wrapper.find(".colorPicker__alphaField input").at(0).props().value).toBe("100");
        });
    });

    describe("Recent Colors", () => {
        it("Should apply recent color on click", () => {
            const defaultRecentColors = ["#000000", "#ffff00", "#ff0000"];

            const wrapper = setup.setProps({ recentColors: defaultRecentColors, open: true });
            setup.update();

            const firstRecentColorValue = defaultRecentColors[0];
            const firstRecentColor = wrapper.find(".colorPicker__recentColor").at(0);
            firstRecentColor.simulate("click");
            wrapper.update();
            setup.update();
            expect(wrapper.find(".colorPicker__textField").at(0).props().value).toBe(firstRecentColorValue);
        });
    });
});
