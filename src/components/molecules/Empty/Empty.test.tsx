import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Components
import Empty, { IEmptyProps } from "./index";

describe("Empty ", () => {
    let setup: ReactWrapper<IEmptyProps>;
    beforeEach(() => {
        setup = mount(<Empty message="some message" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders message prop correctly", () => {
        const message = "test message";
        const wrapper = setup.setProps({ message });

        const title = wrapper
            .find(Text)
            .findWhere((item) => item.hasClass("empty__title"))
            .at(1);

        expect(title.text()).toBe(message);
    });

    it("renders description prop correctly", () => {
        const description = "test description";
        const wrapper = setup.setProps({ description });

        const desc = wrapper
            .find(Text)
            .findWhere((item) => item.hasClass("empty__description"))
            .at(1);

        expect(desc.text()).toBe(description);
    });

    // it("renders src prop correctly", () => {
    //     const src = "https://picsum.photos/id/64/200/300";
    //     const wrapper = setup.setProps({ appearance: "custom", src });
    //
    //     expect(wrapper.find(".empty__image").props().src).toBe(src);
    // });
    //
    it("renders primary and secondary action buttons texts correctly", () => {
        const wrapper = setup.setProps({
            primaryActionText: "Confirm",
            secondaryActionText: "Cancel"
        });
        wrapper.update();
        const buttons = wrapper.find(ButtonGroup).find(Button);

        expect(buttons).toHaveLength(2);
        expect(buttons.at(0).text()).toBe("Cancel");
        expect(buttons.at(1).text()).toBe("Confirm");
        wrapper.unmount();
    });

    it("calls onPrimaryActionClick when the primary action button is clicked", () => {
        const onPrimaryActionClickMock = jest.fn();
        const wrapper = setup.setProps({
            primaryActionText: "Primary",
            onPrimaryActionClick: onPrimaryActionClickMock
        });

        wrapper.update();

        const primaryButton = wrapper
            .find(Button)
            .filterWhere((n) => n.text() === "Primary" && n.prop("appearance") === "primary");
        expect(primaryButton).toHaveLength(1);
        primaryButton.simulate("click");
        expect(onPrimaryActionClickMock).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });

    it("calls onSecondaryActionClick when the secondary action button is clicked", () => {
        const onSecondaryActionClickMock = jest.fn();
        const wrapper = setup.setProps({
            secondaryActionText: "Secondary",
            onSecondaryActionClick: onSecondaryActionClickMock
        });

        wrapper.update();

        const secondaryButton = wrapper
            .find(Button)
            .filterWhere(
                (n) =>
                    n.text() === "Secondary" && n.prop("appearance") === "secondary" && n.prop("layout") === "outline"
            );
        expect(secondaryButton).toHaveLength(1);
        secondaryButton.simulate("click");
        expect(onSecondaryActionClickMock).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });

    it("renders loading prop correctly", () => {
        const loading = true;
        const wrapper = setup.setProps({ loading });

        expect(wrapper.find(".empty__skeleton").exists()).toBeTruthy();
    });
});
