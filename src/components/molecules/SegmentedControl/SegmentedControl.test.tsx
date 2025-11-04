import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { Tag } from "@geneui/icons";

import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

// Components
import { ISegmentedControlProps, SegmentedControl, SegmentedControlButton } from "./index";

describe("SegmentedControl ", () => {
    let setup: ReactWrapper<ISegmentedControlProps>;

    beforeEach(() => {
        setup = mount(
            <SegmentedControl size="large" onChange={jest.fn()}>
                <SegmentedControlButton name="test1" Icon={Tag} />
            </SegmentedControl>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".segmentedControl").hasClass(className)).toBeTruthy();
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
        expect(
            wrapper.find(SegmentedControlButton).find(`.segmentedControl__button_size_${size}`).exists()
        ).toBeTruthy();
    });

    it("renders onChange prop correctly", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="large" onChange={onChange}>
                <SegmentedControlButton name="test1" Icon={Tag} />
            </SegmentedControl>
        );
        act(() => {
            wrapper.find(".segmentedControl__button").simulate("click");
        });
        wrapper.update();
        expect(onChange).toHaveBeenCalledWith("test1");
    });

    it("renders multiple buttons correctly", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()}>
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        expect(wrapper.find(SegmentedControlButton)).toHaveLength(3);
        expect(wrapper.text()).toContain("Button 1");
        expect(wrapper.text()).toContain("Button 2");
        expect(wrapper.text()).toContain("Button 3");
    });

    it("renders button with text correctly", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()}>
                <SegmentedControlButton name="text-button">Text Button</SegmentedControlButton>
            </SegmentedControl>
        );

        expect(wrapper.find(".segmentedControl__text").hostNodes().text()).toBe("Text Button");
    });

    it("renders button with icon and text correctly", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()}>
                <SegmentedControlButton name="icon-text" Icon={Tag}>
                    Icon Text
                </SegmentedControlButton>
            </SegmentedControl>
        );

        expect(wrapper.find(Tag).exists()).toBeTruthy();
        expect(wrapper.find(".segmentedControl__text").hostNodes().text()).toBe("Icon Text");
        expect(wrapper.find(".segmentedControl__button_withIcon").exists()).toBeTruthy();
    });

    it("renders button with icon only correctly", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()}>
                <SegmentedControlButton name="icon-only" Icon={Tag} />
            </SegmentedControl>
        );

        expect(wrapper.find(Tag).exists()).toBeTruthy();
        expect(wrapper.find(".segmentedControl__button_icon_only").exists()).toBeTruthy();
        expect(wrapper.find(".segmentedControl__text").exists()).toBeFalsy();
    });

    it("applies correct tabIndex: 0 for selected button, -1 for others", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()}>
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        const buttons = wrapper.find("button[role='radio']");
        expect(buttons.at(0).prop("tabIndex")).toBe(0);
        expect(buttons.at(1).prop("tabIndex")).toBe(-1);
        expect(buttons.at(2).prop("tabIndex")).toBe(-1);
    });

    it("updates tabIndex when selection changes", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()}>
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
            </SegmentedControl>
        );

        const buttons = wrapper.find("button[role='radio']");
        expect(buttons.at(0).prop("tabIndex")).toBe(0);
        expect(buttons.at(1).prop("tabIndex")).toBe(-1);

        act(() => {
            buttons.at(1).simulate("click");
        });
        wrapper.update();

        const updatedButtons = wrapper.find("button[role='radio']");
        expect(updatedButtons.at(0).prop("tabIndex")).toBe(-1);
        expect(updatedButtons.at(1).prop("tabIndex")).toBe(0);
    });

    it("applies correct aria-checked attribute", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()}>
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
            </SegmentedControl>
        );

        const buttons = wrapper.find("button[role='radio']");
        expect(buttons.at(0).prop("aria-checked")).toBe(true);
        expect(buttons.at(1).prop("aria-checked")).toBe(false);
    });

    it("applies aria-label to wrapper when label prop is provided", () => {
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={jest.fn()} label="Test Label">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        expect(wrapperDiv.prop("aria-label")).toBe("Test Label");
    });

    it("handles keyboard navigation with ArrowRight", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange}>
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "ArrowRight" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button2");
        expect(
            wrapper.find(SegmentedControlButton).at(1).find(".segmentedControl__button_selected").exists()
        ).toBeTruthy();
    });

    it("handles keyboard navigation with ArrowDown", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange}>
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "ArrowDown" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button2");
    });

    it("handles keyboard navigation with ArrowLeft", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange} value="button3">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "ArrowLeft" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button2");
    });

    it("handles keyboard navigation with ArrowUp", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange} value="button2">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "ArrowUp" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button1");
    });

    it("handles keyboard navigation with Home key", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange} value="button2">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "Home" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button1");
    });

    it("handles keyboard navigation with End key", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange} value="button1">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "End" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button3");
    });

    it("wraps around when navigating with ArrowRight from last button", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange} value="button3">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "ArrowRight" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button1");
    });

    it("wraps around when navigating with ArrowLeft from first button", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange} value="button1">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
                <SegmentedControlButton name="button3">Button 3</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "ArrowLeft" });
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledWith("button3");
    });

    it("ignores non-navigation keys", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SegmentedControl size="medium" onChange={onChange} value="button1">
                <SegmentedControlButton name="button1">Button 1</SegmentedControlButton>
                <SegmentedControlButton name="button2">Button 2</SegmentedControlButton>
            </SegmentedControl>
        );

        const wrapperDiv = wrapper.find(".segmentedControl__wrapper");
        act(() => {
            wrapperDiv.simulate("keyDown", { key: "Enter" });
        });

        // onChange should not be called for non-navigation keys
        expect(onChange).not.toHaveBeenCalled();
    });
});
