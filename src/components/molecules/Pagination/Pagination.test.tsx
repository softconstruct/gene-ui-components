import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Pagination, { IPaginationProps } from "./index";

describe("Pagination ", () => {
    let setup: ReactWrapper<IPaginationProps>;
    beforeEach(() => {
        setup = mount(<Pagination />);
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
