import React from "react";
import { mount } from "enzyme";
import useDebouncedCallback from "./index";

jest.useFakeTimers();

describe("useDebouncedCallback", () => {
    it("should debounce the function call", () => {
        const mockFunc = jest.fn();
        const wait = 500;

        function Component() {
            const debouncedFunc = useDebouncedCallback(mockFunc, wait);
            return (
                <button type="button" onClick={() => debouncedFunc("test")}>
                    Click me
                </button>
            );
        }

        const wrapper = mount(<Component />);

        wrapper.find("button").simulate("click");

        expect(mockFunc).not.toHaveBeenCalled();

        jest.advanceTimersByTime(wait);

        expect(mockFunc).toHaveBeenCalledTimes(1);
        expect(mockFunc).toHaveBeenCalledWith("test");
    });

    it("should reset the timer if called multiple times within the wait time", () => {
        const mockFunc = jest.fn();
        const wait = 500;

        function Component() {
            const debouncedFunc = useDebouncedCallback(mockFunc, wait);
            return (
                <button type="button" onClick={() => debouncedFunc("test")}>
                    Click me
                </button>
            );
        }

        const wrapper = mount(<Component />);

        wrapper.find("button").simulate("click");
        jest.advanceTimersByTime(300);
        wrapper.find("button").simulate("click");

        jest.advanceTimersByTime(500);

        expect(mockFunc).toHaveBeenCalledTimes(1);
        expect(mockFunc).toHaveBeenCalledWith("test");
    });
});
