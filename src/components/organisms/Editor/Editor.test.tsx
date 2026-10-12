import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { Globe } from "@geneui/icons";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Editor, { IEditorProps } from "./index";

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
