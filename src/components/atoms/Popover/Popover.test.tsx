import React from "react";
import { mount, ReactWrapper } from "enzyme";

import GeneUIProvider from "../../providers/GeneUIProvider";
import Button from "../Button";
// Components
import { IPopoverProps, Popover, PopoverBody } from "./index";
import PopoverFooter from "./PopoverFooter";
import PopoverFooterActions from "./PopoverFooterActions";

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

    it("renders PopoverFooterActions child correct", () => {
        const child = "test";
        setup.setProps({
            open: true,
            children: (
                <PopoverFooter>
                    <PopoverFooterActions>
                        <Button onClick={() => {}}>{child}</Button>
                    </PopoverFooterActions>
                </PopoverFooter>
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
});
