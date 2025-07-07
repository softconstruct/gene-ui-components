import React, { FC } from "react";
import classNames from "classnames";

import {
    ArrowUpDown,
    CaretDownFilled,
    ChevronRight,
    Clock,
    Copy,
    Download,
    Globe,
    Pin,
    RecycleBin,
    Tag,
    ThreeDotsVertical
} from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Pill from "@components/atoms/Pill";
import Scrollbar from "@components/atoms/Scrollbar";
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./Table.scss";

interface ITableProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Table component props interface
}

const TableLayoutTmp: FC<ITableProps> = ({ className }) => {
    // todo: remove mock data after implementation
    const columnsLength = 18;
    const rowsLength = 18;

    const headers = Array.from({ length: columnsLength }, (_, index) => `Header ${index + 1}`);
    const rows = Array.from({ length: rowsLength }, (_, rowIndex) =>
        // eslint-disable-next-line no-shadow
        Array.from({ length: columnsLength }, (_, cellIndex) => `Row ${rowIndex + 1}, Cell ${cellIndex + 1}`)
    );

    // Convert 2D array into array of objects with unique IDs
    const tableData: { id: string; cells: string[] }[] = [
        { id: "header", cells: headers },
        ...rows.map((row, index) => ({
            id: `row-${index + 1}`,
            cells: row
        }))
    ];

    return (
        <div className={classNames("dataTable", className)}>
            <div className={classNames("dataTable__toolbar toolbar", className)}>
                <div className="dataTable__toolbar_search">
                    {/* todo: import "Search Field" component instead of next input element */}
                    <input type="text" placeholder="Search" style={{ width: "100%" }} />
                    <div className="dataTable__bulkActions">
                        <div className="dataTable__bulkActions_selected">2 selected</div>
                        <Divider direction="vertical" />
                        <Button appearance="primary" layout="text" size="medium" onClick={() => {}}>
                            Deselect
                        </Button>
                        <Button
                            appearance="primary"
                            layout="text"
                            size="medium"
                            Icon={CaretDownFilled}
                            iconPosition="after"
                            onClick={() => {}}
                        >
                            Bulk Actions
                        </Button>
                        {/* todo: import "Menu" component that opens by clicking on "Bulk Actions" button */}
                    </div>
                </div>
                <div className="dataTable__toolbar_actions">
                    {/* todo: import "Swap" component here if needed */}
                    <Button appearance="secondary" layout="outline" size="medium" Icon={Globe} onClick={() => {}}>
                        Edit
                    </Button>
                    <div className="dataTable__toolbar_dropdownMenu">
                        <Button appearance="secondary" layout="outline" size="medium" Icon={Globe} onClick={() => {}}>
                            Manage Columns
                        </Button>

                        {/* todo: conditionally show manageColumns dropdown menu */}
                        <div className="dropdownMenu" style={{ display: "none" }}>
                            <div className="dropdownMenu__header">
                                {/* todo: import "Search Field" component instead of next input element */}
                                <input type="text" placeholder="Search" style={{ width: "100%" }} />
                            </div>

                            <Scrollbar>
                                <div className="dropdownMenu__main">
                                    <div className="dropdownMenu__columns">
                                        <div className="dropdownMenu__columns_header">
                                            <p className="dropdownMenu__columns_title ellipsis-text">Active Columns</p>
                                        </div>

                                        {/* todo: add next classNames for similar states - "dropdownMenu__columns_item_drag", "dropdownMenu__columns_item_disabled" */}
                                        <div
                                            className="dropdownMenu__columns_item dropdownMenu__columns_item_drag"
                                            role="tab"
                                            tabIndex={0}
                                        >
                                            <div className="dropdownMenu__columns_placeholder">
                                                {/* todo: add 'disabled' attr. for similar state */}
                                                {/* todo: add 'readOnly checked' attr-s. for 'readOnly state */}
                                                <Checkbox name="item" value="item" readOnly checked />
                                                <p className="dropdownMenu__columns_text ellipsis-text">
                                                    Active Column Title
                                                </p>
                                            </div>
                                            <div className="dropdownMenu__columns_actions">
                                                {/* todo: change icon from "Pin" to "PinFilled" if needed */}
                                                <Pin className="dropdownMenu__columns_icon" />
                                                {/* <PinFilled className="dropdownMenu__columns_icon" /> */}

                                                {/* todo: change icon from "ThreeDotsVertical" to some "Drag" icon, when it will implemented */}
                                                <ThreeDotsVertical className="dropdownMenu__columns_icon" />
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                </div>
                            </Scrollbar>

                            <div className="dropdownMenu__footer">
                                <Button appearance="secondary" layout="text" size="medium" onClick={() => {}}>
                                    Restore Defaults
                                </Button>

                                {/* todo: import "Button Group" component instead of next element */}
                                <div className="dropdownMenu__footer_buutonGroup">
                                    <Button appearance="secondary" layout="fill" size="medium" onClick={() => {}}>
                                        Cancel
                                    </Button>
                                    <Button appearance="primary" layout="fill" size="medium" onClick={() => {}}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Scrollbar>
                <table className={classNames("table", className)}>
                    <colgroup>
                        {tableData[0].cells.map((_, colIndex) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <col key={`col-${colIndex}`} />
                        ))}
                    </colgroup>

                    <thead>
                        <tr className="table__row table__row_thead">
                            <th className="table__th table__th_group" colSpan={columnsLength + 1}>
                                <div className="table__content">
                                    <span className="table__th_text ellipsis-text">Group Header Text</span>
                                </div>
                            </th>
                        </tr>

                        <tr className="table__row table__row_thead">
                            <th key="header-0" className="table__th">
                                {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                <div className="table__content table__content_expand" />
                            </th>
                            <th key="header-1" className="table__th">
                                {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                <div className="table__content table__content_checkbox">
                                    <Checkbox name="item" value="item" />
                                    {/* <Checkbox name="item" value="item" checked /> */}
                                    {/* <Checkbox name="item" value="item" indeterminate /> */}
                                </div>
                            </th>

                            {/* todo: add next classNames for similar states - "table__pinned", "table__pinned_vertical", "table__pinned_horizontal" */}
                            <th key="header-2" className="table__th" style={{ width: "120px" }}>
                                {/* todo: add next classNames for similar states - "table__content_empty" */}
                                <div className="table__content table__content_empty">
                                    <span className="table__th_text ellipsis-text">Header</span>
                                    <div className="table__th_actions">
                                        <Button
                                            appearance="secondary"
                                            layout="text"
                                            size="small"
                                            Icon={ArrowUpDown}
                                            // Icon={ArrowUp}
                                            // Icon={ArrowDown}
                                            disabled
                                            onClick={() => {}}
                                        />

                                        {/* todo: change icon from "Globe" to some "Filter" icon, when it will implemented */}
                                        <Button
                                            appearance="secondary"
                                            layout="text"
                                            size="small"
                                            Icon={Globe}
                                            onClick={() => {}}
                                        />
                                        {/* todo: import "Dropdown-Menu" component upon click on "Filter" button */}

                                        {/* todo: change icon from "Globe" to some "Search" icon, when it will implemented */}
                                        <Button
                                            appearance="secondary"
                                            layout="text"
                                            size="small"
                                            Icon={Globe}
                                            onClick={() => {}}
                                        />
                                        {/* todo: import "Search Field" component instead of "Search" button upon click on it */}
                                        {/* <input type="text" placeholder="Search" style={{ width: "100%" }} /> */}
                                    </div>
                                </div>
                            </th>
                            {tableData[0].cells.slice(3).map((cellIndex) => (
                                <>
                                    {/* todo: add next classNames for similar states - "table__pinned", "table__pinned_vertical", "table__pinned_horizontal" */}
                                    {/* eslint-disable-next-line react/no-array-index-key */}
                                    <th key={`header-${cellIndex}`} className="table__th">
                                        {/* todo: add next classNames for similar states - "table__content_empty" */}
                                        <div className="table__content table__content_empty">
                                            <span className="table__th_text ellipsis-text" />
                                        </div>
                                    </th>
                                </>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.slice(1, -1).map(({ id, cells }) => (
                            <>
                                {/* todo: add next classNames for similar states - "table__row_selected", "table__row_red", "table__row_green", "table__row_highlighted" */}
                                <tr key={id} className="table__row table__row_tbody">
                                    {/* todo: add next classNames next to "table__td" classname, for similar states - "table__pinned", "table__pinned_horizontal" */}
                                    {/* todo: add next className for similar states - "table__expand" */}
                                    <td key={`${id}-0`} className="table__td">
                                        {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                        <div className="table__content table__content_expand">
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={ChevronRight}
                                                // Icon={ChevronDown}
                                                onClick={() => {}}
                                            />
                                        </div>
                                    </td>

                                    {/* todo: add next classNames next to "table__td" classname, for similar states - "table__pinned", "table__pinned_horizontal" */}
                                    <td key={`${id}-1`} className="table__td">
                                        {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                        <div className="table__content table__content_checkbox">
                                            <Checkbox name="item" value="item" />
                                            {/* <Checkbox name="item" value="item" checked /> */}
                                        </div>
                                    </td>

                                    {/* todo: add next classNames next to "table__td" classname, for similar states - "table__pinned", "table__pinned_vertical", "table__pinned_horizontal" */}
                                    <td key={`${id}-2`} className="table__td">
                                        {/* todo: add next classNames next to "table__content" classname, for similar states - "table__content_empty", "table__content_graph", "table__content_status", "table__content_pill", ...  */}
                                        {/* todo: ... "table__content_text", "table__content_textArea", "table__content_dropdown", "table__content_check", "table__content_check_checkbox", "table__content_check_text", "table__content_switch" */}
                                        <div className="table__content table__content_empty" />
                                    </td>

                                    <td key={`${id}-3`} className="table__td">
                                        <div className="table__content table__content_graph">
                                            {/* todo: import "graph" here */}
                                            `graph`
                                        </div>
                                    </td>

                                    <td key={`${id}-4`} className="table__td">
                                        {/* todo: add next classNames for similar states - "table__content_text_string", "table__content_text_numeric" */}
                                        <div className="table__content table__content_text table__content_text_string">
                                            {/* todo: conditionally toggle next fields with "Text Field" in "Editable" mode */}
                                            <span className="table__td_text ellipsis-text">Row Text</span>
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={Copy}
                                                onClick={() => {}}
                                                className="table__content_copy"
                                            />

                                            {/* todo: import "Text Field" component instead of next "input type=text" element */}
                                            {/* <input type="text" placeholder="Row Text" style={{ width: "160px" }} /> */}
                                        </div>
                                    </td>

                                    <td key={`${id}-5`} className="table__td">
                                        {/* todo: add next classNames for similar states - "table__content_text_string", "table__content_text_numeric" */}
                                        <div className="table__content table__content_text table__content_text_numeric">
                                            {/* todo: conditionally toggle next fields with "Text Field" in "Editable" mode */}
                                            <span className="table__td_text ellipsis-text">123456789</span>
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={Copy}
                                                onClick={() => {}}
                                                className="table__content_copy"
                                            />

                                            {/* todo: import "Text Field" component instead of next "input type=number" element */}
                                            {/* <input type="number" placeholder="1234" style={{ width: "160px" }} /> */}
                                        </div>
                                    </td>

                                    <td key={`${id}-6`} className="table__td">
                                        <div className="table__content table__content_text table__content_textArea">
                                            {/* todo: conditionally toggle next fields with "Text Area" in "Editable" mode */}
                                            <span className="table__td_text">Lorem.</span>

                                            {/* todo: import "Text Area" component instead of next "textarea" element */}
                                            {/* <textarea* */}
                                            {/*    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vulputate felis eget nulla consequat, non fermentum velit gravida. Nulla facilisi. Aenean ac " */}
                                            {/*    style={{ width: "280px" }} */}
                                            {/* /> */}
                                        </div>
                                    </td>

                                    <td key={`${id}-7`} className="table__td">
                                        {/* todo: conditionally toggle next fields with "Dropdown" in "Editable" mode */}
                                        <div className="table__content table__content_text table__content_dropdown">
                                            <span className="table__td_text ellipsis-text">Row Dropdown Item</span>

                                            {/* todo: import "Dropdown" component instead of next "select" element */}
                                            {/* <select name="dropdown" id="dropdown" style={{ width: "160px" }}> */}
                                            {/*    <option value="Value">Value</option> */}
                                            {/*    <option value="Value">Value</option> */}
                                            {/*    <option value="Value">Value</option> */}
                                            {/*    <option value="Value">Value</option> */}
                                            {/*    <option value="Value">Value</option> */}
                                            {/* </select> */}
                                        </div>
                                    </td>

                                    <td key={`${id}-8`} className="table__td">
                                        <div className="table__content table__content_status">
                                            {/* todo: change "Pill" components "appearance" as a status to next values: "informative", "neutral", "error", "success", "warning" */}
                                            <Pill text="Status" appearance="informative" />
                                        </div>
                                    </td>

                                    <td key={`${id}-9`} className="table__td">
                                        <div className="table__content table__content_pill">
                                            <Pill
                                                text="Pill"
                                                filled
                                                appearance="informative"
                                                size="small"
                                                withDot={false}
                                            />
                                        </div>
                                    </td>

                                    <td key={`${id}-10`} className="table__td">
                                        <div className="table__content table__content_icon">
                                            {/* todo: import icon as a component for "Icon" and "Flag" case */}
                                            <Tag size={24} />
                                        </div>
                                    </td>

                                    <td key={`${id}-12`} className="table__td">
                                        <div className="table__content table__content_check table__content_check_text">
                                            {/* todo: conditionally toggle next fields with "Checkbox" in "Editable" mode */}
                                            <span className="table__td_text">No</span>

                                            {/* <Checkbox name="item" value="item" /> */}
                                        </div>
                                    </td>

                                    <td key={`${id}-11`} className="table__td">
                                        <div className="table__content table__content_check table__content_check_checkbox">
                                            {/* todo: conditionally toggle next fields with "Checkbox" in "Editable" mode */}
                                            {/* <Checkbox name="item" value="item" readOnly /> */}
                                            <Checkbox name="item" value="item" checked readOnly />

                                            {/* <Checkbox name="item" value="item" /> */}
                                        </div>
                                    </td>

                                    <td key={`${id}-13`} className="table__td">
                                        <div className="table__content table__content_switch">
                                            {/* todo: conditionally toggle next fields with "Switch" in "Editable" mode */}
                                            <span className="table__td_text">Off</span>

                                            {/* todo: import "Switch" component instead of next "input type=checkbox" element */}
                                            {/* <input type="checkbox" /> */}
                                        </div>
                                    </td>

                                    {cells.slice(14).map((cellData, cellIndex) => (
                                        <>
                                            {/* todo: add next classNames for similar states - "table__pinned", "table__pinned_vertical", "table__pinned_horizontal" */}
                                            {/* eslint-disable-next-line react/no-array-index-key */}
                                            <td key={`${id}-${cellIndex}`} className="table__td">
                                                <div className="table__content table__content_empty">
                                                    <span className="ellipsis-text">{cellData}</span>
                                                </div>
                                            </td>
                                        </>
                                    ))}

                                    <td className="table__td table__actionsWrapper">
                                        <div className="table__actions">
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={Pin}
                                                onClick={() => {}}
                                                className=""
                                            />
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={Tag}
                                                onClick={() => {}}
                                                className=""
                                            />
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={Clock}
                                                onClick={() => {}}
                                                className=""
                                            />
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={Copy}
                                                onClick={() => {}}
                                                className=""
                                            />
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={Download}
                                                onClick={() => {}}
                                                className=""
                                            />
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={RecycleBin}
                                                onClick={() => {}}
                                                className=""
                                            />
                                        </div>
                                    </td>
                                </tr>
                                {id === "row-4" && (
                                    <tr key={id} className="table__row table__row_tbody">
                                        <td className="table__td table__td_expanded" colSpan={columnsLength}>
                                            {/* todo: replace this custom "swapComponent" with needed content after implementation */}
                                            <div
                                                className="swapComponent"
                                                style={{
                                                    height: "20rem",
                                                    // backgroundappearance: "#F4E1EC",
                                                    padding: "1.6rem"
                                                    // appearance: "#A60063"
                                                }}
                                            >
                                                Swap
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>

                    <tfoot>
                        {tableData.slice(-1).map(({ id, cells }) => (
                            <tr key={id} className="table__row table__row_tfoot">
                                <td key={`${id}-0`} className="table__td">
                                    {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                    <div className="table__content table__content_expand">
                                        <Button
                                            appearance="secondary"
                                            layout="text"
                                            size="small"
                                            Icon={ChevronRight}
                                            // Icon={ChevronDown}
                                            onClick={() => {}}
                                        />
                                    </div>
                                </td>
                                <td key={`${id}-1`} className="table__td">
                                    {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                    <div className="table__content table__content_checkbox">
                                        <Checkbox name="item" value="item" />
                                        {/* <Checkbox name="item" value="item" checked /> */}
                                    </div>
                                </td>
                                <td key={`${id}-2`} className="table__td">
                                    {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                    <div className="table__content table__content_empty">
                                        <span className="ellipsis-text">Footer</span>
                                    </div>
                                </td>
                                {cells.slice(3).map((cellIndex) => (
                                    <>
                                        {/* todo: add next classNames for similar states - "table__pinned", "table__pinned_vertical", "table__pinned_horizontal" */}
                                        {/* eslint-disable-next-line react/no-array-index-key */}
                                        <td key={`${id}-${cellIndex}`} className="table__td">
                                            {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                            <div className="table__content table__content_empty">
                                                <span className="ellipsis-text" />
                                            </div>
                                        </td>
                                    </>
                                ))}
                            </tr>
                        ))}
                        <tr className="table__row table__row_tfoot">
                            <td className="table__td table__td_group" colSpan={columnsLength}>
                                {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                                <div className="table__content table__content_empty">Group Footer Text</div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </Scrollbar>
            <Divider />
        </div>
    );
};

export { ITableProps, TableLayoutTmp as default };
