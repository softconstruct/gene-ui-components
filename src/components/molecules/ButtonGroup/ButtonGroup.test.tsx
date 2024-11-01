import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import ButtonGroup, { IButtonGroupProps } from "./index";
import GeneUIProvider from "../../providers/GeneUIProvider";

describe("ButtonGroup ", () => {
    let setup: ReactWrapper<IButtonGroupProps>;
    beforeEach(() => {
        setup = mount(<ButtonGroup />, { wrappingComponent: GeneUIProvider });
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
