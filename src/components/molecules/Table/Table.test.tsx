import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import Pagination from "@components/molecules/Pagination";
// Constants
import { DEFAULT_ERROR_TEXTS } from "@components/molecules/Table/constants";

import { mockColumns, mockData } from "../../../../stories/data/__dataTable";
// Components
import Table, { ITableProps } from "./index";

type MockDataType = (typeof mockData)[0];

describe("Table Component", () => {
    let setup: ReactWrapper<ITableProps<MockDataType>>;

    beforeEach(() => {
        setup = mount(<Table columns={mockColumns} data={mockData} />);
    });

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-custom-class";
        setup.setProps({ className });

        expect(setup.find(".dataTable").hasClass(className)).toBeTruthy();
    });

    it("renders the correct number of columns based on data and columns props", () => {
        const headers = setup.find("thead th");
        expect(headers.length).toBe(mockColumns.length);
    });

    it("renders Loader component and hides data when loading prop is true", () => {
        setup.setProps({ loading: true });

        expect(setup.find(Loader).exists()).toBeTruthy();
        expect(setup.find("tbody tr").exists()).toBeFalsy(); // Rows should not be rendered
    });

    it("passes custom loadingText prop to Loader component", () => {
        const customLoadingText = "Please wait, fetching data...";
        setup.setProps({ loading: true, loadingText: customLoadingText });

        const loader = setup.find(Loader);
        expect(loader.exists()).toBeTruthy();
        expect(loader.prop("text")).toBe(customLoadingText);
    });

    it("renders Empty component with default texts when data is empty (noResult)", () => {
        setup.setProps({ data: [] });

        const emptyState = setup.find(Empty);
        expect(emptyState.exists()).toBeTruthy();
        expect(emptyState.prop("appearance")).toBe("noResult");
        expect(emptyState.prop("title")).toBe(DEFAULT_ERROR_TEXTS.noResultFoundTitle);
        expect(emptyState.prop("description")).toBe(DEFAULT_ERROR_TEXTS.noResultFoundText);
    });

    it("renders Empty component with custom errorTexts when provided", () => {
        const customErrorTexts = {
            noResultFoundTitle: "Custom No Result Title",
            noResultFoundText: "Custom No Result Text"
        };

        setup.setProps({ data: [], errorTexts: customErrorTexts });

        const emptyState = setup.find(Empty);
        expect(emptyState.exists()).toBeTruthy();
        expect(emptyState.prop("title")).toBe(customErrorTexts.noResultFoundTitle);
        expect(emptyState.prop("description")).toBe(customErrorTexts.noResultFoundText);
    });

    it("renders Pagination component by default (pagination = true)", () => {
        expect(setup.find(Pagination).exists()).toBeTruthy();
    });

    it("does not render Pagination when pagination prop is false", () => {
        setup.setProps({ pagination: false });

        expect(setup.find(Pagination).exists()).toBeFalsy();
    });

    it("passes custom config to Pagination when pagination prop is an object", () => {
        const paginationConfig = {
            showInputPageField: true,
            rowsPerPageOptions: [5, 10, 15]
        };

        setup.setProps({ pagination: paginationConfig });

        const paginationEl = setup.find(Pagination);
        expect(paginationEl.exists()).toBeTruthy();
        expect(paginationEl.prop("showInputPageField")).toBe(true);
        expect(paginationEl.prop("rowsPerPageOptions")).toEqual([5, 10, 15]);
    });
});
