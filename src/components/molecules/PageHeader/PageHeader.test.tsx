import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import PageHeader, { IPageHeaderProps } from "./index";

describe("PageHeader ", () => {
    let setup: ReactWrapper<IPageHeaderProps>;
    beforeEach(() => {
        setup = mount(<PageHeader />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.find(".pageHeader").hasClass(className)).toBeTruthy();
    });

    it("renders breadcrumb when passed", () => {
        const wrapper = setup.setProps({ breadcrumb: <div className="test-breadcrumb">Breadcrumb</div> });

        expect(wrapper.find(".pageHeader__breadcrumb").exists()).toBeTruthy();
        expect(wrapper.find(".test-breadcrumb").exists()).toBeTruthy();
    });

    it("renders children content when passed", () => {
        const wrapper = setup.setProps({ children: <div className="test-content">Header content</div> });

        expect(wrapper.find(".pageHeader__content").exists()).toBeTruthy();
        expect(wrapper.find(".test-content").exists()).toBeTruthy();
    });

    it("adds fixed modifier class when fixed is true", () => {
        const wrapper = setup.setProps({ fixed: true });

        expect(wrapper.find(".pageHeader").hasClass("pageHeader_fixed")).toBeTruthy();
    });
});
