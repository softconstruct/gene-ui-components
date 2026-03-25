import React from "react";
import { mount, ReactWrapper } from "enzyme";

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
});
