import React from "react";
import { ReactWrapper, mount } from "enzyme";
import { TagOutline } from "@geneui/icons";

// Components
import SegmentedControl, { ISegmentedControlProps } from "./index";
import Control from "./Control";
import HelperText from "../HelperText";
import Label from "../Label";

describe("SegmentedControl ", () => {
    let setup: ReactWrapper<ISegmentedControlProps>;
    beforeEach(() => {
        setup = mount(
            <SegmentedControl size="large" onChange={jest.fn}>
                <Control name="test1" />
            </SegmentedControl>
        );
    });
    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });
    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({
            disabled: true
        });
        expect(wrapper.find(Control).find(".segmentedControl__block").props().disabled).toBeTruthy();
    });
    it("renders helperText prop correctly", () => {
        const helperText = "test";
        const wrapper = setup.setProps({
            helperText
        });
        expect(wrapper.find(HelperText).find(".helperText__text").text()).toBe(helperText);
    });

    it("renders Icon prop correctly", () => {
        const Icon = TagOutline;
        const wrapper = setup.setProps({
            Icon
        });

        expect(wrapper.find(Icon).exists()).toBeTruthy();
    });
    it("renders iconBefore prop correctly", () => {
        const Icon = TagOutline;
        const wrapper = setup.setProps({
            iconBefore: true,
            Icon
        });

        expect(wrapper.find(Control).find(".segmentedControl__block_icon_before").exists()).toBeTruthy();
    });

    it("renders isSelected prop correctly", () => {
        const children = <Control name="test" isSelected />;
        const wrapper = setup.setProps({ children });
        expect(wrapper.find(Control).find(".segmentedControl__block_selected").exists()).toBeTruthy();
    });

    it("renders Label prop correctly", () => {
        const label = "test";
        const wrapper = setup.setProps({
            label
        });
        expect(wrapper.find(Label).find(".label__text").text()).toBe(label);
    });

    it("renders infoText prop correctly", () => {
        const infoText = "test";
        const wrapper = setup.setProps({
            infoText
        });
        expect(wrapper.find(Label).props().infoText).toBe(infoText);
    });

    it.each<"large" | "medium" | "small">(["large", "medium", "small"])("should have %p size", (size) => {
        const wrapper = setup.setProps({
            size
        });
        expect(wrapper.find(Control).find(`.segmentedControl__block_size_${size}`).exists()).toBeTruthy();
    });

    it("renders onChange prop correctly", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({
            onChange
        });
        wrapper.find(".segmentedControl__block").simulate("click");
        expect(onChange).toHaveBeenCalledWith("test1");
    });
});
