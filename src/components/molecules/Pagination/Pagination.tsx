import React, { ChangeEvent, FC, PointerEvent, useEffect, useState } from "react";
import classNames from "classnames";

import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import PaginationButton from "@components/molecules/Pagination/PaginationButton";
import TextField from "@components/molecules/TextField";

// Styles
import "./Pagination.scss";

// helpers
import { allowOnlyDigits } from "../../../helpers";

interface IPaginationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Total number of pages available.
     * This value determines the upper bound of pagination navigation.
     */
    totalPages: number;
    /**
     * The current active page (1-indexed).
     * This value sets the starting point of the pagination and updates dynamically with user interaction.
     */
    current: number;
    /**
     * Optional array of available page sizes (e.g., [10, 25, 50]).
     * When provided, a dropdown is rendered to allow users to choose the number of items displayed per page.
     */
    rowsPerPageOptions?: number[];
    /**
     * Callback triggered when the user selects a new page size from the dropdown.
     * Receives the selected page size as a numeric argument.
     */
    onPageSizeChange?: (size: number) => void;
    /**
     * Callback triggered when the current page changes, either through navigation buttons or direct input.
     * Receives the new page number as a numeric argument.
     */
    onPageChange?: (page: number) => void;
    /**
     * When `true`, displays an input field allowing the user to jump to a specific page by number.
     */
    showInputPageField?: boolean;
    /**
     * The text or suffix to display after each page size option in the dropdown (e.g., '/Page').
     */
    pageSizeSuffixLabel?: string;
    /**
     * The separator text displayed between the current page size and the total number of items (e.g., 'of').
     */
    pageSizeOfLabel?: string;
    /**
     * The label displayed before the input field for jumping to a specific page (e.g., 'Go to').
     */
    goToPageLabel?: string;
    /**
     * The label displayed after the input field for jumping to a specific page (e.g., 'Page').
     */
    goToPageSuffixLabel?: string;
}

/**
 * Helper function to generate the array of page numbers to be displayed.
 * It ensures the current page is centered when possible and handles edge cases.
 * @param currentPage - The current active page.
 * @param totalPages - The total number of pages.
 * @param pageLimit - The maximum number of page buttons to show.
 * @returns An array of page numbers to display.
 */
const createPageNumbers = (currentPage: number, totalPages: number, pageLimit: number): number[] => {
    if (+totalPages <= pageLimit) {
        return [...Array(totalPages).keys()].map((i) => i + 1);
    }

    const halfLimit = Math.floor(pageLimit / 2);
    let startPage = currentPage - halfLimit;
    let endPage = currentPage + halfLimit;

    // Adjust for start edge case
    if (startPage <= 0) {
        startPage = 1;
        endPage = pageLimit;
    }

    // Adjust for end edge case
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - pageLimit + 1;
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
};

const MAXIMUM_SIZE_IN_VIEW_PORT = 5;
const DOUBLE_ARROW_PAGE_JUMP_COUNT = 3;
const DEFAULT_PAGE_SIZE_SUFFIX = "Page";
const DEFAULT_PAGE_SIZE_OF_LABEL = "of";
const DEFAULT_GO_TO_PAGE_LABEL = "Go to";
const DEFAULT_GO_TO_PAGE_SUFFIX = "Page";

/*
 Pagination divides content into multiple pages, allowing users to navigate through large datasets or long lists of items in a more manageable and digestible way.
 */
