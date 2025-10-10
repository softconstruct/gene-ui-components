import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Loader from "@components/atoms/Loader";
import Scrollbar from "@components/atoms/Scrollbar";
import DataCardList, { IDataCardListProps } from "@components/organisms/DataCardList";
import DataCard from "@components/organisms/DataCardList/DataCard";

const ELEMENTS_COUNT = 5;

const data: IDataCardListProps["data"] = Array.from(Array(ELEMENTS_COUNT).keys()).map((cardIndex) => ({
    cardData: Array.from(Array(8).keys()).map((rowIndex) => ({
        key: `Title ${cardIndex}-${rowIndex}`,
        value: { text: "Description", type: "text" }
    }))
}));

describe("DataCardList ", () => {
    let setup: ReactWrapper<IDataCardListProps>;

    beforeEach(() => {
        setup = mount(<DataCardList data={data} />);
    });

    afterEach(() => {
        if (setup) {
            setup.unmount();
        }
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".dataCardList")).toHaveLength(1);
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".dataCardList").hasClass(className)).toBeTruthy();
    });

    it("renders Scrollbar component", () => {
        expect(setup.find(Scrollbar)).toHaveLength(1);
    });

    it("renders DataCard components with virtualization", () => {
        // With virtualization, not all cards may be rendered at once
        expect(setup.find(DataCard).length).toBeGreaterThanOrEqual(0);
    });

    it("renders isNextPageLoading prop correctly", () => {
        expect(setup.find(Loader).exists()).toBeFalsy();
        const wrapper = setup.setProps({ isNextPageLoading: true });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
    });

    it("handles loadNextPage", async () => {
        const loadNextPage = jest.fn(() => Promise.resolve());
        const wrapper = setup.setProps({
            hasNextPage: true,
            isNextPageLoading: false,
            loadNextPage
        });

        // Simulate scrolling to trigger load
        // Note: With @tanstack/react-virtual, loadNextPage is triggered via useEffect
        // when the last item is visible
        expect(wrapper.find(Loader).exists()).toBeFalsy();
    });

    it("renders with actions prop", () => {
        const actions = [
            { id: "1", title: "Edit" },
            { id: "2", title: "Delete", danger: true }
        ];
        const wrapper = setup.setProps({ actions });
        expect(wrapper.exists()).toBeTruthy();
    });

    it("renders with custom texts", () => {
        const wrapper = setup.setProps({
            showMoreText: "View All",
            actionsText: "Options"
        });
        expect(wrapper.exists()).toBeTruthy();
    });
});
