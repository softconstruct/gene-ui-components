import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Text from "@components/atoms/Text";

import ProgressBar, { IProgressBarProps } from "./index";

describe("ProgressBar ", () => {
    let setup: ReactWrapper<IProgressBarProps>;
    beforeEach(() => {
        setup = mount(<ProgressBar />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "test";
        const wrapper = setup.setProps({ helperText });

        expect(wrapper.find(HelperText).text()).toStrictEqual(helperText);
    });

    it("renders label prop correctly", () => {
        const label = "test label";
        const wrapper = setup.setProps({ label });
        expect(wrapper.find(Label).props().text).toBe(label);
    });

    it("renders infoText prop correctly", () => {
        const infoText = "infoText";
        const wrapper = setup.setProps({ infoText });
        expect(wrapper.find(Label).props().infoText).toBe(infoText);
    });

    it("renders uploadingText prop correctly", () => {
        const uploadingText = "uploadingText";
        const percent = 33;
        const wrapper = setup.setProps({ uploadingText, percent });
        expect(
            wrapper
                .find(Text)
                .findWhere((item) => item.hasClass("progressBar__uploadingText"))
                .at(1)
                .text()
        ).toStrictEqual(`${uploadingText}`);
    });

    it("renders percent prop correctly", () => {
        const percent = 33;
        const wrapper = setup.setProps({ percent });
        expect(wrapper.find(Text).text()).toStrictEqual(`${percent}%`);
    });

    it.each<IProgressBarProps["status"]>(["rest", "warning", "error"])("should have %s status", (status) => {
        const wrapper = setup.setProps({ status });
        const className = status === "warning" ? "rest" : status;
        wrapper.update();
        expect(wrapper.find(".progressBar").hasClass(`progressBar_status_${className}`)).toBeTruthy();
    });

    it.each<IProgressBarProps["size"]>(["large", "medium", "small"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });

        expect(wrapper.find(".progressBar").hasClass(`progressBar_size_${size}`)).toBeTruthy();
    });

    it.each<IProgressBarProps["type"]>(["determinate", "indeterminate"])("should have %s type", (type) => {
        const wrapper = setup.setProps({ type });

        expect(wrapper.find(".progressBar").hasClass(`progressBar_type_${type}`)).toBeTruthy();
    });
});
