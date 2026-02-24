import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Button from "@components/atoms/Button";

// Components
import GeneUIProvider from "../../providers/GeneUIProvider";
import PopoverConfirm, { IPopoverConfirmProps } from "./index";

describe("PopoverConfirm", () => {
    let setup: ReactWrapper<IPopoverConfirmProps>;

    const Component = (
        <PopoverConfirm setProps={() => {}} title="Test Title">
            <span className="test-body">Body content</span>
        </PopoverConfirm>
    );

    beforeEach(() => {
        window.scrollTo = jest.fn();
        setup = mount(Component, {
            wrappingComponent: GeneUIProvider
        });
    });

    afterEach(() => {
        setup.unmount();
    });

    const provider = () =>
        setup.getWrappingComponent().setProps({
            children: Component
        });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders children in body when open", () => {
        setup.setProps({ open: true });
        expect(provider().find(".test-body").exists()).toBeTruthy();
    });

    it("renders title correctly when open", () => {
        setup.setProps({ open: true, title: "Test Title" });
        expect(provider().find(".popover__header").text()).toContain("Test Title");
    });

    it("renders default primaryButtonText when open", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footer_buttons").find(Button).last().text()).toBe("Confirm");
    });

    it("renders default secondaryButtonText when open", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footer_buttons").find(Button).first().text()).toBe("Cancel");
    });

    it("renders custom primaryButtonText when open", () => {
        setup.setProps({ open: true, primaryButtonText: "Delete" });
        expect(provider().find(".popover__footer_buttons").find(Button).last().text()).toBe("Delete");
    });

    it("renders custom secondaryButtonText when open", () => {
        setup.setProps({ open: true, secondaryButtonText: "Go back" });
        expect(provider().find(".popover__footer_buttons").find(Button).first().text()).toBe("Go back");
    });

    it("calls onConfirm when confirm button is clicked", () => {
        const onConfirm = jest.fn();
        setup.setProps({ open: true, onConfirm });
        provider().find(".popover__footer_buttons").find(Button).last().simulate("click");
        expect(onConfirm).toHaveBeenCalled();
    });

    it("calls onCancel when cancel button is clicked", () => {
        const onCancel = jest.fn();
        setup.setProps({ open: true, onCancel });
        provider().find(".popover__footer_buttons").find(Button).first().simulate("click");
        expect(onCancel).toHaveBeenCalled();
    });

    it("cancel button has secondary appearance", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footer_buttons").find(Button).first().prop("appearance")).toBe("secondary");
    });

    it("confirm button has primary appearance", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footer_buttons").find(Button).last().prop("appearance")).toBe("primary");
    });

    it.each<IPopoverConfirmProps["size"]>(["xLarge", "large", "medium", "small", "fitContent"])(
        "should have %p size",
        (size) => {
            setup.setProps({ open: true, size });
            expect(provider().find(`.popover_size_${size}`).exists()).toBeTruthy();
        }
    );

    it("renders withArrow prop correctly", () => {
        setup.setProps({ open: true, withArrow: true });
        expect(provider().find(".popover__arrowPath").exists()).toBeTruthy();
    });

    it("confirm button has danger appearance when status is error", () => {
        setup.setProps({ open: true, status: "error" });
        expect(provider().find(".popover__footer_buttons").find(Button).last().prop("appearance")).toBe("danger");
    });

    it("confirm button has primary appearance when status is warning", () => {
        setup.setProps({ open: true, status: "warning" });
        expect(provider().find(".popover__footer_buttons").find(Button).last().prop("appearance")).toBe("primary");
    });

    it.each<IPopoverConfirmProps["status"]>(["error", "warning"])("renders %p status header icon", (status) => {
        setup.setProps({ open: true, status, title: "Test Title" });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
        expect(provider().find(`.popoverConfirm__title_icon_${status}`).exists()).toBeTruthy();
    });
});
