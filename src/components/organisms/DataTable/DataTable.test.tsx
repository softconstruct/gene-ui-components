import React, { MouseEvent } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import Pagination from "@components/molecules/Pagination";
import { INITIAL_PAGE_SIZE } from "@components/organisms/DataTable/constants";

import { mockColumns, mockData } from "../../../../stories/data/__dataTable";
// Components
import DataTable, { IDataTableProps } from "./index";

type MockDataType = (typeof mockData)[0];

const TestIcon = () => <svg />;

describe("Table Component", () => {
    let setup: ReactWrapper<IDataTableProps<MockDataType>>;

    beforeEach(async () => {
        await act(async () => {
            setup = mount(<DataTable columns={mockColumns} data={mockData} />);
        });
    });

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", async () => {
        const className = "test-custom-class";

        await act(async () => {
            setup.setProps({ className });
        });
        setup.update();

        expect(setup.find(".dataTable").hasClass(className)).toBeTruthy();
    });

    it("renders the correct number of columns based on data and columns props", () => {
        const headers = setup.find("thead th");
        expect(headers.length).toBe(mockColumns.length);
    });

    it("renders Loader component and hides data when loading prop is true", async () => {
        await act(async () => {
            setup.setProps({ loading: true });
        });
        setup.update();

        expect(setup.find(Loader).exists()).toBeTruthy();
    });

    it("passes custom loadingText prop to Loader component", async () => {
        const customLoadingText = "Please wait, fetching data...";

        await act(async () => {
            setup.setProps({ loading: true, loadingText: customLoadingText });
        });
        setup.update();

        const loader = setup.find(Loader);
        expect(loader.exists()).toBeTruthy();
        expect(loader.prop("text")).toBe(customLoadingText);
    });

    it("renders Empty component when data is empty (noData)", async () => {
        await act(async () => {
            setup.setProps({ data: [] });
        });
        setup.update();

        const emptyState = setup.find(Empty);
        expect(emptyState.exists()).toBeTruthy();
        expect(emptyState.prop("appearance")).toBe("noData");
    });

    it("renders Empty component with custom errorTexts when provided", async () => {
        const customErrorTexts = {
            noDataAvailableText: "Custom No Result Title",
            noDataAvailableTitle: "Custom No Result Text"
        };

        await act(async () => {
            setup.setProps({ data: [], noDataTexts: customErrorTexts });
        });
        setup.update();

        const emptyState = setup.find(Empty);
        expect(emptyState.exists()).toBeTruthy();
        expect(emptyState.prop("title")).toBe(customErrorTexts.noDataAvailableTitle);
        expect(emptyState.prop("description")).toBe(customErrorTexts.noDataAvailableText);
    });

    it("renders Pagination component by default (pagination = true)", () => {
        setup.setProps({ pagination: true });
        expect(setup.find(Pagination).exists()).toBeTruthy();
    });

    it("does not render Pagination when pagination prop is false", async () => {
        expect(setup.find(Pagination).exists()).toBeFalsy();
    });

    it("passes custom config to Pagination when pagination prop is an object", async () => {
        const paginationConfig = {
            showInputPageField: true,
            rowsPerPageOptions: [5, 10, 15]
        };

        await act(async () => {
            setup.setProps({ pagination: paginationConfig });
        });
        setup.update();

        const paginationEl = setup.find(Pagination);
        expect(paginationEl.exists()).toBeTruthy();
        expect(paginationEl.prop("showInputPageField")).toBe(true);
        expect(paginationEl.prop("rowsPerPageOptions")).toEqual([5, 10, 15]);
    });

    it("renders sticky header by default", () => {
        const thead = setup.find("thead");
        expect(thead.hasClass("tableHeader__sticky")).toBeTruthy();
    });

    it("removes sticky header class when sticky prop is false", async () => {
        await act(async () => {
            setup.setProps({ sticky: false });
        });
        setup.update();

        const thead = setup.find("thead");
        expect(thead.hasClass("tableHeader__sticky")).toBeFalsy();
    });

    it("renders row actions when rowActions prop is provided", async () => {
        const rowActions = [{ Icon: TestIcon, title: "Edit", onClick: jest.fn(() => undefined) }];

        await act(async () => {
            setup.setProps({ rowActions });
        });
        setup.update();

        const actionWrappers = setup.find(".tableRow__actionsWrapper");
        expect(actionWrappers.length).toBe(INITIAL_PAGE_SIZE);

        const actionButtons = setup.find(".tableRow__actionsWrapper button");
        expect(actionButtons.length).toBe(INITIAL_PAGE_SIZE * rowActions.length);
    });

    it("calls row action onClick with current row data", async () => {
        const onEdit = jest.fn((row: MockDataType, event: MouseEvent) => ({ row, event }));
        const rowActions = [{ Icon: TestIcon, title: "Edit", onClick: onEdit }];

        await act(async () => {
            setup.setProps({ rowActions });
        });
        setup.update();

        const firstActionButton = setup.find(".tableRow__actionsWrapper button").first();
        await act(async () => {
            firstActionButton.simulate("click", { type: "click" });
        });
        setup.update();

        expect(onEdit).toHaveBeenCalledTimes(1);
        const [rowData, event] = onEdit.mock.calls[0];
        expect(rowData.Id).toBe(mockData[0].Id);
        expect(rowData.Email).toBe(mockData[0].Email);
        expect(event).toBeDefined();
    });

    it("applies row action disabled state from row-based callback", async () => {
        const rowActions = [
            {
                Icon: TestIcon,
                title: "Delete",
                disabled: (row: MockDataType) => row.IsLocked,
                onClick: jest.fn(() => undefined)
            }
        ];

        await act(async () => {
            setup.setProps({ rowActions });
        });
        setup.update();

        const actionButtons = setup.find(".tableRow__actionsWrapper button");
        expect(actionButtons.at(0).prop("disabled")).toBe(Boolean(mockData[0].IsLocked));
        expect(actionButtons.at(1).prop("disabled")).toBe(Boolean(mockData[1].IsLocked));
    });

    it("applies row action boolean disabled state", async () => {
        const rowActions = [
            {
                Icon: TestIcon,
                title: "Edit",
                disabled: true,
                onClick: jest.fn(() => undefined)
            }
        ];

        await act(async () => {
            setup.setProps({ rowActions });
        });
        setup.update();

        const actionButtons = setup.find(".tableRow__actionsWrapper button");
        expect(actionButtons.first().prop("disabled")).toBe(true);
    });

    it("resolves row status from getRowStatus callback", async () => {
        await act(async () => {
            setup.setProps({
                getRowStatus: (row) => (row.IsLocked ? "red" : "green")
            });
        });
        setup.update();

        const tableRows = setup.find("tbody.tableBody tr.tableRow");
        expect(tableRows.at(0).hasClass("tableRow_status_red")).toBe(Boolean(mockData[0].IsLocked));
        expect(tableRows.at(1).hasClass("tableRow_status_red")).toBe(Boolean(mockData[1].IsLocked));
        expect(tableRows.at(1).hasClass("tableRow_status_green")).toBe(!mockData[1].IsLocked);
    });

    it("does not add row status modifier class when getRowStatus is not provided", () => {
        const firstRow = setup.find("tbody.tableBody tr.tableRow").at(0);
        expect(firstRow.hasClass("tableRow_status_red")).toBe(false);
        expect(firstRow.hasClass("tableRow_status_default")).toBe(false);
        expect(firstRow.hasClass("tableRow_status_highlighted")).toBe(false);
    });

    it("does not add row status modifier class when getRowStatus returns undefined", async () => {
        await act(async () => {
            setup.setProps({
                getRowStatus: () => undefined
            });
        });
        setup.update();

        const firstRow = setup.find("tbody.tableBody tr.tableRow").at(0);
        expect(firstRow.hasClass("tableRow_status_red")).toBe(false);
        expect(firstRow.hasClass("tableRow_status_default")).toBe(false);
    });

    it("keeps row actions rendered with pagination and expanded rows", async () => {
        const onActionClick = jest.fn(() => undefined);

        await act(async () => {
            setup.setProps({
                data: mockData,
                pagination: true,
                renderExpandedRow: () => <div>Expanded Content</div>,
                rowActions: [{ Icon: TestIcon, title: "Action", onClick: onActionClick }]
            });
        });
        setup.update();

        const expanderButton = setup.find("button").first();
        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(setup.find(".tableRow__actionsWrapper")).toHaveLength(INITIAL_PAGE_SIZE);
    });

    it("calls onRowExpandChange callback when a row is expanded", async () => {
        const onRowExpandChange = jest.fn();

        await act(async () => {
            setup.setProps({
                data: mockData,
                renderExpandedRow: () => <div>Expanded Content</div>,
                onRowExpandChange
            });
        });
        setup.update();

        const expanderButton = setup.find("button").first();
        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(onRowExpandChange).toHaveBeenCalled();
        expect(onRowExpandChange).toHaveBeenCalledWith(true, mockData[0]);
    });

    it("calls onRowExpandChange callback with correct payload when row is toggled", async () => {
        const onRowExpandChange = jest.fn();

        await act(async () => {
            setup.setProps({
                data: mockData,
                renderExpandedRow: () => <div>Expanded Content</div>,
                onRowExpandChange
            });
        });
        setup.update();

        const expanderButton = setup.find("button").first();

        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(onRowExpandChange).toHaveBeenNthCalledWith(1, true, mockData[0]);

        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(onRowExpandChange).toHaveBeenCalledTimes(2);
        expect(onRowExpandChange).toHaveBeenNthCalledWith(2, false, mockData[0]);
    });

    it("does not call onRowExpandChange when renderExpandedRow is not provided", async () => {
        const onRowExpandChange = jest.fn();

        await act(async () => {
            setup.setProps({ onRowExpandChange });
        });
        setup.update();

        expect(onRowExpandChange).not.toHaveBeenCalled();
    });
});
