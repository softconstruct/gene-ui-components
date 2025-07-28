import React from "react";
import { mount, ReactWrapper } from "enzyme";

import GeneUIProvider from "../../providers/GeneUIProvider";
// Components
import Modal, { IModalProps } from "./index";

describe("Modal ", () => {
    let setup: ReactWrapper<IModalProps>;
    beforeEach(() => {
        setup = mount(<Modal />, { wrappingComponent: GeneUIProvider });
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
