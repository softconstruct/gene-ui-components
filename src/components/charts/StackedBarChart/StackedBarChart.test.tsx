import React from "react";
import { mount } from "enzyme";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import StackedBarChart from "./index";

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({
        options
    }: {
        options: {
            chart?: { animation?: boolean; inverted?: boolean };
            plotOptions?: { series?: { animation?: boolean } };
            yAxis?: { plotLines?: unknown[] };
        };
    }) => (
        <div
            className="highcharts-react-mock"
            data-animation={String(options?.chart?.animation)}
            data-series-animation={String(options?.plotOptions?.series?.animation)}
            data-inverted={String(options?.chart?.inverted)}
            data-zero-line={String(Boolean(options?.yAxis?.plotLines?.length))}
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

describe("StackedBarChart", () => {
    const categories = ["Segment", "Segment", "Segment", "Segment"];
    const series = [
        { name: "Channel 1", data: [10, 20, 30, 40], color: "#b91c1c" },
        { name: "Channel 2", data: [15, 25, 35, 45], color: "#0057b8" }
    ];

    const mountStackedBarChart = (props = {}) =>
        mount(<StackedBarChart categories={categories} series={series} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    it("renders without crashing", () => {
        const wrapper = mountStackedBarChart();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("renders loading state", () => {
        const wrapper = mountStackedBarChart({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("renders empty state when series has no data", () => {
        const wrapper = mount(
            <StackedBarChart
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
        const wrapper = mountStackedBarChart();
        const mock = wrapper.find(".highcharts-react-mock");
        expect(mock.prop("data-animation")).toBe("false");
        expect(mock.prop("data-series-animation")).toBe("false");
    });

    it("renders vertical (not inverted) by default", () => {
        const wrapper = mountStackedBarChart();
        expect(wrapper.find(".highcharts-react-mock").prop("data-inverted")).toBe("false");
    });

    it("inverts the chart when direction is horizontal", () => {
        const wrapper = mountStackedBarChart({ direction: "horizontal" });
        expect(wrapper.find(".highcharts-react-mock").prop("data-inverted")).toBe("true");
    });

    it("draws a zero line only when series contain negative values", () => {
        const wrapper = mountStackedBarChart();
        expect(wrapper.find(".highcharts-react-mock").prop("data-zero-line")).toBe("false");

        const divergingWrapper = mountStackedBarChart({
            direction: "horizontal",
            series: [
                { name: "Channel 1", data: [-10, -20, -30, -40] },
                { name: "Channel 2", data: [15, 25, 35, 45] }
            ]
        });
        expect(divergingWrapper.find(".highcharts-react-mock").prop("data-zero-line")).toBe("true");
    });
});
