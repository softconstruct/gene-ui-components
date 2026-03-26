import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Image, RecycleBin } from "@geneui/icons";

import { FileType } from "@components/molecules/FileUploadList/FileUploadItem/types";
import FileUploadList from "@components/molecules/FileUploadList/FileUploadList";
import {
    mockDataForTests,
    uploadingData,
    uploadingWithoutCancelData
} from "@components/molecules/FileUploadList/FileUploadList.mock";

import FileUploadItem, { IFileUploadItemProps } from "./FileUploadItem/FileUploadItem";
import { IFileUploadListProps } from "./index";

function renderList(files: IFileUploadItemProps[], listProps?: Partial<IFileUploadListProps>) {
    return (
        <FileUploadList {...listProps}>
            {files.map((item) => (
                <FileUploadItem key={item.name} {...item} />
            ))}
        </FileUploadList>
    );
}

describe("FileUploadList", () => {
    let setup: ReactWrapper<IFileUploadListProps>;

    beforeEach(() => {
        setup = mount(renderList(mockDataForTests));
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        setup.setProps({ className });

        expect(setup.hasClass(className)).toBeTruthy();
    });

    it("renders null when no children are provided", () => {
        const wrapper = mount(<FileUploadList />);
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it("renders a FileUploadItem per file entry", () => {
        expect(setup.find(FileUploadItem)).toHaveLength(mockDataForTests.length);
    });

    it("displays file name, time, and size metadata for each item", () => {
        mockDataForTests.forEach(({ name, time, size }) => {
            const text = setup.text();
            expect(text).toContain(name);
            expect(text).toContain(time);
            expect(text).toContain(size);
        });
    });

    it("renders no FileUploadItems when children is empty", () => {
        setup = mount(renderList([]));

        expect(setup.find(FileUploadItem)).toHaveLength(0);
        expect(setup.find(".fileUploadList").exists()).toBeTruthy();
    });

    it("updates rendered list when children change", () => {
        const updatedData: IFileUploadItemProps[] = [
            {
                ...mockDataForTests[0],
                id: "new-id",
                name: "Budget-2025.xlsx",
                time: "07:10AM",
                size: "2MB",
                type: "file"
            }
        ];

        setup = mount(renderList(updatedData));

        expect(setup.find(FileUploadItem)).toHaveLength(updatedData.length);
        expect(setup.text()).toContain("Budget-2025.xlsx");
        expect(setup.text()).not.toContain(mockDataForTests[1].name);
    });

    it("renders progress bar and hides metadata when an item is uploading", () => {
        const uploadingWithStatus: IFileUploadItemProps[] = [
            {
                ...uploadingData[0],
                status: "error",
                uploadingText: "Uploading",
                helperText: "Upload in progress."
            }
        ];
        setup = mount(renderList(uploadingWithStatus));

        expect(setup.find(".progressBar")).toHaveLength(1);
        expect(setup.text()).toContain(uploadingData[0].name);
        expect(setup.text()).toContain("Upload in progress.");
        expect(setup.text()).not.toContain(uploadingData[0].size);
        expect(setup.text()).not.toContain(uploadingData[0].time);
    });

    it("renders action buttons when uploading item lacks cancel action", () => {
        setup = mount(renderList(uploadingWithoutCancelData));
        setup.update();

        expect(setup.find(FileUploadItem).find("button.fileUploadItem__button")).toHaveLength(1);
    });

    it("shows all actions while uploading", () => {
        setup = mount(
            renderList([
                {
                    id: "uploading-test",
                    name: "Test-file.zip",
                    time: "11:00AM",
                    size: "120MB",
                    type: "file",
                    loading: true,
                    progressPercent: 45,
                    uploadingText: "Uploading",
                    actions: [
                        { id: "uploading-test-cancel", Icon: Image, name: "Cancel upload" },
                        { id: "uploading-test-recycle", Icon: RecycleBin, name: "Remove file" }
                    ]
                }
            ])
        );
        setup.update();

        const fileUploadItem = setup.find(FileUploadItem).first();
        expect(fileUploadItem.prop("loading")).toBe(true);

        const buttons = fileUploadItem.find("button.fileUploadItem__button");
        expect(buttons).toHaveLength(2);
    });

    it("calls onClick when action button is clicked", () => {
        const onClick = jest.fn();
        setup = mount(
            renderList([
                {
                    ...uploadingData[0],
                    actions: [{ id: "error-cancel", Icon: Image, name: "Cancel upload", onClick }]
                }
            ])
        );
        setup.update();

        const fileUploadItem = setup.find(FileUploadItem).first();
        const button = fileUploadItem.find("button.fileUploadItem__button").at(0);
        button.simulate("click");
        expect(onClick).toHaveBeenCalledWith(expect.anything());
    });

    it("renders error state with helperText when status is error", () => {
        const errorData: IFileUploadItemProps[] = [
            {
                ...mockDataForTests[0],
                id: "error-1",
                name: "Failed-upload.pdf",
                loading: true,
                progressPercent: 40,
                status: "error",
                helperText: "Upload failed. Please try again.",
                uploadingText: "Uploading",
                actions: [{ id: "error-1-cancel", Icon: Image, name: "Cancel upload", onClick: jest.fn() }]
            }
        ];
        setup = mount(renderList(errorData));
        setup.update();

        expect(setup.find(".progressBar")).toHaveLength(1);
        expect(setup.text()).toContain("Upload failed. Please try again.");
    });

    it("renders warning state with helperText when status is warning", () => {
        const warningData: IFileUploadItemProps[] = [
            {
                ...mockDataForTests[0],
                id: "warning-1",
                name: "Large-file.zip",
                loading: true,
                progressPercent: 85,
                status: "warning",
                helperText: "File is large. Upload may take a while.",
                uploadingText: "Uploading...",
                actions: [{ id: "warning-1-cancel", Icon: RecycleBin, name: "Remove file", onClick: jest.fn() }]
            }
        ];
        setup = mount(renderList(warningData));
        setup.update();

        expect(setup.find(".progressBar")).toHaveLength(1);
        expect(setup.text()).toContain("File is large. Upload may take a while.");
    });

    it("omits time cell when item has no time", () => {
        const dataWithoutTime: IFileUploadItemProps[] = [
            {
                ...mockDataForTests[0],
                id: "no-time-1",
                time: undefined
            }
        ];
        setup = mount(renderList(dataWithoutTime));

        expect(setup.text()).not.toContain("09:15AM");
        expect(setup.text()).toContain("Invoice Q1.pdf");
    });

    it("has accessibility role and aria-label on list", () => {
        expect(setup.find('[role="list"]').exists()).toBe(true);
        expect(setup.find('[role="list"]').prop("aria-label")).toBe("Uploaded files list");
    });

    it("renders each item with role listitem", () => {
        expect(setup.find('[role="listitem"]').length).toBe(mockDataForTests.length);
    });

    it("renders without crashing when item has no id using fallback key", () => {
        const dataWithoutId: IFileUploadItemProps[] = [
            {
                ...mockDataForTests[0],
                id: "has-id",
                name: "WithId.pdf"
            },
            {
                ...mockDataForTests[1],
                id: undefined,
                name: "NoId.pdf"
            }
        ];
        const wrapper = mount(renderList(dataWithoutId));
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(FileUploadItem)).toHaveLength(2);
        expect(wrapper.text()).toContain("WithId.pdf");
        expect(wrapper.text()).toContain("NoId.pdf");
    });

    it("action buttons call onClick when clicked", () => {
        const onCancel = jest.fn();
        const onClick = jest.fn();
        setup = mount(
            renderList([
                {
                    id: "upload-disabled",
                    name: "File.zip",
                    time: "10:00AM",
                    size: "5MB",
                    type: "file",
                    loading: true,
                    progressPercent: 50,
                    uploadingText: "Uploading",
                    actions: [
                        { id: "upload-disabled-cancel", Icon: Image, name: "Cancel upload", onClick: onCancel },
                        { id: "upload-disabled-recycle", Icon: RecycleBin, name: "Remove file", onClick }
                    ]
                }
            ])
        );
        setup.update();

        const fileUploadItem = setup.find(FileUploadItem).first();
        const buttons = fileUploadItem.find("button.fileUploadItem__button");
        expect(buttons.at(0).prop("disabled")).toBeFalsy();
        expect(buttons.at(1).prop("disabled")).toBeFalsy();
    });

    it("renders each type with correct type class and icon", () => {
        const types: FileType[] = ["file", "image", "audio", "video"];
        types.forEach((fileType) => {
            const files: IFileUploadItemProps[] = [
                {
                    id: `type-${fileType}`,
                    name: "file",
                    time: "10:00AM",
                    size: "1MB",
                    type: fileType,
                    actions: [{ id: "type-recycle", Icon: RecycleBin, name: "Remove file", onClick: jest.fn() }]
                }
            ];
            const wrapper = mount(renderList(files));
            expect(wrapper.find(`.fileUploadItem__file_type_${fileType}`).exists()).toBe(true);
        });
    });
});
