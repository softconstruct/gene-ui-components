import React, { FC, useState } from "react";
import classNames from "classnames";

import { CaretDownFilled, IconProps } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";

// Styles
import "./SplitButton.scss";

interface ISplitButtonItemProps {
    /**
     * Optional icon shown before the title/content.
     */
    Icon?: FC<IconProps>;
    /**
     * Title shown for the menu item, when it acts as a parent for nested items.
     */
    title?: string;
    /**
     * Unique identifier for the item, forwarded to the menu selection callbacks.
     */
    id: number | string;
}
interface ISplitButtonProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * Type <br/>
     * Possible values: `fill | outline`
     */
    type?: "fill" | "outline";
    /**
     * Indicates the action meaning. <br>
     * Possible values: `primary | secondary | inverse`
     */
    appearance?: "primary" | "secondary" | "inverse";
    /**
     * Fires whenever any split-button action is selected (primary or dropdown).
     */
    onSelect?: (item: ISplitButtonItemProps) => void;
    /**
     * Indicates whether the `SplitButton` is in a loading state.
     * When set to `true` a `skeleton` indicator will be shown instead of the `Avatar`.
     */
    loading?: boolean;
    /**
     * Ordered collection of split-button actions; the first item renders as the primary button.<br/>
     * Example:<br/>
     * [
     *   { id: "expand", title: "Expand", Icon: ExpandIcon },<br/>
     *   { id: "download", title: "Download", Icon: DownloadIcon }
     * ]
     */
    items: ISplitButtonItemProps[];
}

/**
 * A split button allows users to choose from several related actions. The primary action is displayed as the button label, while additional actions are accessible from a dropdown menu.
 */
const SplitButton: FC<ISplitButtonProps> = ({
    className,
    size = "large",
    disabled = false,
    type = "fill",
    appearance = "primary",
    onSelect,
    loading,
    items
}) => {
    const [propsForPopover, setPropsForPopover] = useState({});
    const onSelectHandler = (item: IMenuItemProps | ISplitButtonItemProps) => {
        if (!onSelect) return;

        let icon: FC<IconProps> | undefined;

        if ("IconBefore" in item && item.IconBefore) {
            icon = item.IconBefore;
        } else if ("Icon" in item && item.Icon) {
            icon = item.Icon;
        }

        onSelect({
            title: item.title,
            Icon: icon,
            id: item.id
        });
    };

    const buttonsClassNames = `splitButton__button splitButton__button_size_${size} splitButton__button_type_${type} splitButton__button_appearance_${appearance}`;
    if (items.length === 0) return null;
    if (items.length === 1) {
        const [singleItem] = items;
        return (
            <Button
                iconPosition="before"
                Icon={singleItem.Icon}
                size={size}
                disabled={disabled}
                loading={loading}
                onClick={() => {
                    onSelectHandler(singleItem);
                }}
            >
                {singleItem.title}
            </Button>
        );
    }

    const [firstItem, ...restItems] = items;

    return (
        <div className={classNames("splitButton", className, { splitButton_loading: loading })}>
            <Loader loading={loading} size="smallNudge" className="splitButton__loader" />
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    onSelectHandler(firstItem);
                }}
                className={classNames(buttonsClassNames, {
                    splitButton__button_icon_before: firstItem.Icon,
                    splitButton__button_loading: loading
                })}
            >
                {firstItem.Icon && <firstItem.Icon size={20} className="button__icon" />}
                {firstItem.title && <span className="splitButton__text">{firstItem.title}</span>}
            </button>
            <button
                type="button"
                disabled={disabled}
                className={classNames(buttonsClassNames, "splitButton__button_icon_only", {
                    splitButton__button_loading: loading
                })}
                {...propsForPopover}
            >
                <CaretDownFilled className="splitButton__icon" />
            </button>
            <Menu
                onChange={(item) => {
                    onSelectHandler(item);
                }}
                setPropsForPopover={setPropsForPopover}
                swappable
                position="bottom-right"
                size="small"
            >
                {restItems.map((item: ISplitButtonItemProps) => (
                    <MenuItem IconBefore={item.Icon} id={item.id} key={item.id}>
                        {item.title}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export { ISplitButtonProps, SplitButton as default };
