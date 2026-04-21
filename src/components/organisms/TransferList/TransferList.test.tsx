import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TransferList, { ITransferListProps } from "./index";

describe("TransferList ", () => {
    let setup: ReactWrapper<ITransferListProps>;
    beforeEach(() => {
        setup = mount(<TransferList />);
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
