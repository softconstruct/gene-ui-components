import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ArrowBounceDown, ArrowBounceUp, Globe } from "@geneui/icons";

// Components
import Widget, { IWidgetProps } from "@components/molecules/Widget";

describe("Widget", () => {
    let setup: ReactWrapper<IWidgetProps>;

    beforeEach(() => {
        setup = mount(<Widget />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.find(".widget").hasClass(className)).toBeTruthy();
    });

    it("renders title via Label when provided", () => {
        const wrapper = setup.setProps({ title: "Widget Title" });
        expect(wrapper.find("Label").exists()).toBeTruthy();
        expect(wrapper.find("Label").prop("text")).toBe("Widget Title");
    });

    it("renders infoText via Label when provided", () => {
        const wrapper = setup.setProps({ title: "Title", infoText: "Info text" });
        expect(wrapper.find("Label").prop("infoText")).toBe("Info text");
    });

    it("renders header with Label when title is provided", () => {
        const wrapper = setup.setProps({ title: "Title" });
        expect(wrapper.find(".widget__header").exists()).toBeTruthy();
        expect(wrapper.find("Label").exists()).toBeTruthy();
    });

    it("renders header when only infoText is provided", () => {
        const wrapper = setup.setProps({ infoText: "Info text" });

        expect(wrapper.find(".widget__header").exists()).toBeTruthy();
        expect(wrapper.find("Label").prop("infoText")).toBe("Info text");
    });

    it("renders header when only onDetailsClick is provided", () => {
        const onDetailsClick = jest.fn();
        const wrapper = setup.setProps({ onDetailsClick });

        expect(wrapper.find(".widget__header").exists()).toBeTruthy();
        expect(wrapper.find(".widget__header").hasClass("widget__header_noLabel")).toBeTruthy();
        expect(wrapper.find("Label").exists()).toBeFalsy();
        expect(wrapper.find(".widget__detailsButton").exists()).toBeTruthy();
    });

    it("does not render header when title, infoText, and onDetailsClick are not provided", () => {
        expect(setup.find(".widget__header").exists()).toBeFalsy();
        expect(setup.find("Label").exists()).toBeFalsy();
        expect(setup.find(".widget__detailsButton").exists()).toBeFalsy();
    });

    it("renders details button when onDetailsClick is provided", () => {
        const wrapper = setup.setProps({ title: "Title", onDetailsClick: jest.fn() });

        expect(wrapper.find(".widget__detailsButton").exists()).toBeTruthy();
    });

    it("does not render details button when onDetailsClick is not provided", () => {
        const wrapper = setup.setProps({ title: "Title" });

        expect(wrapper.find(".widget__detailsButton").exists()).toBeFalsy();
    });

    it("calls onDetailsClick when details button is clicked", () => {
        const onDetailsClick = jest.fn();
        const wrapper = setup.setProps({ title: "Title", onDetailsClick });

        wrapper.find(".widget__detailsButton").first().simulate("click");

        expect(onDetailsClick).toHaveBeenCalledTimes(1);
    });

    it("renders icon when Icon prop is provided", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(Globe).exists()).toBeTruthy();
        expect(wrapper.find(".widget__iconWrapper").exists()).toBeTruthy();
    });

    it("does not render icon wrapper when Icon is not provided", () => {
        expect(setup.find(".widget__iconWrapper").exists()).toBeFalsy();
    });

    it("renders swappableElement when provided", () => {
        const swappableElement = <div className="custom-swap">Custom content</div>;
        const wrapper = setup.setProps({ swappableElement });
        expect(wrapper.find(".widget__swap").exists()).toBeTruthy();
        expect(wrapper.find(".custom-swap").exists()).toBeTruthy();
        expect(wrapper.find(".custom-swap").text()).toBe("Custom content");
    });

    it("does not render swap area when swappableElement is not provided", () => {
        expect(setup.find(".widget__swap").exists()).toBeFalsy();
    });

    it("renders widget body with info section", () => {
        expect(setup.find(".widget__body").exists()).toBeTruthy();
        expect(setup.find(".widget__info").exists()).toBeTruthy();
    });

    it("renders value when provided", () => {
        const wrapper = setup.setProps({ value: "$ 123" });

        expect(wrapper.find(".widget__values").text()).toContain("$ 123");
    });

    it("does not render value when not provided", () => {
        expect(setup.find(".widget__values h4")).toHaveLength(0);
    });

    it("renders up trend icon when trend is up", () => {
        const wrapper = setup.setProps({ trend: "up" });

        expect(wrapper.find(ArrowBounceUp).exists()).toBeTruthy();
        expect(wrapper.find(".widget__trendIcon_up").exists()).toBeTruthy();
        expect(wrapper.find(ArrowBounceDown).exists()).toBeFalsy();
    });

    it("renders down trend icon when trend is down", () => {
        const wrapper = setup.setProps({ trend: "down" });

        expect(wrapper.find(ArrowBounceDown).exists()).toBeTruthy();
        expect(wrapper.find(".widget__trendIcon_down").exists()).toBeTruthy();
        expect(wrapper.find(ArrowBounceUp).exists()).toBeFalsy();
    });

    it("does not render trend icon when trend is not provided", () => {
        expect(setup.find(ArrowBounceUp).exists()).toBeFalsy();
        expect(setup.find(ArrowBounceDown).exists()).toBeFalsy();
    });

    it("renders trendValue when provided", () => {
        const wrapper = setup.setProps({ trendValue: "-33%" });

        expect(wrapper.find(".widget__trendWrapper").text()).toContain("-33%");
    });

    it("does not render trendValue when not provided", () => {
        expect(setup.find(".widget__trendWrapper").text()).toBe("");
    });

    it("renders trend wrapper in current implementation", () => {
        expect(setup.find(".widget__trendWrapper").exists()).toBeTruthy();
    });

    it("renders complete widget with all props", () => {
        const onDetailsClick = jest.fn();
        const swappableElement = <span>Swap content</span>;
        const wrapper = mount(
            <Widget
                className="custom-widget"
                title="Complete Widget"
                infoText="Additional info"
                value="$ 999"
                trend="up"
                trendValue="+12%"
                Icon={Globe}
                swappableElement={swappableElement}
                onDetailsClick={onDetailsClick}
            />
        );

        expect(wrapper.find(".widget").hasClass("custom-widget")).toBeTruthy();
        expect(wrapper.find("Label").prop("text")).toBe("Complete Widget");
        expect(wrapper.find("Label").prop("infoText")).toBe("Additional info");
        expect(wrapper.find(".widget__values").text()).toContain("$ 999");
        expect(wrapper.find(ArrowBounceUp).exists()).toBeTruthy();
        expect(wrapper.find(".widget__trendWrapper").text()).toContain("+12%");
        expect(wrapper.find(Globe).exists()).toBeTruthy();
        expect(wrapper.find(".widget__swap").text()).toContain("Swap content");
        expect(wrapper.find(".widget__detailsButton").exists()).toBeTruthy();
    });
});
