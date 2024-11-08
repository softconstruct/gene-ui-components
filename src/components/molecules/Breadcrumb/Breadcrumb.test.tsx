import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Breadcrumb, { IBreadcrumbProps } from "./index";

describe("Breadcrumb ", () => {
    let setup: ReactWrapper<IBreadcrumbProps>;
    beforeEach(() => {
        setup = mount(<Breadcrumb />);
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
