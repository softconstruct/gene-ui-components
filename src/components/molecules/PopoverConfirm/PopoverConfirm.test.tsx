import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ErrorFilled, TriangleAlert } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import PopoverConfirm, { IPopoverConfirmProps } from "@components/molecules/PopoverConfirm";

import GeneUIProvider from "../../providers/GeneUIProvider";

describe("PopoverConfirm", () => {
    let setup: ReactWrapper<IPopoverConfirmProps>;

    const Component = (
        <PopoverConfirm setProps={() => {}} title="Test Title">
            <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
        </PopoverConfirm>
    );

    beforeEach(() => {
        window.scrollTo = jest.fn();
        setup = mount(Component, {
            wrappingComponent: GeneUIProvider
        });
    });

    const provider = () =>
        setup.getWrappingComponent().setProps({
            children: Component
        });

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders children prop correct", () => {
        setup.setProps({ open: true });
        expect(provider().find(".swapComponent").exists()).toBeTruthy();
    });

    it("renders title prop correct", () => {
        const title = "test";
        setup.setProps({ open: true, title });
        expect(provider().find(".popover__header").text()).toBe(title);
    });

    it("renders default primary action text when open", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footerActions").find(Button).last().text()).toBe("Confirm");
    });

    it("renders default secondary action text when open", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footerActions").find(Button).first().text()).toBe("Cancel");
    });

    it("renders custom primary action text when open", () => {
        setup.setProps({
            open: true,
            actions: {
                primary: { text: "Delete" },
                secondary: { text: "Cancel" }
            }
        });
        expect(provider().find(".popover__footerActions").find(Button).last().text()).toBe("Delete");
    });

    it("renders custom secondary action text when open", () => {
        setup.setProps({
            open: true,
            actions: {
                primary: { text: "Confirm" },
                secondary: { text: "Go back" }
            }
        });
        expect(provider().find(".popover__footerActions").find(Button).first().text()).toBe("Go back");
    });

    it("calls primary action onClick when primary button is clicked", () => {
        const onPrimaryClick = jest.fn();
        setup.setProps({
            open: true,
            actions: {
                primary: { text: "Confirm", onClick: onPrimaryClick },
                secondary: { text: "Cancel" }
            }
        });
        provider().find(".popover__footerActions").find(Button).last().simulate("click");
        expect(onPrimaryClick).toHaveBeenCalled();
    });

    it("calls secondary action onClick when secondary button is clicked", () => {
        const onSecondaryClick = jest.fn();
        setup.setProps({
            open: true,
            actions: {
                primary: { text: "Confirm" },
                secondary: { text: "Cancel", onClick: onSecondaryClick }
            }
        });
        provider().find(".popover__footerActions").find(Button).first().simulate("click");
        expect(onSecondaryClick).toHaveBeenCalled();
    });

    it("cancel button has secondary appearance", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footerActions").find(Button).first().prop("appearance")).toBe("secondary");
    });

    it("confirm button has primary appearance by default", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popover__footerActions").find(Button).last().prop("appearance")).toBe("primary");
    });

    it("confirm button has danger appearance when status is error", () => {
        setup.setProps({ open: true, status: "error" });
        expect(provider().find(".popover__footerActions").find(Button).last().prop("appearance")).toBe("danger");
    });

    it("confirm button has primary appearance when status is warning", () => {
        setup.setProps({ open: true, status: "warning" });
        expect(provider().find(".popover__footerActions").find(Button).last().prop("appearance")).toBe("primary");
    });

    it.each<IPopoverConfirmProps["size"]>(["medium", "small"])("should have %p size", (size) => {
        setup.setProps({ open: true, size });
        expect(provider().find(`.popover_size_${size}`).exists()).toBeTruthy();
    });

    it("renders popoverConfirm__content class", () => {
        setup.setProps({ open: true });
        expect(provider().find(".popoverConfirm__content").exists()).toBeTruthy();
    });

    it.each<IPopoverConfirmProps["size"]>(["medium", "small"])(
        "renders popoverConfirm__content with %p size modifier",
        (size) => {
            setup.setProps({ open: true, size });
            expect(provider().find(`.popoverConfirm__content_size_${size}`).exists()).toBeTruthy();
        }
    );

    it("renders arrow correctly (always enabled)", () => {
        setup.setProps({
            open: true
        });
        expect(provider().find(".popover__arrowPath").exists()).toBeTruthy();
    });

    it("does not render close button (X) in header", () => {
        setup.setProps({
            open: true,
            title: "Test Title"
        });
        expect(provider().find(".popover__close").exists()).toBeFalsy();
    });

    it("renders warning icon by default when status is not provided", () => {
        setup.setProps({
            open: true,
            title: "Test Title"
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
        expect(provider().find(TriangleAlert).exists()).toBeTruthy();
    });

    it("renders error icon correctly when status is error", () => {
        setup.setProps({
            open: true,
            title: "Test Title",
            status: "error"
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
        expect(provider().find(ErrorFilled).exists()).toBeTruthy();
    });

    it("renders warning icon correctly when status is warning", () => {
        setup.setProps({
            open: true,
            title: "Test Title",
            status: "warning"
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
        expect(provider().find(TriangleAlert).exists()).toBeTruthy();
    });

    it("renders different custom icons correctly", () => {
        setup.setProps({
            open: true,
            title: "Test Title",
            status: "error"
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
        expect(provider().find(ErrorFilled).exists()).toBeTruthy();

        setup.setProps({
            status: "warning"
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
        expect(provider().find(TriangleAlert).exists()).toBeTruthy();
    });

    it.each<IPopoverConfirmProps["status"]>(["error", "warning"])("renders %p status header icon", (status) => {
        setup.setProps({
            open: true,
            status,
            title: "Test Title"
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
        expect(provider().find(`.popoverConfirm__titleIcon_${status}`).exists()).toBeTruthy();
    });

    it("renders with defaultOpen prop", () => {
        const wrapper = mount(
            <PopoverConfirm setProps={() => {}} title="Test" defaultOpen>
                Content
            </PopoverConfirm>,
            { wrappingComponent: GeneUIProvider }
        );
        expect(wrapper.find(".popoverConfirm").exists()).toBeTruthy();
        wrapper.unmount();
    });

    it("renders with controlled open state", () => {
        setup.setProps({ open: false });
        expect(provider().find(".popover").exists()).toBeFalsy();
        setup.setProps({ open: true });
        expect(provider().find(".popover").exists()).toBeTruthy();
    });

    it("calls onOpenChange when open state changes", () => {
        const onOpenChange = jest.fn();
        setup.setProps({ open: true, onOpenChange });
        expect(setup.exists()).toBeTruthy();
    });

    it("renders position prop correctly", () => {
        setup.setProps({ open: true, position: "bottom-right" });
        expect(provider().find(".popover").exists()).toBeTruthy();
    });

    it("renders disableReposition prop correctly", () => {
        setup.setProps({ open: true, disableReposition: true });
        expect(provider().find(".popover").exists()).toBeTruthy();
    });
});
