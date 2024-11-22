import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import ProgressBar, { IProgressBarProps } from "./index";
import HelperText from "../../atoms/HelperText";
import Label from "../../atoms/Label";

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
        expect(wrapper.find(Label).props().labelText).toBe(label);
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

        expect(wrapper.find(".progressBar__uploadingText").text()).toStrictEqual(`${uploadingText}`);
    });

    it("renders percent prop correctly", () => {
        const percent = 33;
        const wrapper = setup.setProps({ percent });

        expect(wrapper.find(".progressBar__percent").text()).toStrictEqual(`${percent}%`);
    });

    it("renders error prop correctly", () => {
        const wrapper = setup.setProps({ error: true });
        wrapper.update();
        expect(wrapper.find(".progressBar").hasClass(`progressBar_color_error`)).toBeTruthy();
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
