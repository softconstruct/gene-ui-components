import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Tag } from "@geneui/icons";

import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

// Components
import { ISegmentedControlProps, SegmentedControl, SegmentedControlItem } from "./index";

describe("SegmentedControl ", () => {
    let setup: ReactWrapper<ISegmentedControlProps>;

    beforeEach(() => {
        setup = mount(
            <SegmentedControl size="large" onChange={jest.fn}>
                <SegmentedControlItem name="test1" Icon={Tag} />
            </SegmentedControl>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "test";
        const wrapper = setup.setProps({
            helperText
        });
        expect(wrapper.find(HelperText).find(".helperText__text").text()).toBe(helperText);
    });

    it("renders Icon prop correctly", () => {
        expect(setup.find(Tag).exists()).toBeTruthy();
    });

    it("renders selected  prop correctly", () => {
        const children = <SegmentedControlItem name="test" selected />;
        const wrapper = setup.setProps({ children });
        expect(wrapper.find(SegmentedControlItem).find(".segmentedControl__block_selected").exists()).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = "test";
        const wrapper = setup.setProps({
            label
        });
        expect(wrapper.find(Label).find(".label__text").text()).toBe(label);
    });

    it("renders infoText prop correctly", () => {
        const infoText = "test";
        const wrapper = setup.setProps({
            infoText,
            label: "test"
        });
        expect(wrapper.find(Label).props().infoText).toBe(infoText);
    });

    it("renders required prop correctly", () => {
        const wrapper = setup.setProps({
            required: true,
            label: "test"
        });
        expect(wrapper.find(Label).find(".label__asterisk").exists()).toBeTruthy();
    });

    it.each<"large" | "medium" | "small">(["large", "medium", "small"])("should have %p size", (size) => {
        const wrapper = setup.setProps({
            size
        });
        expect(wrapper.find(SegmentedControlItem).find(`.segmentedControl__block_size_${size}`).exists()).toBeTruthy();
    });

    it("renders onChange prop correctly", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({
            onChange
        });
        wrapper.find(".segmentedControl__block").simulate("click");
        expect(onChange).toHaveBeenCalledWith("test1");
    });

    it.each<ISegmentedControlProps["status"]>(["rest", "warning", "error"])('should have "%s" status', (status) => {
        const wrapper = setup.setProps({ status, helperText: "test" } as ISegmentedControlProps);

        expect(wrapper.find(HelperText).find(`.helperText`).hasClass(`helperText_status_${status}`)).toBeTruthy();
    });
});
