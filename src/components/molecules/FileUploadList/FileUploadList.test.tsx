import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Icons (used only for action buttons, not for file type — file icon comes from type)
import { Image, RecycleBin } from "@geneui/icons";

import FileUploadItem, { FileType, IFileUploadItem } from "./FileUploadItem";
import FileUploadList, { IFileUploadListProps } from "./index";

function defaultAriaLabel(item: IFileUploadItem): string {
    return `File: ${item.name ?? "Unnamed"}, Size: ${item.size ?? "Unknown"}, Time: ${item.time ?? "--:--"}`;
}

function renderList(files: IFileUploadItem[], listProps?: Partial<IFileUploadListProps>) {
    return (
        <FileUploadList {...listProps}>
            {files.map((item, index) => (
                <FileUploadItem
                    key={item.id ?? `fallback-${index}`}
                    {...item}
                    aria-label={item["aria-label"] ?? defaultAriaLabel(item)}
                />
            ))}
        </FileUploadList>
    );
}

const mockData: IFileUploadItem[] = [
    {
        id: "1",
        name: "Invoice Q1.pdf",
        time: "09:15AM",
        size: "4.2MB",
        type: "document" as FileType,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    },
    {
        id: "2",
        name: "UX_Wireframe.sketch",
        time: "10:30AM",
        size: "12MB",
        type: "visual" as FileType,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    },
    {
        id: "3",
        name: "Voiceover-final.mp3",
        time: "01:05PM",
        size: "8MB",
        type: "audio" as FileType,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    },
    {
        id: "4",
        name: "Product-demo.mp4",
        time: "05:40PM",
        size: "220MB",
        type: "video" as FileType,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    }
];

const uploadingData: IFileUploadItem[] = [
    {
        id: "uploading-1",
        name: "Quarterly-report.zip",
        time: "11:00AM",
        size: "120MB",
        type: "document" as FileType,
        loading: true,
        progressPercent: 45,
        uploadingText: "Uploading",
        actions: [
            {
                Icon: Image,
                onCancel: jest.fn()
            },
            {
                Icon: RecycleBin,
                onClick: jest.fn()
            }
        ]
    }
];

const uploadingWithoutCancelData: IFileUploadItem[] = [
    {
        id: "uploading-2",
        name: "Research-notes.docx",
        time: "03:30PM",
        size: "2MB",
        type: "document" as FileType,
        loading: true,
        progressPercent: 70,
        uploadingText: "Uploading",
        actions: [
            {
                Icon: RecycleBin,
                onClick: jest.fn()
            }
        ]
    }
];

