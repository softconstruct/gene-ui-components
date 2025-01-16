import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Badge, { IBadgeProps } from "./index";
import Avatar from "../Avatar";

describe("Badge ", () => {
    let setup: ReactWrapper<IBadgeProps>;
    beforeEach(() => {
        setup = mount(<Badge />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders withBorder prop correctly", () => {
        const withBorder = true;
        const wrapper = setup.setProps({ withBorder });

        expect(wrapper.find(".badge__content").hasClass("badge__content_bordered")).toBeTruthy();
    });

    it.each<IBadgeProps["size"]>(["small", "smallNudge", "xSmall", "3xSmall"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".badge__content").hasClass(`badge__content_size_${size}`)).toBeTruthy();
    });

    it.each<IBadgeProps["appearance"]>(["brand", "neutral", "red", "inverse"])(
        "should have %s appearance",
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(".badge__content").hasClass(`badge__content_color_${appearance}`)).toBeTruthy();
        }
    );

    it("renders value prop correctly", () => {
        const value = 8;
        const wrapper = setup.setProps({ value });

        expect(wrapper.find(".badge__num").text()).toBe(value.toString());
    });

    it("renders maxValue prop correctly", () => {
        const value = 100;
        const maxValue = 99;
        const wrapper = setup.setProps({ value, maxValue });

        expect(wrapper.find(".badge__num").text()).toBe("99+");
    });

    it("renders children prop correctly", () => {
        const children = <Avatar />;

        const wrapper = setup.setProps({ children });
        expect(wrapper.find(".badge__content").hasClass(`badge__content_position_absolute`)).toBeTruthy();

        expect(wrapper.contains(children)).toBeTruthy();
    });
});
