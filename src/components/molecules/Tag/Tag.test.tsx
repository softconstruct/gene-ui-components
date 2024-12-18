import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Tag, { ITagProps } from "./index";
import Button from "../../atoms/Button";

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

    it.each<ITagProps["type"]>(["rest", "error", "warning"])("should have %s state", (type) => {
        const wrapper = setup.setProps({ type });
        expect(wrapper.find(`.tag_state_${type}`).exists()).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".tag_state_disabled").exists()).toBeTruthy();
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
        setup.find(Button).simulate("click");
        expect(mockFn).toHaveBeenCalled();
    });
});
