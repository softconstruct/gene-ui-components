import { Globe, PersonFilled } from "@geneui/icons";

import { IDropdownOption } from "@components/molecules/Dropdown";

export const dropdownOptions: IDropdownOption[] = [
    { id: 1, label: "Dropdown Item 1", value: "dropdown-item-1", Icon: PersonFilled, infoText: "Info text" },
    { id: 2, label: "Dropdown Item 2", value: "dropdown-item-2", textAfter: "Text" },
    { id: 3, label: "Dropdown Item 3", value: "dropdown-item-3", Icon: Globe },
    { id: 4, label: "Dropdown Item 4", value: "dropdown-item-4" },
    { id: 5, label: "Dropdown Item 5", value: "dropdown-item-5", disabled: true }
];
