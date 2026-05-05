import { Globe, PersonFilled } from "@geneui/icons";

import { IDropdownOption } from "@components/molecules/Dropdown";

export const dropdownOptions: IDropdownOption[] = [
    { id: 1, label: "Product Design", value: "product-design", Icon: PersonFilled, infoText: "Design team" },
    { id: 2, label: "Frontend Engineering", value: "frontend-engineering", textAfter: "Team" },
    { id: 3, label: "Backend Platform", value: "backend-platform", Icon: Globe },
    { id: 4, label: "Mobile Applications", value: "mobile-applications" },
    { id: 5, label: "Security Operations", value: "security-operations", disabled: true },
    { id: 6, label: "Data Analytics", value: "data-analytics", Icon: PersonFilled, textAfter: "Insights" },
    { id: 7, label: "Growth Marketing", value: "growth-marketing", infoText: "Quarterly planning" },
    { id: 8, label: "Customer Success", value: "customer-success", Icon: Globe, textAfter: "Support" },
    { id: 9, label: "Developer Relations", value: "developer-relations" },
    { id: 10, label: "Legal and Compliance", value: "legal-and-compliance", disabled: true },
    { id: 11, label: "Finance Operations", value: "finance-operations", Icon: PersonFilled },
    { id: 12, label: "Sales Enablement", value: "sales-enablement", textAfter: "Pipeline" },
    { id: 13, label: "Global Partnerships", value: "global-partnerships", Icon: Globe, infoText: "External network" },
    { id: 14, label: "Quality Assurance", value: "quality-assurance" },
    { id: 15, label: "Procurement", value: "procurement", disabled: true },
    { id: 16, label: "Cloud Infrastructure", value: "cloud-infrastructure", Icon: PersonFilled, textAfter: "Core" },
    { id: 17, label: "People Operations", value: "people-operations", infoText: "Hiring and onboarding" },
    { id: 18, label: "Research and Innovation", value: "research-and-innovation", Icon: Globe },
    { id: 19, label: "Content Strategy", value: "content-strategy", textAfter: "Editorial" },
    { id: 20, label: "Release Management", value: "release-management", disabled: true }
];
