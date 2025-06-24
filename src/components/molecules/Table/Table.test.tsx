import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Table, { ITableProps } from "./index";

describe("Table ", () => {
    let setup: ReactWrapper<ITableProps>;
    beforeEach(() => {
        setup = mount(<Table columns={[]} externalData={[]} onSave={() => {}} rowActions={{}} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
