import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import DualAxisChart, { IDualAxisChartProps } from "./index";

describe("DualAxisChart ", () => {
    let setup: ReactWrapper<IDualAxisChartProps>;
    beforeEach(() => {
        setup = mount(<DualAxisChart />);
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
