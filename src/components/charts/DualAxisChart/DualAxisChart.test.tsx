import React from "react";
import { mount } from "enzyme";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import DualAxisChart, { IDualAxisChartSeries } from "./index";

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({
        options
    }: {
        options: {
            chart?: { animation?: boolean };
            plotOptions?: { series?: { animation?: boolean } };
            yAxis?: unknown[];
            series?: { type: string; yAxis: number }[];
        };
    }) => (
        <div
            className="highcharts-react-mock"
            data-animation={String(options?.chart?.animation)}
            data-series-animation={String(options?.plotOptions?.series?.animation)}
            data-y-axis-count={String(options?.yAxis?.length)}
            data-series-axes={options?.series?.map(({ type, yAxis }) => `${type}:${yAxis}`).join(",")}
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

describe("DualAxisChart", () => {
    const categories = ["Segment", "Segment", "Segment", "Segment"];
    const series: IDualAxisChartSeries[] = [
        { name: "Channel 1", type: "line", data: [30, 35, 32, 38], color: "#b91c1c" },
        { name: "Channel 2", type: "column", data: [150, 250, 80, 280], color: "#0057b8" }
    ];

    const mountDualAxisChart = (props = {}) =>
        mount(<DualAxisChart categories={categories} series={series} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    it("renders without crashing", () => {
        const wrapper = mountDualAxisChart();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = mountDualAxisChart({ className });
        expect(wrapper.find(".dualAxisChart").hasClass(className)).toBeTruthy();
    });

    it("renders loading state", () => {
        const wrapper = mountDualAxisChart({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("renders empty state when series has no data", () => {
        const wrapper = mountDualAxisChart({
            series: undefined,
            emptyTitle: "No Data Available",
            emptyDescription: "No data is available for display at this moment."
        });
        expect(wrapper.find(Empty).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("disables chart animations by default", () => {
        const mock = mountDualAxisChart().find(".highcharts-react-mock");
        expect(mock.prop("data-animation")).toBe("false");
        expect(mock.prop("data-series-animation")).toBe("false");
    });

    it("binds columns to the primary and lines to the secondary Y axis", () => {
        const mock = mountDualAxisChart().find(".highcharts-react-mock");
        expect(mock.prop("data-y-axis-count")).toBe("2");
        expect(mock.prop("data-series-axes")).toBe("spline:1,column:0");
    });

    it.each([true, false])("should render legend when showLegend is %s", (showLegend) => {
        const wrapper = mountDualAxisChart({ showLegend });
        expect(wrapper.find(".dualAxisChart__legend").exists()).toBe(showLegend);
    });
});
