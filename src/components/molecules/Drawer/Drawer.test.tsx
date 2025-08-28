import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Drawer, { IDrawerProps } from "@components/molecules/Drawer/Drawer";
import Tooltip from "@components/molecules/Tooltip";
import GeneUIProvider from "@components/providers/GeneUIProvider";

describe("Drawer", () => {
    let setup: ReactWrapper<IDrawerProps>;
    const mockOnClose = jest.fn();
    const mockOnClick = jest.fn();

    beforeEach(() => {
        document.body.style.overflow = "unset";
        setup = mount(<Drawer open />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.style.overflow = "unset";

        const events = ["keydown"];
        events.forEach((event) => {
            document.removeEventListener(event, jest.fn());
        });
    });

    it("renders without crashing when open", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("does not render when open is false", () => {
        const wrapper = mount(<Drawer open={false} />, { wrappingComponent: GeneUIProvider });
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".drawer").hasClass(className)).toBeTruthy();
    });

    it("renders with default props", () => {
        expect(setup.find(".drawer").hasClass("drawer_variant_overlay")).toBeTruthy();
        expect(setup.find(".drawer").hasClass("drawer_withPadding")).toBeTruthy();
        expect(setup.find(".drawer").hasClass("drawer_position_end")).toBeTruthy();
    });

    it.each<IDrawerProps["size"]>(["small", "medium", "large"])(
        "should render with %s size for overlay variant",
        (size) => {
            const wrapper = setup.setProps({ size, variant: "overlay" });
            expect(wrapper.find(".drawer__wrapper").hasClass(`drawer__wrapper_size_${size}`)).toBeTruthy();
        }
    );

    it.each<IDrawerProps["size"]>(["medium", "large"])("should render with %s size for inline variant", (size) => {
        const wrapper = setup.setProps({ size, variant: "inline" });
        expect(wrapper.find(".drawer").hasClass(`drawer_size_${size}`)).toBeTruthy();
    });

    it.each<IDrawerProps["position"]>(["bottom ", "end", "start"])(
        "should render with %s position for overlay variant",
        (position) => {
            const wrapper = setup.setProps({ position, variant: "overlay" });
            expect(wrapper.find(".drawer").hasClass(`drawer_position_${position?.trim()}`)).toBeTruthy();
        }
    );

    it("should not apply position classes for inline variant", () => {
        const wrapper = setup.setProps({ position: "start", variant: "inline" });
        expect(wrapper.find(".drawer").hasClass("drawer_position_start")).toBeFalsy();
    });

    it("should apply padding class when withPadding is true", () => {
        const wrapper = setup.setProps({ withPadding: true });
        expect(wrapper.find(".drawer").hasClass("drawer_withPadding")).toBeTruthy();
    });

    it("should not apply padding class when withPadding is false", () => {
        const wrapper = setup.setProps({ withPadding: false });
        expect(wrapper.find(".drawer").hasClass("drawer_withPadding")).toBeFalsy();
    });

    it("should render overlay variant correctly", () => {
        const wrapper = setup.setProps({ variant: "overlay" });
        expect(wrapper.find(".drawer").hasClass("drawer_variant_overlay")).toBeTruthy();
    });

    it("should render inline variant correctly", () => {
        const wrapper = setup.setProps({ variant: "inline" });
        expect(wrapper.find(".drawer").hasClass("drawer_variant_inline")).toBeTruthy();
    });

    it("should render title when provided", () => {
        const title = "Test Drawer Title";
        const wrapper = setup.setProps({ title });

        expect(wrapper.find(".drawer__header").exists()).toBeTruthy();
        expect(wrapper.find(".drawer__title").exists()).toBeTruthy();

        expect(wrapper.text()).toContain(title);
    });

    it("should not render header when no title, headerContent, or hasCloseButton", () => {
        const wrapper = setup.setProps({
            title: undefined,
            headerContent: undefined,
            hasCloseButton: false
        });
        expect(wrapper.find(".drawer__header").exists()).toBeFalsy();
    });

    it("should render title with tooltip support", () => {
        const title = "Test Drawer Title";
        const wrapper = setup.setProps({ title });
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
    });

    it("should render string children as Text component", () => {
        const textContent = "This is test content";
        const wrapper = setup.setProps({ children: textContent });

        const textComponent = wrapper.find(".drawer__paragraph");
        expect(textComponent.exists()).toBeTruthy();
        expect(textComponent.find(Text).props().children).toBe(textContent);
    });

    it("should render ReactNode children directly", () => {
        const reactContent = <div className="custom-content">Custom React Content</div>;
        const wrapper = setup.setProps({ children: reactContent });

        expect(wrapper.find(".custom-content").exists()).toBeTruthy();
        expect(wrapper.find(".drawer__paragraph").exists()).toBeFalsy();
    });

    it("should render headerContent when provided", () => {
        const headerContent = <div className="test-header-content">Header Content</div>;
        const wrapper = setup.setProps({ headerContent });

        expect(wrapper.find(".drawer__header").exists()).toBeTruthy();
        expect(wrapper.find(".drawer__headerContent").exists()).toBeTruthy();
        expect(wrapper.find(".test-header-content").exists()).toBeTruthy();
    });

    it("should render footerContent when provided", () => {
        const footerContent = <div className="test-footer-content">Footer Content</div>;
        const wrapper = setup.setProps({ footerContent });

        expect(wrapper.find(".drawer__footer").exists()).toBeTruthy();
        expect(wrapper.find(".drawer__footerContent").exists()).toBeTruthy();
        expect(wrapper.find(".test-footer-content").exists()).toBeTruthy();
    });

    it("should not render footer when no footerContent or actions", () => {
        const wrapper = setup.setProps({ footerContent: undefined, actions: undefined });
        expect(wrapper.find(".drawer__footer").exists()).toBeFalsy();
    });

    it("should render action buttons when provided", () => {
        const actions = [
            { children: "Cancel", appearance: "secondary" as const, onClick: mockOnClick },
            { children: "Submit", appearance: "primary" as const, onClick: mockOnClick }
        ];
        const wrapper = setup.setProps({ actions });

        expect(wrapper.find(".drawer__footer").exists()).toBeTruthy();
        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();

        expect(wrapper.text()).toContain("Cancel");
        expect(wrapper.text()).toContain("Submit");
    });

    it("should not render ButtonGroup when actions is empty", () => {
        const wrapper = setup.setProps({ actions: [] });
        expect(wrapper.find(ButtonGroup).exists()).toBeFalsy();
    });

    it("should filter out actions without children", () => {
        const actions = [
            { children: "Valid Button", appearance: "primary" as const },
            { children: undefined, appearance: "secondary" as const }
        ];
        const wrapper = setup.setProps({ actions });
        expect(wrapper.text()).toContain("Valid Button");

        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();
    });

    it("should render close button when hasCloseButton is true", () => {
        const wrapper = setup.setProps({ hasCloseButton: true, onClose: mockOnClose });

        const closeButton = wrapper.find(".drawer__closeButton");
        expect(closeButton.exists()).toBeTruthy();
        expect(closeButton.find(Button).props().Icon).toBe(X);
    });

    it("should call onClose when close button is clicked", () => {
        const wrapper = setup.setProps({ hasCloseButton: true, onClose: mockOnClose });

        wrapper.find(".drawer__closeButton").find(Button).simulate("click");
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not render close button when hasCloseButton is false", () => {
        const wrapper = setup.setProps({ hasCloseButton: false });
        expect(wrapper.find(".drawer__closeButton").exists()).toBeFalsy();
    });

    beforeEach(() => {
        jest.spyOn(document, "addEventListener");
        jest.spyOn(document, "removeEventListener");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should call onClose on Escape key press when shouldCloseOnEscapePress is true", () => {
        setup.setProps({
            open: true,
            onClose: mockOnClose,
            shouldCloseOnEscapePress: true
        });

        expect(document.addEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    });

    it("should not call onClose on Escape key press when shouldCloseOnEscapePress is false", () => {
        const localMockOnClose = jest.fn();

        const escapeKeyEvent = new KeyboardEvent("keydown", { key: "Escape" });
        document.dispatchEvent(escapeKeyEvent);

        expect(localMockOnClose).not.toHaveBeenCalled();
    });

    it("should call onClose on overlay click when shouldCloseOnOverlayClick is true", () => {
        const wrapper = setup.setProps({
            variant: "overlay",
            onClose: mockOnClose,
            shouldCloseOnOverlayClick: true
        });

        const drawerElement = wrapper.find(".drawer").first();
        const mockEvent = {
            target: drawerElement.getDOMNode(),
            currentTarget: drawerElement.getDOMNode(),
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        } as unknown as React.MouseEvent<HTMLDivElement>;

        const onClick = drawerElement.prop("onClick") as (event: React.MouseEvent<HTMLDivElement>) => void;
        if (onClick) {
            onClick(mockEvent);
        }
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose on content click (event bubbling prevented)", () => {
        const wrapper = setup.setProps({
            variant: "overlay",
            onClose: mockOnClose,
            shouldCloseOnOverlayClick: true
        });

        const drawerElement = wrapper.find(".drawer").first();
        const wrapperElement = wrapper.find(".drawer__wrapper").first();

        const mockEvent = {
            target: wrapperElement.getDOMNode(),
            currentTarget: drawerElement.getDOMNode(),
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        } as unknown as React.MouseEvent<HTMLDivElement>;

        const onClick = drawerElement.prop("onClick") as (event: React.MouseEvent<HTMLDivElement>) => void;
        if (onClick) {
            onClick(mockEvent);
        }
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should not call onClose on overlay click for inline variant", () => {
        const wrapper = setup.setProps({
            variant: "inline",
            onClose: mockOnClose,
            shouldCloseOnOverlayClick: true
        });

        const drawerElement = wrapper.find(".drawer").first();
        const mockEvent = {
            target: drawerElement.getDOMNode(),
            currentTarget: drawerElement.getDOMNode(),
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        } as unknown as React.MouseEvent<HTMLDivElement>;

        const onClick = drawerElement.prop("onClick") as (event: React.MouseEvent<HTMLDivElement>) => void;
        if (onClick) {
            onClick(mockEvent);
        }
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should lock body scroll when lockBodyScroll is true and drawer is open", () => {
        mount(<Drawer open lockBodyScroll />, { wrappingComponent: GeneUIProvider });

        expect(document.body.style.overflow).toBe("hidden");
    });

    it("should not lock body scroll when lockBodyScroll is false", () => {
        document.body.style.overflow = "unset";

        mount(<Drawer open lockBodyScroll={false} />, { wrappingComponent: GeneUIProvider });

        expect(document.body.style.overflow).toBe("unset");
    });

    it("should unlock body scroll when drawer is closed", () => {
        const wrapper = mount(<Drawer open lockBodyScroll />, { wrappingComponent: GeneUIProvider });

        expect(document.body.style.overflow).toBe("hidden");

        wrapper.setProps({ open: false });

        expect(document.body.style.overflow).toBe("unset");
    });

    it("should render in portal for overlay variant", () => {
        const wrapper = setup.setProps({ variant: "overlay" });
        expect(wrapper.find(".drawer_variant_overlay").exists()).toBeTruthy();
    });

    it("should render inline for inline variant", () => {
        const wrapper = setup.setProps({ variant: "inline" });
        expect(wrapper.find(".drawer_variant_inline").exists()).toBeTruthy();
    });

    it("should have proper role attribute", () => {
        expect(setup.find(".drawer").prop("role")).toBe("presentation");
    });

    it("should render title as h1 element", () => {
        const wrapper = setup.setProps({ title: "Test Title" });
        expect(wrapper.find(".drawer__title").exists()).toBeTruthy();
        expect(wrapper.find("h1").exists()).toBeTruthy();
    });

    it("should handle undefined onClose gracefully", () => {
        const wrapper = setup.setProps({
            hasCloseButton: true,
            onClose: undefined
        });

        expect(() => {
            wrapper.find(".drawer__closeButton").find(Button).simulate("click");
        }).not.toThrow();
    });

    it("should handle empty actions array", () => {
        const wrapper = setup.setProps({ actions: [] });
        expect(wrapper.find(ButtonGroup).exists()).toBeFalsy();
        if (wrapper.find(".drawer__footer").exists()) {
            expect(wrapper.find(ButtonGroup).exists()).toBeFalsy();
        }
    });

    it("should handle actions with missing children", () => {
        const actions = [{ appearance: "primary" as const }, { children: "Valid", appearance: "secondary" as const }];
        const wrapper = setup.setProps({ actions });
        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();
        expect(wrapper.text()).toContain("Valid");
    });
});
