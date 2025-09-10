import React from "react";
import { mount, ReactWrapper } from "enzyme";

import useDeviceInfo from "@hooks/useDeviceInfo";

import Carousel, { ICarouselProps } from "./index";

// Mock the hooks and context
jest.mock("@hooks/index", () => ({
    useSwipe: jest.fn(() => ({ current: null }))
}));

jest.mock("@hooks/useDeviceInfo", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({})
}));

const content = Array.from({ length: 10 }, (_, index) => (
    <div key={`test-content-${index}`} className="test-content">
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
        expect(wrapper.find(".carousel").hasClass(`carousel_direction_${direction}`)).toBeTruthy();
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

    it("doesn't render indicators when withIndicators is false", () => {
        const wrapper = setup.setProps({ withIndicators: false });
        expect(wrapper.find(".carousel__dots").exists()).toBeFalsy();
    });

    it("doesn't render slide arrow buttons when withSlideArrows is false", () => {
        const wrapper = setup.setProps({ withSlideArrows: false });
        expect(wrapper.find(".carousel__button").exists()).toBeFalsy();
    });

    it("shows arrow buttons on desktop devices", () => {
        // Default mock already provides desktop breakpoint
        const wrapper = mount(<Carousel>{content}</Carousel>);
        expect(wrapper.find(".carousel__button").exists()).toBeTruthy();
    });

    it("hides arrow buttons on mobile devices", () => {
        (useDeviceInfo as jest.Mock).mockReturnValue({
            isMobileDevice: true,
            isDesktopDevice: false,
            isTouch: true,
            os: "Android",
            isWindows: false,
            isMacOS: false,
            isLinux: false,
            isAndroid: true,
            isIOS: false,
            theme: "light"
        });

        const wrapper = mount(<Carousel>{content}</Carousel>);
        expect(wrapper.find(".carousel__button").exists()).toBeFalsy();
    });

    it("doesn't show arrow buttons when only one child", () => {
        const singleChild = [<div key="single">Single</div>];
        const wrapper = mount(<Carousel>{singleChild}</Carousel>);
        expect(wrapper.find(".carousel__button").exists()).toBeFalsy();
    });

    it("navigates when dot is clicked", () => {
        setup.find(".carousel__dot").at(2).simulate("click");
        expect(setup.find(".test-content").text()).toEqual("2");
    });

    it("shows limited dots when more than 6 items", () => {
        const manyItems = Array.from({ length: 10 }, (_, i) => <div key={i}>Item {i}</div>);
        const wrapper = mount(<Carousel>{manyItems}</Carousel>);
        expect(wrapper.find(".carousel__dot")).toHaveLength(6);
    });
});
