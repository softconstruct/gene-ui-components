import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe } from "@geneui/icons";

// Components
import Profile, { IProfileProps } from "./index";

describe("Profile ", () => {
    let setup: ReactWrapper<IProfileProps>;
    beforeEach(() => {
        setup = mount(<Profile />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders name prop correctly", () => {
        const name = "testName";
        const wrapper = setup.setProps({ name });

        expect(wrapper.find(".profile").text()).toStrictEqual(name);
    });

    it("renders avatarProps prop correctly", () => {
        const wrapper = setup.setProps({ avatarProps: { Icon: Globe } });

        expect(wrapper.find(Globe)).toBeTruthy();
    });

    it("renders onToggle prop correctly", () => {
        const onToggleMock = jest.fn();

        const wrapper = setup.setProps({ onToggle: onToggleMock });

        const stepLabel = wrapper.find(".profile");

        stepLabel.simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(1);
        expect(onToggleMock).toHaveBeenCalledWith(expect.any(Object), false);
    });
});
