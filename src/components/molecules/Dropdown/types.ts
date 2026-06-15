import { FC, MouseEvent } from "react";

import { IconProps } from "@geneui/icons";

import { IPopoverFooterActionProps } from "@components/atoms/Popover";

export type DropdownSize = "large" | "medium" | "small";
export type DropdownStatus = "rest" | "warning" | "error";
export type DropdownVariant = "single" | "multi";

export interface IDropdownOption {
    id: string | number;
    label: string;
    value: string;
    disabled?: boolean;
    Icon?: FC<IconProps>;
    infoText?: string;
    textAfter?: string;
}

export interface IDropdownFooterAction {
    text: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    "aria-label"?: string;
}

export interface IDropdownFooterActions {
    primary: Omit<IPopoverFooterActionProps, "appearance">;
    secondary?: Omit<IPopoverFooterActionProps, "appearance">;
}
