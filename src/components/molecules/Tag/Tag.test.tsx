import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Tag, { ITagProps } from "./index";

const tagText = "tag";

describe("Tag ", () => {
    let setup: ReactWrapper<ITagProps>;
    const mockFn = jest.fn();

    beforeEach(() => {
        setup = mount(<Tag text={tagText} onClose={mockFn} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders content text correctly", () => {
        expect(setup.find(".tag__text").contains(tagText)).toBeTruthy();
    });

    it.each<ITagProps["state"]>(["rest", "error", "warning", "disabled"])("should have %s state", (state) => {
        const wrapper = setup.setProps({ state });
        expect(wrapper.find(`.tag_state_${state}`).exists()).toBeTruthy();
    });

    it.each<ITagProps["size"]>(["medium", "small"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`.tag_size_${size}`).exists()).toBeTruthy();
    });

    it("renders withIcon prop correctly", () => {
        expect(setup.find(".tag__icon").exists()).toBeTruthy();
        const wrapper = setup.setProps({ withIcon: false });
        expect(wrapper.find(".tag__icon").exists()).toBeFalsy();
    });

    it("handles close button's click", () => {
        setup.find(".tag__button .button_icon_only").simulate("click");
        expect(mockFn).toHaveBeenCalled();
    });
});
