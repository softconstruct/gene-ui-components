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

    it("renders passed state correctly", () => {
        expect(setup.find(".tag_state_rest").exists()).toBeTruthy();
        const wrapper = setup.setProps({ state: "error" });
        expect(wrapper.find(".tag_state_error").exists()).toBeTruthy();
    });

    it("renders passed size correctly", () => {
        expect(setup.find(".tag_size_medium").exists()).toBeTruthy();
        const wrapper = setup.setProps({ size: "small" });
        expect(wrapper.find(".tag_size_small").exists()).toBeTruthy();
    });

    it("renders with icon", () => {
        expect(setup.find(".tag__icon").exists()).toBeTruthy();
    });

    it("renders without icon", () => {
        const wrapper = setup.setProps({ withIcon: false });
        expect(wrapper.find(".tag__icon").exists()).toBeFalsy();
    });

    it("should call onClose when close button is pressed", () => {
        setup.find(".tag__button .button_icon_only").simulate("click");
        expect(mockFn).toHaveBeenCalled();
    });
});
