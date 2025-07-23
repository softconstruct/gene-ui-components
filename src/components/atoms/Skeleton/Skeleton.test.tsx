import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Skeleton, { ISkeletonProps } from "./index";

describe("Skeleton ", () => {
    let setup: ReactWrapper<ISkeletonProps>;
    beforeEach(() => {
        setup = mount(<Skeleton />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders width prop correctly", () => {
        const width = 120;
        const wrapper = setup.setProps({ width });
        expect(wrapper.find(".skeleton").props().style?.width).toBe(width);
    });

    it("renders height prop correctly", () => {
        const height = 120;
        const wrapper = setup.setProps({ height });
        expect(wrapper.find(".skeleton").props().style?.height).toBe(height);
    });

    it("renders flex prop correctly", () => {
        const wrapper = setup.setProps({ flex: true });
        expect(wrapper.find(".skeleton_flex").exists()).toBeTruthy();
    });

    it("renders inverse prop correctly", () => {
        const wrapper = setup.setProps({ inverse: true });
        expect(wrapper.find(".skeleton_backInverse").exists()).toBeTruthy();
    });

    it.each<ISkeletonProps["rounded"]>(["circle", "rounded2X", "rounded3X", "rounded4X"])(
        "should have %p rounded",
        (rounded) => {
            const wrapper = setup.setProps({ rounded });
            expect(wrapper.find(`.skeleton_${rounded}`).exists()).toBeTruthy();
        }
    );
});
