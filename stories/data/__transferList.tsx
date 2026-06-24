import { IActionableListItem } from "@components/molecules/ActionableList";

export const TRANSFER_LIST_SOURCE_TREE: IActionableListItem[] = [
    {
        id: "portfolio-na",
        title: "Portfolio - North America",
        children: [
            { id: "na-pricing", title: "Pricing and Contracts" },
            { id: "na-sales", title: "Sales Enablement" }
        ]
    },
    {
        id: "portfolio-emea",
        title: "Portfolio - EMEA",
        children: [
            { id: "emea-distributor", title: "Distributor Onboarding" },
            { id: "emea-localization", title: "Localization" }
        ]
    }
];

export const TRANSFER_LIST_TARGET_TREE: IActionableListItem[] = [{ id: "latam", title: "LATAM Market Assessment" }];

export const TRANSFER_LIST_THIRD_PANEL_TREE: IActionableListItem[] = [
    { id: "apac", title: "APAC Growth Initiative" },
    { id: "global", title: "Global Standards Review" }
];

export const TRANSFER_LIST_FOURTH_PANEL_TREE: IActionableListItem[] = [
    { id: "archive-1", title: "Archived Initiative A" },
    { id: "archive-2", title: "Archived Initiative B" }
];
