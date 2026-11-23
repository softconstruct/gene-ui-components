import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Filter, { IFilterProps } from "./index";

const texts = {
    title: "Filters",
    applyText: "Apply",
    resetText: "Reset",
    saveText: "Save",
    savePopoverSaveText: "Save filter",
    savePopoverCancelText: "Cancel",
    savePopoverLabelText: "Filter Name"
};

describe("Filter", () => {
    let setup: ReactWrapper<IFilterProps>;

    // The portal target exists only after the provider's first render, so every case starts with a re-render
    const render = (props: IFilterProps = {}) => setup.setProps(props).update();
    const button = (text: string) => setup.find(Button).filterWhere((item) => item.text() === text);
    const openSave = () => {
        setup.find("button.filter__save").simulate("click");
        setup.update();
    };
    const typeName = (value: string) => {
        setup.find(".popover input").simulate("change", { target: { value } });
        setup.update();
    };

    beforeEach(() => {
        setup = mount(<Filter open {...texts} />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        setup.unmount();
    });

    it("should render without crashing", () => {
        expect(render().find("div.filter").exists()).toBeTruthy();
    });

    it("should not render when open is false", () => {
        expect(render({ open: false }).find("div.filter").exists()).toBeFalsy();
    });

    it("should render className prop correctly", () => {
        const className = "test-class";
        expect(render({ className }).find("div.filter").hasClass(className)).toBeTruthy();
    });

    it("should render title prop correctly", () => {
        expect(render().find(".drawer__title").first().text()).toBe(texts.title);
    });

    it("should render children prop correctly", () => {
        render({ children: <div className="test-field" /> });
        expect(setup.find(".drawer__content .test-field").exists()).toBeTruthy();
    });

    it.each<[keyof IFilterProps, keyof IFilterProps]>([
        ["applyText", "onApply"],
        ["resetText", "onReset"]
    ])("should render %s button and call %s on click", (textProp, callbackProp) => {
        const callback = jest.fn();
        render({ [callbackProp]: callback });
        button(texts[textProp as keyof typeof texts]).simulate("click");
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it.each<keyof IFilterProps>(["applyText", "resetText", "saveText"])(
        "should not render the button without %s",
        (textProp) => {
            render({ [textProp]: undefined });
            expect(button(texts[textProp as keyof typeof texts]).exists()).toBeFalsy();
        }
    );

    it.each<[keyof IFilterProps, keyof typeof texts]>([
        ["applyDisabled", "applyText"],
        ["resetDisabled", "resetText"],
        ["saveDisabled", "saveText"]
    ])("should render %s prop correctly", (disabledProp, textProp) => {
        render();
        expect(button(texts[textProp]).find("button").prop("disabled")).toBeFalsy();
        render({ [disabledProp]: true });
        expect(button(texts[textProp]).find("button").prop("disabled")).toBeTruthy();
    });

    it("should disable the save confirm button when saveDisabled is set", () => {
        render();
        openSave();
        typeName("My filter");
        render({ saveDisabled: true });
        expect(setup.find(".filter__saveActions button").last().prop("disabled")).toBeTruthy();
    });

    it("should call onClose when the close button is clicked", () => {
        const onClose = jest.fn();
        render({ onClose });
        setup.find("button.drawer__closeButton").simulate("click");
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should open the save popover with savePopoverLabelText", () => {
        render();
        expect(setup.find(".popover").exists()).toBeFalsy();
        openSave();
        expect(setup.find(".popover .textField__label").first().text()).toContain(texts.savePopoverLabelText);
    });

    it.each<"savePopoverSaveText" | "savePopoverCancelText">(["savePopoverSaveText", "savePopoverCancelText"])(
        "should render %s prop correctly",
        (textProp) => {
            render();
            openSave();
            expect(button(texts[textProp]).exists()).toBeTruthy();
            render({ [textProp]: undefined });
            expect(button(texts[textProp]).exists()).toBeFalsy();
        }
    );

    it("should keep the save confirm button disabled until a name is typed", () => {
        render();
        openSave();
        expect(setup.find(".filter__saveActions button").last().prop("disabled")).toBeTruthy();
        typeName("   ");
        expect(setup.find(".filter__saveActions button").last().prop("disabled")).toBeTruthy();
        typeName("My filter");
        expect(setup.find(".filter__saveActions button").last().prop("disabled")).toBeFalsy();
    });

    it("should call onSave with the trimmed name and close the save popover", () => {
        const onSave = jest.fn();
        render({ onSave });
        openSave();
        typeName("  My filter ");
        setup.find(".filter__saveActions button").last().simulate("click");
        setup.update();
        expect(onSave).toHaveBeenCalledWith("My filter");
        expect(setup.find(".popover").exists()).toBeFalsy();
    });

    it("should close the save popover on savePopoverCancelText button click without calling onSave", () => {
        const onSave = jest.fn();
        render({ onSave });
        openSave();
        typeName("My filter");
        const cancel = setup.find(".filter__saveActions button").first();
        expect(cancel.text()).toBe(texts.savePopoverCancelText);
        cancel.simulate("click");
        setup.update();
        expect(onSave).not.toHaveBeenCalled();
        expect(setup.find(".popover").exists()).toBeFalsy();
    });

    it("should reset the save popover when the panel is closed and opened again", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        render();
        openSave();
        typeName("My filter");
        render({ open: false });
        render({ open: true });
        expect(setup.find(".popover").exists()).toBeFalsy();
        openSave();
        expect(setup.find(".popover input").prop("value")).toBe("");
        // A ref kept from the unmounted popover would be reported as a state update on an unmounted component
        expect(consoleError).not.toHaveBeenCalled();
        consoleError.mockRestore();
    });
});
