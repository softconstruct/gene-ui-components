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
     * The data used to draw the DataCard components
     * The `value` field can be of three types: `pill`, `textLink`, or plain `text`.
     * - For `pill`, provide properties defined in `IPillProps` along with `type: "pill"`.
     * - For `textLink`, provide properties defined in `ITextLinkProps` along with `type: "textLink"`.
     * - For plain text, provide an object with `text` and `type: "text"`.<br/>
     * Example:<br/>
     * ```
     * const cardData = [```<br/>```
     *   { key: "Name", value: { type: "text", text: "John Doe" } },```<br/>```
     *   { key: "Status", value: { type: "pill", text: "Active" } },```<br/>```
     *   { key: "Email", value: { type: "textLink", text: "}]```<br/><br/>
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
}

const SHOWING_ROWS_COUNT = 6;

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

const MenuItemRecursion = (menuData: IMenuItemProps[] = []) => {
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
                {el.children ? MenuItemRecursion(el.children as IMenuItemProps[]) : el.title}
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
    className,
    actions
}) => {
    const [open, setOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState({});
    const isShowMoreVisible = cardData.length > SHOWING_ROWS_COUNT;

    const onShowMoreToggle = () => {
        setOpen((prev) => !prev);
    };
    const handleMenuChange = () => {};

    const Elements = MenuItemRecursion(actions);

    return (
        <div className={classNames("dataCard", className)} role="table">
            <DataList data={cardData.slice(0, SHOWING_ROWS_COUNT)} />
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
                            {Elements}
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
