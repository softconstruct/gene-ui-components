import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Bell, Eye, Image, RecycleBin } from "@geneui/icons";

import FileUploadItem from "./FileUploadItem";
// Components
import FileUploadList, { IFileUploadListProps } from "./index";

const mockData = [
    {
        id: "1",
        name: "Invoice Q1.pdf",
        time: "09:15AM",
        blob: { size: "4.2MB", type: "document" },
        Icon: Bell,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    },
    {
        id: "2",
        name: "UX_Wireframe.sketch",
        time: "10:30AM",
        blob: { size: "12MB", type: "image" },
        Icon: Bell,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    },
    {
        id: "3",
        name: "Voiceover-final.mp3",
        time: "01:05PM",
        blob: { size: "8MB", type: "audio" },
        Icon: Eye,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    },
    {
        id: "4",
        name: "Product-demo.mp4",
        time: "05:40PM",
        blob: { size: "220MB", type: "video" },
        Icon: Eye,
        actions: [
            { Icon: Image, onClick: jest.fn() },
            { Icon: RecycleBin, onClick: jest.fn() }
        ]
    }
];

const uploadingData = [
    {
        id: "uploading-1",
        name: "Quarterly-report.zip",
        time: "11:00AM",
        blob: { size: "120MB", type: "document" },
        Icon: Bell,
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

const uploadingWithoutCancelData = [
    {
        id: "uploading-2",
        name: "Research-notes.docx",
        time: "03:30PM",
        blob: { size: "2MB", type: "document" },
        Icon: Eye,
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

describe("FileUploadList ", () => {
    let setup: ReactWrapper<IFileUploadListProps>;

    beforeEach(() => {
        mockData.forEach(({ actions }) => actions.forEach(({ onClick }) => onClick?.mockClear?.()));
        setup = mount(<FileUploadList data={mockData} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders a FileUploadItem per data entry", () => {
        expect(setup.find(FileUploadItem)).toHaveLength(mockData.length);
    });

    it("displays file name, time, and size metadata for each item", () => {
        mockData.forEach(({ name, time, blob }) => {
            const text = setup.text();
            expect(text).toContain(name);
            expect(text).toContain(time);
            expect(text).toContain(blob.size);
        });
    });

    it("renders no FileUploadItems when data is empty", () => {
        const wrapper = mount(<FileUploadList data={[]} />);

        expect(wrapper.find(FileUploadItem)).toHaveLength(0);
        expect(wrapper.find(".fileUploadList").exists()).toBeTruthy();
    });

    it("updates rendered list when data prop changes", () => {
        const updatedData = [
            {
                ...mockData[0],
                id: "new-id",
                name: "Budget-2025.xlsx",
                time: "07:10AM",
                blob: { size: "2MB", type: "document" }
            }
        ];

        const wrapper = setup.setProps({ data: updatedData });

        expect(wrapper.find(FileUploadItem)).toHaveLength(updatedData.length);
        expect(wrapper.text()).toContain("Budget-2025.xlsx");
        expect(wrapper.text()).not.toContain(mockData[1].name);
    });

    it("renders progress bar and hides metadata when an item is uploading", () => {
        const wrapper = mount(<FileUploadList data={uploadingData} />);

        expect(wrapper.find(".progressBar")).toHaveLength(1);
        expect(wrapper.text()).toContain("Uploading");
        expect(wrapper.text()).toContain(uploadingData[0].name);
        expect(wrapper.text()).not.toContain(uploadingData[0].blob.size);
        expect(wrapper.text()).not.toContain(uploadingData[0].time);
    });

    it("renders action buttons when uploading item lacks cancel action", () => {
        const wrapper = mount(<FileUploadList data={uploadingWithoutCancelData} />);

        expect(wrapper.find(FileUploadItem).find("button.fileUploadList__button")).toHaveLength(1);
    });

    it("shows all actions while uploading", () => {
        const onCancel = jest.fn();
        const onClick = jest.fn();
        const wrapper = mount(
            <FileUploadList
                data={[
                    {
                        id: "uploading-test",
                        name: "Test-file.zip",
                        time: "11:00AM",
                        blob: { size: "120MB", type: "document" },
                        Icon: Bell,
                        loading: true,
                        progressPercent: 45,
                        uploadingText: "Uploading",
                        actions: [
                            {
                                Icon: Image,
                                onCancel
                            },
                            {
                                Icon: RecycleBin,
                                onClick
                            }
                        ]
                    }
                ]}
            />
        );
        wrapper.update();

        // Verify the FileUploadItem receives loading prop
        const fileUploadItem = wrapper.find(FileUploadItem).first();
        expect(fileUploadItem.prop("loading")).toBe(true);

        // Find buttons - should show all actions
        const buttons = fileUploadItem.find("button.fileUploadList__button");
        expect(buttons).toHaveLength(2);

        buttons.at(0).simulate("click");
        expect(onCancel).toHaveBeenCalledWith("uploading-test");
    });

    it("calls onClick when not uploading", () => {
        const firstItemOnClick = mockData[0].actions[0].onClick;
        const firstItemButton = setup.find(FileUploadItem).at(0).find("button").at(0);
        firstItemButton.simulate("click");
        expect(firstItemOnClick).toHaveBeenCalledWith(expect.anything());
    });

    it("calls onCancel with correct id when uploading", () => {
        const onCancel = jest.fn();
        const wrapper = mount(
            <FileUploadList
                data={[
                    {
                        ...uploadingData[0],
                        actions: [
                            {
                                Icon: Image,
                                onCancel
                            }
                        ]
                    }
                ]}
            />
        );
        wrapper.update();
        const fileUploadItem = wrapper.find(FileUploadItem).first();
        const button = fileUploadItem.find("button.fileUploadList__button").at(0);
        button.simulate("click");
        expect(onCancel).toHaveBeenCalledWith(uploadingData[0].id);
    });
});
