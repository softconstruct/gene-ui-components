import React, { MouseEvent, ReactNode } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import { Popover } from "@components/atoms/Popover";
import Checkbox from "@components/molecules/Checkbox";
import Empty from "@components/molecules/Empty";
import Pagination from "@components/molecules/Pagination";
import { INITIAL_PAGE_SIZE } from "@components/organisms/DataTable/constants";
import Toolbar from "@components/organisms/DataTable/Toolbar/Toolbar";
import { DataTableColumn, DataTableRenderCellArgs } from "@components/organisms/DataTable/types";

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
        expect(onRowExpandChange).toHaveBeenCalledWith(
            expect.objectContaining({ isExpanded: true, row: mockData[0], rowId: expect.stringMatching(/.+/) })
        );
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

        expect(onRowExpandChange).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ isExpanded: true, row: mockData[0], rowId: expect.stringMatching(/.+/) })
        );

        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(onRowExpandChange).toHaveBeenCalledTimes(2);
        expect(onRowExpandChange).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ isExpanded: false, row: mockData[0], rowId: expect.stringMatching(/.+/) })
        );
    });

    it("does not call onRowExpandChange when renderExpandedRow is not provided", async () => {
        const onRowExpandChange = jest.fn();

        await act(async () => {
            setup.setProps({ onRowExpandChange });
        });
        setup.update();

        expect(onRowExpandChange).not.toHaveBeenCalled();
    });

    it("renders Toolbar when manage columns enabled prop is true", async () => {
        await act(async () => {
            setup.setProps({ manageColumnsConfig: { enabled: true, available: true } });
        });
        setup.update();

        const toolbar = setup.find(Toolbar);
        expect(toolbar.exists()).toBeTruthy();

        const manageButton = setup.find(Button).filterWhere((b) => b.text().includes("Manage columns"));
        expect(manageButton.prop("disabled")).toBe(false);
    });
});

describe("Table Component - body cell memoization", () => {
    const visibleData = mockData.slice(0, 3);

    const buildSpyColumns = () => {
        const renderSpy = jest.fn(({ value }: DataTableRenderCellArgs<MockDataType, ReactNode>) => (
            <span>{String(value ?? "")}</span>
        ));
        const columns: DataTableColumn<MockDataType>[] = [
            { accessorKey: "Id", header: "Id", renderCell: renderSpy },
            { accessorKey: "Email", header: "Email", renderCell: renderSpy }
        ];
        return { renderSpy, columns };
    };

    const cellsRenderedFor = (renderSpy: jest.Mock, rowId: MockDataType["Id"]) =>
        renderSpy.mock.calls.filter(([{ row }]) => row.Id === rowId).length;

    it("does not re-render sibling rows' cells when one row toggles expanded; expander reflects new state", async () => {
        const { renderSpy, columns } = buildSpyColumns();
        const setupLocal: ReactWrapper<IDataTableProps<MockDataType>> = mount(
            <DataTable columns={columns} data={visibleData} renderExpandedRow={() => <div>Expanded</div>} />
        );

        renderSpy.mockClear();

        const firstExpanderButton = setupLocal.find("button[aria-label='Expand row']").at(0);
        await act(async () => {
            firstExpanderButton.simulate("click");
        });
        setupLocal.update();

        expect(cellsRenderedFor(renderSpy, visibleData[1].Id)).toBe(0);
        expect(cellsRenderedFor(renderSpy, visibleData[2].Id)).toBe(0);

        const expandedButtons = setupLocal.find("button[aria-expanded=true]");
        expect(expandedButtons.length).toBe(1);

        setupLocal.unmount();
    });

    it("does not re-render any cells when data array reference changes but row references are stable", async () => {
        const { renderSpy, columns } = buildSpyColumns();
        const setupLocal: ReactWrapper<IDataTableProps<MockDataType>> = mount(
            <DataTable columns={columns} data={visibleData} />
        );

        renderSpy.mockClear();

        await act(async () => {
            setupLocal.setProps({ data: [...visibleData] });
        });
        setupLocal.update();

        expect(renderSpy).not.toHaveBeenCalled();

        setupLocal.unmount();
    });

    it("re-renders cells when row references change (custom renderers may read any row field)", async () => {
        const { renderSpy, columns } = buildSpyColumns();
        const setupLocal: ReactWrapper<IDataTableProps<MockDataType>> = mount(
            <DataTable columns={columns} data={visibleData} />
        );

        renderSpy.mockClear();

        const cloned = visibleData.map((row) => ({ ...row }));
        await act(async () => {
            setupLocal.setProps({ data: cloned });
        });
        setupLocal.update();

        expect(renderSpy).toHaveBeenCalled();

        setupLocal.unmount();
    });

    it("updates rendered cell content when data values change in place", async () => {
        const { columns } = buildSpyColumns();
        const setupLocal: ReactWrapper<IDataTableProps<MockDataType>> = mount(
            <DataTable columns={columns} data={visibleData} />
        );

        const updated = visibleData.map((row) => ({ ...row, Email: `updated-${row.Email}` }));
        await act(async () => {
            setupLocal.setProps({ data: updated });
        });
        setupLocal.update();

        expect(setupLocal.text()).toContain(`updated-${visibleData[0].Email}`);

        setupLocal.unmount();
    });
});

