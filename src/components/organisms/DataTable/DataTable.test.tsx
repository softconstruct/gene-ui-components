import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import Pagination from "@components/molecules/Pagination";

import { mockColumns, mockData } from "../../../../stories/data/__dataTable";
// Components
import DataTable, { IDataTableProps } from "./index";

type MockDataType = (typeof mockData)[0];

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

    it("calls onRowExpandChange callback when a row is expanded", async () => {
        const expandableData = mockData.map((item) => ({
            ...item,
            expandedRow: <div>Expanded Content</div>
        }));

        const onRowExpandChange = jest.fn();

        await act(async () => {
            setup.setProps({ expandable: true, data: expandableData, onRowExpandChange });
        });
        setup.update();

        const expanderButton = setup.find("button").first();
        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(onRowExpandChange).toHaveBeenCalled();
        expect(onRowExpandChange).toHaveBeenCalledWith(true, expandableData[0]);
    });

    it("calls onRowExpandChange callback with correct payload when row is toggled", async () => {
        const expandableData = mockData.map((item) => ({
            ...item,
            expandedRow: <div>Expanded Content</div>
        }));

        const onRowExpandChange = jest.fn();

        await act(async () => {
            setup.setProps({ expandable: true, data: expandableData, onRowExpandChange });
        });
        setup.update();

        const expanderButton = setup.find("button").first();

        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(onRowExpandChange).toHaveBeenNthCalledWith(1, true, expandableData[0]);

        await act(async () => {
            expanderButton.simulate("click");
        });
        setup.update();

        expect(onRowExpandChange).toHaveBeenCalledTimes(2);
        expect(onRowExpandChange).toHaveBeenNthCalledWith(2, false, expandableData[0]);
    });

    it("does not call onRowExpandChange when expandable prop is false", async () => {
        const onRowExpandChange = jest.fn();

        await act(async () => {
            setup.setProps({ expandable: false, onRowExpandChange });
        });
        setup.update();

        expect(onRowExpandChange).not.toHaveBeenCalled();
    });
});
