import React, { FC } from "react";
import classNames from "classnames";

import { CaretDownFilled, Globe, Pin, ThreeDotsVertical } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./Table.scss";

import { Scrollbar } from "../../../index";

interface ITableProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Table component props interface
}

const TableLayoutTmp: FC<ITableProps> = ({ className }) => {
    return (
        <div className={classNames("dataTable", className)}>
            <div className={classNames("dataTable__toolbar toolbar", className)}>
                <div className="dataTable__toolbar_search">
                    {/* todo: import "Search Field" component instead of next input element */}
                    <input type="text" placeholder="Search" style={{ width: "100%" }} />
                    <div className="dataTable__bulkActions">
                        <div className="dataTable__bulkActions_selected">2 selected</div>
                        <Divider vertical />
                        <Button appearance="primary" displayType="text" size="medium" onClick={() => {}}>
                            Deselect
                        </Button>
                        <Button
                            appearance="primary"
                            displayType="text"
                            size="medium"
                            Icon={CaretDownFilled}
                            iconAfter
                            onClick={() => {}}
                        >
                            Bulk Actions
                        </Button>
                        {/* todo: import "Menu" component that opens by clicking on "Bulk Actions" button */}
                    </div>
                </div>
                <div className="dataTable__toolbar_actions">
                    {/* todo: import "Swap" component here if needed */}
                    <Button appearance="secondary" displayType="outline" size="medium" Icon={Globe} onClick={() => {}}>
                        Edit
                    </Button>
                    <div className="dataTable__toolbar_dropdownMenu">
                        <Button
                            appearance="secondary"
                            displayType="outline"
                            size="medium"
                            Icon={Globe}
                            onClick={() => {}}
                        >
                            Manage Columns
                        </Button>

                        {/* todo: conditionally show manageColumns dropdown menu */}
                        <div className="dropdownMenu">
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
                                <Button appearance="secondary" displayType="text" size="medium" onClick={() => {}}>
                                    Restore Defaults
                                </Button>

                                {/* todo: import "Button Group" component instead of next element */}
                                <div className="dropdownMenu__footer_buutonGroup">
                                    <Button appearance="secondary" displayType="fill" size="medium" onClick={() => {}}>
                                        Cancel
                                    </Button>
                                    <Button appearance="primary" displayType="fill" size="medium" onClick={() => {}}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ITableProps, TableLayoutTmp as default };
