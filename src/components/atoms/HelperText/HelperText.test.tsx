import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe } from "@geneui/icons";

import GeneUIProvider from "../../providers/GeneUIProvider";
// Components
import HelperText, { IHelperTextProps } from "./index";

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

    it.each<IHelperTextProps["status"]>(["rest", "error", "warning"])('should have "%s" status', (status) => {
        const wrapper = setup.setProps({ status });

        expect(wrapper.find(`.helperText_status_${status}`).exists()).toBeTruthy();
    });

    it("renders text prop correctly", () => {
        expect(setup.find(".helperText__text").hostNodes().text()).toStrictEqual("test");
    });

    it("renders Icon prop correctly", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(Globe)).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".helperText_disabled").exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
