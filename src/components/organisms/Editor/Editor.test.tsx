import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { Globe } from "@geneui/icons";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Editor, { IEditorProps } from "./index";
// Constants
import { EDITOR_COLORS, NO_COLOR, PRESET_COLOR_COUNT } from "./Toolbar/constants";
import FontSizeStepper, { IFontSizeStepperProps } from "./Toolbar/FontSizeStepper/FontSizeStepper";
// Helpers
import { isSafeHref, parseFontFamily, parseFontSize, toHref, toPresetColors } from "./Toolbar/helper";

describe("Editor ", () => {
    let setup: ReactWrapper<IEditorProps>;
    const mockFn = jest.fn();

    beforeEach(() => {
        setup = mount(<Editor />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        jest.clearAllMocks();
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders the editing area correctly", () => {
        const editingArea = setup.getDOMNode().querySelector(".editor__content");

        expect(editingArea).toBeTruthy();
        expect(editingArea?.getAttribute("role")).toBe("textbox");
        expect(editingArea?.getAttribute("contenteditable")).toBe("true");
    });

    it("renders defaultValue prop correctly", () => {
        const wrapper = mount(<Editor defaultValue="<p>test content</p>" />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.getDOMNode().querySelector(".editor__content")?.textContent).toBe("test content");

        wrapper.unmount();
    });

    it("renders id and aria-label props correctly", () => {
        const wrapper = mount(<Editor id="test-id" aria-label="test label" />, { wrappingComponent: GeneUIProvider });
        const editingArea = wrapper.getDOMNode().querySelector(".editor__content");

        expect(editingArea?.getAttribute("id")).toBe("test-id");
        expect(editingArea?.getAttribute("aria-label")).toBe("test label");

        wrapper.unmount();
    });

    it("renders readOnly prop correctly", () => {
        act(() => {
            setup.setProps({ readOnly: true });
        });
        setup.update();

        const root = setup.getDOMNode();
        const toolbarButtons = Array.from(root.querySelectorAll<HTMLButtonElement>(".editor__header button"));

        expect(root.querySelector(".editor__content")?.getAttribute("contenteditable")).toBe("false");
        expect(toolbarButtons.every((button) => button.disabled)).toBeTruthy();
    });

    it("does not render footer when no footerActions", () => {
        expect(setup.find(".editor__footer").exists()).toBeFalsy();
    });

    it("renders footerActions correctly", () => {
        const wrapper = setup.setProps({
            footerActions: [
                { id: "first", Icon: Globe, onClick: mockFn },
                { id: "second", Icon: Globe, onClick: mockFn }
            ]
        });

        expect(wrapper.find(".editor__footer").exists()).toBeTruthy();
        expect(wrapper.getDOMNode().querySelectorAll(".editor__footer button")).toHaveLength(2);
    });

    it("handles onClick from a footer action click", () => {
        const wrapper = setup.setProps({ footerActions: [{ id: "first", Icon: Globe, onClick: mockFn }] });
        wrapper.find(".editor__footer button").simulate("click");

        expect(mockFn).toHaveBeenCalled();
    });

    it("renders the id of a footer action correctly", () => {
        const wrapper = setup.setProps({ footerActions: [{ id: "first", Icon: Globe, onClick: mockFn }] });
        const action = wrapper.getDOMNode().querySelector(".editor__footer button");

        expect(action?.getAttribute("id")).toBe("first");
    });

    it("renders aria-label of a footer action correctly", () => {
        const wrapper = setup.setProps({
            footerActions: [{ id: "first", Icon: Globe, "aria-label": "test action", onClick: mockFn }]
        });
        const action = wrapper.getDOMNode().querySelector(".editor__footer button");

        expect(action?.getAttribute("aria-label")).toBe("test action");
    });

    it("renders placeholder prop correctly", () => {
        const wrapper = mount(<Editor placeholder="test placeholder" />, { wrappingComponent: GeneUIProvider });
        const placeholder = wrapper.getDOMNode().querySelector(".editor__empty");

        expect(placeholder?.getAttribute("data-editor-placeholder")).toBe("test placeholder");

        wrapper.unmount();
    });

    it("does not call onChange on mount", () => {
        const wrapper = mount(<Editor defaultValue="<p>test content</p>" onChange={mockFn} />, {
            wrappingComponent: GeneUIProvider
        });

        expect(mockFn).not.toHaveBeenCalled();

        wrapper.unmount();
    });
});

describe("Editor helpers", () => {
    it("parses a font family stored with single quotes", () => {
        expect(parseFontFamily("'Courier New', Courier, monospace")).toBe("courier new");
    });

    it("parses a font family stored with double quotes", () => {
        expect(parseFontFamily('"Courier New", Courier, monospace')).toBe("courier new");
    });

    it("parses a font family stored without quotes", () => {
        expect(parseFontFamily("Arial, Helvetica, sans-serif")).toBe("arial");
    });

    it("parses an empty font family", () => {
        expect(parseFontFamily("")).toBe("");
    });

    it("parses a font size in pixels", () => {
        expect(parseFontSize("16px")).toBe(16);
        expect(parseFontSize("15.6px")).toBe(16);
    });

    it("ignores a font size in other units", () => {
        expect(parseFontSize("1.5em")).toBeUndefined();
        expect(parseFontSize(undefined)).toBeUndefined();
    });

    it("prefixes a bare domain with a protocol", () => {
        expect(toHref("example.com")).toBe("https://example.com");
        expect(toHref("example.com/path?query=1")).toBe("https://example.com/path?query=1");
    });

    it("keeps a value that already has a scheme", () => {
        expect(toHref("https://example.com")).toBe("https://example.com");
        expect(toHref("http://example.com")).toBe("http://example.com");
        expect(toHref("mailto:test@example.com")).toBe("mailto:test@example.com");
        expect(toHref("tel:+37411000000")).toBe("tel:+37411000000");
    });

    it("keeps a relative value", () => {
        expect(toHref("/path")).toBe("/path");
        expect(toHref("#hash")).toBe("#hash");
        expect(toHref("?query=1")).toBe("?query=1");
    });

    it("accepts a safe href", () => {
        expect(isSafeHref("example.com")).toBeTruthy();
        expect(isSafeHref("https://example.com")).toBeTruthy();
        expect(isSafeHref("http://example.com")).toBeTruthy();
        expect(isSafeHref("mailto:test@example.com")).toBeTruthy();
        expect(isSafeHref("tel:+37411000000")).toBeTruthy();
        expect(isSafeHref("/path")).toBeTruthy();
    });

    it("rejects an unsafe href", () => {
        expect(isSafeHref("js:")).toBeFalsy();
        expect(isSafeHref("data:text/html,<script></script>")).toBeFalsy();
        expect(isSafeHref("")).toBeFalsy();
    });

    it("builds the preset colors from the editor colors", () => {
        const presetColors = toPresetColors();

        expect(presetColors[0]).toBe(NO_COLOR);
        expect(presetColors).toHaveLength(EDITOR_COLORS.length + 1);
    });

    it("builds the preset colors with custom colors first", () => {
        const presetColors = toPresetColors(["#123456", "#654321"]);

        expect(presetColors[0]).toBe(NO_COLOR);
        expect(presetColors[1]).toBe("#123456");
        expect(presetColors[2]).toBe("#654321");
        expect(presetColors).toHaveLength(PRESET_COLOR_COUNT);
    });
});

describe("Editor toolbar navigation", () => {
    const CONTROL_SELECTOR = ".editor__header button, .editor__header input";

    let setup: ReactWrapper<IEditorProps>;

    beforeEach(() => {
        setup = mount(<Editor />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        setup.unmount();
    });

    it("renders the toolbar with the correct role and label", () => {
        const toolbar = setup.getDOMNode().querySelector(".editor__header");

        expect(toolbar?.getAttribute("role")).toBe("toolbar");
        expect(toolbar?.getAttribute("aria-label")).toBe("Text formatting");
    });

    it("renders a single tab stop in the toolbar", () => {
        const controls = Array.from(setup.getDOMNode().querySelectorAll<HTMLElement>(CONTROL_SELECTOR));
        const tabStops = controls.filter((control) => control.getAttribute("tabindex") === "0");

        expect(tabStops).toHaveLength(1);
    });
});

describe("Editor font size stepper", () => {
    let setup: ReactWrapper<IFontSizeStepperProps>;
    const mockFn = jest.fn();

    const getInput = (wrapper: ReactWrapper<IFontSizeStepperProps>) => wrapper.find("input");

    const getDecreaseButton = (wrapper: ReactWrapper<IFontSizeStepperProps>) =>
        wrapper.find('button[aria-label="Decrease font size"]');

    const getIncreaseButton = (wrapper: ReactWrapper<IFontSizeStepperProps>) =>
        wrapper.find('button[aria-label="Increase font size"]');

    beforeEach(() => {
        setup = mount(<FontSizeStepper onChange={mockFn} />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        jest.clearAllMocks();
        setup.unmount();
    });

    it("renders the default size correctly", () => {
        expect(getInput(setup).prop("value")).toBe("14");
    });

    it("renders value prop correctly", () => {
        const wrapper = mount(<FontSizeStepper value={20} onChange={mockFn} />, {
            wrappingComponent: GeneUIProvider
        });

        expect(getInput(wrapper).prop("value")).toBe("20");

        wrapper.unmount();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });

        expect(getDecreaseButton(wrapper).prop("disabled")).toBeTruthy();
        expect(getIncreaseButton(wrapper).prop("disabled")).toBeTruthy();
        expect(getInput(wrapper).prop("disabled")).toBeTruthy();
    });

    it("handles onChange from the increase button", () => {
        getIncreaseButton(setup).simulate("click");

        expect(mockFn).toHaveBeenCalledWith(16, true);
    });

    it("handles onChange from the decrease button", () => {
        getDecreaseButton(setup).simulate("click");

        expect(mockFn).toHaveBeenCalledWith(12, true);
    });

    it("disables the decrease button at the minimum size", () => {
        const wrapper = setup.setProps({ value: 8 });

        expect(getDecreaseButton(wrapper).prop("disabled")).toBeTruthy();
        expect(getIncreaseButton(wrapper).prop("disabled")).toBeFalsy();
    });

    it("disables the increase button at the maximum size", () => {
        const wrapper = setup.setProps({ value: 72 });

        expect(getIncreaseButton(wrapper).prop("disabled")).toBeTruthy();
        expect(getDecreaseButton(wrapper).prop("disabled")).toBeFalsy();
    });

    it("steps down to the minimum size", () => {
        const wrapper = setup.setProps({ value: 9 });

        expect(getDecreaseButton(wrapper).prop("disabled")).toBeFalsy();

        getDecreaseButton(wrapper).simulate("click");

        expect(mockFn).toHaveBeenCalledWith(8, true);
    });

    it("steps up to the maximum size", () => {
        const wrapper = setup.setProps({ value: 71 });

        expect(getIncreaseButton(wrapper).prop("disabled")).toBeFalsy();

        getIncreaseButton(wrapper).simulate("click");

        expect(mockFn).toHaveBeenCalledWith(72, true);
    });

    it("commits a typed size with Enter", () => {
        getInput(setup).simulate("change", { target: { value: "40" } });
        getInput(setup).simulate("keydown", { key: "Enter" });

        expect(mockFn).toHaveBeenCalledWith(40, true);
    });

    it("commits a typed size when the field loses focus", () => {
        getInput(setup).simulate("change", { target: { value: "40" } });
        getInput(setup).simulate("blur");

        expect(mockFn).toHaveBeenCalledWith(40, false);
    });

    it("clamps a typed size above the maximum", () => {
        getInput(setup).simulate("change", { target: { value: "500" } });
        getInput(setup).simulate("keydown", { key: "Enter" });

        expect(mockFn).toHaveBeenCalledWith(72, true);
    });

    it("clamps a typed size below the minimum", () => {
        getInput(setup).simulate("change", { target: { value: "2" } });
        getInput(setup).simulate("keydown", { key: "Enter" });

        expect(mockFn).toHaveBeenCalledWith(8, true);
    });

    it("reverts an invalid typed size", () => {
        getInput(setup).simulate("change", { target: { value: "abc" } });
        getInput(setup).simulate("blur");
        setup.update();

        expect(mockFn).not.toHaveBeenCalled();
        expect(getInput(setup).prop("value")).toBe("14");
    });

    it("does not call onChange when the committed size is unchanged", () => {
        getInput(setup).simulate("change", { target: { value: "14" } });
        getInput(setup).simulate("keydown", { key: "Enter" });

        expect(mockFn).not.toHaveBeenCalled();
    });
});
