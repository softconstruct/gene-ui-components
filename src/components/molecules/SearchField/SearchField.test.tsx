import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import SearchField, { ISearchFieldProps } from "./index";

describe("SearchField ", () => {
    let setup: ReactWrapper<ISearchFieldProps>;
    beforeEach(() => {
        setup = mount(<SearchField />);
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
