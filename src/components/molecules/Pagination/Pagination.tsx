import React, { ChangeEvent, FC, PointerEvent, useEffect, useState } from "react";
import classNames from "classnames";

import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from "@geneui/icons";

import Button from "@components/atoms/Button";
import PaginationButton from "@components/molecules/Pagination/PaginationButton";
import TextField from "@components/molecules/TextField";

// Styles
import "./Pagination.scss";

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
/*
 Pagination divides content into multiple pages, allowing users to navigate through large datasets or long lists of items in a more manageable and digestible way.
*/

const MAXIMUM_SIZE_IN_VIEW_PORT = 5;
const Pagination: FC<IPaginationProps> = ({
    className,
    current = 1,
    totalPages = 25,
    rowsPerPageOptions,
    onPageChange,
    onPageSizeChange,
    showInputPageField,
    pageSizeSuffixLabel = "Page",
    pageSizeOfLabel = "of",
    goToPageLabel = "Go to",
    goToPageSuffixLabel = "Page"
}) => {
    const isRTLMode = document.dir === "rtl";

    const isLessOrEqualFive = totalPages <= MAXIMUM_SIZE_IN_VIEW_PORT;

    const [currentPage, setCurrentPage] = useState<number>(+current > totalPages ? 1 : +current);
    const [currentPageSize, setCurrentPageSize] = useState<number>(rowsPerPageOptions?.[0] || 0);
    const [calculatedData, setCalculatedData] = useState<number[]>([]);

    useEffect(() => {
        if (isLessOrEqualFive) {
            setCalculatedData(new Array(totalPages).fill(undefined).map((_, i) => i + 1));
            return;
        }
        let createData: number[] = [];

        if (totalPages - 1 > currentPage) {
            if (currentPage - 3 === 0) {
                createData = [currentPage - 1, currentPage, currentPage + 1, currentPage + 2, currentPage + 3];
            } else if (currentPage - 2 === 0) {
                createData = [currentPage, currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4];
            } else if (
                totalPages > MAXIMUM_SIZE_IN_VIEW_PORT &&
                currentPage > 2 &&
                currentPage - 2 !== 0 &&
                currentPage + 2 !== totalPages
            ) {
                createData = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
            } else if (currentPage + 2 === totalPages && currentPage > 3) {
                createData = [currentPage - 3, currentPage - 2, currentPage - 1, currentPage, currentPage + 1];
            } else if (currentPage === 1) {
                createData = [
                    currentPage + 1,
                    currentPage + 2,
                    currentPage + 3,
                    currentPage + 4,
                    currentPage + MAXIMUM_SIZE_IN_VIEW_PORT
                ];
            }
        } else {
            createData = [currentPage - 4, currentPage - 3, currentPage - 2, currentPage - 1];
            if (currentPage !== totalPages) {
                createData.push(currentPage);
            } else {
                createData.unshift(currentPage - MAXIMUM_SIZE_IN_VIEW_PORT);
            }
        }
        setCalculatedData(createData);
    }, [currentPage]);

    const changeCurrenPage = (e: ChangeEvent<HTMLInputElement>) => {
        const value = +e.currentTarget.value;
        if (Number.isNaN(value)) return;

        if (value > totalPages || !value) return;

        setCurrentPage(value);
        onPageSizeChange?.(value);
    };

    const changePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = +e.currentTarget.value;
        setCurrentPageSize(value);
        onPageSizeChange?.(value);
    };

    const pageChange = (e: PointerEvent<HTMLButtonElement>) => {
        setCurrentPage(+e.currentTarget.innerText);

        onPageChange?.(+e.currentTarget.innerText);
    };

    const changeWithArrow = (
        isDoubleArrow?: boolean,
        isForward?: boolean,
        isFirstStep?: boolean,
        isLastStep?: boolean
    ) => {
        if (isFirstStep) {
            if (currentPage === 1) {
                setCurrentPage((prev) => prev + 6);
                onPageChange?.(currentPage + 6);
                return;
            }
            if (currentPage === 2) {
                setCurrentPage((prev) => prev + MAXIMUM_SIZE_IN_VIEW_PORT);
                onPageChange?.(currentPage + MAXIMUM_SIZE_IN_VIEW_PORT);
                return;
            }
        }
        if (isLastStep) {
            if (currentPage === totalPages) {
                setCurrentPage((prev) => prev - 6);
                onPageChange?.(currentPage - 6);
                return;
            }
            if (currentPage === totalPages - 1) {
                setCurrentPage((prev) => prev - MAXIMUM_SIZE_IN_VIEW_PORT);
                onPageChange?.(currentPage - MAXIMUM_SIZE_IN_VIEW_PORT);
                return;
            }
        }
        if (isDoubleArrow) {
            if (isForward) {
                setCurrentPage((prev) => prev + 3);
                onPageChange?.(currentPage + 3);
                return;
            }

            if (!isForward) {
                setCurrentPage((prev) => prev - 3);
                onPageChange?.(currentPage - 3);
                return;
            }
        }

        if (!isDoubleArrow) {
            if (isForward) {
                onPageChange?.(currentPage + 1);
                setCurrentPage((prev) => prev + 1);
                return;
            }

            if (!isForward) {
                onPageChange?.(currentPage - 1);
                setCurrentPage((prev) => prev - 1);
            }
        }
    };

    return (
        <div className={classNames("pagination", className)}>
            {rowsPerPageOptions && (
                <div className="pagination__perpage">
                    {/* todo: import 'Dropdown' component */}

                    <div className="pagination__select">
                        <select onChange={changePageSize}>
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
                        onClick={() => changeWithArrow(false, false)}
                    />

                    {!isLessOrEqualFive && (
                        <button
                            className={classNames("pagination__nav_item", {
                                pagination__nav_item_selected: currentPage === 1
                            })}
                            type="button"
                            onClick={pageChange}
                        >
                            <span className="pagination__nav_value">1</span>
                        </button>
                    )}

                    {!isLessOrEqualFive && currentPage >= MAXIMUM_SIZE_IN_VIEW_PORT && (
                        <PaginationButton
                            onClick={() =>
                                changeWithArrow(
                                    true,
                                    false,
                                    false,
                                    currentPage === totalPages || currentPage === totalPages - 1
                                )
                            }
                            Icon={isRTLMode ? ChevronDoubleRight : ChevronDoubleLeft}
                        />
                    )}
                    {calculatedData.map((el, i) => {
                        return (
                            <button
                                key={el}
                                className={classNames("pagination__nav_item", {
                                    pagination__nav_item_selected:
                                        currentPage + 2 >= totalPages || currentPage - 3 <= 0
                                            ? currentPage === el
                                            : Math.round(calculatedData.length / 2) - 1 === i
                                })}
                                type="button"
                                onClick={pageChange}
                            >
                                <span className="pagination__nav_value">{el}</span>
                            </button>
                        );
                    })}

                    {!isLessOrEqualFive && (
                        <>
                            {totalPages - MAXIMUM_SIZE_IN_VIEW_PORT >= currentPage && (
                                <PaginationButton
                                    onClick={() => changeWithArrow(true, true, currentPage === 1 || currentPage === 2)}
                                    Icon={isRTLMode ? ChevronDoubleLeft : ChevronDoubleRight}
                                />
                            )}

                            <button
                                className={classNames("pagination__nav_item", {
                                    pagination__nav_item_selected: totalPages === currentPage
                                })}
                                type="button"
                                onClick={() => setCurrentPage(totalPages)}
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
                        onClick={() => changeWithArrow(false, true)}
                    />
                </div>
                {showInputPageField && (
                    <div className="pagination__nav_specific">
                        <span>{goToPageLabel}</span>
                        <TextField
                            numericOnly
                            onChange={changeCurrenPage}
                            autoComplete="off"
                            className="pagination__input"
                        />
                        <span>{goToPageSuffixLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export { IPaginationProps, Pagination as default };
