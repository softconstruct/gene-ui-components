import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Pill from "@components/atoms/Pill";
import TextLink from "@components/atoms/TextLink/TextLink";

// Components
import { IKeyValueProps, Key, KeyValue, Value } from "./index";

const title = "title";

describe("KeyValue ", () => {
    let setup: ReactWrapper<IKeyValueProps>;
    beforeEach(() => {
        setup = mount(
            <KeyValue>
                <Key>{title}</Key>
                <Value>Description</Value>
            </KeyValue>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders key text correctly", () => {
        expect(setup.find(".keyValue__title").contains(title)).toBeTruthy();
    });

    it("renders Pill correctly", () => {
        const wrapper = mount(
            <KeyValue>
                <Key>{title}</Key>
                <Value>
                    <Pill text="Pill" filled />
                </Value>
            </KeyValue>
        );
        expect(wrapper.find(Pill).exists()).toBeTruthy();
    });

    it("renders TextLink correctly", () => {
        const wrapper = mount(
            <KeyValue>
                <Key>{title}</Key>
                <Value>
                    <TextLink text="Link text" href="#" />
                </Value>
            </KeyValue>
        );
        expect(wrapper.find(TextLink).exists()).toBeTruthy();
    });

    it.each<IKeyValueProps["size"]>(["large", "medium"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".keyValue").hasClass(`keyValue_size_${size}`)).toBeTruthy();
    });

    it.each<IKeyValueProps["direction"]>(["vertical", "horizontal"])("should have %s direction", (direction) => {
        const wrapper = setup.setProps({ direction });
        expect(wrapper.find(".keyValue").hasClass(`keyValue_direction_${direction}`)).toBeTruthy();
    });
    it("renders space between key and value", () => {
        const wrapper = setup.setProps({ spaceBetween: true });
        expect(wrapper.find(".keyValue_spaceBetween").exists()).toBeTruthy();
    });
});
