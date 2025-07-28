import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// We need to mock the icons to make assertions on them
import { CheckMark, CircleInfo, ErrorFilled, LightBulb, TriangleAlert } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import ButtonGroup from "@components/molecules/ButtonGroup";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Notification, { INotificationProps } from "./index";

describe("Notification ", () => {
    let setup: ReactWrapper<INotificationProps>;
    const baseProps: INotificationProps = {
        open: true,
        title: "Test Title",
        description: "Test description.",
        variant: "sectionMessage"
    };

    beforeEach(() => {
        setup = mount(<Notification {...baseProps} />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".notification").hasClass(className)).toBeTruthy();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".notification")).toHaveLength(1);
    });

    it("renders title prop correctly", () => {
        const title = "Custom Title";

        const wrapper = setup.setProps({ title, variant: "sectionMessage" });
        expect(wrapper.find(".notification__title").first().text()).toStrictEqual(title);
    });

    it("renders description prop correctly", () => {
        const description = "Custom description text.";
        const wrapper = setup.setProps({ description, variant: "sectionMessage" });
        expect(wrapper.find(".notification__description").first().text()).toStrictEqual(description);
    });

    it("renders primary and secondary action buttons correctly", () => {
        const wrapper = mount(
            <Notification {...baseProps} primaryActionText="Confirm" secondaryActionText="Cancel" />,
            { wrappingComponent: GeneUIProvider }
        );
        const buttons = wrapper.find(ButtonGroup).find(Button);
        expect(buttons).toHaveLength(2);
        expect(buttons.at(0).text()).toBe("Cancel");
        expect(buttons.at(1).text()).toBe("Confirm");
        wrapper.unmount();
    });

    it("calls onClose when the close button is clicked", () => {
        const onCloseMock = jest.fn();
        const wrapper = mount(<Notification {...baseProps} onClose={onCloseMock} />, {
            wrappingComponent: GeneUIProvider
        });

        // Find the close button by looking for the X icon button
        const closeButton = wrapper
            .find(Button)
            .filterWhere((n) => n.prop("Icon") && n.hasClass("notification__button"))
            .first();

        act(() => {
            closeButton.simulate("click");
        });

        expect(onCloseMock).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });

    it("calls onPrimaryActionClick when the primary action button is clicked", () => {
        const onPrimaryActionClickMock = jest.fn();
        const wrapper = mount(
            <Notification {...baseProps} primaryActionText="Primary" onPrimaryActionClick={onPrimaryActionClickMock} />,
            { wrappingComponent: GeneUIProvider }
        );

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
        const wrapper = mount(
            <Notification
                {...baseProps}
                secondaryActionText="Secondary"
                onSecondaryActionClick={onSecondaryActionClickMock}
            />,
            { wrappingComponent: GeneUIProvider }
        );

        const secondaryButton = wrapper
            .find(Button)
            .filterWhere(
                (n) => n.text() === "Secondary" && n.prop("appearance") === "secondary" && n.prop("layout") === "text"
            );
        expect(secondaryButton).toHaveLength(1);
        secondaryButton.simulate("click");
        expect(onSecondaryActionClickMock).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });

    it("does not render if open prop is false", () => {
        const wrapper = mount(<Notification {...baseProps} open={false} />, { wrappingComponent: GeneUIProvider });
        expect(wrapper.find(".notification").exists()).toBeFalsy();
        wrapper.unmount();
    });

    it.each<INotificationProps["variant"]>(["toast", "sectionMessage"])("should have %s variant", (variant) => {
        const wrapper = mount(<Notification {...baseProps} variant={variant} />, { wrappingComponent: GeneUIProvider });
        expect(wrapper.find(".notification").hasClass(`notification_variant_${variant}`)).toBeTruthy();
        wrapper.unmount();
    });

    it.each<[INotificationProps["status"], any]>([
        ["informative", CircleInfo],
        ["success", CheckMark],
        ["warning", TriangleAlert],
        ["error", ErrorFilled],
        ["insight", LightBulb]
    ])("should have %s status and correct icon", (status, Icon) => {
        const wrapper = mount(<Notification {...baseProps} status={status} variant="sectionMessage" />, {
            wrappingComponent: GeneUIProvider
        });
        expect(wrapper.find(".notification").hasClass(`notification_status_${status}`)).toBeTruthy();
        expect(wrapper.find(Icon).exists()).toBeTruthy();
        wrapper.unmount();
    });

    it("should convert 'insight' status to 'informative' for 'toast' variant", () => {
        const wrapper = mount(<Notification {...baseProps} status="insight" variant="toast" />, {
            wrappingComponent: GeneUIProvider
        });
        expect(wrapper.find(".notification").hasClass("notification_status_informative")).toBeTruthy();
        // Check that the icon is also the one for 'informative'
        expect(wrapper.find(CircleInfo).exists()).toBeTruthy();
        wrapper.unmount();
    });
});
