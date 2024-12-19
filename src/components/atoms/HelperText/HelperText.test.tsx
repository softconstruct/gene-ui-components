import React from "react";
import { ReactWrapper, mount } from "enzyme";
import { Globe } from "@geneui/icons";

// Components
import HelperText, { IHelperTextProps } from "./index";
import GeneUIProvider from "../../providers/GeneUIProvider";

describe("HelperText ", () => {
    let setup: ReactWrapper<IHelperTextProps>;
    beforeEach(() => {
        setup = mount(<HelperText text="test" />, {
            wrappingComponent: GeneUIProvider
        });
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it.each<IHelperTextProps["size"]>(["medium", "small"])('should have "%s" size', (size) => {
        const wrapper = setup.setProps({ size });

        expect(wrapper.find(`.helperText_size_${size}`).exists()).toBeTruthy();
    });

    it.each<IHelperTextProps["type"]>(["rest", "error", "warning"])('should have "%s" type', (type) => {
        const wrapper = setup.setProps({ type });

        expect(wrapper.find(`.helperText_type_${type}`).exists()).toBeTruthy();
    });

    it("renders text prop correctly", () => {
        expect(setup.find(".helperText__text").text()).toStrictEqual("test");
    });

    it("renders Icon prop correctly", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(Globe)).toBeTruthy();
    });

    it("renders isDisabled prop correctly", () => {
        const wrapper = setup.setProps({ isDisabled: true });
        expect(wrapper.find(".helperText_disabled").exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
