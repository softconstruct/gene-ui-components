import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Filter, { IFilterProps, IFilterSaveConfig } from "./index";

const texts = {
    title: "Filters",
    applyText: "Apply now",
    resetText: "Reset all"
};

const saveTexts = {
    buttonText: "Save as",
    popoverSaveText: "Save filter",
    popoverCancelText: "Discard",
    popoverLabelText: "Filter Name"
};

describe("Filter", () => {
    let setup: ReactWrapper<IFilterProps>;

    const saveConfig = (config: Partial<IFilterSaveConfig> = {}): IFilterSaveConfig => ({
        ...saveTexts,
        popoverOpen: false,
        onPopoverOpenChange: jest.fn(),
        onSave: jest.fn(),
        ...config
    });
    // The portal target exists only after the provider's first render, so every case starts with a re-render
    const render = (props: IFilterProps = {}) => setup.setProps(props).update();
    const button = (text: string) => setup.find(Button).filterWhere((item) => item.text() === text);
    const popoverButtons = () => setup.find(".popover__footerActions button");
    const savedFiltersButton = () => setup.find(".drawer__headerSwappable button");
    const openSave = (config: Partial<IFilterSaveConfig> = {}) =>
        render({ saveConfig: saveConfig({ popoverOpen: true, ...config }) });
    const typeName = (value: string) => {
        setup.find(".popover input").simulate("change", { target: { value } });
        setup.update();
    };

    beforeEach(() => {
        setup = mount(<Filter open {...texts} saveConfig={saveConfig()} />, { wrappingComponent: GeneUIProvider });
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

    it.each<[keyof IFilterProps, string]>([
        ["applyText", "Apply"],
        ["resetText", "Reset"]
    ])("should render the button with the default text without %s", (textProp, defaultText) => {
        render({ [textProp]: undefined });
        expect(button(defaultText).exists()).toBeTruthy();
    });

    it.each<[keyof IFilterProps, keyof typeof texts]>([
        ["applyDisabled", "applyText"],
        ["resetDisabled", "resetText"]
    ])("should render %s prop correctly", (disabledProp, textProp) => {
        render();
        expect(button(texts[textProp]).find("button").prop("disabled")).toBeFalsy();
        render({ [disabledProp]: true });
        expect(button(texts[textProp]).find("button").prop("disabled")).toBeTruthy();
    });

    it("should call onClose when the close button is clicked", () => {
        const onClose = jest.fn();
        render({ onClose });
        setup.find("button.drawer__closeButton").simulate("click");
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not render the Save button without saveConfig", () => {
        render({ saveConfig: undefined });
        expect(setup.find("button.filter__save").exists()).toBeFalsy();
    });

    it("should render saveConfig texts correctly", () => {
        render();
        expect(setup.find("button.filter__save").text()).toBe(saveTexts.buttonText);
        openSave();
        expect(setup.find(".popover .textField__label").first().text()).toContain(saveTexts.popoverLabelText);
        expect(popoverButtons().first().text()).toBe(saveTexts.popoverCancelText);
        expect(popoverButtons().last().text()).toBe(saveTexts.popoverSaveText);
    });

    it("should render saveConfig with the default texts", () => {
        render({
            saveConfig: {
                popoverOpen: true,
                onPopoverOpenChange: jest.fn(),
                onSave: jest.fn(),
                onSavedFiltersClick: jest.fn()
            }
        });
        expect(setup.find("button.filter__save").text()).toBe("Save");
        expect(savedFiltersButton().text()).toBe("Saved Filters");
        expect(popoverButtons().first().text()).toBe("Cancel");
        expect(popoverButtons().last().text()).toBe("Save");
    });

    it("should render saveConfig buttonLoading correctly", () => {
        render();
        expect(setup.find("button.filter__save").hasClass("button_loading")).toBeFalsy();
        render({ saveConfig: saveConfig({ buttonLoading: true }) });
        expect(setup.find("button.filter__save").hasClass("button_loading")).toBeTruthy();
    });

    it("should render saveConfig buttonDisabled correctly", () => {
        render();
        expect(setup.find("button.filter__save").prop("disabled")).toBeFalsy();
        render({ saveConfig: saveConfig({ buttonDisabled: true }) });
        expect(setup.find("button.filter__save").prop("disabled")).toBeTruthy();
    });

    it("should not render the Saved Filters button without onSavedFiltersClick", () => {
        render();
        expect(savedFiltersButton().exists()).toBeFalsy();
    });

    it("should render the Saved Filters button and call onSavedFiltersClick on click", () => {
        const onSavedFiltersClick = jest.fn();
        render({ saveConfig: saveConfig({ savedFiltersText: "Saved Filters", onSavedFiltersClick }) });
        expect(savedFiltersButton().text()).toBe("Saved Filters");
        expect(savedFiltersButton().find("svg").exists()).toBeTruthy();
        savedFiltersButton().simulate("click");
        expect(onSavedFiltersClick).toHaveBeenCalledTimes(1);
    });

    it("should render saveConfig popoverOpen correctly", () => {
        render();
        expect(setup.find(".popover").exists()).toBeFalsy();
        openSave();
        expect(setup.find(".popover").exists()).toBeTruthy();
    });

    it.each([false, true])(
        "should call onPopoverOpenChange with the opposite of popoverOpen %s on the Save button click",
        (popoverOpen) => {
            const onPopoverOpenChange = jest.fn();
            render({ saveConfig: saveConfig({ popoverOpen, onPopoverOpenChange }) });
            setup.find("button.filter__save").simulate("click");
            expect(onPopoverOpenChange).toHaveBeenLastCalledWith(!popoverOpen);
        }
    );

    it("should not open the save popover by itself on the Save button click", () => {
        render();
        setup.find("button.filter__save").simulate("click");
        setup.update();
        expect(setup.find(".popover").exists()).toBeFalsy();
    });

    it("should call onPopoverOpenChange with false on the cancel button click without calling onSave", () => {
        const onSave = jest.fn();
        const onPopoverOpenChange = jest.fn();
        openSave({ onSave, onPopoverOpenChange });
        typeName("My filter");
        popoverButtons().first().simulate("click");
        expect(onPopoverOpenChange).toHaveBeenCalledWith(false);
        expect(onSave).not.toHaveBeenCalled();
    });

    it("should keep the save confirm button disabled until a name is typed", () => {
        openSave();
        expect(popoverButtons().last().prop("disabled")).toBeTruthy();
        typeName("My filter");
        expect(popoverButtons().last().prop("disabled")).toBeFalsy();
    });

    it("should keep the save popover buttons mounted while the name is typed", () => {
        openSave();
        const cancel = popoverButtons().first().getDOMNode();
        typeName("My filter");
        expect(popoverButtons().first().getDOMNode()).toBe(cancel);
    });

    it("should call onSave with the typed name and leave closing the save popover to the consumer", () => {
        const onSave = jest.fn();
        const onPopoverOpenChange = jest.fn();
        openSave({ onSave, onPopoverOpenChange });
        typeName("  My filter ");
        popoverButtons().last().simulate("click");
        setup.update();
        expect(onSave).toHaveBeenCalledWith("  My filter ");
        expect(onPopoverOpenChange).not.toHaveBeenCalled();
        expect(setup.find(".popover").exists()).toBeTruthy();
    });

    it("should render saveConfig popoverSaveLoading correctly", () => {
        openSave();
        typeName("My filter");
        expect(popoverButtons().last().hasClass("button_loading")).toBeFalsy();
        expect(popoverButtons().first().prop("disabled")).toBeFalsy();
        expect(setup.find(".popover input").prop("disabled")).toBeFalsy();
        openSave({ popoverSaveLoading: true });
        expect(popoverButtons().last().hasClass("button_loading")).toBeTruthy();
        expect(popoverButtons().first().prop("disabled")).toBeTruthy();
        expect(setup.find(".popover input").prop("disabled")).toBeTruthy();
    });

    it("should not call onSave while popoverSaveLoading is true", () => {
        const onSave = jest.fn();
        openSave({ onSave });
        typeName("My filter");
        openSave({ onSave, popoverSaveLoading: true });
        popoverButtons().last().simulate("click");
        expect(onSave).not.toHaveBeenCalled();
    });

    it("should keep the typed name while the save popover stays open", () => {
        openSave();
        typeName("My filter");
        openSave({ popoverSaveLoading: true });
        openSave({ popoverSaveLoading: false });
        expect(setup.find(".popover input").prop("value")).toBe("My filter");
    });

    it("should clear the typed name when the save popover is closed", () => {
        openSave();
        typeName("My filter");
        render({ saveConfig: saveConfig({ popoverOpen: false }) });
        openSave();
        expect(setup.find(".popover input").prop("value")).toBe("");
    });

    it("should call onPopoverOpenChange with false when the panel is closed with the save popover open", () => {
        const onPopoverOpenChange = jest.fn();
        openSave({ onPopoverOpenChange });
        render({ open: false });
        expect(onPopoverOpenChange).toHaveBeenCalledWith(false);
    });

    it("should remove the Save button and the save popover when saveConfig is removed", () => {
        openSave();
        typeName("My filter");
        render({ saveConfig: undefined });
        expect(setup.find("button.filter__save").exists()).toBeFalsy();
        expect(setup.find(".popover").exists()).toBeFalsy();
        render({ saveConfig: saveConfig() });
        expect(setup.find("button.filter__save").exists()).toBeTruthy();
        expect(setup.find(".popover").exists()).toBeFalsy();
    });

    it("should reset the save popover when the panel is closed and opened again", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        openSave();
        typeName("My filter");
        render({ open: false, saveConfig: saveConfig({ popoverOpen: false }) });
        render({ open: true });
        expect(setup.find(".popover").exists()).toBeFalsy();
        openSave();
        expect(setup.find(".popover input").prop("value")).toBe("");
        // A ref kept from the unmounted popover would be reported as a state update on an unmounted component
        expect(consoleError).not.toHaveBeenCalled();
        consoleError.mockRestore();
    });
});
