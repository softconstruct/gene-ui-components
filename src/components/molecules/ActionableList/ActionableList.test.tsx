import React from "react";
import { mount, ReactWrapper } from "enzyme";

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

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("filters items by search value", () => {
        setup.find("input").simulate("change", { target: { value: "2.1" } });

        expect(setup.text()).toContain("Actionable Item 2.1");
        expect(setup.text()).not.toContain("Actionable Item 1");
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
        const wrapper = mount(<ActionableList items={items} withCheckbox />);
        const inputs = wrapper.find(".actionableList__list input[type='checkbox']");
        expect(inputs).toHaveLength(2);
        inputs.at(1).simulate("change", { target: { checked: true } });
        wrapper.update();
        const after = wrapper.find(".actionableList__list input[type='checkbox']");
        expect(after.at(0).prop("checked")).toBe(true);
        expect(after.at(1).prop("checked")).toBe(true);
    });
});
