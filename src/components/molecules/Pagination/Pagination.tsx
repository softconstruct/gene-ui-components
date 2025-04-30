import React, { FC } from "react";
import classNames from "classnames";

import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight, ThreeDotsHorizontal } from "@geneui/icons";

import Button from "@components/atoms/Button";

// Styles
import "./Pagination.scss";

interface IPaginationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Pagination component props interface
}

const Pagination: FC<IPaginationProps> = ({ className }) => {
    const isRTLMode = document.dir === "rtl";

    return (
        <div className={classNames("pagination", className)}>
            <div className="pagination__perpage">
                {/* todo: import 'Dropdown' component */}
                <div className="pagination__select">
                    <select>
                        <option value="5">5/Page</option>
                        <option value="25">25/Page</option>
                        <option value="50">50/Page</option>
                    </select>
                </div>
                <div className="pagination__perpage_values">
                    <span>1-25</span> of <span>755</span>
                </div>
            </div>
            <div className="pagination__nav">
                <div className="pagination__nav_list">
                    <Button
                        appearance="secondary"
                        displayType="text"
                        Icon={isRTLMode ? ChevronRight : ChevronLeft}
                        onClick={() => {}}
                    />
                    <button className="pagination__nav_item" type="button">
                        <span className="pagination__nav_value">1</span>
                    </button>
                    <Button appearance="secondary" displayType="text" Icon={ThreeDotsHorizontal} onClick={() => {}} />
                    <button className="pagination__nav_item" type="button">
                        <span className="pagination__nav_value">5</span>
                    </button>
                    {/* todo: add "pagination__nav_item_selected" className for selected state */}
                    <button className="pagination__nav_item pagination__nav_item_selected" type="button">
                        <span className="pagination__nav_value">6</span>
                    </button>
                    {/* todo: add "disabled" attribute for disabled state */}
                    <button className="pagination__nav_item" type="button" disabled>
                        <span className="pagination__nav_value">7</span>
                    </button>
                    <button className="pagination__nav_item" type="button">
                        <span className="pagination__nav_value">8</span>
                    </button>
                    <Button
                        appearance="secondary"
                        displayType="text"
                        Icon={isRTLMode ? ChevronDoubleLeft : ChevronDoubleRight}
                        onClick={() => {}}
                    />
                    <button className="pagination__nav_item" type="button">
                        <span className="pagination__nav_value">15</span>
                    </button>
                    <Button
                        appearance="secondary"
                        displayType="text"
                        Icon={isRTLMode ? ChevronLeft : ChevronRight}
                        onClick={() => {}}
                    />
                </div>
                <div className="pagination__nav_specific">
                    <span>Go to</span>
                    {/* todo: import 'Text Field' component */}
                    <div className="pagination__input">
                        <input type="text" />
                    </div>
                    <span>Page</span>
                </div>
            </div>
        </div>
    );
};

export { IPaginationProps, Pagination as default };
