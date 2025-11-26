import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import InteractiveCard, { IInteractiveCardProps } from "./index";

describe("InteractiveCard ", () => {
    let setup: ReactWrapper<IInteractiveCardProps>;
    beforeEach(() => {
        setup = mount(<InteractiveCard />);
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
