import React from "react";
import { mount } from "enzyme";
import Highcharts from "highcharts";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import ChartLegend from "@internal/components/ChartLegend";

import TreeMap from "./index";

interface IMockPoint {
    name: string;
    value?: number;
    parent?: string;
}

jest.mock("highcharts-react-official", () => {
    const MockHighchartsReact = ({
        options
    }: {
        options: {
            chart?: { animation?: boolean; type?: string };
            plotOptions?: { series?: { animation?: boolean } };
            series?: { data: IMockPoint[] }[];
        };
    }) => (
        <div
            className="highcharts-react-mock"
            data-animation={String(options?.chart?.animation)}
            data-series-animation={String(options?.plotOptions?.series?.animation)}
            data-type={options?.chart?.type}
            data-points={options?.series?.[0]?.data
                .map(({ name, value, parent }) => `${parent ? `${parent}>` : ""}${name}:${value}`)
                .join(",")}
        />
    );

    return {
        __esModule: true,
        default: MockHighchartsReact
    };
});

jest.mock("highcharts", () => ({
    seriesTypes: { treemap: { prototype: {} } },
    color: (input: string) => ({ tweenTo: () => `tint(${input})` })
}));

jest.mock("highcharts/modules/treemap", () => jest.fn());

describe("TreeMap", () => {
    const series = [
        { name: "Channel 1", value: 40, color: "#b91c1c" },
        { name: "Channel 2", value: 60, color: "#0057b8" }
    ];

    const mountTreeMap = (props = {}) =>
        mount(<TreeMap series={series} {...props} />, {
            wrappingComponent: GeneUIProvider
        });

    it("should render without crashing", () => {
        const wrapper = mountTreeMap();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeTruthy();
    });

    it("should render className prop correctly", () => {
        expect(mountTreeMap({ className: "test-class" }).find(".treeMap").hasClass("test-class")).toBeTruthy();
    });

    it("should render series prop correctly", () => {
        const mock = mountTreeMap().find(".highcharts-react-mock");
        expect(mock.prop("data-type")).toBe("treemap");
        expect(mock.prop("data-points")).toBe("Channel 1:40,Channel 2:60");
    });

    it("should render subChannels as children of their channel", () => {
        const wrapper = mountTreeMap({
            series: [
                {
                    name: "Channel 1",
                    color: "#b91c1c",
                    subChannels: [
                        { name: "Sub channel 1", value: 30 },
                        { name: "Sub channel 2", value: 10 }
                    ]
                },
                series[1]
            ]
        });

        expect(wrapper.find(".highcharts-react-mock").prop("data-points")).toBe(
            "Channel 1:undefined,channel-0>Sub channel 1:30,channel-0>Sub channel 2:10,Channel 2:60"
        );
    });

    it("should render loading state", () => {
        const wrapper = mountTreeMap({ loading: true, loadingText: "Loading Info" });
        expect(wrapper.find(Loader).exists()).toBeTruthy();
        expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
    });

    it.each([undefined, [], [{ name: "Channel 1", value: 0 }], [{ name: "Channel 1", subChannels: [] }]])(
        "should render empty state when series is %p",
        (emptySeries) => {
            const wrapper = mountTreeMap({ series: emptySeries, emptyTitle: "No Data Available" });
            expect(wrapper.find(Empty).exists()).toBeTruthy();
            expect(wrapper.find(".highcharts-react-mock").exists()).toBeFalsy();
        }
    );

    it("should render showLegend prop correctly", () => {
        expect(mountTreeMap().find(ChartLegend).exists()).toBeTruthy();
        expect(mountTreeMap({ showLegend: false }).find(ChartLegend).exists()).toBeFalsy();
    });

    it("should hide a channel when its legend item is clicked", () => {
        const wrapper = mountTreeMap();
        wrapper.find(".chartLegend__button").first().simulate("click");
        expect(wrapper.find(".highcharts-react-mock").prop("data-points")).toBe("Channel 2:60");
    });

    it("should disable chart animations by default", () => {
        const mock = mountTreeMap().find(".highcharts-react-mock");
        expect(mock.prop("data-animation")).toBe("false");
        expect(mock.prop("data-series-animation")).toBe("false");
    });

    it("should lay sub-channels out inside the channel frame", () => {
        const { geneUISubChannels } = (
            Highcharts as unknown as {
                seriesTypes: {
                    treemap: { prototype: Record<string, (this: object, area: object, children: []) => object[]> };
                };
            }
        ).seriesTypes.treemap.prototype;
        const treemapSeries = { yAxis: { len: 200 }, squarified: (area: object) => [area] };

        expect(geneUISubChannels.call(treemapSeries, { x: 0, y: 0, width: 100, height: 100 }, [])).toEqual([
            { x: 8, y: 18, width: 84, height: 74 }
        ]);
        expect(geneUISubChannels.call(treemapSeries, { x: 0, y: 0, width: 100, height: 20 }, [])).toEqual([
            { x: 0, y: 0, width: 100, height: 20 }
        ]);
    });
});
