import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { defaultColumns } from "@components/molecules/Table/Columns";
import { makeData } from "@components/molecules/Table/makeData";

// Components
import Table, { ITableProps, Row } from "./index";

const mockData: Row[] = makeData(1);

describe("Table ", () => {
    let setup: ReactWrapper<ITableProps>;
    beforeEach(() => {
        const defaultProps: ITableProps = {
            columns: defaultColumns,
            externalData: mockData,
            onSave: jest.fn()
        };
        setup = mount(<Table {...defaultProps} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with className prop", () => {
        const className = "test-class";
        setup.setProps({ className });
        expect(setup.hasClass(className)).toBeTruthy();
    });

    it("renders with expandable rows prop", () => {
        setup.setProps({ expandable: true });

        expect(setup.find(".table__content_expand").exists()).toBeTruthy();
    });

    it("renders withCheckbox props", () => {
        setup.setProps({ withCheckbox: true });
        expect(setup.find(".table__content_checkbox").exists()).toBeTruthy();
    });

    // it("handles row checkbox click", () => {
    //     const onRowClick = jest.fn();
    //     setup.setProps({ onRowClick, withCheckbox: true });
    //     setup.find("input[type='checkbox']").at(1).simulate("change");
    //     expect(onRowClick).toHaveBeenCalled();
    // });

    it("handles onManageColumns", () => {
        const mockManage = jest.fn();
        setup.setProps({ onManageColumns: mockManage, withManageColumns: true });
        setup
            .find("button")
            .filterWhere((b) => b.hasClass("dataTable__toolbar_dropdownMenu_manageColumns"))
            .simulate("click");
        setup.update();
        setup
            .find("button")
            .filterWhere((b) => b.hasClass("dropdownMenu__footer_buttonGroup_save"))
            .simulate("click");
        expect(mockManage).toHaveBeenCalled();
    });

    it("renders withGlobalFilter prop", () => {
        setup.setProps({ withGlobalFilter: true });
        expect(setup.find(".dataTable__toolbar_search").exists()).toBeTruthy();
    });

    it("renders withFilter prop", () => {
        const placeholder = "Search here...";
        setup.setProps({ globalFilterPlaceholder: placeholder, withGlobalFilter: true });
        expect(setup.find(".dataTable__toolbar_searchInput").prop("placeholder")).toBe(placeholder);
    });

    it("renders withPagination prop", () => {
        setup.setProps({ withPagination: true });
        expect(setup.find(".dataTable__pagination").exists()).toBeTruthy();
    });

    // it("renders bulkActions prop", () => {
    //     const bulkActions: BulkAction = {
    //         label: "Bulk",
    //         onChange: (item: IMenuItemProps) => {},
    //         list: [
    //             {
    //                 id: 1,
    //                 title: "Item 1"
    //             }
    //         ]
    //     };
    //     setup.setProps({ bulkActions });
    //     console.log(setup.find(BulkActions).debug());
    //     expect(setup.find(BulkActions).exists()).toBeTruthy();
    // });
});
