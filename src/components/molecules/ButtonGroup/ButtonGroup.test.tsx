import React from "react";
import { mount, ReactWrapper } from "enzyme";

import GeneUIProvider from "../../providers/GeneUIProvider";
// Components
import ButtonGroup, { IButtonGroupProps } from "./index";

describe("ButtonGroup ", () => {
    let setup: ReactWrapper<IButtonGroupProps>;
    beforeEach(() => {
        setup = mount(<ButtonGroup direction="vertical"> 312</ButtonGroup>, { wrappingComponent: GeneUIProvider });
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
