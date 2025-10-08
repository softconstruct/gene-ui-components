import { IDataCardListProps } from "@components/organisms/DataCardList";

// Static datasets for DataCardList stories (no dynamic generation)

// 10 cards, 8 rows each, text values
export const defaultData: IDataCardListProps["data"] = Array.from(Array(10).keys()).map((index) =>
    Array.from(Array(8).keys()).map((rowIndex) => ({
        key: `Card ${index} Row ${rowIndex}`,
        value: { text: "Description", type: "text" }
    }))
);

// 10 cards, 8 rows with pill values and infoText
export const pillData: IDataCardListProps["data"] = Array.from(Array(10).keys()).map((index) =>
    Array.from(Array(8).keys()).map((rowIndex) => ({
        infoText: "Info text",
        key: `Card ${index} Row ${rowIndex}`,
        value: { text: "Pill", type: "pill", filled: true }
    }))
);

// 10 cards, 8 rows with text links
export const textLinkData: IDataCardListProps["data"] = Array.from(Array(10).keys()).map((index) =>
    Array.from(Array(8).keys()).map((rowIndex) => ({
        key: `Card ${index} Row ${rowIndex}`,
        value: { text: "Text Link", type: "textLink", href: "#" }
    }))
);

export const totalCount = 100;

// Random-like mixed dataset with text, pill, and textLink, enough rows to show "Show More"
export const randomRichData: IDataCardListProps["data"] = Array.from(Array(20).keys()).map((index) => [
    { key: `Name ${index}`, value: { type: "text", text: "John Doe" } },
    {
        key: `Status ${index}`,
        value: {
            type: "pill",
            text: index % 2 ? "Active" : "Pending",
            appearance: index % 2 ? "magenta" : "informative",
            filled: true
        }
    },
    {
        key: `Email ${index}`,
        value: { type: "textLink", text: `user${index}@example.com`, href: `mailto:user${index}@example.com` }
    },
    { key: `Role ${index}`, value: { type: "text", text: index % 3 === 0 ? "Administrator" : "User" } },
    { key: `Projects ${index}`, value: { type: "text", text: String(10 + index) } },
    { key: `Manager ${index}`, value: { type: "text", text: "Jane Smith" } },
    { key: `Location ${index}`, value: { type: "text", text: "New York" } }
]);

// Minimal dataset with two rows per card; no show more
export const minimalTwoRowData: IDataCardListProps["data"] = Array.from(Array(20).keys()).map((index) => [
    { key: `Name ${index}`, value: { type: "text", text: "John Doe" } },
    {
        key: `Email ${index}`,
        value: { type: "textLink", text: `user${index}@example.com`, href: `mailto:user${index}@example.com` }
    }
]);
