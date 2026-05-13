import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import List, { IListProps } from "@components/molecules/List";

describe("List ", () => {
    let setup: ReactWrapper<IListProps>;
    const renderItems = (count: number) =>
        Array.from({ length: count }, (_, index) => ({
            id: `item-${index + 1}`,
            label: `Item ${index + 1}`
        }));

    const Component = <List items={[{ id: "test-item", label: "Test Child" }]} />;

    beforeEach(() => {
        setup = mount(Component);
    });

    const showMoreButton = () => setup.find(".list__footer").find("button").first();

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("applies className correctly", () => {
        setup.setProps({ className: "custom-list-class" });
        expect(setup.find(".list").hasClass("custom-list-class")).toBeTruthy();
    });

    it("renders non-interactive items when onItemClick is not provided", () => {
        setup.setProps({ items: renderItems(2) });
        expect(setup.find(".item__button")).toHaveLength(0);
    });

    it("calls onItemClick with the clicked item", () => {
        const onItemClick = jest.fn();
        setup.setProps({ items: renderItems(2), onItemClick });

        setup.find(".item__button").first().simulate("click");

        expect(onItemClick).toHaveBeenCalledTimes(1);
        expect(onItemClick).toHaveBeenCalledWith({
            id: "item-1",
            label: "Item 1"
        });
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
        setup.setProps({ items: [] });
        expect(setup.find(Empty).exists()).toBeTruthy();
    });

    it("renders custom empty text", () => {
        setup.setProps({ emptyText: "Nothing found", items: [] });
        expect(setup.text()).toContain("Nothing found");
    });

    it("renders footer when showMore is true", () => {
        setup.setProps({ showMore: true, items: renderItems(1) });
        expect(setup.find(".list__footer").exists()).toBeTruthy();
    });

    it("does not render footer when showMore is false", () => {
        setup.setProps({ showMore: false });
        expect(setup.find(".list__footer").exists()).toBeFalsy();
    });

    it("disables showMore button when showMoreDisabled is true", () => {
        setup.setProps({ showMore: true, showMoreDisabled: true, items: renderItems(1) });
        expect(showMoreButton().prop("disabled")).toBeTruthy();
    });

    it("hides footer when loading is true", () => {
        setup.setProps({ showMore: true, loading: true });
        expect(setup.find(".list__footer").exists()).toBeFalsy();
    });

    it("hides footer when there are no children", () => {
        setup.setProps({ showMore: true, items: [] });
        expect(setup.find(".list__footer").exists()).toBeFalsy();
    });

    it("shows loading state on showMore button when showMoreLoading is true", () => {
        setup.setProps({ showMore: true, showMoreLoading: true, items: renderItems(1) });
        expect(showMoreButton().hasClass("button_loading")).toBeTruthy();
    });

    it("keeps showMore button in loading state while showMoreLoading is true", () => {
        setup.setProps({
            showMore: true,
            showMoreLoading: true,
            items: renderItems(1)
        });

        expect(showMoreButton().hasClass("button_loading")).toBeTruthy();
    });

    it("calls onShowMore when footer button is clicked", () => {
        const onShowMore = jest.fn();
        setup.setProps({ showMore: true, onShowMore, items: renderItems(2) });
        showMoreButton().simulate("click");
        expect(onShowMore).toHaveBeenCalledTimes(1);
    });

    it("does not call onShowMore when button is disabled", () => {
        const onShowMore = jest.fn();
        setup.setProps({ showMore: true, onShowMore, showMoreDisabled: true, items: renderItems(2) });
        showMoreButton().simulate("click");
        expect(onShowMore).toHaveBeenCalledTimes(0);
    });

    it("does not render skeleton row when there are no children", () => {
        setup.setProps({
            showMore: true,
            showMoreLoading: true,
            items: []
        });

        expect(setup.find(".list__skeletonRow")).toHaveLength(0);
    });

    it("renders virtualized list container when provided items", () => {
        setup.setProps({
            items: renderItems(2),
            virtualized: true
        });

        expect(setup.find(".list__virtualContainer").exists()).toBeTruthy();
        expect(setup.find(".list__virtualContainer").first().type()).toEqual("ul");
        expect(setup.find(Empty).exists()).toBeFalsy();
    });

    it("renders virtualized container and does not render empty state when items exist", () => {
        setup.setProps({ items: renderItems(5), virtualized: true });
        expect(setup.find(".list__virtualContainer").exists()).toBeTruthy();
        expect(setup.find(Empty).exists()).toBeFalsy();
    });
});
