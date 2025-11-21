export interface DemoTagItem {
    id: string;
    text: string;
}

export const demoStatusTagItems: DemoTagItem[] = [
    { id: "status-1", text: "New" },
    { id: "status-2", text: "Pending" },
    { id: "status-3", text: "In Progress" },
    { id: "status-4", text: "On Hold" },
    { id: "status-5", text: "Review" },
    { id: "status-6", text: "QA" },
    { id: "status-7", text: "Approved" },
    { id: "status-8", text: "Rejected" },
    { id: "status-9", text: "Blocked" },
    { id: "status-10", text: "Unblocked" },
    { id: "status-11", text: "Ready" },
    { id: "status-12", text: "Scheduled" },
    { id: "status-13", text: "Deployed" },
    { id: "status-14", text: "Shipped" },
    { id: "status-15", text: "Delivered" },
    { id: "status-16", text: "Completed" },
    { id: "status-17", text: "Closed" },
    { id: "status-18", text: "Reopened" },
    { id: "status-19", text: "Backlog" },
    { id: "status-20", text: "Grooming" },
    { id: "status-21", text: "Planning" },
    { id: "status-22", text: "Design" },
    { id: "status-23", text: "Prototype" },
    { id: "status-24", text: "Implementation" },
    { id: "status-25", text: "Testing" },
    { id: "status-26", text: "Bug" },
    { id: "status-27", text: "Feature" },
    { id: "status-28", text: "Enhancement" },
    { id: "status-29", text: "Hotfix" },
    { id: "status-30", text: "Incident" },
    { id: "status-31", text: "Maintenance" },
    { id: "status-32", text: "Refactor" },
    { id: "status-33", text: "Docs" },
    { id: "status-34", text: "Security" },
    { id: "status-35", text: "Performance" },
    { id: "status-36", text: "Optimization" },
    { id: "status-37", text: "Archive" },
    { id: "status-38", text: "Active" },
    { id: "status-39", text: "Inactive" },
    { id: "status-40", text: "Deprecated" }
];

export const demoTagItems: DemoTagItem[] = demoStatusTagItems;

export const sliceDemoTags = (count: number): DemoTagItem[] => demoTagItems.slice(0, count);
