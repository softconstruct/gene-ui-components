import React from "react";
import { mount } from "enzyme";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import AreaChart from "./index";

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({
        options
    }: {
        options: {
            chart?: { animation?: boolean; type?: string };
            plotOptions?: { series?: { animation?: boolean } };
            xAxis?: { crosshair?: unknown };
        };
    }) => (
        <div
            className="highcharts-react-mock"
            data-animation={String(options?.chart?.animation)}
            data-series-animation={String(options?.plotOptions?.series?.animation)}
            data-type={options?.chart?.type}
            data-crosshair={String(Boolean(options?.xAxis?.crosshair))}
        />
    );

    return {
        __esModule: true,
        default: MockHighchartsReact
    };
});

jest.mock("highcharts", () => ({
    addEvent: jest.fn(() => jest.fn()),
    color: jest.fn((color: string) => ({
        setOpacity: () => ({ get: () => color })
    }))
}));

describe("AreaChart", () => {
    const categories = ["Segment", "Segment", "Segment", "Segment"];
    const series = [
        { name: "Channel 1", data: [10, 20, 30, 40], color: "#b91c1c" },
        { name: "Channel 2", data: [15, 25, 35, 45], color: "#0057b8" }
    ];

    const mountAreaChart = (props = {}) =>
        mount(<AreaChart categories={categories} series={series} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    it("renders without crashing", () => {
        const wrapper = mountAreaChart();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("renders loading state", () => {
        const wrapper = mountAreaChart({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("renders empty state when series has no data", () => {
        const wrapper = mount(
            <AreaChart
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
        const wrapper = mountAreaChart();
        const mock = wrapper.find(".highcharts-react-mock");
        expect(mock.prop("data-animation")).toBe("false");
        expect(mock.prop("data-series-animation")).toBe("false");
    });

    it("renders smooth areas with a crosshair", () => {
        const wrapper = mountAreaChart();
        const mock = wrapper.find(".highcharts-react-mock");
        expect(mock.prop("data-type")).toBe("areaspline");
        expect(mock.prop("data-crosshair")).toBe("true");
    });
});
