import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Breadcrumb from "@components/molecules/Breadcrumb";

// Hooks
import useDeviceInfo from "@hooks/useDeviceInfo";

import PageHeader, { IPageHeaderProps } from "./index";

jest.mock("@hooks/useDeviceInfo", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({ isMobileDevice: false })
}));

describe("PageHeader ", () => {
    let setup: ReactWrapper<IPageHeaderProps>;

    beforeEach(() => {
        (useDeviceInfo as jest.Mock).mockReturnValue({ isMobileDevice: false });
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

    it("does not render breadcrumb and content blocks by default", () => {
        expect(setup.find(".pageHeader__breadcrumb").exists()).toBeFalsy();
        expect(setup.find(".pageHeader__content").exists()).toBeFalsy();
    });

    it("renders breadcrumb when passed", () => {
        const wrapper = setup.setProps({
            breadcrumb: <Breadcrumb className="test-breadcrumb" items={[{ title: "Home", path: "/" }]} />
        });

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

    it("does not add fixed modifier class by default", () => {
        expect(setup.find(".pageHeader").hasClass("pageHeader_fixed")).toBeFalsy();
    });

    it("adds mobile modifier class when device is mobile", () => {
        (useDeviceInfo as jest.Mock).mockReturnValue({ isMobileDevice: true });
        const wrapper = mount(<PageHeader />);

        expect(wrapper.find(".pageHeader").hasClass("pageHeader_mobile")).toBeTruthy();
    });
});
