import React from "react";
import { mount, ReactWrapper } from "enzyme";

import GeneUIProvider from "../../providers/GeneUIProvider";
// Components
import Menu, { IMenuProps } from "./index";
import MenuItem from "./MenuItem";

describe("Menu ", () => {
    let setup: ReactWrapper<IMenuProps>;
    beforeEach(() => {
        setup = mount(
            <Menu onChange={() => {}} setPropsForPopover={() => {}}>
                <MenuItem selected={false} index={0} danger={false} disabled={false} id="testId">
                    test
                </MenuItem>
            </Menu>,
            { wrappingComponent: GeneUIProvider }
        );
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
