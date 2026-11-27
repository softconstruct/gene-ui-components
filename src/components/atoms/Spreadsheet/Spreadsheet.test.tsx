import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Spreadsheet, { ISpreadsheetProps } from "./index";

describe("Spreadsheet", () => {
    let setup: ReactWrapper<ISpreadsheetProps>;

    const Component = (
        <Spreadsheet open inset>
            <div className="spreadsheet-content">Test Content</div>
        </Spreadsheet>
    );

    beforeEach(() => {
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
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders children prop correct", () => {
        setup.setProps({ open: true });
        expect(provider().find(".spreadsheet-content").exists()).toBeTruthy();
    });

    it("should have className prop", () => {
        const className = "custom-class";
        setup.setProps({
            open: true,
            className,
            children: (
                <Spreadsheet open className={className}>
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        expect(provider().find(`.spreadsheet.${className}`).exists()).toBeTruthy();
    });

    it("should render inset class when inset is true", () => {
        setup.setProps({
            open: true,
            inset: true,
            children: (
                <Spreadsheet open inset>
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        expect(provider().find(".spreadsheet__body_inset").exists()).toBeTruthy();
    });

    it("should not render inset class when inset is false", () => {
        setup.setProps({
            open: true,
            inset: false,
            children: (
                <Spreadsheet open inset={false}>
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        expect(provider().find(".spreadsheet__body_inset").exists()).toBeFalsy();
    });

    it("should render full height class by default", () => {
        setup.setProps({ open: true });
        expect(provider().find(".spreadsheet__body_height_full").exists()).toBeTruthy();
    });

    it("should render fit height class when heightMode is fit", () => {
        setup.setProps({
            open: true,
            heightMode: "fit",
            children: (
                <Spreadsheet open heightMode="fit">
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        const wrapper = provider();
        expect(wrapper.find(".spreadsheet__body_height_fit").exists()).toBeTruthy();
        expect(wrapper.find(".scrollbar_height_auto").exists()).toBeTruthy();
    });

    it("should render compact height class with scrollable content when heightMode is compact", () => {
        setup.setProps({
            open: true,
            heightMode: "compact",
            children: (
                <Spreadsheet open heightMode="compact">
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        const wrapper = provider();
        expect(wrapper.find(".spreadsheet__body_height_compact").exists()).toBeTruthy();
        expect(wrapper.find(".spreadsheet__body_height_full").exists()).toBeFalsy();
        expect(wrapper.find(".scrollbar_height_full").exists()).toBeTruthy();
    });

    it("should not render when open is false", () => {
        setup.setProps({
            open: false,
            children: (
                <Spreadsheet open={false}>
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        expect(provider().find(".spreadsheet").exists()).toBeFalsy();
    });

    it("should handle open prop changes correctly", () => {
        setup.setProps({
            open: false,
            children: (
                <Spreadsheet open={false}>
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        expect(provider().find(".spreadsheet").exists()).toBeFalsy();

        setup.setProps({
            open: true,
            children: (
                <Spreadsheet open>
                    <div className="spreadsheet-content">Test Content</div>
                </Spreadsheet>
            )
        });
        expect(provider().find(".spreadsheet").exists()).toBeTruthy();
    });
});
