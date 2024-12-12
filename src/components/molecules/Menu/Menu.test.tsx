import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Menu, { IMenuProps } from "./index";
import GeneUIProvider from "../../providers/GeneUIProvider";

describe("Menu ", () => {
    let setup: ReactWrapper<IMenuProps>;
    beforeEach(() => {
        setup = mount(<Menu />, { wrappingComponent: GeneUIProvider });
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
