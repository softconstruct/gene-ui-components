import React, { FC } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import useWindowSize from "./useWindowSize";

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
        wrapper = mount(<TestComponent />);
        window.innerWidth = 1024;
        window.innerHeight = 768;
    });

    it("should initialize with window dimensions", () => {
        const width = wrapper.find('[data-testid="width"]').text();
        const height = wrapper.find('[data-testid="height"]').text();

        expect(+width).toBe(1024);
        expect(+height).toBe(768);
    });

    it("should update dimensions on window resize", () => {
        act(() => {
            window.innerWidth = 800;
            window.innerHeight = 600;
            window.dispatchEvent(new Event("resize"));
        });

        wrapper.update();

        const width = wrapper.find('[data-testid="width"]').text();
        const height = wrapper.find('[data-testid="height"]').text();
        expect(+width).toBe(800);
        expect(+height).toBe(600);
    });
});
