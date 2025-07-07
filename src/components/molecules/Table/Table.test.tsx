import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { defaultColumns } from "@components/molecules/Table/Columns";
import { makeData, Row } from "@components/molecules/Table/makeData";

// Components
import Table, { ITableProps } from "./index";

const mockData: Row[] = makeData(1);

describe("Table ", () => {
    let setup: ReactWrapper<ITableProps>;
    beforeEach(() => {
        const defaultProps: ITableProps = {
            columns: defaultColumns,
            externalData: mockData,
            onSave: jest.fn(),
            rowActions: {}
        };
        setup = mount(<Table {...defaultProps} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });
    //
    // it("renders with className prop", () => {
    //     const className = "test-class";
    //     setup.setProps({ className });
    //     expect(setup.find(className).exists()).toBeTruthy();
    // });
    //
    // it("renders with expandable rows prop", () => {
    //     expect(setup.find(".table__content_expand").exists()).toBeTruthy();
    // });
    //
    // it("renders with checkboxes props", () => {
    //     expect(setup.find("input[type='checkbox']").exists()).toBeTruthy();
    // });
    //
    // it("handles row checkbox click", () => {
    //     const onRowClick = jest.fn();
    //     setup.setProps({ onRowClick, withCheckbox: true });
    //     setup.find("input[type='checkbox']").at(1).simulate("change");
    //     expect(onRowClick).toHaveBeenCalled();
    // });
    //
    // it("handles onManageColumns", () => {
    //     const mockManage = jest.fn();
    //     setup.setProps({ onManageColumns: mockManage });
    //     setup
    //         .find("button")
    //         .filterWhere((b) => b.text().includes("Manage Columns"))
    //         .simulate("click");
    //     setup
    //         .find("button")
    //         .filterWhere((b) => b.text().includes("Save"))
    //         .simulate("click");
    //     expect(mockManage).toHaveBeenCalled();
    // });
    //
    // it("renders with withFilter prop", () => {
    //     setup.setProps({ withFilter: true });
    //     expect(setup.find("input[type='text']").exists()).toBeTruthy();
    // });
    //
    // it("renders with withFilter prop", () => {
    //     setup.setProps({ searchPlaceholder: "Search here...", withFilter: true });
    //     expect(setup.find("input[type='text']").prop("placeholder")).toBe("Search here...");
    // });
    //
    // it("renders with emptyStateMessage prop", () => {
    //     setup.setProps({ emptyStateMessage: "No records found", externalData: [] });
    //     expect(setup.text()).toContain("No records found");
    // });
    //
    // it("renders with errorMessage prop", () => {
    //     setup.setProps({ errorMessage: "Something went wrong" });
    //     expect(setup.text()).toContain("Something went wrong");
    // });
    //
    // it("renders with withPagination prop", () => {
    //     setup.setProps({ withPagination: true });
    //     expect(setup.find(".dataTable__pagination").exists()).toBe(true);
    // });

    // it("renders size and variant classes", () => {
    //     setup = mount(<Table {...defaultProps} size="small" variant="striped" />);
    //     expect(setup.find(".dataTable").hasClass("dataTable--small")).toBe(false); // class logic not shown
    // });

    // it("renders bulk actions if provided", () => {
    //     setup = mount(<Table {...defaultProps} bulkActions={[{ label: "Action", onClick: jest.fn() }]} />);
    //     expect(setup.find(".dataTable__bulkActions").exists()).toBe(true);
    // });
});
