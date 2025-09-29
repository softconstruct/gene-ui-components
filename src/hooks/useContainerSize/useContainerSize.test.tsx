import React, { FC, LegacyRef } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import useContainerSize from "./useContainerSize";

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
let mockCallback: ((entries: ResizeObserverEntry[], observer: ResizeObserver) => void) | null = null;

afterEach(() => {
    jest.clearAllMocks();
    mockCallback = null;
});

const TestComponent: FC<{ observeResize?: boolean }> = ({ observeResize = true }) => {
    const { containerRef, sizes } = useContainerSize({ observeResize });
    return (
        <div
            ref={containerRef as LegacyRef<HTMLDivElement>}
            data-testid="container"
            style={{ width: "300px", height: "200px" }}
        >
            <div data-testid="width">{sizes.width}</div>
            <div data-testid="height">{sizes.height}</div>
        </div>
    );
};

describe("useContainerSize", () => {
    let wrapper: ReactWrapper;
    beforeAll(() => {
        global.ResizeObserver = class ResizeObserver {
            constructor(callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void) {
                mockCallback = callback as typeof mockCallback;
            }

            observe = mockObserve;

            unobserve = jest.fn();

            disconnect = mockDisconnect;
        };
    });

    beforeEach(() => {
        wrapper = mount(<TestComponent />);
        const container = wrapper.find('[data-testid="container"]').getDOMNode() as HTMLElement;
        Object.defineProperty(container, "offsetWidth", { value: 300, configurable: true });
        Object.defineProperty(container, "offsetHeight", { value: 200, configurable: true });
    });

    it("should initialize with zero sizes", () => {
        expect(wrapper.find('[data-testid="width"]').text()).toBe("0");
        expect(wrapper.find('[data-testid="height"]').text()).toBe("0");
    });

    it("should observe resize when observeResize is true", () => {
        const container = wrapper.find('[data-testid="container"]').getDOMNode();

        expect(mockObserve).toHaveBeenCalledWith(container);
    });

    it("should disconnect ResizeObserver on unmount", () => {
        wrapper.unmount();
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it("should update sizes when ResizeObserver triggers", () => {
        act(() => {
            if (mockCallback) {
                mockCallback([], {} as ResizeObserver);
            }
        });

        wrapper.update();
        expect(wrapper.find('[data-testid="width"]').text()).toBe("300");
        expect(wrapper.find('[data-testid="height"]').text()).toBe("200");
    });
});
