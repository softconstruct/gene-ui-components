import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Accordion, { IAccordionProps } from "./index";

describe("Accordion ", () => {
    let setup: ReactWrapper<IAccordionProps>;
    beforeEach(() => {
        setup = mount(<Accordion />);
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
