import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import PageHeader, { IPageHeaderProps } from "./index";

describe("PageHeader ", () => {
    let setup: ReactWrapper<IPageHeaderProps>;
    beforeEach(() => {
        setup = mount(<PageHeader />);
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
