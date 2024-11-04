import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Skeleton, { ISkeletonProps } from "./index";

describe("Skeleton ", () => {
    let setup: ReactWrapper<ISkeletonProps>;
    beforeEach(() => {
        setup = mount(<Skeleton />);
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
