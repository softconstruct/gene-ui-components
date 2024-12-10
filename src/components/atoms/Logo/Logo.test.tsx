import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Logo, { ILogoProps } from "./index";

describe("Logo ", () => {
    let setup: ReactWrapper<ILogoProps>;
    beforeEach(() => {
        setup = mount(<Logo />);
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
