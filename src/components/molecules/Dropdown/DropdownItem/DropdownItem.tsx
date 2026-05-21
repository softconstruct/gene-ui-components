import React, { FC, Ref } from "react";
import classNames from "classnames";

import { CheckMark, IconProps } from "@geneui/icons";

import Info from "@components/atoms/Info";
// Components
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./DropdownItem.scss";

// Types
import { DropdownSize, DropdownVariant } from "../types";

export interface IDropdownItemProps {
    className?: string;
    label: string;
    variant: DropdownVariant;
    selected?: boolean;
    disabled?: boolean;
    Icon?: FC<IconProps>;
    size?: DropdownSize;
    infoText?: string;
    textAfter?: string;
    onClick?: () => void;
    buttonRef?: Ref<HTMLButtonElement>;
}

const DropdownItem: FC<IDropdownItemProps> = ({
    className,
    label,
    variant,
    selected,
    disabled,
    Icon,
    size = "medium",
    infoText,
    textAfter,
    onClick,
    buttonRef
}) => {
    const hasTrailing = Boolean(textAfter || (variant === "single" && selected));

    return (
        <div
            className={classNames(
                "dropdownItem",
                `dropdownItem_size_${size}`,
                {
                    dropdownItem_selected: selected,
                    dropdownItem_disabled: disabled,
                    dropdownItem_multi: variant === "multi",
                    dropdownItem_single: variant === "single"
                },
                className
            )}
        >
            <button
                className="dropdownItem__action"
                type="button"
                role="option"
                aria-selected={selected}
                onClick={onClick}
                disabled={disabled}
                ref={buttonRef}
            >
                <span className="dropdownItem__main">
                    {variant === "multi" && (
                        <Checkbox checked={selected} disabled={disabled} className="dropdownItem__checkbox" />
                    )}
                    {Icon && <Icon className="dropdownItem__icon" size={20} />}
                    <span className="dropdownItem__label ellipsis-text">{label}</span>
                </span>
                {hasTrailing && (
                    <span className="dropdownItem__trailing">
                        {textAfter && <span className="dropdownItem__textAfter ellipsis-text">{textAfter}</span>}
                        {variant === "single" && selected && (
                            <CheckMark className="dropdownItem__checkmark" size={20} />
                        )}
                    </span>
                )}
            </button>
            {infoText && (
                <Info
                    infoText={infoText}
                    size="smallNudge"
                    className="dropdownItem__info"
                    disabled={disabled}
                    aria-label={`More information about ${label}`}
                />
            )}
        </div>
    );
};

export { DropdownItem as default };
