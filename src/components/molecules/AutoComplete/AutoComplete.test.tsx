import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import AutoComplete, { IAutoCompleteProps } from "./index";

describe("AutoComplete ", () => {
    let setup: ReactWrapper<IAutoCompleteProps>;
    beforeEach(() => {
        setup = mount(
            <AutoComplete
                setPropsForPopover={() => {
                    // Provide a no-op function for setPropsForPopover
                }}
            >
                <div>Test Child</div>
            </AutoComplete>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    // Your tests here
});
