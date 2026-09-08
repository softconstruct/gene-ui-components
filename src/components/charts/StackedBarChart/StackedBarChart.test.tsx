import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import StackedBarChart, { IStackedBarChartProps } from "./index";

describe("StackedBarChart ", () => {
    let setup: ReactWrapper<IStackedBarChartProps>;
    beforeEach(() => {
        setup = mount(<StackedBarChart />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
