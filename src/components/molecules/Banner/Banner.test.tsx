import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Banner, { IBannerProps } from "./index";

const text = "Title";

describe("Banner ", () => {
    let setup: ReactWrapper<IBannerProps>;
    beforeEach(() => {
        setup = mount(<Banner text={text} status="informative" open />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders text", () => {
        expect(setup.find(".banner__text").first().text()).toEqual(text);
    });

    it("renders status informative", () => {
        expect(setup.find(".banner_state_informative").exists()).toBeTruthy();
    });

    it("renders status warning", () => {
        const wrapper = setup.setProps({ status: "warning" });
        expect(wrapper.find(".banner_state_warning").exists()).toBeTruthy();
    });

    it("renders status error", () => {
        const wrapper = setup.setProps({ status: "error" });
        expect(wrapper.find(".banner_state_error").exists()).toBeTruthy();
    });

    it("should not be open", () => {
        const wrapper = setup.setProps({ open: false });
        wrapper.update();
        expect(wrapper.find(".banner").exists()).toBeFalsy();
    });
});
