import React from "react";
import { mount, ReactWrapper } from "enzyme";

import GeneUIProvider from "../../providers/GeneUIProvider";
// Components
import Drawer, { IDrawerProps } from "./index";

describe("Drawer ", () => {
    let setup: ReactWrapper<IDrawerProps>;
    beforeEach(() => {
        setup = mount(<Drawer />, { wrappingComponent: GeneUIProvider });
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
