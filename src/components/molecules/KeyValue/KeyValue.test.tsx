import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import KeyValue, { IKeyValueProps } from "./index";

describe("KeyValue ", () => {
    let setup: ReactWrapper<IKeyValueProps>;
    beforeEach(() => {
        setup = mount(<KeyValue keyText="key" value="value" />);
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
