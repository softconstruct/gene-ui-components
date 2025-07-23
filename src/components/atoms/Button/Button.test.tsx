import React, { MouseEvent } from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe } from "@geneui/icons";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Button, { IButtonProps } from "./index";

describe("Button ", () => {
    let setup: ReactWrapper<IButtonProps>;
    const mockFn = jest.fn();

    beforeEach(() => {
        setup = mount(<Button onClick={() => {}} />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".button").props().disabled).toBeTruthy();
    });

    it("renders fullWidth prop correctly", () => {
        const wrapper = setup.setProps({ fullWidth: true });
        expect(wrapper.find(".button").hasClass("button_fullWidth")).toBeTruthy();
    });

    it("renders Icon prop correctly", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(Globe).exists()).toBeTruthy();
    });

    it("renders name prop correctly", () => {
        const name = "test";
        const wrapper = setup.setProps({ name });
        expect(wrapper.find("button").props().name).toBe(name);
    });

    it("handles user's click", () => {
        const wrapper = setup.setProps({ onClick: mockFn });
        const event = {
            currentTarget: {
                innerHTML: "test"
            }
        } as MouseEvent<HTMLButtonElement>;
        wrapper.find("button").props().onClick!(event);
        expect(mockFn).toHaveBeenCalledWith(event);
    });

    it.each<IButtonProps["size"]>(["large", "medium", "small", "smallNudge"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".button").hasClass(`button_size_${size}`)).toBeTruthy();
    });

    it.each<IButtonProps["iconPosition"]>(["before", "after"])("should have %s position", (iconPosition) => {
        const wrapper = setup.setProps({ iconPosition, Icon: Globe, children: "Search" });
        expect(wrapper.find(".button").hasClass(`button_icon_${iconPosition}`)).toBeTruthy();
    });

    it.each<IButtonProps["appearance"]>(["primary", "secondary", "danger", "success", "inverse", "transparent"])(
        "should have %s appearance",
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(".button").hasClass(`button_color_${appearance}`)).toBeTruthy();
        }
    );

    it.each<IButtonProps["layout"]>(["fill", "outline", "text"])("should have %s layout", (layout) => {
        const wrapper = setup.setProps({ layout });
        expect(wrapper.find(".button").hasClass(`button_type_${layout}`)).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it.each<IButtonProps["type"]>(["button", "submit", "reset"])("should have %s type", (type) => {
        const wrapper = setup.setProps({ type });
        expect(wrapper.find("button").props().type).toBe(type);
    });
});
