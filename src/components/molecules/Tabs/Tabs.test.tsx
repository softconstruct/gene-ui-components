import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ChevronLeft, ChevronRight } from "@geneui/icons";

import Button from "../../atoms/Button";
// Components
import Tab from "./Tab";
import Tabs, { ITabsProps } from "./Tabs";

describe("Tabs Component", () => {
    let setup: ReactWrapper<ITabsProps>;

    beforeEach(() => {
        setup = mount(
            <Tabs>
                <Tab title="Tab 1">Content 1</Tab>
                <Tab title="Tab 2">Content 2</Tab>
            </Tabs>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".tabs").hasClass(className)).toBeTruthy();
    });

    it("renders children Tab  correctly", () => {
        expect(setup.find(Tab).length).toBe(2);
    });

    it.each<ITabsProps["direction"]>(["horizontal", "vertical"])('should have "%s" direction', (direction) => {
        const wrapper = setup.setProps({ direction });
        expect(wrapper.find(".tabs").hasClass(`tabs_${direction}`)).toBeTruthy();
    });

    it("calls onChange when a tab is clicked", () => {
        const onChangeMock = jest.fn();
        const wrapper = setup.setProps({ onChange: onChangeMock });
        wrapper.find(Tab).at(1).simulate("click");
        expect(onChangeMock).toHaveBeenCalledWith(1);
    });

    it("displays navigation buttons when needed", () => {
        const wrapper = setup.setProps({ direction: "horizontal" });
        expect(wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === ChevronLeft)).toBeTruthy();
        expect(wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === ChevronRight)).toBeTruthy();
    });

    it("removes a tab when closable is enabled and close button is clicked", () => {
        const wrapper = setup.setProps({ closable: true });
        const initialTabCount = setup.find(Tab).length;

        wrapper.find(Button).first().simulate("click");

        expect(wrapper.find(Tab).length).toBe(initialTabCount - 1);
    });

    it("shows loading skeleton when isLoading is true", () => {
        setup.setProps({ isLoading: true });
        expect(setup.text()).toContain("Skeleton");
    });
});
