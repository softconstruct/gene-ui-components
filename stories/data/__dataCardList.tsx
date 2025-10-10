import { Copy, DocumentPen, Download, Eye, RecycleBin } from "@geneui/icons";

import { IMenuItemProps } from "@components/molecules/Menu";
import { IDataCardListProps } from "@components/organisms/DataCardList";

// Static datasets for DataCardList stories (no dynamic generation)

export const totalCount = 100;

// Unique names and emails for variety
const names = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Davis",
    "David Wilson",
    "Sarah Brown",
    "James Taylor",
    "Jessica Anderson",
    "Robert Thomas",
    "Linda Martinez",
    "William Garcia",
    "Patricia Rodriguez",
    "Richard Lee",
    "Barbara White",
    "Joseph Harris",
    "Susan Clark",
    "Thomas Lewis",
    "Nancy Walker",
    "Charles Hall",
    "Karen Allen",
    "Christopher Young",
    "Betty King",
    "Daniel Wright",
    "Lisa Scott",
    "Matthew Green",
    "Sandra Adams",
    "Anthony Baker",
    "Ashley Nelson",
    "Mark Carter",
    "Donna Mitchell",
    "Paul Perez",
    "Carol Roberts",
    "Steven Turner",
    "Michelle Phillips",
    "Andrew Campbell",
    "Kimberly Parker",
    "Joshua Evans",
    "Elizabeth Edwards",
    "Brian Collins",
    "Helen Stewart"
];

const roles = [
    "Administrator",
    "Developer",
    "Designer",
    "Manager",
    "Analyst",
    "Engineer",
    "Consultant",
    "Specialist",
    "Coordinator",
    "Director"
];

const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "IT",
    "Support",
    "Product",
    "Legal"
];

const locations = [
    "New York",
    "San Francisco",
    "London",
    "Berlin",
    "Tokyo",
    "Sydney",
    "Toronto",
    "Paris",
    "Amsterdam",
    "Singapore"
];

const statuses = ["Active", "Pending", "Inactive", "On Leave", "Remote"];

const subscriptions = ["Premium", "Basic", "Enterprise", "Trial", "Free"];

// 1. Short data with unique names and emails - 40 cards
export const shortUniqueData: IDataCardListProps["data"] = Array.from(Array(40).keys()).map((index) => ({
    cardData: [
        { key: "Name", value: { type: "text", text: names[index % names.length] } },
        {
            key: "Email",
            value: {
                type: "textLink",
                text: `${names[index % names.length].toLowerCase().replace(" ", ".")}@example.com`,
                href: `mailto:${names[index % names.length].toLowerCase().replace(" ", ".")}@example.com`
            }
        }
    ]
}));

// 2. Long data with unique values - 20 cards
export const longUniqueData: IDataCardListProps["data"] = Array.from(Array(20).keys()).map((index) => ({
    cardData: [
        { key: "Name", value: { type: "text", text: names[index % names.length] } },
        {
            key: "Status",
            value: {
                type: "pill",
                text: statuses[index % statuses.length],
                appearance: index % 2 ? "magenta" : "informative",
                filled: true
            }
        },
        {
            key: "Email",
            value: {
                type: "textLink",
                text: `${names[index % names.length].toLowerCase().replace(" ", ".")}@example.com`,
                href: `mailto:${names[index % names.length].toLowerCase().replace(" ", ".")}@example.com`
            }
        },
        { key: "Role", value: { type: "text", text: roles[index % roles.length] } },
        {
            key: "Last Login",
            value: {
                type: "text",
                text: `2023-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")} ${(index % 12) + 1}:${String(index % 60).padStart(2, "0")} ${index % 2 ? "AM" : "PM"}`
            }
        },
        {
            key: "Subscription",
            value: {
                type: "pill",
                text: subscriptions[index % subscriptions.length],
                appearance: "informative",
                filled: true
            }
        },
        { key: "Projects", value: { type: "text", text: String(10 + index) } },
        { key: "Tasks", value: { type: "text", text: String(20 + index * 2) } },
        { key: "Department", value: { type: "text", text: departments[index % departments.length] } },
        { key: "Manager", value: { type: "text", text: names[(index + 5) % names.length] } },
        { key: "Location", value: { type: "text", text: locations[index % locations.length] } },
        {
            key: "Phone",
            value: {
                type: "textLink",
                text: `+1 (${String((index % 900) + 100)}) ${String((index % 900) + 100)}-${String((index % 9000) + 1000)}`,
                href: `tel:+1${String((index % 900) + 100)}${String((index % 900) + 100)}${String((index % 9000) + 1000)}`
            }
        }
    ]
}));

// 3. Data with unique actions per card - 20 cards
const actionsVariants: IMenuItemProps[][] = [
    [
        { id: "1", title: "Edit", IconAfter: DocumentPen },
        { id: "2", title: "Delete", IconAfter: RecycleBin, danger: true }
    ],
    [], // No actions
    [{ id: "1", title: "View Details", IconAfter: Eye }],
    [
        { id: "1", title: "Edit", IconAfter: DocumentPen },
        { id: "2", title: "Copy", IconAfter: Copy },
        { id: "3", title: "Delete", IconAfter: RecycleBin, danger: true }
    ],
    [{ id: "1", title: "Download", IconAfter: Download }],
    [
        { id: "1", title: "View", IconAfter: Eye },
        { id: "2", title: "Edit", IconAfter: DocumentPen }
    ]
];

export const uniqueActionsData: IDataCardListProps["data"] = Array.from(Array(20).keys()).map((index) => ({
    cardData: [
        { key: "Name", value: { type: "text", text: names[index % names.length] } },
        {
            key: "Status",
            value: {
                type: "pill",
                text: statuses[index % statuses.length],
                appearance: index % 2 ? "magenta" : "informative",
                filled: true
            }
        },
        {
            key: "Email",
            value: {
                type: "textLink",
                text: `${names[index % names.length].toLowerCase().replace(" ", ".")}@example.com`,
                href: `mailto:${names[index % names.length].toLowerCase().replace(" ", ".")}@example.com`
            }
        },
        { key: "Role", value: { type: "text", text: roles[index % roles.length] } }
    ],
    actions: actionsVariants[index % actionsVariants.length]
}));

// Helper functions for pure virtualization data
const getRole = (idx: number): string => {
    if (idx % 3 === 0) return "Admin";
    if (idx % 2 === 0) return "User";
    return "Guest";
};

const getStatus = (idx: number): string => {
    if (idx % 4 === 0) return "Active";
    if (idx % 3 === 0) return "Inactive";
    return "Pending";
};

// Pure virtualization data - 100 static items
export const pureVirtualizationData: IDataCardListProps["data"] = Array.from(Array(100).keys()).map((index) => ({
    cardData: [
        { key: "Name", value: { text: `User ${index + 1}`, type: "text" } },
        { key: "Email", value: { text: `user${index + 1}@example.com`, type: "text" } },
        { key: "Role", value: { text: getRole(index), type: "text" } },
        { key: "Status", value: { text: getStatus(index), type: "text" } },
        { key: "Department", value: { text: `Department ${(index % 5) + 1}`, type: "text" } },
        { key: "Location", value: { text: index % 2 === 0 ? "New York" : "San Francisco", type: "text" } },
        { key: "Last Login", value: { text: `2023-12-${String((index % 28) + 1).padStart(2, "0")}`, type: "text" } },
        { key: "Projects", value: { text: `${(index % 10) + 1}`, type: "text" } }
    ]
}));
