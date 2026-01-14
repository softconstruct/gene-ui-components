import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Avatar from "@components/atoms/Avatar";
import Profile, { IProfileProps } from "@components/molecules/Profile";

import { profileData } from "../../../../stories/data/__profile";

describe("Profile ", () => {
    let setup: ReactWrapper<IProfileProps>;
    beforeEach(() => {
        setup = mount(<Profile profileData={profileData} />);
    });

    afterEach(() => {
        if (setup) {
            setup.unmount();
        }
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders fullName prop correctly", () => {
        const fullName = "testName";
        const wrapper = setup.setProps({ fullName });

        expect(wrapper.find(".profile__text").text()).toStrictEqual(fullName);
    });

    it("renders src prop correctly", () => {
        const src = "https://picsum.photos/id/64/200/300";
        const wrapper = setup.setProps({ src });

        expect(wrapper.find(Avatar).props().src).toStrictEqual(src);
    });

    it("renders onToggle prop correctly", () => {
        const onToggleMock = jest.fn();

        const wrapper = setup.setProps({ onToggle: onToggleMock });

        const stepLabel = wrapper.find(".profile__button");

        stepLabel.simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(1);
        expect(onToggleMock).toHaveBeenCalledWith(expect.any(Object), true);
    });
});
