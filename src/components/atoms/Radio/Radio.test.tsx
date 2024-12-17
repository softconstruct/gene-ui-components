import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Radio, { IRadioProps } from "./index";

describe("Radio ", () => {
    let setup: ReactWrapper<IRadioProps>;
    beforeEach(() => {
        setup = mount(<Radio />);
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
