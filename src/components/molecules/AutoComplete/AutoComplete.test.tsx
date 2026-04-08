import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";

import GeneUIProvider from "../../providers/GeneUIProvider";
import AutoCompleteItem from "./AutoCompleteItem";
import AutoComplete, { IAutoCompleteProps } from "./index";

describe("AutoComplete ", () => {
    let setup: ReactWrapper<IAutoCompleteProps>;
    const renderItems = (count: number) =>
        Array.from({ length: count }, (_, index) => (
            <AutoCompleteItem id={`item-${index + 1}`} key={`item-${index + 1}`}>
                {`Item ${index + 1}`}
            </AutoCompleteItem>
        ));

    const Component = (
        <AutoComplete
            setPropsForPopover={() => {
                // no-op for tests
            }}
        >
            <div>Test Child</div>
        </AutoComplete>
    );

    beforeEach(() => {
        setup = mount(Component, { wrappingComponent: GeneUIProvider });
    });

    const provider = () =>
        setup.getWrappingComponent().setProps({
            children: Component
        });

    const showMoreButton = () => provider().find(".autoComplete__footer").find("button").first();

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders loading state correctly", () => {
        setup.setProps({ loading: true, open: true, loadingText: "Loading data..." });
        expect(provider().find(Loader).exists()).toBeTruthy();
    });

    it("renders custom loading text", () => {
        setup.setProps({ loading: true, open: true, loadingText: "Loading custom..." });
        expect(provider().text()).toContain("Loading custom...");
    });

    it("renders empty state when there are no children", () => {
        setup.setProps({ open: true, children: [] as unknown as React.ReactElement[] });
        expect(provider().find(Empty).exists()).toBeTruthy();
    });

    it("renders custom empty text", () => {
        setup.setProps({ open: true, emptyText: "Nothing found", children: [] as unknown as React.ReactElement[] });
        expect(provider().text()).toContain("Nothing found");
    });

    it("renders footer when showMore is true", () => {
        setup.setProps({ open: true, showMore: true });
        expect(provider().find(".autoComplete__footer").exists()).toBeTruthy();
    });

    it("does not render footer when showMore is false", () => {
        setup.setProps({ open: true, showMore: false });
        expect(provider().find(".autoComplete__footer").exists()).toBeFalsy();
    });

    it("disables showMore button when showMoreDisabled is true", () => {
        setup.setProps({ open: true, showMore: true, showMoreDisabled: true });
        expect(showMoreButton().prop("disabled")).toBeTruthy();
    });

    it("hides footer when loading is true", () => {
        setup.setProps({ open: true, showMore: true, loading: true });
        expect(provider().find(".autoComplete__footer").exists()).toBeFalsy();
    });

    it("hides footer when there are no children", () => {
        setup.setProps({ open: true, showMore: true, children: [] as unknown as React.ReactElement[] });
        expect(provider().find(".autoComplete__footer").exists()).toBeFalsy();
    });

    it("shows loading state on showMore button when showMoreLoading is true", () => {
        setup.setProps({ open: true, showMore: true, showMoreLoading: true });
        expect(showMoreButton().hasClass("button_loading")).toBeTruthy();
    });

    it("keeps showMore button in loading state while showMoreLoading is true", () => {
        setup.setProps({
            open: true,
            showMore: true,
            showMoreLoading: true,
            children: renderItems(1)
        });

        expect(showMoreButton().hasClass("button_loading")).toBeTruthy();
    });

    it("calls onShowMore when footer button is clicked", () => {
        const onShowMore = jest.fn();
        setup.setProps({ open: true, showMore: true, onShowMore, children: renderItems(2) });
        showMoreButton().simulate("click");
        expect(onShowMore).toHaveBeenCalledTimes(1);
    });

    it("does not call onShowMore when button is disabled", () => {
        const onShowMore = jest.fn();
        setup.setProps({ open: true, showMore: true, onShowMore, showMoreDisabled: true, children: renderItems(2) });
        showMoreButton().simulate("click");
        expect(onShowMore).toHaveBeenCalledTimes(0);
    });

    it("does not render skeleton row when there are no children", () => {
        setup.setProps({
            open: true,
            showMore: true,
            showMoreLoading: true,
            children: [] as unknown as React.ReactElement[]
        });

        expect(provider().find(".autoComplete__skeletonRow")).toHaveLength(0);
    });

    it("renders virtualized list container when provided items", () => {
        setup.setProps({
            open: true,
            children: renderItems(2)
        });

        expect(provider().find(".autoComplete__virtualContainer").exists()).toBeTruthy();
        expect(provider().find(Empty).exists()).toBeFalsy();
    });

    it("renders virtualized container and does not render empty state when items exist", () => {
        setup.setProps({ open: true, children: renderItems(5) });
        expect(provider().find(".autoComplete__virtualContainer").exists()).toBeTruthy();
        expect(provider().find(Empty).exists()).toBeFalsy();
    });

    it("emits onOpenChange when open prop changes", () => {
        const onOpenChange = jest.fn();
        setup.setProps({ onOpenChange, open: true });
        provider();
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("emits onOpenChange false when open prop switches to false", () => {
        const onOpenChange = jest.fn();
        setup.setProps({ onOpenChange, open: true });
        provider();
        setup.setProps({ onOpenChange, open: false });
        provider();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("applies mapped medium popover size for small autocomplete", () => {
        setup.setProps({ open: true, size: "small", children: renderItems(2) });
        expect(provider().find(".popover_size_medium").exists()).toBeTruthy();
    });

    it("applies mapped medium popover size for large autocomplete", () => {
        setup.setProps({ open: true, size: "large", children: renderItems(2) });
        expect(provider().find(".popover_size_medium").exists()).toBeTruthy();
    });
});
