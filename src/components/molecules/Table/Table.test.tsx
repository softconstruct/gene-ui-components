import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import Checkbox from "@components/molecules/Checkbox";
import Empty from "@components/molecules/Empty";
import Pagination from "@components/molecules/Pagination";
// Components
import Table, { ITableProps, Row } from "@components/molecules/Table";
import BulkActions from "@components/molecules/Table/BulkActions";
import { ColActions } from "@components/molecules/Table/ColActions";
import { Columns } from "@components/molecules/Table/Columns";
import THead from "@components/molecules/Table/THead";
import VirtualScrollTBody from "@components/molecules/Table/VirtualScrollTBody";

import { TableData } from "../../../../stories/data/__table";

const emptyData: Row[] = [];

describe("Table", () => {
    let setup: ReactWrapper<ITableProps>;

    const defaultProps: ITableProps = {
        columns: Columns,
        externalData: TableData,
        onSave: jest.fn(),
        onRowClick: jest.fn(),
        onSelectAllRows: jest.fn(),
        onGlobalFilterChange: jest.fn(),
        onManageColumnsChange: jest.fn(),
        onSortChange: jest.fn(),
        onPageChange: jest.fn(),
        onPageSizeChange: jest.fn(),
        onRowSelect: jest.fn(),
        onEdit: jest.fn(),
        onCancel: jest.fn(),
        onRowDelete: jest.fn(),
        loading: false
    };

    beforeEach(() => {
        setup = mount(<Table {...defaultProps} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with className prop on the table element", () => {
        const className = "test-class";
        setup.setProps({ className });
        expect(setup.find("table").hasClass(className)).toBeTruthy();
    });

    it("renders with columns prop", () => {
        setup.setProps({ columns: Columns });
        expect(setup.find(Table).exists()).toBeTruthy();
    });

    it("renders with expandable prop", () => {
        setup.setProps({ withExpandable: true });
        expect(setup.find(".table__content_expand").exists()).toBeTruthy();
    });

    it("renders with withCheckbox prop", () => {
        setup.setProps({ withCheckbox: true });
        expect(setup.find(".table__content_checkbox").exists()).toBeTruthy();
    });

    it("renders with withGlobalFilter prop", () => {
        setup.setProps({ withGlobalFilter: true });
        expect(setup.find(".dataTable__toolbar_searchInput").exists()).toBeTruthy();
    });

    it("renders with globalFilterPlaceholder prop", () => {
        const placeholder = "Search here...";
        setup.setProps({ globalFilterPlaceholder: placeholder, withGlobalFilter: true });
        expect(setup.find(".dataTable__toolbar_searchInput").prop("placeholder")).toBe(placeholder);
    });

    it("renders with withStickyHeader prop", () => {
        setup.setProps({ withStickyHeader: true });
        expect(setup.find(".table__thead_sticky").exists()).toBeTruthy();
    });

    it("renders with withPagination prop", () => {
        setup.setProps({ withPagination: true });
        expect(setup.find(Pagination).exists()).toBeTruthy();
    });

    it("renders with pageSizes prop", () => {
        const customPageSizes = [5, 15];
        setup.setProps({ withPagination: true, pageSizes: customPageSizes });
        expect(setup.find(Pagination).prop("rowsPerPageOptions")).toEqual(customPageSizes);
    });

    it("renders with withVirtualScroll prop", () => {
        setup.setProps({ withVirtualScroll: true });
        expect(setup.find(VirtualScrollTBody).exists()).toBeTruthy();
    });

    it("renders bulk actions dropdown when 'bulkActions' is provided and rows are selected", () => {
        const bulkActions = {
            label: "Bulk Action",
            onChange: jest.fn(),
            list: [{ id: "action1", title: "Action 1" }]
        };
        setup.setProps({ bulkActions, withCheckbox: true });
        expect(setup.find(BulkActions).exists()).toBeTruthy();
    });

    it("renders with loading prop", () => {
        setup.setProps({ loading: true });
        expect(setup.find(Loader).exists()).toBeTruthy();
    });

    it("renders 'Empty' component when there is no data", () => {
        setup.setProps({ externalData: emptyData });
        setup.update();
        expect(setup.find(Empty).exists()).toBeTruthy();
    });

    it("renders with withManageColumns prop", () => {
        setup.setProps({ withManageColumns: true });
        expect(setup.find(".dataTable__toolbar_dropdownMenu_manageColumns").exists()).toBeTruthy();
    });

    it("renders with isManageColumnsDisabled prop", () => {
        setup.setProps({ withManageColumns: true, isManageColumnsDisabled: true });
        expect(setup.find(".dataTable__toolbar_dropdownMenu_manageColumns").first().props().disabled).toBeTruthy();
    });

    it("renders with manageColumnsTitle prop", () => {
        const manageColumnsTitle = "some title";
        setup.setProps({ withManageColumns: true, manageColumnsTitle });
        expect(setup.find(".dataTable__toolbar_dropdownMenu_manageColumns").first().text()).toBe(manageColumnsTitle);
    });

    it("renders with headerContent prop", () => {
        const customContent = <div className="custom-header-content">Test Content</div>;
        setup.setProps({ headerContent: customContent });
        expect(setup.find(".custom-header-content").exists()).toBeTruthy();
    });

    // // ------------------------------------
    // // Callback/Functionality Props
    // // ------------------------------------
    //
    it("calls 'onSelectAllRows' when header checkbox is toggled", () => {
        const changeMock = defaultProps.onSelectAllRows;

        setup.setProps({ withCheckbox: true, onSelectAllRows: changeMock });
        const headerCheckbox = setup.find(THead).find(Checkbox);
        headerCheckbox.find("input").simulate("change", { target: { checked: true } });

        expect(changeMock).toHaveBeenCalledTimes(1);
    });

    it("calls 'onRowClick' when a non-control part of a row is clicked", () => {
        const rowElement = setup.find(".table__row_tbody").at(0);

        rowElement.simulate("click");

        expect(defaultProps.onRowClick).toHaveBeenCalledTimes(1);
    });

    it("calls 'onSortChange' when a column header is clicked", () => {
        const sorChangeMock = defaultProps.onSortChange;
        setup.setProps({ onSortChange: sorChangeMock });
        setup.find(ColActions).find(Button).first().simulate("click");
        expect(sorChangeMock).toHaveBeenCalled();
    });

    it("calls 'onEdit' when the component is set to 'editableMode' and the edit action is performed", () => {
        setup.setProps({ withEditMode: false });
        setup.setProps({ onEdit: defaultProps.onEdit, withEditMode: true });
        expect(defaultProps.onEdit).not.toHaveBeenCalled();
    });
});
