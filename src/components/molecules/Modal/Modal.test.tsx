import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ErrorFilled, Info, TriangleAlert } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Modal, { IModalProps } from "./index";

describe("Modal ", () => {
    let setup: ReactWrapper<IModalProps>;
    beforeEach(() => {
        setup = mount(<Modal withPadding open />, { wrappingComponent: GeneUIProvider });
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".modal")).toHaveLength(1);
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".modal").hasClass(className)).toBeTruthy();
    });

    it("renders open prop correctly", () => {
        expect(setup.find(".modal").exists()).toBeTruthy();
    });

    it("does not render when open is false", () => {
        const wrapper = setup.setProps({ open: false });
        expect(wrapper.find(".modal").exists()).toBeFalsy();
    });

    it("renders title and status correctly", () => {
        const wrapper = setup.setProps({ title: "Modal Title", status: "informative" });
        expect(wrapper.find(".modal__title").first().text()).toEqual("Modal Title");
        expect(wrapper.find(".modal_status_informative").exists()).toBeTruthy();
    });

    it("renders hasCloseButton prop correctly", () => {
        const wrapper = setup.setProps({ hasCloseButton: true });
        expect(wrapper.find(".modal__header").exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it("handles onClose from close button click", () => {
        const onCloseMock = jest.fn();
        const wrapper = setup.setProps({ hasCloseButton: true, onClose: onCloseMock });
        wrapper.find(Button).simulate("click");
        expect(onCloseMock).toHaveBeenCalled();
    });

    it("handles onClose from overlay click", () => {
        const onCloseMock = jest.fn();
        const wrapper = setup.setProps({ shouldCloseOnOverlayClick: true, onClose: onCloseMock });
        const modalElement = wrapper.find(".modal").first();
        modalElement.simulate("click", { target: modalElement.getDOMNode(), currentTarget: modalElement.getDOMNode() });
        expect(onCloseMock).toHaveBeenCalled();
    });

    it("renders actions correctly", () => {
        const actions = [{ children: "OK", onClick: jest.fn() }];
        const wrapper = setup.setProps({ actions });
        expect(wrapper.find(".modal__footer").exists()).toBeTruthy();
        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();
    });

    it("does not render footer when no actions or footerContent", () => {
        expect(setup.find(".modal__footer").exists()).toBeFalsy();
    });

    it("renders footerContent correctly", () => {
        const footerContent = <div className="custom-footer">Custom Footer</div>;
        const wrapper = setup.setProps({ footerContent });
        expect(wrapper.find(".modal__footerContent").exists()).toBeTruthy();
        expect(wrapper.find(".custom-footer").exists()).toBeTruthy();
    });

    it("renders string children as Text component", () => {
        const wrapper = setup.setProps({ children: "Modal content text" });
        expect(wrapper.find(Text).exists()).toBeTruthy();
        expect(wrapper.find(Text).text()).toEqual("Modal content text");
    });

    it("renders withPadding prop correctly", () => {
        const wrapper = setup.setProps({ withPadding: true });
        expect(wrapper.find(".modal__wrapper").hasClass("modal_withPadding")).toBeTruthy();
    });

    it.each<IModalProps["size"]>(["xxLarge", "xLarge", "large", "medium", "small"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".modal").hasClass(`modal_size_${size}`)).toBeTruthy();
    });

    it.each<IModalProps["status"]>(["informative", "warning", "error"])("should have %s status icon", (status) => {
        const iconMap = {
            informative: Info,
            warning: TriangleAlert,
            error: ErrorFilled
        } as const;
        const wrapper = setup.setProps({ title: "Test", status });
        if (status) {
            expect(wrapper.find(iconMap[status]).exists()).toBeTruthy();
        }
    });

    it.each<IModalProps["position"]>(["top", "center"])("should have %s position", (position) => {
        const wrapper = setup.setProps({ position });
        expect(wrapper.find(".modal").hasClass(`modal_position_${position}`)).toBeTruthy();
    });
});
