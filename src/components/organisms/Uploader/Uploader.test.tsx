import React, { ChangeEvent } from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";

import Uploader, { IUploaderProps } from "./index";

describe("Uploader ", () => {
    let setup: ReactWrapper<IUploaderProps>;
    beforeEach(() => {
        setup = mount(<Uploader />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = "Uploader Label";
        const wrapper = setup.setProps({ label });

        expect(wrapper.find(".uploader__label").text()).toBe(label);
    });

    it("renders description prop correctly", () => {
        const description = "Uploader description";
        const wrapper = setup.setProps({ description, type: "button" });

        expect(wrapper.find(Text).text()).toBe(description);
    });

    it("renders hidden file input for button type", () => {
        const wrapper = setup.setProps({ type: "button" });

        expect(wrapper.find('input[type="file"]').exists()).toBeTruthy();
        expect(wrapper.find('input[type="file"]').hasClass("uploader__input")).toBeTruthy();
    });

    it("opens file picker when upload button is clicked", () => {
        const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => undefined);
        const wrapper = setup.setProps({ type: "button" });

        wrapper.find(Button).simulate("click");

        expect(clickSpy).toHaveBeenCalled();
        clickSpy.mockRestore();
    });

    it("calls onChange when files are selected", () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ type: "button", onChange });
        const mockFiles = [{ name: "test.pdf" }] as unknown as FileList;

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: mockFiles, value: "test.pdf" }
        } as ChangeEvent<HTMLInputElement>);

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls[0][0].target.files).toBe(mockFiles);
    });

    it("does not open file picker when disabled", () => {
        const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => undefined);
        const wrapper = setup.setProps({ type: "button", disabled: true });

        expect(wrapper.find(Button).props().disabled).toBe(true);
        wrapper.find(Button).simulate("click");

        expect(clickSpy).not.toHaveBeenCalled();
        clickSpy.mockRestore();
    });

    it("renders dropzone browse trigger", () => {
        const wrapper = setup.setProps({ type: "dropZone" });

        expect(wrapper.find(".uploader__browseTrigger").exists()).toBeTruthy();
    });

    it("opens file picker when dropzone browse trigger is clicked", () => {
        const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => undefined);
        const wrapper = setup.setProps({ type: "dropZone" });

        wrapper.find(".uploader__browseTrigger").simulate("click");

        expect(clickSpy).toHaveBeenCalled();
        clickSpy.mockRestore();
    });

    it("adds drag active class on drag enter and removes it on drag leave", () => {
        const wrapper = setup.setProps({ type: "dropZone" });

        wrapper.find(".uploader__dropZone").simulate("dragenter", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        });
        expect(wrapper.find(".uploader__dropZone_dragActive").exists()).toBeTruthy();

        wrapper.find(".uploader__dropZone").simulate("dragleave", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        });
        expect(wrapper.find(".uploader__dropZone_dragActive").exists()).toBeFalsy();
    });

    it("calls onDrop when files are dropped on dropzone", () => {
        const onDrop = jest.fn();
        const mockFiles = [{ name: "dropped.pdf" }] as unknown as FileList;
        const wrapper = setup.setProps({ type: "dropZone", onDrop });

        wrapper.find(".uploader__dropZone").simulate("drop", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            dataTransfer: { files: mockFiles }
        });

        expect(onDrop).toHaveBeenCalledWith(mockFiles);
    });

    it("does not open picker or handle drop when dropzone is disabled", () => {
        const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => undefined);
        const onDrop = jest.fn();
        const mockFiles = [{ name: "dropped.pdf" }] as unknown as FileList;
        const wrapper = setup.setProps({ type: "dropZone", disabled: true, onDrop });

        wrapper.find(".uploader__browseTrigger").simulate("click");
        wrapper.find(".uploader__dropZone").simulate("drop", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            dataTransfer: { files: mockFiles }
        });

        expect(clickSpy).not.toHaveBeenCalled();
        expect(onDrop).not.toHaveBeenCalled();
        clickSpy.mockRestore();
    });
});
