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

    it("renders empty state when there are no children", () => {
        setup.setProps({ open: true, children: [] as unknown as React.ReactElement[] });
        expect(provider().find(Empty).exists()).toBeTruthy();
    });

    it("renders footer when showMore is true", () => {
        setup.setProps({ open: true, showMore: true });
        expect(provider().find(".autoComplete__footer").exists()).toBeTruthy();
    });

    it("disables showMore button when showMoreDisabled is true", () => {
        setup.setProps({ open: true, showMore: true, showMoreDisabled: true });
        expect(provider().find(".autoComplete__footer").find("button").prop("disabled")).toBeTruthy();
    });

    it("shows loading state on showMore button when showMoreLoading is true", () => {
        setup.setProps({ open: true, showMore: true, showMoreLoading: true });
        expect(provider().find(".autoComplete__footer").find("button").hasClass("button_loading")).toBeTruthy();
    });

    it("renders provided items", () => {
        setup.setProps({
            open: true,
            children: [
                <AutoCompleteItem id="1" key="1">
                    Item 1
                </AutoCompleteItem>,
                <AutoCompleteItem id="2" key="2">
                    Item 2
                </AutoCompleteItem>
            ]
        });

        expect(provider().find(AutoCompleteItem)).toHaveLength(2);
    });
});
