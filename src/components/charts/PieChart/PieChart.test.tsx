import React from "react";
import { mount } from "enzyme";

import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import ChartLegend from "@internal/components/ChartLegend";

import PieChart from "./index";

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({
        options
    }: {
        options: {
            chart?: { animation?: boolean; type?: string };
            plotOptions?: { series?: { animation?: boolean } };
            series?: { data: { y: number; visible: boolean }[] }[];
        };
    }) => (
        <div
            className="highcharts-react-mock"
            data-animation={String(options?.chart?.animation)}
            data-series-animation={String(options?.plotOptions?.series?.animation)}
            data-type={options?.chart?.type}
            data-values={options?.series?.[0]?.data.map(({ y }) => y).join(",")}
            data-visible={options?.series?.[0]?.data.map(({ visible }) => visible).join(",")}
        />
    );

    return {
        __esModule: true,
        default: MockHighchartsReact
    };
});

jest.mock("highcharts", () => ({}));

describe("PieChart", () => {
    const series = [
        { name: "Channel 1", value: 40, color: "#b91c1c" },
        { name: "Channel 2", value: 60, color: "#0057b8" }
    ];

    const mountPieChart = (props = {}) =>
        mount(<PieChart series={series} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    it("renders without crashing", () => {
        const wrapper = mountPieChart();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("renders series prop correctly", () => {
        const mock = mountPieChart().find(".highcharts-react-mock");
        expect(mock.prop("data-type")).toBe("pie");
        expect(mock.prop("data-values")).toBe("40,60");
    });

    it("renders loading state", () => {
        const wrapper = mountPieChart({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it.each([undefined, [], [{ name: "Channel 1", value: 0 }]])(
        "renders empty state when series is %p",
        (emptySeries) => {
            const wrapper = mountPieChart({ series: emptySeries, emptyTitle: "No Data Available" });
            expect(wrapper.find(Empty).exists()).toBeTruthy();
            expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
        }
    );

    it("renders showLegend prop correctly", () => {
        expect(mountPieChart().find(ChartLegend).exists()).toBeTruthy();
        expect(mountPieChart({ showLegend: false }).find(ChartLegend).exists()).toBeFalsy();
    });

    it("toggles a slice when its legend item is clicked", () => {
        const wrapper = mountPieChart();
        wrapper.find(".chartLegend__button").first().simulate("click");
        expect(wrapper.find(".highcharts-react-mock").prop("data-visible")).toBe("false,true");
    });

    it("disables chart animations by default", () => {
        const mock = mountPieChart().find(".highcharts-react-mock");
        expect(mock.prop("data-animation")).toBe("false");
        expect(mock.prop("data-series-animation")).toBe("false");
    });
});
