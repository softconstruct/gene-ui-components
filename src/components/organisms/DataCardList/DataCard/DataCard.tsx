import React, { AriaRole, FC, useState } from "react";
import classNames from "classnames";

// Component
import Button from "@components/atoms/Button";
import Pill, { IPillProps } from "@components/atoms/Pill";
import TextLink, { ITextLinkProps } from "@components/atoms/TextLink";
import { IKeyValueProps, Key, KeyValue, Value } from "@components/molecules/KeyValue";

// Styles
import "./DataCard.scss";

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

interface RowData {
    key: string;
    value: RowValue;
    infoText?: string;
}

type CardData = RowData[];

interface IDataCardProps {
    /**
     * The data used to draw the DataCard components
     */
    cardData: CardData;
    /**
     * DataCard size
     * Possible values: `medium | large`;
     */
    size?: IKeyValueProps["size"];
    /**
     * Aria role
     */
    role?: AriaRole;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const SHOWING_ROWS_COUNT = 6;

const valueRenderer = (value: RowValue) => {
    if (value.type === "pill") {
        return <Pill {...(value as IPillProps)} />;
    }

    if (value.type === "textLink") {
        return <TextLink {...(value as ITextLinkProps)} />;
    }

    return value.text;
};

/**
 * DataCard Component is a row for DataCard component
 */
const DataCard: FC<IDataCardProps> = ({ cardData, role, className, size = "medium" }) => {
    const [isShowMoreMenuOpen, setIsShowMoreMenuOpen] = useState(false);
    const isShowMoreVisible = cardData.length > SHOWING_ROWS_COUNT;

    // TODO: Remove when menu is implemented
    console.log("isShowMoreMenuOpen", isShowMoreMenuOpen);

    return (
        <div className={classNames("dataCard", className)} role={role}>
            {cardData.slice(0, SHOWING_ROWS_COUNT).map(({ key, value, infoText }, index) => (
                <KeyValue
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className={`dataCard__row_${size}`}
                    direction="horizontal"
                    spaceBetween
                    size={size}
                >
                    <Key infoText={infoText}>{key}</Key>
                    <Value>{valueRenderer(value)}</Value>
                </KeyValue>
            ))}
            <div className="dataCard__buttons">
                {isShowMoreVisible && (
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="large"
                        fullWidth
                        onClick={() => setIsShowMoreMenuOpen(true)}
                    >
                        Show more
                    </Button>
                )}
                <Button appearance="secondary" size="large" fullWidth onClick={() => {}}>
                    Actions
                </Button>
            </div>
        </div>
    );
};

export { IDataCardProps, DataCard as default };
