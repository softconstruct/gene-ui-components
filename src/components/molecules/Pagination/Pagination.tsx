import React, { ChangeEvent, FC, PointerEvent, useEffect, useState } from "react";
import classNames from "classnames";

import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import PaginationButton from "@components/molecules/Pagination/PaginationButton";
import TextField from "@components/molecules/TextField";

// Styles
import "./Pagination.scss";

// Helpers
import { allowOnlyDigits } from "../../../helpers";

interface IPaginationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Disables pagination interactions.
     * When `true`, all navigation buttons, page size select, and go-to-page input are non-interactive.
     */
    disabled?: boolean;
    /**
     * Total number of pages available.
     * This value determines the upper bound of pagination navigation.
     * If not provided, will be calculated from `totalItems` and `pageSize`.
     */
    totalPages?: number;
    /**
     * Total number of items across all pages.
     * Used to display "X of Y items" and calculate `totalPages` if not explicitly provided.
     */
    totalItems?: number;
    /**
     * The current active page (1-indexed).
     * When provided, enables controlled mode where the parent component manages pagination state.
     * When undefined, the component manages its own internal state (uncontrolled mode).
     */
    current?: number;
    /**
     * The current page size (number of items per page).
     * When provided, enables controlled mode for page size.
     * When undefined, the component manages its own internal state (uncontrolled mode).
     */
    pageSize?: number;
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
    disabled = false,
    current,
    totalPages,
    totalItems,
    pageSize,
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

    const isControlledPage = current !== undefined && !!onPageChange;
    const isControlledPageSize = pageSize !== undefined && !!onPageSizeChange;

    const [internalPage, setInternalPage] = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(rowsPerPageOptions?.[0] || pageSize || 10);
    const [goToPageValue, setGoToPageValue] = useState(1);

    const currentPage = isControlledPage ? current : internalPage;
    const currentPageSize = isControlledPageSize ? pageSize : internalPageSize;

    const calculatedTotalPages =
        totalPages ?? (totalItems && currentPageSize ? Math.ceil(totalItems / currentPageSize) : 25);

    // Generate the page numbers to display
    const calculatedData = createPageNumbers(currentPage, calculatedTotalPages, MAXIMUM_SIZE_IN_VIEW_PORT);

    const pageValue = goToPageValue > 0 ? goToPageValue.toString() : "";

    // Sync internal state with external prop changes (controlled mode)
    useEffect(() => {
        if (isControlledPage) {
            const newCurrentPage = +current > calculatedTotalPages ? 1 : +current;
            setInternalPage(newCurrentPage);
            setGoToPageValue(newCurrentPage);
        }
    }, [current, calculatedTotalPages, isControlledPage]);

    useEffect(() => {
        if (isControlledPageSize && pageSize) {
            setInternalPageSize(pageSize);
        }
    }, [pageSize, isControlledPageSize]);

    useEffect(() => {
        if (!isControlledPage) {
            setGoToPageValue(internalPage);
        }
    }, [internalPage, isControlledPage]);

    const handlePageChange = (newPage: number) => {
        if (disabled) return;

        if (newPage >= 1 && newPage <= calculatedTotalPages) {
            if (newPage !== goToPageValue) setGoToPageValue(newPage);

            if (!isControlledPage) {
                setInternalPage(newPage);
            }

            onPageChange?.(newPage);
        }
    };

    const handleGoToPageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        const inputValue = e.currentTarget.value;
        const isNumericValue = allowOnlyDigits(inputValue);
        if (!isNumericValue) return;

        setGoToPageValue(+inputValue);
        handlePageChange(+inputValue);
    };

    const handleGoToPageBlur = () => {
        if (disabled) return;

        if (currentPage === goToPageValue) return;
        const currentPageValue =
            goToPageValue > calculatedTotalPages ? calculatedTotalPages : goToPageValue || currentPage;
        setGoToPageValue(currentPageValue);
        handlePageChange(currentPageValue);
    };

    const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (disabled) return;

        const value = +e.currentTarget.value;

        if (!isControlledPageSize) {
            setInternalPageSize(value);
            setInternalPage(1);
        }

        onPageSizeChange?.(value);
    };

    const handlePageButtonClick = (e: PointerEvent<HTMLButtonElement>) => {
        if (disabled) return;
        handlePageChange(+e.currentTarget.innerText);
    };

    const handleArrowClick = (isDoubleArrow?: boolean, isForward?: boolean) => {
        if (disabled) return;

        const jumpSize = isDoubleArrow ? DOUBLE_ARROW_PAGE_JUMP_COUNT : 1;
        const newPage = isForward
            ? Math.min(currentPage + jumpSize, calculatedTotalPages)
            : Math.max(currentPage - jumpSize, 1);
        handlePageChange(newPage);
    };

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
    const endItem = totalItems ? Math.min(currentPage * currentPageSize, totalItems) : currentPage * currentPageSize;

    return (
        <div className={classNames("pagination", className)}>
            {rowsPerPageOptions && (
                <div className="pagination__perpage">
                    {/* todo: import 'Dropdown' component */}
                    <div className="pagination__select">
                        <select value={currentPageSize} onChange={handlePageSizeChange} disabled={disabled}>
                            {rowsPerPageOptions.map((el) => (
                                <option value={el} key={el}>
                                    {el}/{pageSizeSuffixLabel}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div
                        className={classNames("pagination__perpage_values", {
                            pagination__perpage_values_disabled: disabled
                        })}
                    >
                        <span>
                            {startItem}-{endItem}
                        </span>{" "}
                        {pageSizeOfLabel} <span>{totalItems ?? calculatedTotalPages}</span>
                    </div>
                </div>
            )}
            <div className="pagination__nav">
                <div className="pagination__nav_list">
                    <Button
                        appearance="secondary"
                        layout="text"
                        disabled={disabled || currentPage === 1}
                        Icon={isRTLMode ? ChevronRight : ChevronLeft}
                        onClick={() => handleArrowClick(false, false)}
                    />

                    {calculatedData[0] > 1 && (
                        <>
                            <button
                                className="pagination__nav_item"
                                type="button"
                                disabled={disabled}
                                onClick={() => handlePageChange(1)}
                            >
                                <span className="pagination__nav_value">1</span>
                            </button>
                            <PaginationButton
                                disabled={disabled}
                                onClick={() => handleArrowClick(true, false)}
                                Icon={isRTLMode ? ChevronDoubleRight : ChevronDoubleLeft}
                            />
                        </>
                    )}

                    {calculatedData.map((el) => (
                        <button
                            key={el}
                            className={classNames("pagination__nav_item", {
                                pagination__nav_item_selected: currentPage === el,
                                pagination__nav_item_selected_disabled: disabled && currentPage === el
                            })}
                            type="button"
                            disabled={disabled}
                            onClick={handlePageButtonClick}
                        >
                            <span className="pagination__nav_value">{el}</span>
                        </button>
                    ))}

                    {calculatedData[calculatedData.length - 1] < calculatedTotalPages && (
                        <>
                            <PaginationButton
                                disabled={disabled}
                                onClick={() => handleArrowClick(true, true)}
                                Icon={isRTLMode ? ChevronDoubleLeft : ChevronDoubleRight}
                            />
                            <button
                                className="pagination__nav_item"
                                type="button"
                                disabled={disabled}
                                onClick={() => handlePageChange(calculatedTotalPages)}
                            >
                                <span className="pagination__nav_value">{calculatedTotalPages}</span>
                            </button>
                        </>
                    )}
                    <Button
                        appearance="secondary"
                        layout="text"
                        disabled={disabled || currentPage === calculatedTotalPages}
                        Icon={isRTLMode ? ChevronLeft : ChevronRight}
                        onClick={() => handleArrowClick(false, true)}
                    />
                </div>
                {showInputPageField && (
                    <div
                        className={classNames("pagination__nav_specific", {
                            pagination__nav_specific_disabled: disabled
                        })}
                    >
                        <span>{goToPageLabel}</span>
                        <TextField
                            size="medium"
                            onChange={handleGoToPageChange}
                            onBlur={handleGoToPageBlur}
                            autoComplete="off"
                            className="pagination__input"
                            value={pageValue}
                            disabled={disabled}
                        />
                        <span>{goToPageSuffixLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export { IPaginationProps, Pagination as default };
