import React, { KeyboardEvent } from "react";
import classNames from "classnames";
import { format, getYear } from "date-fns";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";

// Components
import Button from "@components/atoms/Button";
import { ChevronLeft, ChevronRight, ChevronDoubleLeft, ChevronDoubleRight } from "@geneui/icons";

// Types
import { DatePickerSizes, DatePickerViewMode } from "../../types";

import "./Header.scss";

interface IHeaderCustomProps {
    /**
    * Additional class for the header element.
    * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
  */
    className?: string;
    /**
    * View mode of DatePicker
    * Possible values: `day | month | year`
    */
    view: DatePickerViewMode;
    /**
 * Callback function to change the active view of picker
 * @param view
 * @returns void
 */
    setView: (view: DatePickerViewMode) => void;
    /**
    * Defines the sizes of DatePicker header
    */
    size?: DatePickerSizes;
}

interface IHeaderProps extends ReactDatePickerCustomHeaderProps, IHeaderCustomProps { }

const handleKeyDown = (e: KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
    }
};

const Header: React.FC<IHeaderProps> = ({
    date,
    view,
    setView,
    size = "medium",
    className,
    decreaseMonth,
    increaseMonth,
    decreaseYear,
    increaseYear,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    prevYearButtonDisabled,
    nextYearButtonDisabled,
}) => {
    const isDayView = view === "day";
    const startYear = Math.floor(getYear(date) / 10) * 10;

    const renderTitle = () => {
        const titleBaseClass = "datePickerHeader__title";

        if (view === "month") {
            return (
                <div
                    className={titleBaseClass}
                    role="button"
                    tabIndex={0}
                    onClick={() => setView("year")}
                    onKeyDown={(e) => handleKeyDown(e, () => setView("year"))}
                >
                    {format(date, "yyyy")}
                </div>
            );
        }

        if (view === "year") {
            return (
                <div
                    className={titleBaseClass}
                    role="button"
                    tabIndex={0}
                    onClick={() => setView("day")}
                    onKeyDown={(e) => handleKeyDown(e, () => setView("day"))}
                >
                    {`${startYear} - ${startYear + 9}`}
                </div>
            );
        }

        return (
            <div className={titleBaseClass}>
                <span
                    className={`${titleBaseClass}_month`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setView("month")}
                    onKeyDown={(e) => handleKeyDown(e, () => setView("month"))}
                >
                    {format(date, 'MMM')}
                </span>{" "}
                <span
                    className={`${titleBaseClass}_year`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setView("year")}
                    onKeyDown={(e) => handleKeyDown(e, () => setView("year"))}
                >
                    {getYear(date)}
                </span>
            </div>
        );
    };

    return (
        <div
            className={classNames(
                "datePickerHeader",
                className,
                { [`datePickerHeader_${size}`]: size }
            )}
        >
            <Button
                className="datePickerHeader__control"
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
                Icon={ChevronDoubleLeft}
                aria-label="Previous Year"
            />

            {isDayView && (
                <Button
                    className="datePickerHeader__control"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    Icon={ChevronLeft}
                    aria-label="Previous Month"
                />
            )}

            {renderTitle()}

            {isDayView && (
                <Button
                    className="datePickerHeader__control"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    Icon={ChevronRight}
                    aria-label="Next Month"
                />
            )}

            <Button
                className="datePickerHeader__control"
                onClick={increaseYear}
                disabled={nextYearButtonDisabled}
                Icon={ChevronDoubleRight}
                aria-label="Next Year"
            />
        </div>
    );
};

export default Header;