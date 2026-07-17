import React, { ChangeEvent } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import Button from "@components/atoms/Button";
import Label from "@components/atoms/Label";
import { FileUploadItem, FileUploadList } from "@components/molecules/FileUploadList";
import ProgressBar from "@components/molecules/ProgressBar";

import Uploader, { IUploaderProps } from "./index";

const createFileList = (file: File) =>
    ({
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null)
    }) as unknown as FileList;

describe("Uploader ", () => {
    let setup: ReactWrapper<IUploaderProps>;
    const originalFileReader = global.FileReader;

    beforeEach(() => {
        class MockFileReader {
            onload: ((event?: ProgressEvent<FileReader>) => void) | null = null;

            onerror: ((event?: ProgressEvent<FileReader>) => void) | null = null;

            readAsArrayBuffer() {
                this.onload?.({} as ProgressEvent<FileReader>);
            }
        }

        global.FileReader = MockFileReader as unknown as typeof FileReader;
        setup = mount(<Uploader />);
    });

    afterEach(async () => {
        await act(async () => {
            await Promise.resolve();
        });
        setup.unmount();
        global.FileReader = originalFileReader;
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

        expect(wrapper.find(Label).prop("text")).toBe(label);
    });

    it("renders description prop correctly", () => {
        const description = "Uploader description";
        const wrapper = setup.setProps({ description, type: "button" });

        expect(wrapper.find(".uploader__description").first().text()).toBe(description);
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

    it("renders uploadText for both uploader types", () => {
        const uploadText = "Select file";
        const wrapper = setup.setProps({ type: "dropZone", uploadText });

        expect(wrapper.find(".uploader__browseTrigger").text()).toBe(uploadText);

        wrapper.setProps({ type: "button" });

        expect(wrapper.find(Button).text()).toBe(uploadText);
    });

    it("calls onChange with file list when files are selected", async () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ type: "button", onChange });
        const selectedFile = new File(["content"], "test.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "test.pdf" }
        } as ChangeEvent<HTMLInputElement>);

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls[0][0][0].name).toBe("test.pdf");
        expect(onChange.mock.calls[0][0][0].loading).toBe(true);

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.update();

        expect(onChange.mock.calls.at(-1)?.[0][0].loading).toBe(false);
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
        const dropZoneText = "Drag and Drop file or";
        const wrapper = setup.setProps({ type: "dropZone", dropZoneText });

        expect(wrapper.find(".uploader__browseTrigger").exists()).toBeTruthy();
        expect(wrapper.find(".uploader__title").first().text()).toBe(dropZoneText);
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

    it("keeps drag active class when dragging over nested dropzone children", () => {
        const wrapper = setup.setProps({ type: "dropZone", dropZoneText: "Drag and Drop file or" });

        wrapper.find(".uploader__dropZone").simulate("dragenter", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        });
        expect(wrapper.find(".uploader__dropZone_dragActive").exists()).toBeTruthy();

        wrapper.find(".uploader__dropZone").simulate("dragleave", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            relatedTarget: wrapper.find(".uploader__browseTrigger").getDOMNode()
        });
        wrapper.update();

        expect(wrapper.find(".uploader__dropZone_dragActive").exists()).toBeTruthy();
    });

    it("adds dropped files and calls onChange", async () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ type: "dropZone", onChange });
        const droppedFile = new File(["dropped"], "dropped.pdf", { type: "application/pdf" });

        wrapper.find(".uploader__dropZone").simulate("drop", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            dataTransfer: { files: createFileList(droppedFile) }
        });

        expect(onChange).toHaveBeenCalled();
        expect(wrapper.find(FileUploadItem).props().name).toBe("dropped.pdf");
        expect(wrapper.find(FileUploadItem).props().loading).toBe(true);
        expect(wrapper.find(ProgressBar).props().type).toBe("indeterminate");

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.update();
    });

    it("does not open picker or handle drop when dropzone is disabled", () => {
        const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => undefined);
        const onChange = jest.fn();
        const droppedFile = new File(["dropped"], "dropped.pdf", { type: "application/pdf" });
        const wrapper = setup.setProps({ type: "dropZone", disabled: true, onChange });

        wrapper.find(".uploader__browseTrigger").simulate("click");
        wrapper.find(".uploader__dropZone").simulate("drop", {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            dataTransfer: { files: createFileList(droppedFile) }
        });

        expect(clickSpy).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
        clickSpy.mockRestore();
    });

    it("does not render file list when files prop is empty", () => {
        const wrapper = setup.setProps({ files: [] });

        expect(wrapper.find(FileUploadList).exists()).toBeFalsy();
    });

    it("renders FileUploadList items from files prop", () => {
        const files = [
            {
                id: "1",
                name: "Invoice.pdf",
                time: "10:03 AM",
                size: "1,3 MB",
                type: "file" as const
            },
            {
                id: "2",
                name: "Photo.png",
                time: "10:05 AM",
                size: "2 MB",
                type: "image" as const,
                loading: true,
                progressPercent: 70,
                uploadingText: "Uploading"
            }
        ];
        const wrapper = setup.setProps({ files });

        expect(wrapper.find(FileUploadList).exists()).toBeTruthy();
        expect(wrapper.find(FileUploadItem)).toHaveLength(2);
        expect(wrapper.find(FileUploadItem).at(0).props().name).toBe("Invoice.pdf");
        expect(wrapper.find(FileUploadItem).at(1).props().loading).toBe(true);
    });

    it("renders error state from files prop", () => {
        const files = [
            {
                id: "error-1",
                name: "Large.pdf",
                time: "10:03 AM",
                size: "30 MB",
                type: "file" as const,
                status: "error" as const,
                helperText: "File is too large"
            }
        ];
        const wrapper = setup.setProps({ files });

        expect(wrapper.find(FileUploadItem).props().status).toBe("error");
        expect(wrapper.find(FileUploadItem).props().helperText).toBe("File is too large");
    });

    it("shows indeterminate progress while processing a selected file", async () => {
        const wrapper = mount(<Uploader type="button" />);
        const selectedFile = new File(["content"], "report.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "report.pdf" }
        });

        expect(wrapper.find(FileUploadList).exists()).toBeTruthy();
        expect(wrapper.find(FileUploadItem).props().name).toBe("report.pdf");
        expect(wrapper.find(FileUploadItem).props().loading).toBe(true);
        expect(wrapper.find(ProgressBar).props().type).toBe("indeterminate");

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.update();

        expect(wrapper.find(FileUploadItem).props().loading).toBe(false);
    });

    it("completes all selected files when multiple files are uploaded", async () => {
        const wrapper = mount(<Uploader type="button" multiple />);
        const selectedFiles = [
            new File(["one"], "one.pdf", { type: "application/pdf" }),
            new File(["two"], "two.pdf", { type: "application/pdf" }),
            new File(["three"], "three.pdf", { type: "application/pdf" })
        ];

        wrapper.find('input[type="file"]').simulate("change", {
            target: {
                files: {
                    0: selectedFiles[0],
                    1: selectedFiles[1],
                    2: selectedFiles[2],
                    length: 3,
                    item: (index: number) => selectedFiles[index] ?? null
                },
                value: "one.pdf"
            }
        });

        expect(wrapper.find(FileUploadItem)).toHaveLength(3);
        expect(wrapper.find(FileUploadItem).map((item) => item.props().loading)).toEqual([true, true, true]);

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.update();

        expect(wrapper.find(FileUploadItem)).toHaveLength(3);
        expect(wrapper.find(FileUploadItem).map((item) => item.props().loading)).toEqual([false, false, false]);
        wrapper.unmount();
    });

    it("prepends newly selected files to the start of the list", async () => {
        const wrapper = mount(<Uploader type="button" multiple />);
        const firstFile = new File(["first"], "first.pdf", { type: "application/pdf" });
        const secondFile = new File(["second"], "second.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(firstFile), value: "first.pdf" }
        });

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.update();

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(secondFile), value: "second.pdf" }
        });
        wrapper.update();

        expect(wrapper.find(FileUploadItem).map((item) => item.props().name)).toEqual(["second.pdf", "first.pdf"]);

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.unmount();
    });

    it("calls upload and updates progress dynamically", async () => {
        let resolveUpload: (() => void) | undefined;
        const upload = jest.fn(
            ({ onProgress }) =>
                new Promise<void>((resolve) => {
                    resolveUpload = () => {
                        onProgress(40);
                        onProgress(100);
                        resolve();
                    };
                })
        );
        const wrapper = mount(<Uploader type="button" upload={upload} />);
        const selectedFile = new File(["content"], "done.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "done.pdf" }
        });

        expect(wrapper.find(FileUploadItem).props().loading).toBe(true);
        expect(wrapper.find(FileUploadItem).props().progressPercent).toBeUndefined();
        expect(wrapper.find(ProgressBar).props().type).toBe("indeterminate");
        expect(upload).toHaveBeenCalled();

        await act(async () => {
            resolveUpload?.();
            await Promise.resolve();
        });
        wrapper.update();

        expect(wrapper.find(FileUploadItem).props().loading).toBe(false);
        expect(wrapper.find(FileUploadItem).props().progressPercent).toBeUndefined();
    });

    it("marks file as error when upload rejects", async () => {
        const upload = jest.fn(async () => {
            throw new Error("Network error");
        });
        const wrapper = mount(<Uploader type="button" upload={upload} />);
        const selectedFile = new File(["content"], "fail.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "fail.pdf" }
        });

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.update();

        expect(wrapper.find(FileUploadItem).props().status).toBe("error");
        expect(wrapper.find(FileUploadItem).props().helperText).toBe("Network error");
    });

    it("marks oversized files as error using maxFileSize", () => {
        const wrapper = mount(<Uploader type="button" maxFileSize={10} sizeErrorMsg="File is too large" />);
        const selectedFile = new File(["01234567890123456789"], "large.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "large.pdf" }
        });

        expect(wrapper.find(FileUploadItem).props().status).toBe("error");
        expect(wrapper.find(FileUploadItem).props().helperText).toBe("File is too large");
    });

    it("applies getActions to selected files", async () => {
        const onView = jest.fn();
        const wrapper = mount(
            <Uploader
                type="button"
                getActions={(file) => [
                    {
                        Icon: () => null,
                        name: "View file",
                        onClick: () => onView(file)
                    }
                ]}
            />
        );
        const selectedFile = new File(["content"], "photo.png", { type: "image/png" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "photo.png" }
        });

        const { actions } = wrapper.find(FileUploadItem).props();
        expect(actions).toHaveLength(1);
        expect(actions?.[0].name).toBe("View file");
        actions?.[0].onClick?.({} as React.MouseEvent<HTMLButtonElement>);
        expect(onView).toHaveBeenCalled();

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.unmount();
    });

    it("does not render actions when getActions is omitted", async () => {
        const wrapper = mount(<Uploader type="button" />);
        const selectedFile = new File(["content"], "no-actions.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "no-actions.pdf" }
        });

        expect(wrapper.find(FileUploadItem).props().actions).toBeUndefined();

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.unmount();
    });

    it("removes a file when removeFile helper is used from getActions", async () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <Uploader
                type="button"
                onChange={onChange}
                getActions={(_file, { removeFile }) => [
                    {
                        Icon: () => null,
                        name: "Remove file",
                        onClick: () => removeFile()
                    }
                ]}
            />
        );
        const selectedFile = new File(["content"], "remove-me.pdf", { type: "application/pdf" });

        wrapper.find('input[type="file"]').simulate("change", {
            target: { files: createFileList(selectedFile), value: "remove-me.pdf" }
        });

        const { actions } = wrapper.find(FileUploadItem).props();
        act(() => {
            actions?.[0].onClick?.({} as React.MouseEvent<HTMLButtonElement>);
        });
        wrapper.update();

        expect(wrapper.find(FileUploadItem).exists()).toBeFalsy();
        expect(onChange).toHaveBeenLastCalledWith([]);

        await act(async () => {
            await Promise.resolve();
        });
        wrapper.unmount();
    });
});
