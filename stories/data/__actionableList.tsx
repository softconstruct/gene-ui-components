import { IActionableListItem } from "@components/molecules/ActionableList";

/**
 * Canonical demo tree — literal structure you can read at a glance.
 *
 * org-portfolio
 * ├── program-na (3 children — matches drag / nested-wrapper design)
 * │   ├── workstream-pricing
 * │   ├── workstream-sales
 * │   └── workstream-channel
 * ├── program-emea (3 children)
 * │   ├── workstream-distributor
 * │   ├── workstream-localization
 * │   └── workstream-regulatory
 * ├── initiative-latam
 * ├── initiative-apac
 * └── initiative-global
 *
 * deep-branch (optional: full depth 1→5 for maxNestedLevel demos)
 */
const DEEP_BRANCH: IActionableListItem = {
    id: "deep-l1",
    title: "Deep branch — Level 1",
    infoText: "Expand to see levels 2–5.",
    children: [
        {
            id: "deep-l2",
            title: "Level 2",
            children: [
                {
                    id: "deep-l3",
                    title: "Level 3",
                    children: [
                        {
                            id: "deep-l4",
                            title: "Level 4",
                            children: [{ id: "deep-l5", title: "Level 5 (leaf)", infoText: "Deepest node." }]
                        }
                    ]
                }
            ]
        }
    ]
};

/** Main story + AsyncLoading — full explicit tree */
export const ACTIONABLE_LIST_ITEMS: IActionableListItem[] = [
    {
        id: "org-portfolio",
        title: "Portfolio — North America Launch",
        infoText: "Parent with three nested workstreams (group wrapper + connector lines).",
        checked: false,
        children: [
            {
                id: "workstream-pricing",
                title: "Pricing and Contracts",
                infoText: "Reorder with siblings via drag handle.",
                checked: false
            },
            {
                id: "workstream-sales",
                title: "Sales Enablement",
                infoText: "Reorder with siblings via drag handle.",
                checked: false
            },
            {
                id: "workstream-channel",
                title: "Channel Partnerships",
                infoText: "Reorder with siblings via drag handle.",
                checked: false
            }
        ]
    },
    {
        id: "org-emea",
        title: "Portfolio — EMEA Expansion",
        infoText: "Second parent with three children.",
        checked: false,
        children: [
            {
                id: "workstream-distributor",
                title: "Distributor Onboarding",
                checked: false
            },
            {
                id: "workstream-localization",
                title: "Localization",
                checked: false
            },
            {
                id: "workstream-regulatory",
                title: "Regulatory Submission",
                checked: false
            }
        ]
    },
    {
        id: "initiative-latam",
        title: "LATAM Market Assessment",
        infoText: "Top-level leaf (no children).",
        checked: false
    },
    {
        id: "initiative-apac",
        title: "APAC Partner Program",
        infoText: "Top-level leaf (no children).",
        checked: false
    },
    {
        id: "initiative-global",
        title: "Global Support Rollout",
        infoText: "Top-level leaf (no children).",
        checked: false
    },
    DEEP_BRANCH
];

/** Same portfolio shape as ACTIONABLE_LIST_ITEMS[0–1] — kept for stories that only need drag demo */
export const actionableListDragData: IActionableListItem[] = [
    ACTIONABLE_LIST_ITEMS[0],
    ACTIONABLE_LIST_ITEMS[1],
    ACTIONABLE_LIST_ITEMS[2],
    ACTIONABLE_LIST_ITEMS[3],
    ACTIONABLE_LIST_ITEMS[4]
];

/** Alias — use ACTIONABLE_LIST_ITEMS everywhere for one source of truth */
export const actionableListBaseData = ACTIONABLE_LIST_ITEMS;

/** Long titles — flat explicit structure */
export const actionableListLongTextData: IActionableListItem[] = [
    {
        id: "long-parent",
        title: "Long planning item title that demonstrates text truncation in compact rows for busy operational layouts",
        infoText: "Parent with two nested rows.",
        children: [
            {
                id: "long-child-a",
                title: "Nested planning item with another long title and additional metadata rendered in the row",
                infoText: "Nested info."
            },
            {
                id: "long-child-b",
                title: "Q4 quality assurance backlog",
                infoText: "Shorter nested row."
            }
        ]
    },
    {
        id: "long-sibling",
        title: "Cross-functional launch dependencies with medium title length",
        infoText: "Second top-level row."
    }
];
