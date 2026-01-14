import React, { useRef } from "react";
import { mount } from "enzyme";

import useClickOutside from "./index";

describe("useClickOutside", () => {
    it("should not call the callback when clicking on target", () => {
        const mockCallback = jest.fn();

        function Component() {
            const relativeRef = useRef(null);
            const ref = useClickOutside(() => {
                mockCallback();
            }, [relativeRef]);

            return (
                <div>
                    <div data-testid="dropdown" ref={ref} style={{ border: "1px solid black", padding: "10px" }}>
                        This is a dropdown
                    </div>
                    <span data-testid="relative" ref={relativeRef}>
                        Relative Element
                    </span>
                </div>
            );
        }

        const wrapper = mount(<Component />);

        wrapper.simulate("click");

        expect(mockCallback).not.toHaveBeenCalled();
    });

    it("should not call the callback when clicking inside", () => {
        const mockCallback = jest.fn();

        function Component() {
            const ref = useClickOutside(mockCallback);
            return (
                <div data-testid="inside" ref={ref}>
                    Inside
                </div>
            );
        }

        const wrapper = mount(<Component />);

        wrapper.find('[data-testid="inside"]').simulate("mousedown");

        expect(mockCallback).not.toHaveBeenCalled();
    });

    it("should not call the callback when clicking a relative element", () => {
        const mockCallback = jest.fn();

        function Component() {
            const relativeRef = useRef(null);
            const ref = useClickOutside(mockCallback, [relativeRef]);

            return (
                <div>
                    <div data-testid="dropdown" ref={ref}>
                        Dropdown
                    </div>
                    <span data-testid="relative" ref={relativeRef}>
                        Relative
                    </span>
                </div>
            );
        }

        const wrapper = mount(<Component />);

        wrapper.find('[data-testid="relative"]').simulate("mousedown");

        expect(mockCallback).not.toHaveBeenCalled();
    });

    it("should call the callback when clicking outside the component", () => {
        const mockCallback = jest.fn();

        function Component() {
            const ref = useClickOutside(mockCallback);
            return (
                <div>
                    <div data-testid="dropdown" ref={ref}>
                        Dropdown
                    </div>
                </div>
            );
        }

        mount(<Component />);

        document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("should call the callback when clicking outside the component with only relative ref", () => {
        const mockCallback = jest.fn();

        function Component() {
            const ref = useRef(null);
            useClickOutside(mockCallback, [ref]);
            return (
                <div>
                    <div data-testid="dropdown" ref={ref}>
                        Dropdown
                    </div>
                </div>
            );
        }

        mount(<Component />);

        document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback when clicking a relative element with only relative element", () => {
        const mockCallback = jest.fn();

        function Component() {
            const relativeRef = useRef(null);
            useClickOutside(mockCallback, [relativeRef]);

            return (
                <div>
                    <span data-testid="relative" ref={relativeRef}>
                        Relative
                    </span>
                </div>
            );
        }

        const wrapper = mount(<Component />);

        wrapper.find('[data-testid="relative"]').simulate("mousedown");

        expect(mockCallback).not.toHaveBeenCalled();
    });
});
