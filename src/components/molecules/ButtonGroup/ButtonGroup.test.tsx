import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Button } from "../../../index";
// Components
import ButtonGroup, { IButtonGroupProps } from "./index";

describe("ButtonGroup ", () => {
    let setup: ReactWrapper<IButtonGroupProps>;
    beforeEach(() => {
        setup = mount(
            <ButtonGroup>
                <Button size="medium" appearance="primary" onClick={() => console.log("Button 1 clicked")}>
                    primary
                </Button>
                <Button size="medium" appearance="secondary" onClick={() => console.log("Button 1 clicked")}>
                    secondary
                </Button>
            </ButtonGroup>
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
