import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Timelines, { ITimelinesProps } from "./Timeline";
// Components
import TimelinePoint, { ITimelinePointProps } from "./TimelinePoint";

describe("Timeline ", () => {
    let setup: ReactWrapper<ITimelinesProps>;
    beforeEach(() => {
        setup = mount(
            <Timelines direction="vertical">
                <TimelinePoint title="Task A" description="Description A" status="active" />
            </Timelines>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders children prop correctly", () => {
        expect(setup.find(TimelinePoint)).toBeTruthy();
    });

    it.each<ITimelinesProps["direction"]>(["vertical", "horizontal"])('should have "%s" direction', (direction) => {
        const wrapper = setup.setProps({ direction });

        expect(wrapper.find(".timeline").hasClass(`timeline_direction_${direction}`)).toBeTruthy();
    });

    it.each<ITimelinesProps["position"]>(["after", "before", "alternate"])(
        'should have "%s" position for vertical direction ',
        (position) => {
            const wrapper = setup.setProps({ position, direction: "vertical" });

            expect(wrapper.find(".timeline").hasClass(`timeline_position_${position}`)).toBeTruthy();
        }
    );

    it.each<ITimelinesProps["position"]>(["after", "before", "alternate"])(
        'should have "%s" direction for horizontal direction ',
        (position) => {
            const wrapper = setup.setProps({ position, direction: "horizontal" });

            expect(wrapper.find(".timeline").hasClass(`timeline_position_${position}`)).toBeTruthy();
        }
    );

    it.each<ITimelinePointProps["status"]>(["default", "active", "success", "error", "pending"])(
        'should have "%s" direction',
        (status) => {
            const wrapper = mount(<TimelinePoint status={status} title="Test1" description="Description 1" />);
            expect(wrapper.find(".timeline__status").hasClass(`timeline__status_${status}`)).toBeTruthy();
        }
    );

    it("renders title correctly", () => {
        const title = "Test1";
        const wrapper = mount(<TimelinePoint title={title} status="success" description="Description 1" />);

        expect(wrapper.find(".timeline__title").text()).toBe(title);
    });

    it("renders description correctly", () => {
        const description = "Description 1";
        const wrapper = mount(<TimelinePoint status="success" title="Test1" description={description} />);

        expect(wrapper.find(".timeline__description").text()).toBe(description);
    });
});
