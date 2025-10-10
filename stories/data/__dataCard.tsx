import { Copy, DocumentPen, Download, Eye, RecycleBin } from "@geneui/icons";

import { IMenuItemProps } from "@components/molecules/Menu";
import { IDataCardProps } from "@components/organisms/DataCardList/DataCard";

// Base card data - used in both stories and tests
export const baseCardData: IDataCardProps["cardData"] = [
    { key: "Name", value: { type: "text", text: "John Doe" }, infoText: "Full name" },
    { key: "Status", value: { type: "pill", text: "Active", appearance: "magenta", filled: true } },
    { key: "Email", value: { type: "textLink", text: "john@example.com", href: "mailto:john@example.com" } }
];

// Extended card data for stories (with more fields)
export const extendedCardData: IDataCardProps["cardData"] = [
    { key: "Name", value: { type: "text", text: "John Doe" }, infoText: "infoText" },
    { key: "Status", value: { type: "pill", text: "Active", appearance: "magenta", filled: true } },
    {
        key: "Email",
        value: { type: "textLink", text: "john@administrator.com", href: "mailto:john@administrator.com" }
    },
    { key: "Role", value: { type: "text", text: "Administrator" } }
];

// Long card data for testing "Show More" functionality
export const longCardData: IDataCardProps["cardData"] = [
    { key: "Name", value: { type: "text", text: "John Doe" }, infoText: "infoText" },
    { key: "Status", value: { type: "pill", text: "Active", appearance: "magenta", filled: true } },
    {
        key: "Email",
        value: { type: "textLink", text: "john@administrator.com", href: "mailto:john@administrator.com" }
    },
    { key: "Role", value: { type: "text", text: "Administrator" } },
    { key: "Last Login", value: { type: "text", text: "2023-10-01 12:34 PM" } },
    { key: "Subscription", value: { type: "pill", text: "Premium", appearance: "informative", filled: true } },
    { key: "Projects", value: { type: "text", text: "15" } },
    { key: "Tasks", value: { type: "text", text: "42" } },
    { key: "Department", value: { type: "text", text: "Engineering" } },
    { key: "Manager", value: { type: "text", text: "Jane Smith" } },
    { key: "Location", value: { type: "text", text: "New York" } },
    { key: "Phone", value: { type: "textLink", text: "+1 (555) 123-4567", href: "tel:+15551234567" } }
];

// Basic actions for tests
export const basicActions: IMenuItemProps[] = [
    { id: "1", title: "Edit", IconAfter: DocumentPen },
    { id: "2", title: "Delete", IconAfter: RecycleBin, danger: true }
];

// Extended actions for stories
export const extendedActions: IMenuItemProps[] = [
    { id: "1", title: "Edit", IconAfter: DocumentPen },
    { id: "2", title: "View", IconAfter: Eye },
    { id: "3", title: "Copy", IconAfter: Copy },
    { id: "4", title: "Download", IconAfter: Download },
    { id: "6", title: "Delete", IconAfter: RecycleBin, danger: true }
];

// Empty data for testing edge cases
export const emptyCardData: IDataCardProps["cardData"] = [];
