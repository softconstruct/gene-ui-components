import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { ErrorFilled, Info, TriangleAlert } from "@geneui/icons";

// Components
import ButtonGroup from "../../molecules/ButtonGroup";
import GeneUIProvider from "../../providers/GeneUIProvider";
import Button from "../Button";
import { IPopoverProps, Popover, PopoverBody } from "./index";
import PopoverFooter, { IPopoverFooterActionProps } from "./PopoverFooter";

describe("Popover", () => {
    let setup: ReactWrapper<IPopoverProps>;

    const Component = (
        <Popover size="small" margin={0} setProps={() => {}}>
            <PopoverBody>
                <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
            </PopoverBody>
        </Popover>
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

    it.each<IPopoverProps["size"]>(["xLarge", "large", "medium", "small", "fitContent"])(
        "should have %p size",
        (size) => {
            setup.setProps({ open: true, size });
            expect(provider().find(`.popover_size_${size}`).exists()).toBeTruthy();
        }
    );

    it("renders fitReference prop correct", () => {
        const fitReference = true;
        setup.setProps({ open: true, fitReference });
        expect(provider().find(`.popover_size_reference`).exists()).toBeTruthy();
    });

    it("renders PopoverFooter actions correct", () => {
        const child = "test";
        setup.setProps({
            open: true,
            children: (
                <PopoverFooter
                    actions={[
                        {
                            text: child,
                            onClick: () => {}
                        }
                    ]}
                />
            )
        });
        expect(provider().find(Button).first().props().children).toBe(child);
    });

    it("renders withArrow prop correct", () => {
        setup.setProps({
            withArrow: true,
            open: true
        });
        expect(provider().find(".popover__arrowPath").exists()).toBeTruthy();
    });

    it("renders hasCloseButton prop correctly", () => {
        setup.setProps({
            hasCloseButton: true,
            open: true,
            title: "Test Title"
        });
        expect(provider().find(".popover__close").exists()).toBeTruthy();
    });

    it("does not render icon when Icon prop is not provided", () => {
        setup.setProps({
            open: true,
            title: "Test Title"
        });
        expect(provider().find(".popover__title_icon").exists()).toBeFalsy();
    });

    it("renders custom Icon prop correctly", () => {
        setup.setProps({
            open: true,
            title: "Test Title",
            Icon: ErrorFilled
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
    });

    it("renders different custom icons correctly", () => {
        setup.setProps({
            open: true,
            title: "Test Title",
            Icon: TriangleAlert
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();

        setup.setProps({
            Icon: Info
        });
        expect(provider().find(".popover__title_icon").exists()).toBeTruthy();
    });

    it("renders multiple PopoverFooter actions correctly", () => {
        const actions: IPopoverFooterActionProps[] = [
            { text: "Primary", appearance: "primary", onClick: () => {} },
            { text: "Secondary", appearance: "secondary", onClick: () => {} },
            { text: "Cancel", appearance: "danger", onClick: () => {} }
        ];
        setup.setProps({
            open: true,
            children: <PopoverFooter actions={actions} />
        });
        const buttons = provider().find(Button);
        expect(buttons).toHaveLength(3);
        expect(buttons.at(0).props().children).toBe("Primary");
        expect(buttons.at(1).props().children).toBe("Secondary");
        expect(buttons.at(2).props().children).toBe("Cancel");
    });

    it("renders PopoverFooter actions with icons correctly", () => {
        setup.setProps({
            open: true,
            children: (
                <PopoverFooter
                    actions={[
                        { Icon: Info, text: "View", onClick: () => {} },
                        { Icon: Info, onClick: () => {} }
                    ]}
                />
            )
        });
        const buttons = provider().find(Button);
        expect(buttons).toHaveLength(2);
        expect(buttons.at(0).props().Icon).toBe(Info);
        expect(buttons.at(0).props().children).toBe("View");
    });

    it("renders PopoverFooter children alongside actions", () => {
        setup.setProps({
            open: true,
            children: (
                <PopoverFooter actions={[{ text: "Action", onClick: () => {} }]}>
                    <div className="footer-content">Footer Content</div>
                </PopoverFooter>
            )
        });
        expect(provider().find(".footer-content").exists()).toBeTruthy();
        expect(provider().find(Button).exists()).toBeTruthy();
        expect(provider().find(ButtonGroup).exists()).toBeTruthy();
    });

    it("renders ButtonGroup when actions are provided", () => {
        setup.setProps({
            open: true,
            children: <PopoverFooter actions={[{ text: "Action", onClick: () => {} }]} />
        });
        expect(provider().find(ButtonGroup).exists()).toBeTruthy();
        expect(provider().find(ButtonGroup).hasClass("popover__footerActions")).toBeTruthy();
    });

    it("does not render ButtonGroup when actions array is empty", () => {
        setup.setProps({
            open: true,
            children: <PopoverFooter actions={[]} />
        });
        expect(provider().find(ButtonGroup).exists()).toBeFalsy();
    });

    it("does not render ButtonGroup when actions prop is undefined", () => {
        setup.setProps({
            open: true,
            children: <PopoverFooter />
        });
        expect(provider().find(ButtonGroup).exists()).toBeFalsy();
    });

    it("calls action onClick handler when action button is clicked", () => {
        const onClickMock = jest.fn();
        setup.setProps({
            open: true,
            children: <PopoverFooter actions={[{ text: "Test Action", onClick: onClickMock }]} />
        });
        provider().find(Button).first().simulate("click");
        expect(onClickMock).toHaveBeenCalled();
    });

    it("does not close when pointer down starts inside popover and click ends outside", () => {
        const onClose = jest.fn();

        const wrapper = mount(
            <Popover size="small" margin={0} setProps={() => {}} defaultOpen onClose={onClose}>
                <PopoverBody>
                    <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
                </PopoverBody>
            </Popover>,
            { wrappingComponent: GeneUIProvider }
        );

        const popoverElement = wrapper.getWrappingComponent().find(".popover").first().getDOMNode() as HTMLElement;

        act(() => {
            popoverElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        wrapper.update();
        expect(onClose).not.toHaveBeenCalled();
        wrapper.unmount();
    });
});
