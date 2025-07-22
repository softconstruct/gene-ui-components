import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Button from "@components/atoms/Button";

import Pagination, { IPaginationProps } from "./index";

describe("Pagination", () => {
    let setup: ReactWrapper<IPaginationProps>;
    const defaultProps: IPaginationProps = {
        totalPages: 10,
        current: 1
    };

    beforeEach(() => {
        setup = mount(<Pagination {...defaultProps} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".pagination").hasClass(className)).toBeTruthy();
    });

    it("renders correct number of page buttons when totalPages is less than or equal to 5", () => {
        const wrapper = setup.setProps({ totalPages: 4 });
        expect(wrapper.find(".pagination__nav_item").length).toBe(5);
    });

    it("renders correct number of page buttons when totalPages is greater than 5", () => {
        const wrapper = setup.setProps({ totalPages: 10, current: 5 });
        expect(wrapper.find(".pagination__nav_item").length).toBeGreaterThan(5);
    });

    it("renders page size dropdown when rowsPerPageOptions prop is provided", () => {
        const wrapper = setup.setProps({ rowsPerPageOptions: [10, 20, 30] });
        expect(wrapper.find("select").exists()).toBeTruthy();
    });

    it("calls onPageSizeChange when page size is changed", () => {
        const onPageSizeChange = jest.fn();
        const wrapper = setup.setProps({
            rowsPerPageOptions: [10, 20],
            onPageSizeChange
        });

        wrapper.find("select").simulate("change", { currentTarget: { value: 10 } });
        expect(onPageSizeChange).toHaveBeenCalledWith(10);
    });

    it("calls onPageChange when a page button is clicked", () => {
        const onPageChange = jest.fn();
        const wrapper = setup.setProps({ onPageChange, totalPages: 5, current: 1 });

        wrapper.find(".pagination__nav_item").at(1).simulate("click");
        expect(onPageChange).toHaveBeenCalled();
    });

    it("disables previous arrow button on first page", () => {
        const leftArrow = setup.find(Button).at(0);
        expect(leftArrow.props().disabled).toBeTruthy();
    });

    it("renders input field when showInputPageField is true", () => {
        const wrapper = setup.setProps({ showInputPageField: true });
        expect(wrapper.find("input[type='text']").exists()).toBeTruthy();
    });

    it("updates current page from input field correctly", () => {
        const onPageSizeChange = jest.fn();
        const wrapper = setup.setProps({ showInputPageField: true, onPageSizeChange });

        wrapper.find("input[type='text']").simulate("input", { currentTarget: { value: 3 } });
        requestAnimationFrame(() => {
            expect(onPageSizeChange).toHaveBeenCalledWith(3);
        });
    });

    it("navigates to last page when last button is clicked", () => {
        const wrapper = setup.setProps({ totalPages: 10, current: 5 });

        wrapper.find(".pagination__nav_item").last().simulate("click");
        expect(wrapper.find(".pagination__nav_item_selected").text()).toBe("10");
    });
});
