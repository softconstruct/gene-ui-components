import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import Scrollbar, { IScrollbarProps } from "./index";

describe("Scrollbar ", () => {
    let setup: ReactWrapper<IScrollbarProps>;
    const TestComponent = () => <span>test</span>;
    beforeEach(() => {
        setup = mount(
            <Scrollbar>
                <TestComponent />
            </Scrollbar>
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
        const children = <span>test children</span>;
        const wrapper = setup.setProps({ children });

        expect(wrapper.contains("test children")).toBeTruthy();
    });

    it("keeps the track visible while the thumb is grabbed", () => {
        jest.useFakeTimers();
        const thumbYProps = setup.find("Scrollbar").prop("thumbYProps") as {
            onDragStart: () => void;
            onDragEnd: () => void;
        };

        act(() => {
            thumbYProps.onDragStart();
            jest.advanceTimersByTime(1100);
        });
        setup.update();

        expect(setup.find(".scrollbar__track_direction_y").first().hasClass("scrollbar__track_active")).toBeTruthy();

        act(() => {
            thumbYProps.onDragEnd();
            jest.advanceTimersByTime(1100);
        });
        setup.update();

        expect(setup.find(".scrollbar__track_direction_y").first().hasClass("scrollbar__track_active")).toBeFalsy();

        jest.useRealTimers();
    });
});
