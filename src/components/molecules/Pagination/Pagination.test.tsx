import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Button from "@components/atoms/Button";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Pagination, { IPaginationProps } from "./index";

describe("Pagination", () => {
    let setup: ReactWrapper<IPaginationProps>;
    const baseProps: IPaginationProps = {
        totalPages: 10,
        current: 1
    };

    beforeEach(() => {
        setup = mount(<Pagination {...baseProps} />);
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
        expect(wrapper.find(".pagination__nav_item").length).toBe(4);
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

    it("disables previous arrow button on first page", () => {
        const leftArrow = setup.find(Button).at(0);
        expect(leftArrow.props().disabled).toBeTruthy();
    });

    it("renders input field when showInputPageField is true", () => {
        const wrapper = setup.setProps({ showInputPageField: true });
        expect(wrapper.find("input[type='text']").exists()).toBeTruthy();
    });

    it("disables all controls when disabled prop is true", () => {
        const wrapper = setup.setProps({
            disabled: true,
            showInputPageField: true,
            rowsPerPageOptions: [10, 20]
        });

        wrapper.find(".pagination__nav_item").forEach((button) => {
            expect(button.prop("disabled")).toBeTruthy();
        });
        expect(wrapper.find("select").prop("disabled")).toBeTruthy();
        expect(wrapper.find("input[type='text']").prop("disabled")).toBeTruthy();
        wrapper.find(Button).forEach((button) => {
            expect(button.prop("disabled")).toBeTruthy();
        });
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

    it("renders pageSizeSuffixLabel prop correctly", () => {
        const customLabel = "per page";
        setup = mount(
            <Pagination {...baseProps} rowsPerPageOptions={[10, 20, 30]} pageSizeSuffixLabel={customLabel} />,
            { wrappingComponent: GeneUIProvider }
        );

        // Check if the first option in the dropdown has the correct custom label.
        const firstOptionText = setup.find("option").first().text();
        expect(firstOptionText).toBe(`10/${customLabel}`);
    });

    it("renders pageSizeOfLabel prop correctly", () => {
        const customLabel = "of";
        setup = mount(<Pagination {...baseProps} rowsPerPageOptions={[10, 20]} pageSizeOfLabel={customLabel} />, {
            wrappingComponent: GeneUIProvider
        });

        // Check if the text indicating the page range contains the custom label.
        const perPageValuesText = setup.find(".pagination__perpage_values").text();
        expect(perPageValuesText).toContain(customLabel);
        expect(perPageValuesText).toBe(`1-10 ${customLabel} 10`);
    });

    it("renders goToPageLabel prop correctly", () => {
        const customLabel = "Jump to";
        setup = mount(<Pagination {...baseProps} showInputPageField goToPageLabel={customLabel} />, {
            wrappingComponent: GeneUIProvider
        });

        // Check if the label before the input field matches the custom label.
        const goToText = setup.find(".pagination__nav_specific span").first().text();
        expect(goToText).toBe(customLabel);
    });

    it("renders goToPageSuffixLabel prop correctly", () => {
        const customLabel = "page";
        setup = mount(<Pagination {...baseProps} showInputPageField goToPageSuffixLabel={customLabel} />, {
            wrappingComponent: GeneUIProvider
        });

        // Check if the label after the input field matches the custom label.
        const pageText = setup.find(".pagination__nav_specific span").last().text();
        expect(pageText).toBe(customLabel);
    });

    it("uses defaultCurrent as initial page in uncontrolled mode", () => {
        setup = mount(<Pagination totalPages={10} defaultCurrent={4} />, {
            wrappingComponent: GeneUIProvider
        });

        expect(setup.find(".pagination__nav_item_selected .pagination__nav_value").text()).toBe("4");
    });

    it("ignores defaultCurrent when current is controlled", () => {
        setup = mount(<Pagination totalPages={10} current={2} defaultCurrent={6} onPageChange={jest.fn()} />, {
            wrappingComponent: GeneUIProvider
        });

        expect(setup.find(".pagination__nav_item_selected .pagination__nav_value").text()).toBe("2");
    });
});
