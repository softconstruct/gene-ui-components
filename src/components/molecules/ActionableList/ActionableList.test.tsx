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
});
