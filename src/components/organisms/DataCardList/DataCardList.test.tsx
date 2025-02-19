import React from "react";
import { mount, ReactWrapper } from "enzyme";
// Components
import { InfiniteLoader } from "react-virtualized";

import Loader from "@components/atoms/Loader";
import DataCardList, { IDataCardListProps } from "@components/organisms/DataCardList";
import DataCard from "@components/organisms/DataCardList/DataCard";

const ELEMENTS_COUNT = 5;

const data: IDataCardListProps["data"] = Array.from(Array(ELEMENTS_COUNT).keys()).map(() =>
    Array.from(Array(8).keys()).map(() => ({
        key: "Title",
        value: { text: "Description", type: "text" }
    }))
);

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

    it(`renders ${ELEMENTS_COUNT} DataCard component`, () => {
        expect(setup.find(DataCard).length).toEqual(ELEMENTS_COUNT);
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

    it.each<IDataCardListProps["size"]>(["large", "medium"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(DataCard).at(0).props().size).toEqual(size);
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
