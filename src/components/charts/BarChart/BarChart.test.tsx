import React from "react";
import { mount } from "enzyme";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import BarChart from "./index";

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({
        options
    }: {
        options: { chart?: { animation?: boolean }; plotOptions?: { series?: { animation?: boolean } } };
    }) => (
        <div
            className="highcharts-react-mock"
            data-animation={String(options?.chart?.animation)}
            data-series-animation={String(options?.plotOptions?.series?.animation)}
        />
    );

    return {
        __esModule: true,
        default: MockHighchartsReact
    };
});

jest.mock("highcharts", () => ({
    addEvent: jest.fn(() => jest.fn())
}));

describe("BarChart", () => {
    const categories = ["Segment", "Segment", "Segment", "Segment"];
    const series = { name: "Channel", data: [10, 20, 30, 40], color: "#0057b8" };

    const mountBarChart = (props = {}) =>
        mount(<BarChart categories={categories} series={series} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    it("renders without crashing", () => {
        const wrapper = mountBarChart();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("renders loading state", () => {
        const wrapper = mountBarChart({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("renders empty state when series has no data", () => {
        const wrapper = mount(
            <BarChart
                categories={categories}
                series={undefined}
                emptyTitle="No Data Available"
                emptyDescription="No data is available for display at this moment."
            />,
            { wrappingComponent: GeneUIProvider }
        );
        expect(wrapper.find(Empty).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("disables chart animations by default", () => {
        const wrapper = mountBarChart();
        const mock = wrapper.find(".highcharts-react-mock");
        expect(mock.prop("data-animation")).toBe("false");
        expect(mock.prop("data-series-animation")).toBe("false");
    });
});
