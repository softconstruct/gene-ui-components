import React, { FC, useState } from "react";

import { CaretDownFilled, IconProps } from "@geneui/icons";

// Components
import { Menu, MenuItem } from "@components/molecules/Menu";
import ToolbarButton from "@components/organisms/Editor/Toolbar/ToolbarButton/ToolbarButton";

interface IMenuTriggerItem {
    /**
     * Identifies the row. Returned by `onChange`.
     */
    id: string;
    /**
     * The row's text.
     */
    label: string;
    /**
     * A React Functional Component rendered before the row's text.
     */
    Icon?: FC<IconProps>;
    /**
     * Marks the row as the currently applied option.
     */
    selected?: boolean;
    /**
     * Draws a divider below this row.
     */
    divider?: boolean;
}

interface IMenuTriggerProps {
    /**
     * The trigger's text - normally the currently selected option.
     */
    label?: string;
    /**
     * A React Functional Component rendered as the trigger's icon, before the caret.
     */
    Icon?: FC<IconProps>;
    /**
     * The rows of the menu.
     */
    items: IMenuTriggerItem[];
    /**
     * A callback function that is called with the selected row's `id`.
     */
    onChange: (id: string) => void;
    /**
     * Indicates whether the trigger is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * An ARIA label for the trigger.
     */
    "aria-label"?: string;
    /**
     * Additional class for the trigger.
     */
    className?: string;
}

/**
 * A `ToolbarButton` that opens a `Menu`. Internal to the Editor.
 */
const MenuTrigger: FC<IMenuTriggerProps> = ({
    label,
    Icon,
    items,
    onChange,
    disabled,
    "aria-label": ariaLabel,
    className
}) => {
    const [triggerProps, setTriggerProps] = useState({});

    return (
        <>
            <ToolbarButton
                triggerProps={triggerProps}
                IconBefore={Icon}
                IconAfter={CaretDownFilled}
                disabled={disabled}
                className={className}
                title={label}
                aria-label={ariaLabel}
            >
                {label}
            </ToolbarButton>

            <Menu size="medium" setPropsForPopover={setTriggerProps} onChange={(item) => onChange(String(item.id))}>
                {items.map(({ id, label: itemLabel, Icon: ItemIcon, selected }) => (
                    <MenuItem key={id} id={id} IconBefore={ItemIcon} selected={selected}>
                        {itemLabel}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export { IMenuTriggerItem, IMenuTriggerProps, MenuTrigger as default };
