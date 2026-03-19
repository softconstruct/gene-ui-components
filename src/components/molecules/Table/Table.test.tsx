import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Mockup datas
import { mockColumns, mockData } from "@components/molecules/Table/Table.mock";

// Components
import Table, { ITableProps } from "./index";

type MockDataType = (typeof mockData)[0];

describe("Table ", () => {
    // Pass the inferred type into ITableProps
    let setup: ReactWrapper<ITableProps<MockDataType>>;

    beforeEach(() => {
        setup = mount(<Table columns={mockColumns} data={mockData} />);
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
