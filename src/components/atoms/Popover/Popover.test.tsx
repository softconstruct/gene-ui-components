import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Popover, { IPopoverProps } from "./index";

describe("Popover ", () => {
    let setup: ReactWrapper<IPopoverProps>;
    beforeEach(() => {
        setup = mount(<Popover size="small" padding={0} setProps={() => {}} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
