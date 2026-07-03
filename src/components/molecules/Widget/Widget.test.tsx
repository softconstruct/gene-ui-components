import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ArrowBounceDown, ArrowBounceUp, Globe } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
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

    it("renders header with Label and Button", () => {
        const wrapper = setup.setProps({ title: "Title" });
        expect(wrapper.find(".widget__header").exists()).toBeTruthy();
        expect(wrapper.find("Label").exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
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

    it("renders percent wrapper in current implementation", () => {
        expect(setup.find(".widget__trendWrapper").exists()).toBeTruthy();
        expect(setup.find(".widget__trendWrapper").text()).toContain("-32%");
    });

    it("renders complete widget with all props", () => {
        const swappableElement = <span>Swap content</span>;
        const wrapper = mount(
            <Widget
                className="custom-widget"
                title="Complete Widget"
                infoText="Additional info"
                value="$ 999"
                trend="up"
                Icon={Globe}
                swappableElement={swappableElement}
            />
        );

        expect(wrapper.find(".widget").hasClass("custom-widget")).toBeTruthy();
        expect(wrapper.find("Label").prop("text")).toBe("Complete Widget");
        expect(wrapper.find("Label").prop("infoText")).toBe("Additional info");
        expect(wrapper.find(".widget__values").text()).toContain("$ 999");
        expect(wrapper.find(ArrowBounceUp).exists()).toBeTruthy();
        expect(wrapper.find(Globe).exists()).toBeTruthy();
        expect(wrapper.find(".widget__swap").text()).toContain("Swap content");
    });
});
