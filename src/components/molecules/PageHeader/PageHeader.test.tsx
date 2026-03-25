import React from "react";
import { mount, ReactWrapper } from "enzyme";

import GeneUIProvider from "@components/providers/GeneUIProvider";

// Hooks
import useDeviceInfo from "@hooks/useDeviceInfo";

import PageHeader, { IPageHeaderProps } from "./index";

jest.mock("@hooks/useDeviceInfo", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({ isMobileDevice: false })
}));

describe("PageHeader ", () => {
    const mountWithDevice = (isMobileDevice: boolean, props: Partial<IPageHeaderProps> = {}) => {
        (useDeviceInfo as jest.Mock).mockReturnValue({ isMobileDevice });
        return mount(<PageHeader {...props} />, {
            wrappingComponent: GeneUIProvider
        }) as ReactWrapper<IPageHeaderProps>;
    };

    it("renders without crashing", () => {
        const setup = mountWithDevice(false);
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const setup = mountWithDevice(false);
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.find(".pageHeader").hasClass(className)).toBeTruthy();
    });

    it("renders breadcrumb only when breadcrumbProps are provided", () => {
        const breadcrumbProps = {
            items: [{ title: "Home", path: "/" }, { title: "Current" }]
        };

        const setupWithBreadcrumb = mountWithDevice(false, { breadcrumbProps } as IPageHeaderProps);
        expect(setupWithBreadcrumb.find(".pageHeader__breadcrumb").exists()).toBeTruthy();

        const setupWithoutBreadcrumb = mountWithDevice(false);
        expect(setupWithoutBreadcrumb.find(".pageHeader__breadcrumb").exists()).toBeFalsy();
    });

    it("passes breadcrumbProps into Breadcrumb component", () => {
        const breadcrumbProps = {
            items: [{ title: "Home", path: "/" }, { title: "Current" }]
        };

        const setup = mountWithDevice(false, { breadcrumbProps } as IPageHeaderProps);
        // Breadcrumb renders nav with a11y label
        expect(setup.find('nav[aria-label="breadcrumb navigation"]').exists()).toBeTruthy();
        expect(setup.text()).toContain("Home");
        expect(setup.text()).toContain("Current");
    });

    it("renders children content wrapper", () => {
        const setup = mountWithDevice(false, {
            children: <span className="test-children">Hello</span>
        });

        const content = setup.find(".pageHeader__content");
        expect(content.exists()).toBeTruthy();
        expect(content.find(".test-children").text()).toBe("Hello");
    });

    it("applies sticky modifier when sticky=true", () => {
        const setup = mountWithDevice(false, { sticky: true });
        expect(setup.find(".pageHeader").hasClass("pageHeader_sticky")).toBeTruthy();
    });

    it("applies mobile modifier when device is mobile", () => {
        const setup = mountWithDevice(true);
        expect(setup.find(".pageHeader").hasClass("pageHeader_device_mobile")).toBeTruthy();
        expect(setup.find(".pageHeader").hasClass("pageHeader_device_desktop")).toBeFalsy();
    });

    it("applies desktop modifier when device is desktop", () => {
        const setup = mountWithDevice(false);
        expect(setup.find(".pageHeader").hasClass("pageHeader_device_desktop")).toBeTruthy();
        expect(setup.find(".pageHeader").hasClass("pageHeader_device_mobile")).toBeFalsy();
    });
});
