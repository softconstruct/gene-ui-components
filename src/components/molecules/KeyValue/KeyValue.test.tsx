import React from "react";
import { ReactWrapper, mount } from "enzyme";
import { Globe, WarningFill } from "@geneui/icons";

// Components
import KeyValue, { IKeyValueProps } from "./index";
import Info from "../../atoms/Info";
import Pill from "../../atoms/Pill";

const title = "title";

describe("KeyValue ", () => {
    let setup: ReactWrapper<IKeyValueProps>;
    beforeEach(() => {
        setup = mount(<KeyValue title={title} value="value" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders IconBefore prop correctly", () => {
        const wrapper = setup.setProps({ KeyIcon: Globe });
        expect(wrapper.find(Globe).exists()).toBeTruthy();
    });

    it("renders title prop correctly", () => {
        expect(setup.find(".keyValue__title").contains(title)).toBeTruthy();
    });

    it("renders title prop correctly", () => {
        expect(setup.find(".keyValue__title").contains(title)).toBeTruthy();
    });

    it("renders info icon correctly", () => {
        const wrapper = setup.setProps({ iconInfo: { infoText: "info" } });
        expect(wrapper.find(Info).exists()).toBeTruthy();
    });

    it("renders pill value correctly", () => {
        const wrapper = setup.setProps({ value: { text: "Pill", isFill: true } });
        expect(wrapper.find(Pill).exists()).toBeTruthy();
    });

    it("renders icon value correctly", () => {
        const wrapper = setup.setProps({ value: WarningFill });
        expect(wrapper.find(WarningFill).exists()).toBeTruthy();
    });

    it("renders text value correctly", () => {
        const value = "Value";
        const wrapper = setup.setProps({ value });
        expect(wrapper.find(".keyValue__value").contains(value)).toBeTruthy();
    });

    it.each<IKeyValueProps["size"]>(["large", "medium", "small"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".keyValue").hasClass(`keyValue_${size}`)).toBeTruthy();
    });

    it.each<IKeyValueProps["direction"]>(["vertical", "horizontal"])("should have %s direction", (direction) => {
        const wrapper = setup.setProps({ direction });
        expect(wrapper.find(".keyValue").hasClass(`keyValue_${direction}`)).toBeTruthy();
    });
});