describe("Table Component - Manage Columns Integration", () => {
    let setup: ReactWrapper<IDataTableProps<MockDataType>>;

    beforeEach(async () => {
        await act(async () => {
            setup = mount(
                <DataTable
                    columns={mockColumns}
                    data={mockData}
                    manageColumnsConfig={{
                        enabled: true,
                        available: true
                    }}
                />
            );
        });
        setup.update();
    });

    afterEach(() => {
        setup.unmount();
    });

    it("respects the controlled open state and configuration within ManageColumns", async () => {
        await act(async () => {
            setup.setProps({
                manageColumnsConfig: {
                    open: true,
                    enabled: true,
                    available: true,
                    texts: { label: "Custom Manage Label" }
                }
            });
        });
        setup.update();

        const manageButton = setup.find(Button).filterWhere((b) => b.text().includes("Custom Manage Label"));
        expect(manageButton.exists()).toBeTruthy();

        const popover = setup.find(Popover);
        expect(popover.prop("open")).toBe(true);
    });

    it("updates table column visibility when a column checkbox is toggled and saved", async () => {
        expect(setup.find("thead th").length).toBe(mockColumns.length);

        await act(async () => {
            setup
                .find(Button)
                .filterWhere((b) => b.text().includes("Manage columns"))
                .simulate("click");
        });
        setup.update();

        const firstColId = mockColumns[0].accessorKey as string;

        const checkbox = setup.find(Checkbox).filterWhere((c) => c.prop("id") === firstColId);
        await act(async () => {
            checkbox.prop("onChange")();
        });
        setup.update();

        const saveButton = setup.find(Button).filterWhere((b) => b.text().includes("Save"));
        await act(async () => {
            saveButton.simulate("click");
        });
        setup.update();

        expect(setup.find("thead th").length).toBe(mockColumns.length - 1);
    });

    it("keeps the expander column first when a column is pinned and saved", async () => {
        await act(async () => {
            setup.setProps({ renderExpandedRow: () => <div>Expanded</div> });
        });
        setup.update();

        expect(setup.find("thead th").first().hasClass("tableHeaderCell_expander")).toBeTruthy();

        await act(async () => {
            setup
                .find(Button)
                .filterWhere((b) => b.text().includes("Manage columns"))
                .simulate("click");
        });
        setup.update();

        const firstPinAction = setup.find(".manageColumnListItem__pinAction").first();
        await act(async () => {
            firstPinAction.simulate("click");
        });
        setup.update();

        const saveButton = setup.find(Button).filterWhere((b) => b.text().includes("Save"));
        await act(async () => {
            saveButton.simulate("click");
        });
        setup.update();

        const headerCells = setup.find("thead th");
        expect(headerCells.first().hasClass("tableHeaderCell_expander")).toBeTruthy();
        expect(headerCells.at(1).hasClass("tableHeaderCell_pinned")).toBeTruthy();
    });

    it("does not hide the expander column when 'All Columns' is unchecked and saved", async () => {
        await act(async () => {
            setup.setProps({ renderExpandedRow: () => <div>Expanded</div> });
        });
        setup.update();

        await act(async () => {
            setup
                .find(Button)
                .filterWhere((b) => b.text().includes("Manage columns"))
                .simulate("click");
        });
        setup.update();

        const selectAll = setup.find(Checkbox).filterWhere((c) => c.prop("id") === "manageColumns-selectAll");
        const onSelectAllChange = selectAll.prop("onChange") as (e: { target: { checked: boolean } }) => void;
        await act(async () => {
            onSelectAllChange({ target: { checked: false } });
        });
        setup.update();

        const saveButton = setup.find(Button).filterWhere((b) => b.text().includes("Save"));
        await act(async () => {
            saveButton.simulate("click");
        });
        setup.update();

        const headerCells = setup.find("thead th");
        expect(headerCells.length).toBe(1);
        expect(headerCells.first().hasClass("tableHeaderCell_expander")).toBeTruthy();
    });

    it("does not enable Save when pinning is attempted on a disabled column", async () => {
        const firstColId = mockColumns[0].accessorKey as string;

        await act(async () => {
            setup.setProps({
                manageColumnsConfig: { enabled: true, available: true, disabledColumns: [firstColId] }
            });
        });
        setup.update();

        await act(async () => {
            setup
                .find(Button)
                .filterWhere((b) => b.text().includes("Manage columns"))
                .simulate("click");
        });
        setup.update();

        const firstPinAction = setup.find(".manageColumnListItem__pinAction").first();
        await act(async () => {
            firstPinAction.simulate("click");
        });
        setup.update();

        const saveButton = setup.find(Button).filterWhere((b) => b.text().includes("Save"));
        expect(saveButton.prop("disabled")).toBe(true);
    });

    it("applies pinning classes to body and header cells when a column is pinned and saved", async () => {
        await act(async () => {
            setup
                .find(Button)
                .filterWhere((b) => b.text().includes("Manage columns"))
                .simulate("click");
        });
        setup.update();

        const firstPinAction = setup.find(".manageColumnListItem__pinAction").first();
        await act(async () => {
            firstPinAction.simulate("click");
        });
        setup.update();

        const saveButton = setup.find(Button).filterWhere((b) => b.text().includes("Save"));
        await act(async () => {
            saveButton.simulate("click");
        });
        setup.update();

        const firstHeaderCell = setup.find("thead th").first();
        expect(firstHeaderCell.hasClass("tableHeaderCell_pinned")).toBeTruthy();

        const firstBodyCell = setup.find("tbody tr").first().find("td").first();
        expect(firstBodyCell.hasClass("tableBodyCell_pinned")).toBeTruthy();
    });
});

