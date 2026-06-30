import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Widget, { IWidgetProps } from "./index";

describe("Widget ", () => {
    let setup: ReactWrapper<IWidgetProps>;
    beforeEach(() => {
        setup = mount(<Widget />);
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
