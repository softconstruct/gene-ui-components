import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { countCheckedItems, countLeafItems, reorderInTree } from "./ActionableList.helpers";
// Components
import ActionableList, { IActionableListProps } from "./index";

describe("ActionableList ", () => {
    let setup: ReactWrapper<IActionableListProps>;
    beforeEach(() => {
        setup = mount(
            <ActionableList
                items={[
                    { id: "1", title: "Actionable Item 1" },
                    { id: "2", title: "Actionable Item 2", children: [{ id: "2-1", title: "Actionable Item 2.1" }] }
                ]}
            />
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("countLeafItems excludes parent rows and counts nested leaves only", () => {
        const items = [
            {
                id: "portfolio-na",
                title: "Portfolio - North America",
                children: [
                    { id: "na-pricing", title: "Pricing and Contracts" },
                    { id: "na-sales", title: "Sales Enablement" }
                ]
            },
            {
                id: "portfolio-emea",
                title: "Portfolio - EMEA",
                children: [
                    { id: "emea-distributor", title: "Distributor Onboarding" },
                    { id: "emea-localization", title: "Localization" }
                ]
            }
        ];

        expect(countLeafItems(items)).toBe(4);
    });

    it("countCheckedItems counts selected leaves only, not parent group rows", () => {
        const items = [
            {
                id: "portfolio-na",
                title: "Portfolio - North America",
                checked: true,
                children: [
                    { id: "na-pricing", title: "Pricing and Contracts", checked: true },
                    { id: "na-sales", title: "Sales Enablement", checked: true }
                ]
            },
            {
                id: "portfolio-emea",
                title: "Portfolio - EMEA",
                checked: false,
                children: [
                    { id: "emea-distributor", title: "Distributor Onboarding", checked: false },
                    { id: "emea-localization", title: "Localization", checked: false }
                ]
            }
        ];

        expect(countCheckedItems(items)).toBe(2);
    });

    it("reorderInTree places item after target when edge is bottom", () => {
        const items = [
            { id: "a", title: "A" },
            { id: "b", title: "B" },
            { id: "c", title: "C" }
        ];
        const result = reorderInTree(items, "a", "c", "bottom");
        expect(result.map((item) => item.id)).toEqual(["b", "c", "a"]);
    });

    it("reorderInTree places item before target when edge is top", () => {
        const items = [
            { id: "a", title: "A" },
            { id: "b", title: "B" },
            { id: "c", title: "C" }
        ];
        const result = reorderInTree(items, "c", "b", "top");
        expect(result.map((item) => item.id)).toEqual(["a", "c", "b"]);
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("filters items by search value", () => {
        setup.find(".actionableListItem__toggle").at(0).simulate("click");
        setup.find("input").simulate("change", { target: { value: "2.1" } });

        expect(setup.text()).toContain("Actionable Item 2.1");
        expect(setup.text()).not.toContain("Actionable Item 1");
    });

    it("shows nested search matches even when collapsed by default", () => {
        const wrapper = mount(
            <ActionableList
                items={[
                    {
                        id: "parent",
                        title: "Parent",
                        children: [{ id: "child", title: "Child target" }]
                    }
                ]}
            />
        );

        expect(wrapper.text()).not.toContain("Child target");

        wrapper.find("input").simulate("change", { target: { value: "target" } });
        wrapper.update();

        expect(wrapper.text()).toContain("Child target");
    });

    it("preserves user expansion state when items prop updates", () => {
        const wrapper = mount(
            <ActionableList
                items={[
                    {
                        id: "parent",
                        title: "Parent",
                        children: [{ id: "child", title: "Child" }]
                    }
                ]}
            />
        );

        expect(wrapper.text()).not.toContain("Child");

        wrapper.find(".actionableListItem__toggle").at(0).simulate("click");
        wrapper.update();
        expect(wrapper.text()).toContain("Child");

        wrapper.setProps({
            items: [
                {
                    id: "parent",
                    title: "Parent updated",
                    children: [{ id: "child", title: "Child" }]
                }
            ]
        });
        wrapper.update();

        expect(wrapper.text()).toContain("Child");
    });

    it("keeps nested items collapsed by default", () => {
        const wrapper = mount(
            <ActionableList
                items={[
                    {
                        id: "parent",
                        title: "Parent",
                        children: [{ id: "child", title: "Child" }]
                    }
                ]}
            />
        );

        expect(wrapper.text()).toContain("Parent");
        expect(wrapper.text()).not.toContain("Child");
    });

    it("expands all nested items when defaultExpandAll is true", () => {
        const wrapper = mount(
            <ActionableList
                defaultExpandAll
                items={[
                    {
                        id: "parent",
                        title: "Parent",
                        children: [{ id: "child", title: "Child" }]
                    }
                ]}
            />
        );

        expect(wrapper.text()).toContain("Parent");
        expect(wrapper.text()).toContain("Child");
    });

    it("renders no data state when items are empty", () => {
        const wrapper = mount(<ActionableList items={[]} />);

        expect(wrapper.text()).toContain("No Data Available");
    });

    it("calls onItemCheck with id and updated tree when checkbox toggles", () => {
        const onItemCheck = jest.fn();
        const wrapper = mount(
            <ActionableList withCheckbox items={[{ id: "leaf-a", title: "Leaf A" }]} onItemCheck={onItemCheck} />
        );

        wrapper.find(".actionableList__list input[type='checkbox']").simulate("change", { target: { checked: true } });

        expect(onItemCheck).toHaveBeenCalledTimes(1);
        const [row, checked, nextItems] = onItemCheck.mock.calls[0];
        expect(row).toMatchObject({ id: "leaf-a", title: "Leaf A", checked: true });
        expect(checked).toBe(true);
        expect(nextItems[0]).toMatchObject({ id: "leaf-a", title: "Leaf A", checked: true });
    });

    it("calls onSelectAllChange and not onItemCheck when select all is toggled", () => {
        const onItemCheck = jest.fn();
        const onSelectAllChange = jest.fn();
        const wrapper = mount(
            <ActionableList
                withCheckbox
                items={[
                    { id: "a", title: "A" },
                    { id: "b", title: "B" }
                ]}
                onItemCheck={onItemCheck}
                onSelectAllChange={onSelectAllChange}
            />
        );

        wrapper
            .find(".actionableList__bulkSelection input[type='checkbox']")
            .simulate("change", { target: { checked: true } });

        expect(onItemCheck).not.toHaveBeenCalled();
        expect(onSelectAllChange).toHaveBeenCalledTimes(1);
        const [checked, items] = onSelectAllChange.mock.calls[0];
        expect(checked).toBe(true);
        expect(items).toHaveLength(2);
        expect(items[0]).toMatchObject({ id: "a", checked: true });
        expect(items[1]).toMatchObject({ id: "b", checked: true });
    });

    it("shows every ancestor fully checked when only the deepest leaf is checked", () => {
        const items = [
            {
                id: "p",
                title: "Parent",
                children: [{ id: "c", title: "Child" }]
            }
        ];
        const wrapper = mount(<ActionableList items={items} withCheckbox defaultExpandAll />);
        const inputs = wrapper.find(".actionableList__list input[type='checkbox']");
        expect(inputs).toHaveLength(2);
        inputs.at(1).simulate("change", { target: { checked: true } });
        wrapper.update();
        const after = wrapper.find(".actionableList__list input[type='checkbox']");
        expect(after.at(0).prop("checked")).toBe(true);
        expect(after.at(1).prop("checked")).toBe(true);
    });
});
