import React from "react";
import { mount } from "enzyme";

import GeneUIProvider from "@components/providers/GeneUIProvider";

import ChartLegend from "./index";

describe("ChartLegend", () => {
    const items = [
        { name: "Channel 1", color: "red" },
        { name: "Channel 2", color: "green" },
        { name: "Channel 3", color: "blue" }
    ];

    // jsdom has no layout: report every item after the first as wrapped onto a second row.
    const offsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetTop");

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "offsetTop", {
            configurable: true,
            get() {
                return this.previousElementSibling ? 10 : 0;
            }
        });
    });

    afterAll(() => {
        if (offsetTop) Object.defineProperty(HTMLElement.prototype, "offsetTop", offsetTop);
    });

    const mountLegend = (props = {}) =>
        mount(<ChartLegend items={items} {...props} />, { wrappingComponent: GeneUIProvider });

    it("renders without crashing", () => {
        expect(mountLegend().find(".chartLegend").exists()).toBe(true);
    });

    it("renders showMoreText and showLessText props correctly", () => {
        const wrapper = mountLegend({
            showMoreText: (hiddenCount: number) => `${hiddenCount} more`,
            showLessText: "Less"
        });

        expect(wrapper.find("button.chartLegend__toggle").text()).toBe("2 more");

        wrapper.find("button.chartLegend__toggle").simulate("click");

        expect(wrapper.find("button.chartLegend__toggle").text()).toBe("Less");
    });

    it("renders default toggle text", () => {
        const wrapper = mountLegend();

        expect(wrapper.find("button.chartLegend__toggle").text()).toBe("Show 2 more");

        wrapper.find("button.chartLegend__toggle").simulate("click");

        expect(wrapper.find("button.chartLegend__toggle").text()).toBe("Show less");
    });
});
