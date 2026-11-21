import React from "react";
import { mount } from "enzyme";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import HeatMap, { IHeatMapProps } from "./index";

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({ options }: { options: Record<string, unknown> }) => (
        <div className="highcharts-react-mock" data-options={JSON.stringify(options)} />
    );

    return {
        __esModule: true,
        default: MockHighchartsReact
    };
});

describe("HeatMap", () => {
    const categories = ["Monday", "Tuesday"];
    const series = [
        { name: "01:00", data: [10, 20] },
        { name: "02:00", data: [30, null] }
    ];
    const color = "#0057b8";

    const mountHeatMap = (props: Partial<IHeatMapProps> = {}) =>
        mount(<HeatMap categories={categories} series={series} color={color} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    const getOptions = (wrapper: ReturnType<typeof mountHeatMap>) =>
        JSON.parse(wrapper.find(".highcharts-react-mock").prop("data-options"));

    it("should render without crashing", () => {
        const wrapper = mountHeatMap();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("should render className prop correctly", () => {
        const wrapper = mountHeatMap({ className: "test-class" });
        expect(wrapper.find(".heatMap").hasClass("test-class")).toBeTruthy();
    });

    it("should render series prop correctly", () => {
        const options = getOptions(mountHeatMap());

        expect(options.chart.type).toBe("heatmap");
        // series[rowIndex].data[columnIndex] -> [x, y, value]
        expect(options.series[0].data).toEqual([
            [0, 0, 10],
            [1, 0, 20],
            [0, 1, 30],
            [1, 1, null]
        ]);
        expect(options.xAxis.categories).toEqual(categories);
        expect(options.yAxis.categories).toEqual(["01:00", "02:00"]);
    });

    it("should render min and max props correctly", () => {
        const { colorAxis } = getOptions(mountHeatMap({ min: 0, max: 100 }));

        expect(colorAxis.min).toBe(0);
        expect(colorAxis.max).toBe(100);
        expect(colorAxis.maxColor).toBe(color);
        expect(colorAxis.minColor).toBe("rgba(0,87,184,0.1)");
    });

    it.each([true, false])("should have %s showLegend", (showLegend) => {
        expect(getOptions(mountHeatMap({ showLegend })).legend.enabled).toBe(showLegend);
    });

    it("should render subtitle prop correctly", () => {
        const wrapper = mountHeatMap({ subtitle: "Subtitle" });
        expect(wrapper.find(".heatMap__subtitle").first().text()).toBe("Subtitle");
    });

    it("should render loading state", () => {
        const wrapper = mountHeatMap({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("should render empty state when series has no data", () => {
        const wrapper = mountHeatMap({ series: undefined, emptyTitle: "No Data Available" });
        expect(wrapper.find(Empty).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it("should disable chart animations by default", () => {
        const options = getOptions(mountHeatMap());
        expect(options.chart.animation).toBe(false);
        expect(options.plotOptions.series.animation).toBe(false);
    });
});
