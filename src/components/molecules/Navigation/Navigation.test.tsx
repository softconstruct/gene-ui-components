import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { navigationData } from "../../../../stories/data/__navigation";
// Components
import Navigation, { INavigationProps } from "./index";

describe("Navigation ", () => {
    let setup: ReactWrapper<INavigationProps>;
    beforeEach(() => {
        setup = mount(<Navigation open navigationData={navigationData} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    // it("renders className prop correctly", () => {
    //     const className = "test-class";
    //     const wrapper = setup.setProps({ className });
    //
    //     expect(wrapper.hasClass(className)).toBeTruthy();
    // });

    // Your tests here
});
