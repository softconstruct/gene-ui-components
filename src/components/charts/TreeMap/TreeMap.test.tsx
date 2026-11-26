import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TreeMap, { ITreeMapProps } from "./index";

describe("TreeMap ", () => {
    let setup: ReactWrapper<ITreeMapProps>;
    beforeEach(() => {
        setup = mount(<TreeMap />);
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