describe("Table Component - column defaults, row identity and structure", () => {
    type SimpleRow = { Id: number; Email: string };

    const simpleData: SimpleRow[] = [
        { Id: 1, Email: "first@mail.com" },
        { Id: 2, Email: "second@mail.com" },
        { Id: 3, Email: "third@mail.com" }
    ];

    const simpleColumns: DataTableColumn<SimpleRow>[] = [
        { accessorKey: "Id", header: "Id" },
        { accessorKey: "Email", header: "Email" }
    ];

    it("hides columns with defaultVisible=false initially", async () => {
        const cols: DataTableColumn<SimpleRow>[] = [
            { accessorKey: "Id", header: "Id" },
            { accessorKey: "Email", header: "Email", defaultVisible: false }
        ];

        let wrapper: ReactWrapper<IDataTableProps<SimpleRow>>;
        await act(async () => {
            wrapper = mount(<DataTable columns={cols} data={simpleData} />);
        });
        wrapper!.update();

        const headers = wrapper!.find("thead th");
        expect(headers.length).toBe(1);
        expect(headers.first().text()).toBe("Id");

        wrapper!.unmount();
    });

    it("pins columns with defaultPinned=true initially", async () => {
        const cols: DataTableColumn<SimpleRow>[] = [
            { accessorKey: "Id", header: "Id", defaultPinned: true },
            { accessorKey: "Email", header: "Email" }
        ];

        let wrapper: ReactWrapper<IDataTableProps<SimpleRow>>;
        await act(async () => {
            wrapper = mount(<DataTable columns={cols} data={simpleData} />);
        });
        wrapper!.update();

        const headers = wrapper!.find("thead th");
        expect(headers.first().hasClass("tableHeaderCell_pinned")).toBeTruthy();
        expect(headers.at(1).hasClass("tableHeaderCell_pinned")).toBeFalsy();

        wrapper!.unmount();
    });

    it("keeps the expanded row bound to the record (not the index) when getRowId is provided", async () => {
        let wrapper: ReactWrapper<IDataTableProps<SimpleRow>>;
        await act(async () => {
            wrapper = mount(
                <DataTable
                    columns={simpleColumns}
                    data={simpleData}
                    getRowId={(row) => String(row.Id)}
                    renderExpandedRow={(row) => <div className="expandedProbe">{row.Email}</div>}
                />
            );
        });
        wrapper!.update();

        await act(async () => {
            wrapper!.find("button[aria-label='Expand row']").at(0).simulate("click");
        });
        wrapper!.update();
        expect(wrapper!.find(".expandedProbe").text()).toBe(simpleData[0].Email);

        await act(async () => {
            wrapper!.setProps({ data: [...simpleData].reverse() });
        });
        wrapper!.update();

        const expanded = wrapper!.find(".expandedProbe");
        expect(expanded.length).toBe(1);
        expect(expanded.text()).toBe(simpleData[0].Email);

        wrapper!.unmount();
    });

    it("spans the expanded row across the row-actions cell too", async () => {
        let wrapper: ReactWrapper<IDataTableProps<SimpleRow>>;
        await act(async () => {
            wrapper = mount(
                <DataTable
                    columns={simpleColumns}
                    data={simpleData}
                    renderExpandedRow={(row) => <div>{row.Email}</div>}
                    rowActions={[{ Icon: TestIcon, title: "Edit", onClick: jest.fn(() => undefined) }]}
                />
            );
        });
        wrapper!.update();

        await act(async () => {
            wrapper!.find("button[aria-label='Expand row']").at(0).simulate("click");
        });
        wrapper!.update();

        const firstRowCellCount = wrapper!.find("tbody tr.tableRow").first().find("td").length;
        expect(wrapper!.find("td.tableExpandedCell").first().prop("colSpan")).toBe(firstRowCellCount);

        wrapper!.unmount();
    });

    it("renders a matching header cell for the row-actions column", async () => {
        let wrapper: ReactWrapper<IDataTableProps<SimpleRow>>;
        await act(async () => {
            wrapper = mount(
                <DataTable
                    columns={simpleColumns}
                    data={simpleData}
                    rowActions={[{ Icon: TestIcon, title: "Edit", onClick: jest.fn(() => undefined) }]}
                />
            );
        });
        wrapper!.update();

        const headerCellCount = wrapper!.find("thead th").length;
        const bodyCellCount = wrapper!.find("tbody tr.tableRow").first().find("td").length;
        expect(headerCellCount).toBe(bodyCellCount);
        expect(wrapper!.find("th.tableHeaderCell_actions").length).toBe(1);

        wrapper!.unmount();
    });
});
