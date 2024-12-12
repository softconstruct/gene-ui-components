import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Carousel, { ICarouselProps } from "./index";

describe("Carousel ", () => {
    let setup: ReactWrapper<ICarouselProps>;
    beforeEach(() => {
        setup = mount(<Carousel />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    // Your tests here
});
