import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import DonutChart, { IDonutChartProps } from "./index";

describe("DonutChart ", () => {
    let setup: ReactWrapper<IDonutChartProps>;
    beforeEach(() => {
        setup = mount(<DonutChart />);
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
