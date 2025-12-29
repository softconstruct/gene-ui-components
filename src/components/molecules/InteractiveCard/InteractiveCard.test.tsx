import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe } from "@geneui/icons";

// Components
import Pill from "@components/atoms/Pill";
import Checkbox from "@components/molecules/Checkbox";
import InteractiveCard, { IInteractiveCardProps } from "@components/molecules/InteractiveCard";
import Switch from "@components/molecules/Switch";

describe("InteractiveCard", () => {
    let setup: ReactWrapper<IInteractiveCardProps>;

    beforeEach(() => {
        setup = mount(<InteractiveCard />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("applies className", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it.each<IInteractiveCardProps["size"]>(["large", "medium", "small"])("applies size class %s", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`.interactiveCard_size_${size}`).exists()).toBeTruthy();
    });

    it("renders label when provided", () => {
        const wrapper = setup.setProps({ label: "Test Label" });
        expect(wrapper.find("Label").exists()).toBeTruthy();
        expect(wrapper.find("Label").prop("text")).toBe("Test Label");
    });

    it("renders description when provided", () => {
        const wrapper = setup.setProps({ description: "Test Description" });
        expect(wrapper.find(".interactiveCard__description").exists()).toBeTruthy();
        expect(wrapper.find(".interactiveCard__description").first().text()).toBe("Test Description");
    });

    it("renders label and description together", () => {
        const wrapper = setup.setProps({ label: "Label", description: "Description" });
        expect(wrapper.find("Label").prop("text")).toBe("Label");
        expect(wrapper.find(".interactiveCard__description").first().text()).toBe("Description");
    });

    it("renders icon when provided", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(Globe).exists()).toBeTruthy();
    });

    it("applies icon class when icon is provided", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(".interactiveCard").hasClass("interactiveCard_withIcon")).toBeTruthy();
    });

    it("renders infoText in label when provided", () => {
        const wrapper = setup.setProps({ label: "Label", infoText: "Info text" });
        expect(wrapper.find("Label").prop("infoText")).toBe("Info text");
    });

    it("renders as button when actionProps not provided", () => {
        const wrapper = setup.setProps({});
        expect(wrapper.find("button.interactiveCard").exists()).toBeTruthy();
        expect(wrapper.find("div.interactiveCard").exists()).toBeFalsy();
    });

    it("applies interactive mode class when actionProps not provided", () => {
        const wrapper = setup.setProps({});
        expect(wrapper.find(".interactiveCard").hasClass("interactiveCard_mode_interactive")).toBeTruthy();
    });

    it("renders actions block when pill provided even without actionProps", () => {
        const pill = { size: "small" as const, text: "Pill", filled: true };
        const wrapper = setup.setProps({ pill });
        expect(wrapper.find(".interactiveCard__actions").exists()).toBeTruthy();
    });

    it("does not render pill when not provided in interactive mode", () => {
        const wrapper = setup.setProps({});
        expect(wrapper.find(Pill).exists()).toBeFalsy();
    });

    it("calls onClick handler when button is clicked", () => {
        const onClick = jest.fn();
        const wrapper = setup.setProps({ onClick });
        wrapper.find("button").simulate("click");
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onFocus handler when button receives focus", () => {
        const onFocus = jest.fn();
        const wrapper = setup.setProps({ onFocus });
        wrapper.find("button").simulate("focus");
        expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("disables button when disabled prop is true", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find("button").prop("disabled")).toBe(true);
    });

    it("applies disabled class when disabled in interactive mode", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".interactiveCard").hasClass("interactiveCard_disabled")).toBeTruthy();
    });

    it("renders pill in interactive mode when provided", () => {
        const pill = { size: "small" as const, text: "Pill", filled: true };
        const wrapper = setup.setProps({ pill });
        expect(wrapper.find(Pill).exists()).toBeTruthy();
        expect(wrapper.find(".interactiveCard__actions").exists()).toBeTruthy();
        expect(wrapper.find(Pill).prop("text")).toBe("Pill");
    });

    it("does not render action component in interactive mode", () => {
        const wrapper = setup.setProps({});
        expect(wrapper.find(Checkbox).exists()).toBeFalsy();
        expect(wrapper.find(Switch).exists()).toBeFalsy();
    });

    it("renders as div when actionProps provided", () => {
        const wrapper = setup.setProps({
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find("div.interactiveCard").exists()).toBeTruthy();
        expect(wrapper.find("button.interactiveCard").exists()).toBeFalsy();
    });

    it("applies static mode class when actionProps provided", () => {
        const wrapper = setup.setProps({
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find(".interactiveCard").hasClass("interactiveCard_mode_static")).toBeTruthy();
    });

    it("renders actions block when actionProps provided", () => {
        const wrapper = setup.setProps({
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find(".interactiveCard__actions").exists()).toBeTruthy();
    });

    it("does not apply disabled class when disabled in non-interactive mode", () => {
        const wrapper = setup.setProps({
            disabled: true,
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find(".interactiveCard").hasClass("interactiveCard_disabled")).toBeFalsy();
    });

    it("does not call onClick in non-interactive mode", () => {
        const onClick = jest.fn();
        const wrapper = setup.setProps({
            onClick,
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        wrapper.find("div.interactiveCard").simulate("click");
        expect(onClick).not.toHaveBeenCalled();
    });

    it("does not call onFocus in non-interactive mode", () => {
        const onFocus = jest.fn();
        const wrapper = setup.setProps({
            onFocus,
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        wrapper.find("div.interactiveCard").simulate("focus");
        expect(onFocus).not.toHaveBeenCalled();
    });

    it("renders checkbox when actionProps type is checkbox", () => {
        const wrapper = setup.setProps({
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find(Checkbox).exists()).toBeTruthy();
        expect(wrapper.find(Switch).exists()).toBeFalsy();
    });

    it("passes all checkbox props correctly", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({
            actionProps: {
                type: "checkbox",
                name: "checkbox-name",
                value: "checkbox-value",
                onChange,
                checked: true
            }
        });
        const checkbox = wrapper.find(Checkbox);
        expect(checkbox.prop("name")).toBe("checkbox-name");
        expect(checkbox.prop("value")).toBe("checkbox-value");
        expect(checkbox.prop("checked")).toBe(true);
    });

    it("disables checkbox when card disabled prop is true", () => {
        const wrapper = setup.setProps({
            disabled: true,
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find(Checkbox).prop("disabled")).toBe(true);
    });

    it("calls checkbox onChange handler", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({
            actionProps: { type: "checkbox", name: "test", value: "test", onChange }
        });
        const checkbox = wrapper.find(Checkbox);
        checkbox.prop("onChange")?.({
            target: { checked: true }
        });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("renders switch when actionProps type is switch", () => {
        const wrapper = setup.setProps({
            actionProps: { type: "switch", onChange: jest.fn() }
        });
        expect(wrapper.find(Switch).exists()).toBeTruthy();
        expect(wrapper.find(Checkbox).exists()).toBeFalsy();
    });

    it("passes all switch props correctly", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({
            actionProps: {
                type: "switch",
                onChange,
                checked: true
            }
        });
        const switchComponent = wrapper.find(Switch);
        expect(switchComponent.prop("onChange")).toBe(onChange);
        expect(switchComponent.prop("checked")).toBe(true);
    });

    it("disables switch when card disabled prop is true", () => {
        const wrapper = setup.setProps({
            disabled: true,
            actionProps: { type: "switch", onChange: jest.fn() }
        });
        expect(wrapper.find(Switch).prop("disabled")).toBe(true);
    });

    it("calls switch onChange handler when provided", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({
            actionProps: { type: "switch", onChange }
        });
        const switchComponent = wrapper.find(Switch);
        switchComponent.prop("onChange")?.({
            target: { checked: true }
        });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("renders pill in interactive mode when provided", () => {
        const pill = { size: "small" as const, text: "Pill Text", filled: true };
        const wrapper = setup.setProps({ pill });
        expect(wrapper.find(Pill).exists()).toBeTruthy();
        expect(wrapper.find(Pill).prop("text")).toBe("Pill Text");
    });

    it("renders pill in non-interactive mode when provided", () => {
        const pill = { size: "small" as const, text: "Pill Text", filled: true };
        const wrapper = setup.setProps({
            pill,
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find(Pill).exists()).toBeTruthy();
        expect(wrapper.find(Pill).prop("text")).toBe("Pill Text");
    });

    it("does not render pill when not provided", () => {
        const wrapper = setup.setProps({});
        expect(wrapper.find(Pill).exists()).toBeFalsy();
    });

    it("passes all pill props correctly", () => {
        const pill = {
            size: "medium" as const,
            text: "Test Pill",
            filled: false,
            withDot: true
        };
        const wrapper = setup.setProps({ pill });
        const pillComponent = wrapper.find(Pill);
        expect(pillComponent.prop("size")).toBe("medium");
        expect(pillComponent.prop("text")).toBe("Test Pill");
        expect(pillComponent.prop("filled")).toBe(false);
        expect(pillComponent.prop("withDot")).toBe(true);
    });

    it("applies onlyDescription class when description provided without label", () => {
        const wrapper = setup.setProps({ description: "Description only" });
        expect(
            wrapper.find(".interactiveCard__content").hasClass("interactiveCard__content_onlyDescription")
        ).toBeTruthy();
    });

    it("does not apply onlyDescription class when label is provided", () => {
        const wrapper = setup.setProps({ label: "Label", description: "Description" });
        expect(
            wrapper.find(".interactiveCard__content").hasClass("interactiveCard__content_onlyDescription")
        ).toBeFalsy();
    });

    it("renders pill and action component together in non-interactive mode", () => {
        const pill = { size: "small" as const, text: "Pill", filled: true };
        const wrapper = setup.setProps({
            pill,
            actionProps: { type: "checkbox", name: "test", value: "test", onChange: jest.fn() }
        });
        expect(wrapper.find(Pill).exists()).toBeTruthy();
        expect(wrapper.find(Checkbox).exists()).toBeTruthy();
        expect(wrapper.find(".interactiveCard__actions").children().length).toBe(2);
    });

    it("uses medium label size when card size is large", () => {
        const wrapper = setup.setProps({ size: "large", label: "Label" });
        expect(wrapper.find("Label").prop("size")).toBe("medium");
    });

    it("uses same label size when card size is medium", () => {
        const wrapper = setup.setProps({ size: "medium", label: "Label" });
        expect(wrapper.find("Label").prop("size")).toBe("medium");
    });

    it("uses same label size when card size is small", () => {
        const wrapper = setup.setProps({ size: "small", label: "Label" });
        expect(wrapper.find("Label").prop("size")).toBe("small");
    });

    it("handles empty props correctly", () => {
        const wrapper = mount(<InteractiveCard />);
        expect(wrapper.find("button.interactiveCard").exists()).toBeTruthy();
    });

    it("handles undefined actionProps explicitly", () => {
        const wrapper = setup.setProps({ actionProps: undefined });
        expect(wrapper.find("button.interactiveCard").exists()).toBeTruthy();
    });

    it("renders correctly with only label", () => {
        const wrapper = setup.setProps({ label: "Label Only" });
        expect(wrapper.find("Label").prop("text")).toBe("Label Only");
        expect(wrapper.find(".interactiveCard__description").exists()).toBeFalsy();
    });

    it("renders correctly with only description", () => {
        const wrapper = setup.setProps({ description: "Description Only" });
        expect(wrapper.find(".interactiveCard__description").first().text()).toBe("Description Only");
    });
});
