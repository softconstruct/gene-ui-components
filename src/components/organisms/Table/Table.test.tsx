import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Table, { ITableProps } from "./index";

describe("Table ", () => {
    let setup: ReactWrapper<ITableProps>;
    beforeEach(() => {
        setup = mount(<Table columns={[]} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    // Your tests here
});
