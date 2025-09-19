import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import Banner, { IBannerProps } from "@components/molecules/Banner";
import GeneUIProvider from "@components/providers/GeneUIProvider";

const text = "Title";

describe("Banner ", () => {
    let setup: ReactWrapper<IBannerProps>;
    const mockOnClose = jest.fn();
    const mockOnPrimaryAction = jest.fn();
    const mockOnSecondaryAction = jest.fn();

    beforeEach(() => {
        setup = mount(<Banner text={text} status="informative" open />, {
            wrappingComponent: GeneUIProvider
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders default CSS class correctly", () => {
        expect(setup.find(".banner")).toHaveLength(1);
    });

    it("renders text prop correctly", () => {
        expect(setup.find(".banner__text").first().text()).toEqual(text);
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".banner").hasClass(className)).toBeTruthy();
    });

    it.each<IBannerProps["status"]>(["informative", "warning", "error"])("should have %s status", (status) => {
        const wrapper = setup.setProps({ status });
        expect(wrapper.find(".banner").hasClass(`banner_state_${status}`)).toBeTruthy();
    });

    it("should not be open when open prop is false", () => {
        const wrapper = setup.setProps({ open: false });
        wrapper.update();
        expect(wrapper.find(".banner").exists()).toBeFalsy();
    });

    it("renders primary action button when primaryActionText is provided", () => {
        const wrapper = mount(
            <Banner
                text={text}
                status="informative"
                open
                primaryActionText="Primary Action"
                onPrimaryActionClick={mockOnPrimaryAction}
                onClose={mockOnClose}
            />,
            { wrappingComponent: GeneUIProvider }
        );
        expect(wrapper.find(".banner__actions").exists()).toBeTruthy();
        expect(wrapper.find(Button).at(0).text()).toEqual("Primary Action");
    });

    it("renders secondary action button when secondaryActionText is provided", () => {
        const wrapper = mount(
            <Banner
                text={text}
                status="informative"
                open
                secondaryActionText="Secondary Action"
                onSecondaryActionClick={mockOnSecondaryAction}
                onClose={mockOnClose}
            />,
            { wrappingComponent: GeneUIProvider }
        );
        expect(wrapper.find(".banner__actions").exists()).toBeTruthy();
        expect(wrapper.find(Button).at(0).text()).toEqual("Secondary Action");
    });

    it("renders both action buttons when both texts are provided", () => {
        const wrapper = mount(
            <Banner
                text={text}
                status="informative"
                open
                primaryActionText="Primary"
                secondaryActionText="Secondary"
                onPrimaryActionClick={mockOnPrimaryAction}
                onSecondaryActionClick={mockOnSecondaryAction}
                onClose={mockOnClose}
            />,
            { wrappingComponent: GeneUIProvider }
        );
        expect(wrapper.find(".banner__actions").exists()).toBeTruthy();
        expect(wrapper.find(Button)).toHaveLength(3); // 2 action buttons + close button
    });

    it("does not render action buttons when no action texts are provided", () => {
        expect(setup.find(".banner__actions").exists()).toBeFalsy();
    });

    it("handles primary action button click", () => {
        const wrapper = mount(
            <Banner
                text={text}
                status="informative"
                open
                primaryActionText="Primary Action"
                onPrimaryActionClick={mockOnPrimaryAction}
                onClose={mockOnClose}
            />,
            { wrappingComponent: GeneUIProvider }
        );
        wrapper.find(Button).at(0).simulate("click");
        expect(mockOnPrimaryAction).toHaveBeenCalled();
    });

    it("handles secondary action button click", () => {
        const wrapper = mount(
            <Banner
                text={text}
                status="informative"
                open
                secondaryActionText="Secondary Action"
                onSecondaryActionClick={mockOnSecondaryAction}
                onClose={mockOnClose}
            />,
            { wrappingComponent: GeneUIProvider }
        );
        wrapper.find(Button).at(0).simulate("click");
        expect(mockOnSecondaryAction).toHaveBeenCalled();
    });

    it("handles close button click", () => {
        const wrapper = mount(<Banner text={text} status="informative" open onClose={mockOnClose} />, {
            wrappingComponent: GeneUIProvider
        });
        wrapper.find(Button).simulate("click");
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("renders close button when onClose is provided", () => {
        const wrapper = mount(<Banner text={text} status="informative" open onClose={mockOnClose} />, {
            wrappingComponent: GeneUIProvider
        });
        expect(wrapper.find(Button).exists()).toBeTruthy();
        expect(wrapper.find(".banner__close").exists()).toBeTruthy();
    });

    it("does not render close button when onClose is not provided", () => {
        expect(setup.find(Button).exists()).toBeFalsy();
    });
});
