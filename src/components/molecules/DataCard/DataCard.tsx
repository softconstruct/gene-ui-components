import React, { FC, Fragment, useState } from "react";
import classNames from "classnames";

// Component
import Button from "@components/atoms/Button";
import Pill, { IPillProps } from "@components/atoms/Pill";
import TextLink, { ITextLinkProps } from "@components/atoms/TextLink";
import { Key, KeyValue, Value } from "@components/molecules/KeyValue";

// Styles
import "./DataCard.scss";

import { IMenuItemProps, Menu, MenuItem, Spreadsheet } from "../../../index";

interface TextValue {
    text: string;
    type: "text";
}

interface PillValue extends Omit<IPillProps, "size"> {
    type: "pill";
}

interface TextLinkValue extends Omit<ITextLinkProps, "size"> {
    type: "textLink";
}

type RowValue = PillValue | TextValue | TextLinkValue;

interface IDataCardProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The data used to render the DataCard components
     * The `value` field can be of three types: `pill`, `textLink`, or plain `text`.
     * - For `pill`, provide properties defined in `IPillProps` along with `type: "pill"`.
     * - For `textLink`, provide properties defined in `ITextLinkProps` along with `type: "textLink"`.
     * - For plain text, provide an object with `text` and `type: "text"`.
     *
     * @example
     * ```tsx
     * const cardData = [
     *   { key: "Name", value: { type: "text", text: "John Doe" }, infoText: "Full name" },
     *   { key: "Status", value: { type: "pill", text: "Active", variant: "success" } },
     *   { key: "Email", value: { type: "textLink", text: "john@example.com", href: "mailto:john@example.com" } }
     * ];
     * ```
     */
    cardData: {
        key: string;
        value?: RowValue;
        infoText?: string;
    }[];
    /**
     * Custom text for the "Show more" button that appears when there are more than 6 items in the card data.<br>
     * Defaults to "Show more" if not provided.
     */
    showMoreText?: string;
    /**
     * Custom text for the actions button that triggers the actions menu.<br>
     * Defaults to "Actions" if not provided.
     */
    actionsText?: string;
    /**
     * Array of menu items to display in the actions menu dropdown.<br>
     * Each item can contain nested children for submenu functionality. When provided, the actions button will be rendered.
     */
    actions?: IMenuItemProps[];
    /**
     * Callback function triggered when a menu item is clicked.
     * Receives the clicked menu item as an argument.
     */
    onActionClick?: (menuItem: IMenuItemProps) => void;
}

const MAX_VISIBLE_ROWS = 6;

/**
 * Renders different types of values (text, pill, textLink) based on the value type
 * @param value - The value object containing type and data
 * @returns JSX element or string based on value type
 */
const valueRenderer = (value: RowValue) => {
    if (value.type === "pill") {
        return <Pill {...(value as IPillProps)} />;
    }

    if (value.type === "textLink") {
        const textLinkProps = value as ITextLinkProps;
        if (!textLinkProps.href) {
            return <span className="textLink textLink_color_primary">{textLinkProps.text}</span>;
        }
        return <TextLink {...textLinkProps} />;
    }

    return value.text;
};

/**
 * Renders a list of key-value pairs using the KeyValue component
 * @param data - Array of objects containing key, value, and optional infoText
 */
const DataList: FC<{
    data: { key: string; value?: RowValue; infoText?: string }[];
}> = ({ data }) => (
    <div className="dataCard__listWrapper">
        {data.map(({ key, value, infoText }) => (
            <Fragment key={key}>
                <KeyValue className="dataCard__keyValue" direction="horizontal" spaceBetween>
                    <Key infoText={infoText}>{key}</Key>
                    <Value>{value ? valueRenderer(value) : ""}</Value>
                </KeyValue>
            </Fragment>
        ))}
    </div>
);

/**
 * Recursively renders menu items and their children for nested menu structure
 * @param menuData - Array of menu item props to render
 * @returns Array of JSX MenuItem elements
 */
const renderMenuItemRecursion = (menuData: IMenuItemProps[] = []) => {
    return menuData.map((el) => {
        return (
            <MenuItem
                key={el.id}
                selected={el.selected}
                title={el.children ? el.title : ""}
                IconBefore={el.IconBefore}
                IconAfter={el.IconAfter}
                danger={el.danger}
                disabled={el.disabled}
                loading={el.loading}
                id={el.id}
                divider={el.divider}
                loadingText={el.loadingText}
                emptyText={el.emptyText}
                ComponentRender={el.ComponentRender}
            >
                {el.children ? renderMenuItemRecursion(el.children as IMenuItemProps[]) : el.title}
            </MenuItem>
        );
    });
};

/**
 * Data Card Component is a responsive alternative to a data table, designed specifically for smaller screens or mobile devices.
 */
const DataCard: FC<IDataCardProps> = ({
    cardData = [],
    showMoreText = "Show more",
    actionsText = "Actions",
    onActionClick,
    className,
    actions
}) => {
    const [open, setOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState({});
    const isShowMoreVisible = cardData.length > MAX_VISIBLE_ROWS;

    const onShowMoreToggle = () => {
        setOpen((prev) => !prev);
    };
    const handleMenuChange = (menuItem: IMenuItemProps) => {
        onActionClick?.(menuItem);
    };

    const menuElements = renderMenuItemRecursion(actions);

    return (
        <div className={classNames("dataCard", className)}>
            <DataList data={cardData.slice(0, MAX_VISIBLE_ROWS)} />
            <div className="dataCard__footer">
                {isShowMoreVisible && (
                    <Button appearance="secondary" layout="text" size="large" fullWidth onClick={onShowMoreToggle}>
                        {showMoreText}
                    </Button>
                )}
                {actions && (
                    <>
                        <Button appearance="secondary" size="large" fullWidth {...propsForPopover}>
                            {actionsText}
                        </Button>
                        <Menu onChange={handleMenuChange} setPropsForPopover={setPropsForPopover}>
                            {menuElements}
                        </Menu>
                    </>
                )}
            </div>
            <Spreadsheet open={open} className="dataCard__spreadsheet dataCard" onClose={onShowMoreToggle}>
                <DataList data={cardData} />
            </Spreadsheet>
        </div>
    );
};

export { IDataCardProps, DataCard as default };
