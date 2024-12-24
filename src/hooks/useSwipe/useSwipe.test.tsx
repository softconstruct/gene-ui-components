import React from "react";
import { mount, ReactWrapper } from "enzyme";
import useSwipe from "./useSwipe";

const simulateTouchEvent = (wrapper: ReactWrapper, eventType: string, clientX: number, clientY: number) => {
    const touch = {
        clientX,
        clientY,
        force: 1,
        identifier: 1,
        pageX: clientX,
        pageY: clientY,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        screenX: clientX,
        screenY: clientY,
        target: wrapper.getDOMNode()
    };

    const event = new TouchEvent(eventType, {
        touches: [touch],
        changedTouches: [touch],
        targetTouches: [touch]
    });

    wrapper.getDOMNode().dispatchEvent(event);
};

describe("useSwipe Hook", () => {
    let setup: ReactWrapper;

    let onSlideLeft: jest.Mock;
    let onSlideRight: jest.Mock;
    let onSlideUp: jest.Mock;
    let onSlideDown: jest.Mock;

    beforeEach(() => {
        onSlideLeft = jest.fn();
        onSlideRight = jest.fn();
        onSlideUp = jest.fn();
        onSlideDown = jest.fn();

        const TestComponent = () => {
            const ref = useSwipe<HTMLDivElement>({
                onSlideLeft,
                onSlideRight,
                onSlideUp,
                onSlideDown
            });

            return <div id="carousel" ref={ref} style={{ width: "200px", height: "200px" }} />;
        };
        setup = mount(<TestComponent />);
    });

    it("slides right", () => {
        simulateTouchEvent(setup, "touchstart", 150, 100);
        simulateTouchEvent(setup, "touchmove", 90, 100);
        simulateTouchEvent(setup, "touchend", 90, 100);

        expect(onSlideRight).toHaveBeenCalled();
    });

    it("slides left", () => {
        simulateTouchEvent(setup, "touchstart", 90, 100);
        simulateTouchEvent(setup, "touchmove", 150, 100);
        simulateTouchEvent(setup, "touchend", 150, 100);

        expect(onSlideLeft).toHaveBeenCalled();
    });

    it("slides down", () => {
        simulateTouchEvent(setup, "touchstart", 100, 150);
        simulateTouchEvent(setup, "touchmove", 100, 90);
        simulateTouchEvent(setup, "touchend", 100, 90);

        expect(onSlideDown).toHaveBeenCalled();
    });

    it("slides up", () => {
        simulateTouchEvent(setup, "touchstart", 100, 90);
        simulateTouchEvent(setup, "touchmove", 100, 150);
        simulateTouchEvent(setup, "touchend", 100, 150);

        expect(onSlideUp).toHaveBeenCalled();
    });

    it("does not trigger any slide events if movement is below threshold", () => {
        simulateTouchEvent(setup, "touchstart", 100, 100);
        simulateTouchEvent(setup, "touchmove", 110, 110);
        simulateTouchEvent(setup, "touchend", 110, 110);

        expect(onSlideLeft).not.toHaveBeenCalled();
        expect(onSlideRight).not.toHaveBeenCalled();
        expect(onSlideUp).not.toHaveBeenCalled();
        expect(onSlideDown).not.toHaveBeenCalled();
    });
});
