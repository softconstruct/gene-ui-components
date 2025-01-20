import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Products, { IProductsProps } from "./index";

describe("Products ", () => {
    let setup: ReactWrapper<IProductsProps>;
    beforeEach(() => {
        setup = mount(<Products />);
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
