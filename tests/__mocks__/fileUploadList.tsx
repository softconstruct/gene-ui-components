import { RecycleBin, Image } from "@geneui/icons";
import { IFileUploadItemProps } from "../../src";

export const mockDataForTests: IFileUploadItemProps[] = [
    {
        id: "1",
        name: "Invoice Q1.pdf",
        time: "09:15AM",
        size: "4.2MB",
        type: "file",
        actions: [
            { id: "1-image", Icon: Image, name: "Preview image" },
            { id: "1-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    },
    {
        id: "2",
        name: "UX_Wireframe.sketch",
        time: "10:30AM",
        size: "12MB",
        type: "image",
        actions: [
            { id: "2-image", Icon: Image, name: "Preview image" },
            { id: "2-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    },
    {
        id: "3",
        name: "Voiceover-final.mp3",
        time: "01:05PM",
        size: "8MB",
        type: "audio",
        actions: [
            { id: "3-image", Icon: Image, name: "Preview audio" },
            { id: "3-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    },
    {
        id: "4",
        name: "Product-demo.mp4",
        time: "05:40PM",
        size: "220MB",
        type: "video",
        actions: [
            { id: "4-image", Icon: Image, name: "Preview video" },
            { id: "4-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    }
];

export const uploadingData: IFileUploadItemProps[] = [
    {
        id: "uploading-1",
        name: "Quarterly-report.zip",
        time: "11:00AM",
        size: "120MB",
        type: "file",
        loading: true,
        progressPercent: 45,
        uploadingText: "Uploading",
        actions: [
            { id: "uploading-1-cancel", Icon: Image, name: "Cancel upload" },
            { id: "uploading-1-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    }
];

export const uploadingWithoutCancelData: IFileUploadItemProps[] = [
    {
        id: "uploading-2",
        name: "Research-notes.docx",
        time: "03:30PM",
        size: "2MB",
        type: "file",
        loading: true,
        progressPercent: 70,
        uploadingText: "Uploading",
        actions: [{ id: "uploading-2-recycle", Icon: RecycleBin, name: "Remove file" }]
    }
];
