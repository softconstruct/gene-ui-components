import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import TagGroup, { ITagGroupProps } from "./index";

describe("TagGroup ", () => {
    let setup: ReactWrapper<ITagGroupProps>;
    beforeEach(() => {
        setup = mount(<TagGroup />);
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
