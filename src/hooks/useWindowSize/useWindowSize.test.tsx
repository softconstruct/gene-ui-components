import React, { FC } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import useWindowSize from "./useWindowSize";

jest.useFakeTimers(); // Enable fake timers for handling debounce delay

const TestComponent: FC = () => {
    const size = useWindowSize();
    return (
        <div>
            <p data-testid="width">{size.width}</p>
            <p data-testid="height">{size.height}</p>
        </div>
    );
};

describe("useWindowSize", () => {
    let wrapper: ReactWrapper;

    beforeEach(() => {
        // Set window size before mounting the component
        window.innerWidth = 1024;
        window.innerHeight = 768;

        wrapper = mount(<TestComponent />);
    });

    it("should initialize with window dimensions", () => {
        act(() => {
            jest.advanceTimersByTime(100); // Wait for debounce effect
        });
        wrapper.update();

        const width = wrapper.find('[data-testid="width"]').text();
        const height = wrapper.find('[data-testid="height"]').text();

        expect(+width).toBe(1024);
        expect(+height).toBe(768);
    });

    it("should update dimensions on window resize with debounce", () => {
        act(() => {
            window.innerWidth = 800;
            window.innerHeight = 600;
            window.dispatchEvent(new Event("resize"));
        });

        // Move time forward to let debounce complete
        act(() => {
            jest.advanceTimersByTime(100);
        });

        wrapper.update(); // Force re-render after debounce timeout

        const width = wrapper.find('[data-testid="width"]').text();
        const height = wrapper.find('[data-testid="height"]').text();

        expect(+width).toBe(800);
        expect(+height).toBe(600);
    });
});
