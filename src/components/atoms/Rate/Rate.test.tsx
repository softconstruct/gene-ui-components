import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Rate, { IRateProps } from "./index";

describe("Rate ", () => {
    let setup: ReactWrapper<IRateProps>;
    // const jestFn = jest.fn();
    beforeEach(() => {
        setup = mount(<Rate />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    // it("renders count prop correctly", () => {
    //     const count = 5;
    //     const wrapper = setup.setProps({ count });
    //     expect(wrapper.find(".rating__wrapper")).toHaveLength(count);
    // });

    // it("renders readonly prop correctly", () => {
    //     const wrapper = setup.setProps({ readonly: true });
    //     expect(wrapper.find(".rating__wrapper-readonly")).toBeDefined();
    // });

    // it("renders size prop correctly", () => {
    //     const size = "medium";
    //     const wrapper = setup.setProps({ size });
    //     expect(wrapper.find(".rating__wrapper").first().hasClass(`rating__wrapper-${size}`)).toBeTruthy();
    // });

    // it("renders onChange prop correctly", () => {
    //     const wrapper = setup.setProps({ onChange: jestFn, value: 3, defaultValue: 3 });
    //     wrapper.find(".rating__wrapper").first().simulate("click");
    //     expect(jestFn).toHaveBeenCalledWith(1);
    // });
});
