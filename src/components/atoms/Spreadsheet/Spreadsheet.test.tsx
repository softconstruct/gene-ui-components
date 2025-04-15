import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Spreadsheet, { ISpreadsheetProps } from "./index";

describe("Spreadsheet ", () => {
    let setup: ReactWrapper<ISpreadsheetProps>;
    beforeEach(() => {
        setup = mount(<Spreadsheet />, { wrappingComponent: GeneUIProvider });
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