const Pagination: FC<IPaginationProps> = ({
    className,
    current = 1,
    totalPages = 25,
    rowsPerPageOptions,
    onPageChange,
    onPageSizeChange,
    showInputPageField,
    pageSizeSuffixLabel = DEFAULT_PAGE_SIZE_SUFFIX,
    pageSizeOfLabel = DEFAULT_PAGE_SIZE_OF_LABEL,
    goToPageLabel = DEFAULT_GO_TO_PAGE_LABEL,
    goToPageSuffixLabel = DEFAULT_GO_TO_PAGE_SUFFIX
}) => {
    const isRTLMode = document.dir === "rtl";

    const [currentPage, setCurrentPage] = useState<number>(+current > totalPages ? 1 : +current);
    const [currentPageSize, setCurrentPageSize] = useState<number>(rowsPerPageOptions?.[0] || 0);
    const [goToPageValue, setGoToPageValue] = useState<number>(() => currentPage);

    // Generate the page numbers to display
    const calculatedData = createPageNumbers(currentPage, +totalPages, MAXIMUM_SIZE_IN_VIEW_PORT);

    // Effect to sync internal state with external prop changes
    useEffect(() => {
        const newCurrentPage = +current > totalPages ? 1 : +current;
        setCurrentPage(newCurrentPage);
        setGoToPageValue(newCurrentPage);
    }, [current, totalPages]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            if (newPage !== goToPageValue) setGoToPageValue(newPage);
            setCurrentPage(newPage);
            onPageChange?.(newPage);
        }
    };

    const handleGoToPageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;
        const isNumericValue = allowOnlyDigits(inputValue);
        if (!isNumericValue) return;

        setGoToPageValue(+inputValue);
        handlePageChange(+inputValue);
    };

    const handleGoToPageBlur = () => {
        if (currentPage === goToPageValue) return;
        const currentPageValue = goToPageValue > totalPages ? totalPages : goToPageValue || currentPage;
        setGoToPageValue(currentPageValue);
        handlePageChange(currentPageValue);
    };

    const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = +e.currentTarget.value;
        setCurrentPageSize(value);
        onPageSizeChange?.(value);
    };

    const handlePageButtonClick = (e: PointerEvent<HTMLButtonElement>) => {
        handlePageChange(+e.currentTarget.innerText);
    };

    const handleArrowClick = (isDoubleArrow?: boolean, isForward?: boolean) => {
        const jumpSize = isDoubleArrow ? DOUBLE_ARROW_PAGE_JUMP_COUNT : 1;
        const newPage = isForward ? Math.min(currentPage + jumpSize, totalPages) : Math.max(currentPage - jumpSize, 1);
        handlePageChange(newPage);
    };

    const pageValue = () => (goToPageValue > 0 ? goToPageValue : "");

    return (
        <div className={classNames("pagination", className)}>
            {rowsPerPageOptions && (
                <div className="pagination__perpage">
                    {/* todo: import 'Dropdown' component */}
                    <div className="pagination__select">
                        <select onChange={handlePageSizeChange}>
                            {rowsPerPageOptions.map((el) => (
                                <option value={el} key={el}>
                                    {el}/{pageSizeSuffixLabel}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pagination__perpage_values">
                        <span>{currentPageSize}</span> {pageSizeOfLabel} <span>{totalPages}</span>
                    </div>
                </div>
            )}
            <div className="pagination__nav">
                <div className="pagination__nav_list">
                    <Button
                        appearance="secondary"
                        layout="text"
                        disabled={currentPage === 1}
                        Icon={isRTLMode ? ChevronRight : ChevronLeft}
                        onClick={() => handleArrowClick(false, false)}
                    />

                    {calculatedData[0] > 1 && (
                        <>
                            <button className="pagination__nav_item" type="button" onClick={() => handlePageChange(1)}>
                                <span className="pagination__nav_value">1</span>
                            </button>
                            <PaginationButton
                                onClick={() => handleArrowClick(true, false)}
                                Icon={isRTLMode ? ChevronDoubleRight : ChevronDoubleLeft}
                            />
                        </>
                    )}

                    {calculatedData.map((el) => (
                        <button
                            key={el}
                            className={classNames("pagination__nav_item", {
                                pagination__nav_item_selected: currentPage === el
                            })}
                            type="button"
                            onClick={handlePageButtonClick}
                        >
                            <span className="pagination__nav_value">{el}</span>
                        </button>
                    ))}

                    {calculatedData[calculatedData.length - 1] < totalPages && (
                        <>
                            <PaginationButton
                                onClick={() => handleArrowClick(true, true)}
                                Icon={isRTLMode ? ChevronDoubleLeft : ChevronDoubleRight}
                            />
                            <button
                                className="pagination__nav_item"
                                type="button"
                                onClick={() => handlePageChange(totalPages)}
                            >
                                <span className="pagination__nav_value">{totalPages}</span>
                            </button>
                        </>
                    )}
                    <Button
                        appearance="secondary"
                        layout="text"
                        disabled={currentPage === totalPages}
                        Icon={isRTLMode ? ChevronLeft : ChevronRight}
                        onClick={() => handleArrowClick(false, true)}
                    />
                </div>
                {showInputPageField && (
                    <div className="pagination__nav_specific">
                        <span>{goToPageLabel}</span>
                        <TextField
                            size="medium"
                            onChange={handleGoToPageChange}
                            onBlur={handleGoToPageBlur}
                            autoComplete="off"
                            className="pagination__input"
                            value={pageValue()}
                        />
                        <span>{goToPageSuffixLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export { IPaginationProps, Pagination as default };
