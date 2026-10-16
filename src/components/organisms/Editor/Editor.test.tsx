import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { Globe } from "@geneui/icons";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Editor, { IEditorProps } from "./index";
// Constants
import { EDITOR_COLORS, NO_COLOR, PRESET_COLOR_COUNT } from "./Toolbar/constants";
// Helpers
import { parseFontFamily, parseFontSize, toHref, toPresetColors } from "./Toolbar/helper";

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

    it("generates an id for a footer action without one", () => {
        const wrapper = setup.setProps({ footerActions: [{ Icon: Globe, onClick: mockFn }] });
        const action = wrapper.getDOMNode().querySelector(".editor__footer button");

        expect(action?.getAttribute("id")).toBeTruthy();
    });

    it("renders aria-label of a footer action correctly", () => {
        const wrapper = setup.setProps({
            footerActions: [{ id: "first", Icon: Globe, "aria-label": "test action", onClick: mockFn }]
        });
        const action = wrapper.getDOMNode().querySelector(".editor__footer button");

        expect(action?.getAttribute("aria-label")).toBe("test action");
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
