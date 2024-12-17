import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Carousel, { ICarouselProps } from "./index";

const content = Array.from(Array(10).keys()).map((index) => (
    <div key={index} className="test-content">
        {index}
    </div>
));

describe("Carousel ", () => {
    let setup: ReactWrapper<ICarouselProps>;

    beforeEach(() => {
        setup = mount(<Carousel>{content}</Carousel>);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it.each<ICarouselProps["direction"]>(["horizontal", "vertical"])("should have %s direction", (direction) => {
        const wrapper = setup.setProps({ direction });
        expect(wrapper.find(".carousel").hasClass(`carousel_${direction}`)).toBeTruthy();
    });

    it.each<ICarouselProps["size"]>(["large", "small"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(".carousel").hasClass(`carousel_${size}`)).toBeTruthy();
    });

    it("slides forward when forward button is clicked", () => {
        expect(setup.find(".test-content").text()).toEqual("0");
        setup.find(".carousel__button .carousel__button_forward").simulate("click");
        expect(setup.find(".test-content").text()).toEqual("1");
    });

    it("slides back when back button is clicked", () => {
        setup.find(".carousel__button .carousel__button_forward").simulate("click");
        expect(setup.find(".test-content").text()).toEqual("1");
        setup.find(".carousel__button .carousel__button_back").simulate("click");
        expect(setup.find(".test-content").text()).toEqual("0");
    });

    it("renders dot selection when slide changes", () => {
        expect(setup.find(".carousel__dots").childAt(0).hasClass("carousel__dot_active")).toBeTruthy();
        expect(setup.find(".carousel__dots").childAt(1).hasClass("carousel__dot_active")).toBeFalsy();
        setup.find(".carousel__button .carousel__button_forward").simulate("click");
        expect(setup.find(".carousel__dots").childAt(0).hasClass("carousel__dot_active")).toBeFalsy();
        expect(setup.find(".carousel__dots").childAt(1).hasClass("carousel__dot_active")).toBeTruthy();
    });
});
