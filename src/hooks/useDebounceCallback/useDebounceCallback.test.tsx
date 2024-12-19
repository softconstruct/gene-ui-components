import React from "react";
import { mount } from "enzyme";
import useDebouncedCallback from "./index";

jest.useFakeTimers();

describe("useDebouncedCallback", () => {
    it("should debounce the function call", () => {
        const mockFunc = jest.fn();
        const wait = 500;

        function Component() {
            const { debouncedCallback: debouncedFunc } = useDebouncedCallback(mockFunc, wait);
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
            const { debouncedCallback } = useDebouncedCallback(mockFunc, wait);
            return (
                <button type="button" onClick={() => debouncedCallback("test")}>
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

    it("should clearDebounce", () => {
        const mockFunc = jest.fn();
        const wait = 500;

        function Component() {
            const { debouncedCallback: debouncedFunc, clearDebounce } = useDebouncedCallback(mockFunc, wait);
            return (
                <>
                    <button type="button" onClick={() => debouncedFunc("test")}>
                        Click me
                    </button>
                    <button type="button" onClick={clearDebounce}>
                        clearDebounce
                    </button>
                </>
            );
        }

        const wrapper = mount(<Component />);

        wrapper.find("button").at(0).simulate("click");

        wrapper.find("button").at(1).simulate("click");

        jest.advanceTimersByTime(wait);

        expect(mockFunc).not.toHaveBeenCalled();
    });
});
