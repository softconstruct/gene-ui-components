import React from "react";
import { mount } from "enzyme";
import useScrollLock from "./useScrollLock";

describe("useScrollLock", () => {
    function TestComponent() {
        const { lock, unlock } = useScrollLock(document.body);

        return (
            <div>
                <button type="button" id="lock-button" onClick={lock}>
                    Lock Body
                </button>

                <button type="button" id="unlock-button" onClick={unlock}>
                    Unlock Body
                </button>
            </div>
        );
    }

    it("should lock and unlock scroll on body when lock/unlock are called", () => {
        const wrapper = mount(<TestComponent />);
        const lockButton = wrapper.find("#lock-button");
        const unlockButton = wrapper.find("#unlock-button");

        // Initially, the body shouldn't have the class
        expect(document.body.classList.contains("scroll-lock")).toBe(false);

        // Simulate clicking the "Lock Body" button
        lockButton.simulate("click");
        expect(document.body.classList.contains("scroll-lock")).toBe(true);

        // Simulate clicking the "Unlock Body" button
        unlockButton.simulate("click");
        expect(document.body.classList.contains("scroll-lock")).toBe(false);

        wrapper.unmount();
    });

    it("should automatically unlock on unmount if the body is locked", () => {
        // In this test component, we lock the body immediately upon mount
        function LockOnMount() {
            const { lock } = useScrollLock(document.body);
            React.useEffect(() => {
                lock();
            }, [lock]);
            return <div>Locking body on mount...</div>;
        }

        const wrapper = mount(<LockOnMount />);
        expect(document.body.classList.contains("scroll-lock")).toBe(true);

        // Unmount the component
        wrapper.unmount();

        // The class should be removed automatically
        expect(document.body.classList.contains("scroll-lock")).toBe(false);
    });
});
