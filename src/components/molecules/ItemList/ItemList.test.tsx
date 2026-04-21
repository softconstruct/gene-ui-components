import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import ItemList, { IItemListProps } from "@components/molecules/ItemList";
import ItemListItem from "@components/molecules/ItemList/ItemListItem/ItemListItem";

describe("ItemList ", () => {
    let setup: ReactWrapper<IItemListProps>;
    const renderItems = (count: number) =>
        Array.from({ length: count }, (_, index) => (
            <ItemListItem id={`item-${index + 1}`} key={`item-${index + 1}`}>
                {`Item ${index + 1}`}
            </ItemListItem>
        ));

    const Component = (
        <ItemList>
            <ItemListItem id="test-item">Test Child</ItemListItem>
        </ItemList>
    );

    beforeEach(() => {
        setup = mount(Component);
    });

    const showMoreButton = () => setup.find(".itemList__footer").find("button").first();

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders loading state correctly", () => {
        setup.setProps({ loading: true, loadingText: "Loading data..." });
        expect(setup.find(Loader).exists()).toBeTruthy();
    });

    it("renders custom loading text", () => {
        setup.setProps({ loading: true, loadingText: "Loading custom..." });
        expect(setup.text()).toContain("Loading custom...");
    });

    it("renders empty state when there are no children", () => {
        setup.setProps({ children: [] as unknown as React.ReactElement[] });
        expect(setup.find(Empty).exists()).toBeTruthy();
    });

    it("renders custom empty text", () => {
        setup.setProps({ emptyText: "Nothing found", children: [] as unknown as React.ReactElement[] });
        expect(setup.text()).toContain("Nothing found");
    });

    it("renders footer when showMore is true", () => {
        setup.setProps({ showMore: true, children: renderItems(1) });
        expect(setup.find(".itemList__footer").exists()).toBeTruthy();
    });

    it("does not render footer when showMore is false", () => {
        setup.setProps({ showMore: false });
        expect(setup.find(".itemList__footer").exists()).toBeFalsy();
    });

    it("disables showMore button when showMoreDisabled is true", () => {
        setup.setProps({ showMore: true, showMoreDisabled: true, children: renderItems(1) });
        expect(showMoreButton().prop("disabled")).toBeTruthy();
    });

    it("hides footer when loading is true", () => {
        setup.setProps({ showMore: true, loading: true });
        expect(setup.find(".itemList__footer").exists()).toBeFalsy();
    });

    it("hides footer when there are no children", () => {
        setup.setProps({ showMore: true, children: [] as unknown as React.ReactElement[] });
        expect(setup.find(".itemList__footer").exists()).toBeFalsy();
    });

    it("shows loading state on showMore button when showMoreLoading is true", () => {
        setup.setProps({ showMore: true, showMoreLoading: true, children: renderItems(1) });
        expect(showMoreButton().hasClass("button_loading")).toBeTruthy();
    });

    it("keeps showMore button in loading state while showMoreLoading is true", () => {
        setup.setProps({
            showMore: true,
            showMoreLoading: true,
            children: renderItems(1)
        });

        expect(showMoreButton().hasClass("button_loading")).toBeTruthy();
    });

    it("calls onShowMore when footer button is clicked", () => {
        const onShowMore = jest.fn();
        setup.setProps({ showMore: true, onShowMore, children: renderItems(2) });
        showMoreButton().simulate("click");
        expect(onShowMore).toHaveBeenCalledTimes(1);
    });

    it("does not call onShowMore when button is disabled", () => {
        const onShowMore = jest.fn();
        setup.setProps({ showMore: true, onShowMore, showMoreDisabled: true, children: renderItems(2) });
        showMoreButton().simulate("click");
        expect(onShowMore).toHaveBeenCalledTimes(0);
    });

    it("does not render skeleton row when there are no children", () => {
        setup.setProps({
            showMore: true,
            showMoreLoading: true,
            children: [] as unknown as React.ReactElement[]
        });

        expect(setup.find(".itemList__skeletonRow")).toHaveLength(0);
    });

    it("renders virtualized list container when provided items", () => {
        setup.setProps({
            children: renderItems(2)
        });

        expect(setup.find(".itemList__virtualContainer").exists()).toBeTruthy();
        expect(setup.find(".itemList__virtualContainer").first().type()).toEqual("ul");
        expect(setup.find(Empty).exists()).toBeFalsy();
    });

    it("renders virtualized container and does not render empty state when items exist", () => {
        setup.setProps({ children: renderItems(5) });
        expect(setup.find(".itemList__virtualContainer").exists()).toBeTruthy();
        expect(setup.find(Empty).exists()).toBeFalsy();
    });
});
