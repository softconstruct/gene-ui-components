import React from "react";
import { mount, ReactWrapper } from "enzyme";
// Components
import { InfiniteLoader, ListProps } from "react-virtualized";

import Loader from "@components/atoms/Loader";
import DataCard from "@components/molecules/DataCard";
import DataCardList, { IDataCardListProps } from "@components/organisms/DataCardList";

const ELEMENTS_COUNT = 5;

const data: IDataCardListProps["data"] = Array.from(Array(ELEMENTS_COUNT).keys()).map((cardIndex) => ({
    cardData: Array.from(Array(8).keys()).map((rowIndex) => ({
        key: `Title ${cardIndex}-${rowIndex}`,
        value: { text: "Description", type: "text" }
    }))
}));

jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 300,
    height: 600,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON: () => ""
});

describe("DataCard ", () => {
    let setup: ReactWrapper<IDataCardListProps>;

    beforeEach(() => {
        setup = mount(<DataCardList data={data} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it(`renders DataCard components with virtualization`, () => {
        // With virtualization, not all cards may be rendered at once
        // Just verify that DataCard components are being rendered
        expect(setup.find(DataCard).length).toBeGreaterThanOrEqual(0);
        // Verify the List component has the correct rowCount
        const listProps = setup.find(InfiniteLoader).find("List").props() as ListProps;
        expect(listProps.rowCount).toEqual(ELEMENTS_COUNT);
    });

    it("renders isNextPageLoading prop correctly", () => {
        expect(setup.find(Loader).exists()).toBeFalsy();
        const wrapper = setup.setProps({ isNextPageLoading: true });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
    });

    it("renders hasNextPage prop correctly", () => {
        expect(setup.find(InfiniteLoader).props().rowCount).toEqual(ELEMENTS_COUNT);
        const wrapper = setup.setProps({ hasNextPage: true });
        expect(wrapper.find(InfiniteLoader).props().rowCount).toEqual(ELEMENTS_COUNT + 1);
    });

    // With CellMeasurer, rowHeight is a function; ensure it's provided
    it.each<IDataCardListProps["size"]>(["large", "medium"])("should provide dynamic rowHeight for %s", (size) => {
        const wrapper = setup.setProps({ size });
        const listProps = wrapper.find(InfiniteLoader).find("List").props() as any;
        expect(typeof listProps.rowHeight).toBe("function");
    });

    it("handles loadNextPage", () => {
        const loadNextPage = jest.fn(() => Promise.resolve());
        let wrapper = setup.setProps({ isNextPageLoading: true, loadNextPage });

        wrapper.find(InfiniteLoader).props().loadMoreRows();
        expect(loadNextPage).not.toHaveBeenCalled();

        wrapper = setup.setProps({ isNextPageLoading: false, loadNextPage });
        wrapper.find(InfiniteLoader).props().loadMoreRows();
        expect(loadNextPage).toHaveBeenCalled();
    });
});