describe("FileUploadList", () => {
    let setup: ReactWrapper<IFileUploadListProps>;

    beforeEach(() => {
        mockData.forEach(({ actions }) => actions?.forEach(({ onClick }) => (onClick as jest.Mock)?.mockClear?.()));
        setup = mount(renderList(mockData));
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        setup.setProps({ className });

        expect(setup.hasClass(className)).toBeTruthy();
    });

    it("renders a FileUploadItem per file entry", () => {
        expect(setup.find(FileUploadItem)).toHaveLength(mockData.length);
    });

    it("displays file name, time, and size metadata for each item", () => {
        mockData.forEach(({ name, time, size }) => {
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
        const updatedData: IFileUploadItem[] = [
            {
                ...mockData[0],
                id: "new-id",
                name: "Budget-2025.xlsx",
                time: "07:10AM",
                size: "2MB",
                type: "document" as FileType
            }
        ];

        setup = mount(renderList(updatedData));

        expect(setup.find(FileUploadItem)).toHaveLength(updatedData.length);
        expect(setup.text()).toContain("Budget-2025.xlsx");
        expect(setup.text()).not.toContain(mockData[1].name);
    });

    it("renders progress bar and hides metadata when an item is uploading", () => {
        // Progress bar and hidden metadata are shown when loading and status is not "rest" (e.g. error or warning)
        const uploadingWithStatus: IFileUploadItem[] = [
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

        expect(setup.find(FileUploadItem).find("button.fileUploadList__button")).toHaveLength(1);
    });

    it("shows all actions while uploading", () => {
        const onCancel = jest.fn();
        const onClick = jest.fn();
        setup = mount(
            renderList([
                {
                    id: "uploading-test",
                    name: "Test-file.zip",
                    time: "11:00AM",
                    size: "120MB",
                    type: "document" as FileType,
                    loading: true,
                    progressPercent: 45,
                    uploadingText: "Uploading",
                    actions: [
                        { Icon: Image, onCancel },
                        { Icon: RecycleBin, onClick }
                    ]
                }
            ])
        );
        setup.update();

        const fileUploadItem = setup.find(FileUploadItem).first();
        expect(fileUploadItem.prop("loading")).toBe(true);

        const buttons = fileUploadItem.find("button.fileUploadList__button");
        expect(buttons).toHaveLength(2);

        buttons.at(0).simulate("click");
        expect(onCancel).toHaveBeenCalledWith("uploading-test");
    });

    it("calls onClick when not uploading", () => {
        const firstItemOnClick = mockData[0].actions?.[0].onClick;
        const firstItemButton = setup.find(FileUploadItem).at(0).find("button").at(0);
        firstItemButton.simulate("click");
        expect(firstItemOnClick).toHaveBeenCalledWith(expect.anything());
    });

    it("calls onCancel with correct id when uploading", () => {
        const onCancel = jest.fn();
        setup = mount(
            renderList([
                {
                    ...uploadingData[0],
                    actions: [{ Icon: Image, onCancel }]
                }
            ])
        );
        setup.update();

        const fileUploadItem = setup.find(FileUploadItem).first();
        const button = fileUploadItem.find("button.fileUploadList__button").at(0);
        button.simulate("click");
        expect(onCancel).toHaveBeenCalledWith(uploadingData[0].id);
    });

    it("renders error state with helperText when status is error", () => {
        const errorData: IFileUploadItem[] = [
            {
                ...mockData[0],
                id: "error-1",
                name: "Failed-upload.pdf",
                loading: true,
                progressPercent: 40,
                status: "error",
                helperText: "Upload failed. Please try again.",
                uploadingText: "Uploading",
                actions: [{ Icon: Image, onCancel: jest.fn() }]
            }
        ];
        setup = mount(renderList(errorData));
        setup.update();

        expect(setup.find(".progressBar")).toHaveLength(1);
        expect(setup.text()).toContain("Upload failed. Please try again.");
    });

    it("renders warning state with helperText when status is warning", () => {
        const warningData: IFileUploadItem[] = [
            {
                ...mockData[0],
                id: "warning-1",
                name: "Large-file.zip",
                loading: true,
                progressPercent: 85,
                status: "warning",
                helperText: "File is large. Upload may take a while.",
                uploadingText: "Uploading...",
                actions: [{ Icon: RecycleBin, onCancel: jest.fn() }]
            }
        ];
        setup = mount(renderList(warningData));
        setup.update();

        expect(setup.find(".progressBar")).toHaveLength(1);
        expect(setup.text()).toContain("File is large. Upload may take a while.");
    });

    it("omits time cell when item has no time", () => {
        const dataWithoutTime: IFileUploadItem[] = [
            {
                ...mockData[0],
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
        expect(setup.find('[role="listitem"]').length).toBe(mockData.length);
    });

    it("renders without crashing when item has no id using fallback key", () => {
        const dataWithoutId: IFileUploadItem[] = [
            {
                ...mockData[0],
                id: "has-id",
                name: "WithId.pdf"
            },
            {
                ...mockData[1],
                id: undefined as unknown as string,
                name: "NoId.pdf"
            }
        ];
        const wrapper = mount(renderList(dataWithoutId));
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(FileUploadItem)).toHaveLength(2);
        expect(wrapper.text()).toContain("WithId.pdf");
        expect(wrapper.text()).toContain("NoId.pdf");
    });

    it("disables non-cancel action buttons when item is uploading", () => {
        const onCancel = jest.fn();
        const onClick = jest.fn();
        setup = mount(
            renderList([
                {
                    id: "upload-disabled",
                    name: "File.zip",
                    time: "10:00AM",
                    size: "5MB",
                    type: "document" as FileType,
                    loading: true,
                    progressPercent: 50,
                    uploadingText: "Uploading",
                    actions: [
                        { Icon: Image, onCancel },
                        { Icon: RecycleBin, onClick }
                    ]
                }
            ])
        );
        setup.update();

        const fileUploadItem = setup.find(FileUploadItem).first();
        const buttons = fileUploadItem.find("button.fileUploadList__button");
        expect(buttons.at(0).prop("disabled")).toBe(false);
        expect(buttons.at(1).prop("disabled")).toBe(true);
    });

    it("renders each type with correct type class and icon", () => {
        const types: FileType[] = ["document", "visual", "audio", "video"];
        types.forEach((fileType) => {
            const files: IFileUploadItem[] = [
                {
                    id: `type-${fileType}`,
                    name: "file",
                    time: "10:00AM",
                    size: "1MB",
                    type: fileType,
                    actions: [{ Icon: RecycleBin, onClick: jest.fn() }]
                }
            ];
            const wrapper = mount(renderList(files));
            expect(wrapper.find(`.fileUploadList__file_type_${fileType}`).exists()).toBe(true);
        });
    });
});
