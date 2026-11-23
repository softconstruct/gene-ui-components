import React from "react";
import { mount } from "enzyme";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import ChartLegend from "@internal/components/ChartLegend";

import DonutChart, { IDonutChartProps } from "./index";

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({
        options
    }: {
        options: {
            chart?: { animation?: boolean; type?: string };
            plotOptions?: { series?: { animation?: boolean }; pie?: { innerSize?: string; borderWidth?: number } };
            series?: { data: { y: number; visible: boolean }[] }[];
        };
    }) => (
        <div
            className="highcharts-react-mock"
            data-animation={String(options?.chart?.animation)}
            data-series-animation={String(options?.plotOptions?.series?.animation)}
            data-type={options?.chart?.type}
            data-inner-size={options?.plotOptions?.pie?.innerSize}
            data-border-width={options?.plotOptions?.pie?.borderWidth}
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

describe("DonutChart", () => {
    const series = [
        { name: "Channel 1", value: 40, color: "#b91c1c" },
        { name: "Channel 2", value: 60, color: "#0057b8" }
    ];

    const mountDonutChart = (props: IDonutChartProps = {}) =>
        mount(<DonutChart series={series} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    it("should render without crashing", () => {
        const wrapper = mountDonutChart();
        expect(wrapper.find(".donutChart").exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("should render className prop correctly", () => {
        expect(mountDonutChart({ className: "test-class" }).find(".donutChart").hasClass("test-class")).toBeTruthy();
    });

    it("should render series prop as a pie with a hole", () => {
        const mock = mountDonutChart().find(".highcharts-react-mock");
        expect(mock.prop("data-type")).toBe("pie");
        expect(mock.prop("data-inner-size")).toBe("60%");
        expect(mock.prop("data-values")).toBe("40,60");
    });

    it("should merge options prop over the donut defaults", () => {
        const mock = mountDonutChart({ options: { plotOptions: { pie: { innerSize: "80%" } } } }).find(
            ".highcharts-react-mock"
        );
        expect(mock.prop("data-inner-size")).toBe("80%");
        expect(mock.prop("data-border-width")).toBe(2);
    });

    it("should render loading state", () => {
        const wrapper = mountDonutChart({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it.each([undefined, [], [{ name: "Channel 1", value: 0 }]])(
        "should render empty state when series is %p",
        (emptySeries) => {
            const wrapper = mountDonutChart({ series: emptySeries, emptyTitle: "No Data Available" });
            expect(wrapper.find(Empty).exists()).toBeTruthy();
            expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
        }
    );

    it("should render showLegend prop correctly", () => {
        expect(mountDonutChart().find(ChartLegend).exists()).toBeTruthy();
        expect(mountDonutChart({ showLegend: false }).find(ChartLegend).exists()).toBeFalsy();
    });

    it("should toggle a slice when its legend item is clicked", () => {
        const wrapper = mountDonutChart();
        wrapper.find(".chartLegend__button").first().simulate("click");
        expect(wrapper.find(".highcharts-react-mock").prop("data-visible")).toBe("false,true");
    });

    it("should disable chart animations by default", () => {
        const mock = mountDonutChart().find(".highcharts-react-mock");
        expect(mock.prop("data-animation")).toBe("false");
        expect(mock.prop("data-series-animation")).toBe("false");
    });
});
