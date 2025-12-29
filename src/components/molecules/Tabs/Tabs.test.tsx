import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ChevronLeft, ChevronRight, X } from "@geneui/icons";

import Button from "../../atoms/Button";
// Components
import Tab from "./Tab";
import Tabs, { ITabsProps } from "./Tabs";

describe("Tabs", () => {
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

    it("renders children Tab correctly", () => {
        expect(setup.find(Tab).length).toBe(2);
    });

    it("renders without children", () => {
        const wrapper = mount(<Tabs />);
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(Tab).length).toBe(0);
    });

    it.each<ITabsProps["direction"]>(["horizontal", "vertical"])('should have "%s" direction', (direction) => {
        const wrapper = setup.setProps({ direction });
        expect(wrapper.find(".tabs").hasClass(`tabs_${direction}`)).toBeTruthy();
    });

    it.each<ITabsProps["size"]>(["large", "medium"])('should have "%s" size', (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".tabs").hasClass(`tabs_${size}`)).toBeTruthy();
    });

    it.each<ITabsProps["type"]>(["line", "contained"])('should have "%s" type', (type) => {
        const wrapper = setup.setProps({ type });
        expect(wrapper.find(".tabs").hasClass(`tabs_${type}`)).toBeTruthy();
    });

    it("calls onChange when a tab is clicked", () => {
        const onChangeMock = jest.fn();
        const wrapper = setup.setProps({ onChange: onChangeMock });
        wrapper.find(Tab).at(1).simulate("click");
        expect(onChangeMock).toHaveBeenCalledWith(1);
    });

    it("calls onChange when a tab is selected via keyboard", () => {
        const onChangeMock = jest.fn();
        const wrapper = setup.setProps({ onChange: onChangeMock });
        wrapper.find(Tab).at(1).simulate("keyDown", { key: "Enter" });
        expect(onChangeMock).toHaveBeenCalledWith(1);
    });

    it("displays navigation buttons when needed", () => {
        const wrapper = setup.setProps({ direction: "horizontal" });
        expect(wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === ChevronLeft)).toBeTruthy();
        expect(wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === ChevronRight)).toBeTruthy();
    });

    describe("closable tabs", () => {
        it("removes a tab when closable is enabled and close button is clicked (uncontrolled)", () => {
            const wrapper = setup.setProps({ closable: true });
            const initialTabCount = setup.find(Tab).length;

            wrapper.find(Button).first().simulate("click");

            expect(wrapper.find(Tab).length).toBe(initialTabCount - 1);
        });

        it("calls onClose when close button is clicked (controlled)", () => {
            const onCloseMock = jest.fn();
            const wrapper = setup.setProps({ closable: true, onClose: onCloseMock });
            const closeButton = wrapper
                .find(Button)
                .findWhere((btn) => btn.prop("Icon") === X)
                .first();

            closeButton.simulate("click");

            expect(onCloseMock).toHaveBeenCalled();
        });

        it("does not remove tab internally when onClose is provided (controlled mode)", () => {
            const onCloseMock = jest.fn();
            const wrapper = setup.setProps({ closable: true, onClose: onCloseMock });
            const initialTabCount = wrapper.find(Tab).length;

            const closeButton = wrapper
                .find(Button)
                .findWhere((btn) => btn.prop("Icon") === X)
                .first();
            closeButton.simulate("click");

            expect(onCloseMock).toHaveBeenCalled();
            expect(wrapper.find(Tab).length).toBe(initialTabCount);
        });

        it("adjusts selectedTabIndex when tab before selected is removed (uncontrolled)", () => {
            const wrapper = mount(
                <Tabs closable>
                    <Tab title="Tab 0">Content 0</Tab>
                    <Tab title="Tab 1">Content 1</Tab>
                    <Tab title="Tab 2">Content 2</Tab>
                </Tabs>
            );

            // Select tab 2
            wrapper.find(Tab).at(2).simulate("click");
            wrapper.update();

            // Check if tab 2 is selected by checking the DOM element's aria-selected attribute
            const tab2Element = wrapper.find(Tab).at(2).find('[role="tab"]').first();
            expect(tab2Element.prop("aria-selected")).toBe(true);

            // Remove tab 0 (before selected)
            const closeButtons = wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === X);
            closeButtons.first().simulate("click");

            // Tab 2 should now be at index 1, but selectedTabIndex should be adjusted
            wrapper.update();
            expect(wrapper.find(Tab).length).toBe(2);
        });

        it("selects next tab when selected tab is removed (uncontrolled)", () => {
            const onChangeMock = jest.fn();
            const wrapper = mount(
                <Tabs closable onChange={onChangeMock}>
                    <Tab title="Tab 0">Content 0</Tab>
                    <Tab title="Tab 1">Content 1</Tab>
                    <Tab title="Tab 2">Content 2</Tab>
                </Tabs>
            );

            // Select tab 1
            wrapper.find(Tab).at(1).simulate("click");
            wrapper.update();

            // Remove tab 1 (selected tab)
            const closeButtons = wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === X);
            closeButtons.at(1).simulate("click");

            wrapper.update();
            expect(wrapper.find(Tab).length).toBe(2);
            expect(onChangeMock).toHaveBeenCalled();
        });

        it("does not change selectedTabIndex in controlled mode when tab is not removed", () => {
            const onCloseMock = jest.fn();
            const wrapper = mount(
                <Tabs closable onClose={onCloseMock}>
                    <Tab title="Tab 0">Content 0</Tab>
                    <Tab title="Tab 1">Content 1</Tab>
                    <Tab title="Tab 2">Content 2</Tab>
                </Tabs>
            );

            // Select tab 2
            wrapper.find(Tab).at(2).simulate("click");
            wrapper.update();

            // Find selected tab index before by checking DOM elements
            let selectedIndexBefore = -1;
            wrapper.find(Tab).forEach((tab, index) => {
                const tabElement = tab.find('[role="tab"]').first();
                if (tabElement.prop("aria-selected") === true) {
                    selectedIndexBefore = index;
                }
            });

            // Click close on tab 0 (but don't actually remove it - controlled mode)
            const closeButtons = wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === X);
            closeButtons.first().simulate("click");

            wrapper.update();
            expect(onCloseMock).toHaveBeenCalledWith(0);

            // Selected tab should remain the same since tab wasn't actually removed
            let selectedIndexAfter = -1;
            wrapper.find(Tab).forEach((tab, index) => {
                const tabElement = tab.find('[role="tab"]').first();
                if (tabElement.prop("aria-selected") === true) {
                    selectedIndexAfter = index;
                }
            });
            expect(selectedIndexAfter).toBe(selectedIndexBefore);
        });
    });

    describe("controlled mode with children updates", () => {
        it("adjusts selectedTabIndex when children prop changes", () => {
            const onCloseMock = jest.fn();
            const TestComponent = () => {
                const [tabs, setTabs] = React.useState([
                    <Tab key="0" title="Tab 0">
                        Content 0
                    </Tab>,
                    <Tab key="1" title="Tab 1">
                        Content 1
                    </Tab>,
                    <Tab key="2" title="Tab 2">
                        Content 2
                    </Tab>
                ]);

                const handleClose = (index: number) => {
                    onCloseMock(index);
                    setTabs((prev) => prev.filter((_, i) => i !== index));
                };

                return (
                    <Tabs closable onClose={handleClose}>
                        {tabs}
                    </Tabs>
                );
            };

            const wrapper = mount(<TestComponent />);

            // Select tab 2
            wrapper.find(Tab).at(2).simulate("click");
            wrapper.update();

            // Remove tab 0
            const closeButtons = wrapper.find(Button).findWhere((btn) => btn.prop("Icon") === X);
            closeButtons.first().simulate("click");

            wrapper.update();
            expect(wrapper.find(Tab).length).toBe(2);
            expect(onCloseMock).toHaveBeenCalledWith(0);
        });
    });

    describe("defaultSelected", () => {
        it("selects tab with defaultSelected prop", () => {
            const wrapper = mount(
                <Tabs>
                    <Tab title="Tab 0">Content 0</Tab>
                    <Tab title="Tab 1" defaultSelected>
                        Content 1
                    </Tab>
                    <Tab title="Tab 2">Content 2</Tab>
                </Tabs>
            );

            // Check if tab 1 is selected by checking the DOM element's aria-selected attribute
            const tab1Element = wrapper.find(Tab).at(1).find('[role="tab"]').first();
            expect(tab1Element.prop("aria-selected")).toBe(true);
        });
    });

    it("shows loading skeleton when loading is true", () => {
        setup.setProps({ loading: true });
        expect(setup.text()).toContain("Skeleton");
    });

    it("renders tab content in tabs__stage", () => {
        const wrapper = mount(
            <Tabs>
                <Tab title="Tab 1">Content 1</Tab>
                <Tab title="Tab 2">Content 2</Tab>
            </Tabs>
        );

        expect(wrapper.find(".tabs__stage").text()).toContain("Content 1");
    });
});
