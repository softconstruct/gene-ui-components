import React, { FC, MouseEvent } from "react";
import classNames from "classnames";

// Components
import Button from "@components/atoms/Button";
import Tooltip from "@components/molecules/Tooltip";

import "./MonthYearView.scss";

interface IMonthYearViewItemProps {
    /**
     * Label to display inside picker (day, month name)
     */
    label: string | number;
    /**
     * Selected value (day, month)
     */
    value: number;
    /**
     *
     */
    excludedList: Array<{
        month: number;
        message?: string;
    }> | Array<{
        year: number;
        message?: string;
    }>
    | Array<number>;
    /**
     * Type of grid with which component should work
     * Possible values: `month | year`
     */
    excludeKey?: "month" | "year";
    /**
     *
     * @returns
     */
    onClick: () => void;
}

const MonthYearViewItem: FC<IMonthYearViewItemProps> = ({ label, value, excludedList, excludeKey, onClick }) => {
    const disabledEntry = excludedList?.find((item) => {
        if (typeof item === "number") return item === value;
        return item?.[excludeKey || ""] === value;
    });

    const isDisabled = !!disabledEntry;
    const tooltipMsg = typeof disabledEntry === "object" && disabledEntry.message ? disabledEntry.message : undefined;

    const handleItemClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isDisabled) onClick();
    };

    const content = (
        <Button
            tabIndex={isDisabled ? -1 : 0}
            className={classNames("x-datepicker__grid-item", {
                "x-datepicker__grid-item--disabled": isDisabled
            })}
            onClick={handleItemClick}
        >
            {`${label}`}
        </Button>
    );

    if (isDisabled && tooltipMsg) {
        return (
            <Tooltip text={tooltipMsg} position="bottom-center">
                {content}
            </Tooltip>
        );
    }
    return content;
};

export default MonthYearViewItem;
