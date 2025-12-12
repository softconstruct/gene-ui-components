import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe } from "@geneui/icons";

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

    it("renders label and description", () => {
        const wrapper = setup.setProps({ label: "Label", description: "Desc" });
        expect(wrapper.find("Label").at(0).prop("text")).toBe("Label");
        expect(wrapper.find(".interactiveCard__description").at(0).text()).toBe("Desc");
    });

    it("renders icon when provided", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(Globe).exists()).toBeTruthy();
    });

    it("renders interactive variant as button without actions block", () => {
        const wrapper = setup.setProps({ interactive: true });
        expect(wrapper.find("button.interactiveCard").exists()).toBeTruthy();
        expect(wrapper.find(".interactiveCard__actions").exists()).toBeFalsy();
    });

    it("renders non-interactive variant with default checkbox action when none provided", () => {
        const wrapper = setup.setProps({ interactive: false });
        expect(wrapper.find(".interactiveCard__actions").exists()).toBeTruthy();
        const action = wrapper.find(Checkbox);
        expect(action.exists()).toBeTruthy();
        expect(action.prop("name")).toBe("interactive-card-checkbox");
        expect(action.prop("value")).toBe("interactive-card-checkbox");
    });

    it("renders checkbox when actionProps type is checkbox", () => {
        const wrapper = setup.setProps({
            interactive: false,
            actionProps: { type: "checkbox", name: "n", value: "v", onChange: jest.fn() }
        });
        expect(wrapper.find(Checkbox).exists()).toBeTruthy();
        expect(wrapper.find(Switch).exists()).toBeFalsy();
    });

    it("renders switch when actionProps type is switch", () => {
        const wrapper = setup.setProps({
            interactive: false,
            actionProps: { type: "switch", onChange: jest.fn() }
        });
        expect(wrapper.find(Switch).exists()).toBeTruthy();
        expect(wrapper.find(Checkbox).exists()).toBeFalsy();
    });

    it("renders pill when pillProps provided", () => {
        const wrapper = setup.setProps({
            interactive: false,
            pillProps: { text: "Pill text", size: "small" }
        });
        expect(wrapper.find(Pill).exists()).toBeTruthy();
        expect(wrapper.find(Pill).prop("text")).toBe("Pill text");
    });

    it("does not render pill when pillProps not provided", () => {
        const wrapper = setup.setProps({ interactive: false, pillProps: undefined });
        expect(wrapper.find(Pill).exists()).toBeFalsy();
    });

    it("disables default action when card is disabled", () => {
        const wrapper = setup.setProps({ interactive: false, disabled: true });
        expect(wrapper.find(Checkbox).prop("disabled")).toBe(true);
    });

    it("disables provided action when card is disabled", () => {
        const wrapper = setup.setProps({
            interactive: false,
            disabled: true,
            actionProps: { type: "checkbox", name: "n", value: "v", onChange: jest.fn() }
        });
        expect(wrapper.find(Checkbox).prop("disabled")).toBe(true);
    });
});
