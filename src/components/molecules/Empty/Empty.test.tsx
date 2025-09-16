import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Components
import Empty, { IEmptyProps } from "./index";

describe("Empty ", () => {
    let setup: ReactWrapper<IEmptyProps>;
    const mockOnClose = jest.fn();
    const mockOnClick = jest.fn();
    beforeEach(() => {
        setup = mount(<Empty title="some message" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders title prop correctly", () => {
        const title = "test message";
        const wrapper = setup.setProps({ title });

        const element = wrapper
            .find(Text)
            .findWhere((item) => item.hasClass("empty__title"))
            .at(1);

        expect(element.text()).toBe(title);
    });

    it("renders description prop correctly", () => {
        const description = "test description";
        const wrapper = setup.setProps({ description });

        const desc = wrapper
            .find(Text)
            .findWhere((item) => item.hasClass("empty__description"))
            .at(1);

        expect(desc.text()).toBe(description);
    });

    it("renders src prop correctly", () => {
        const src = "https://picsum.photos/id/64/200/300";
        const wrapper = setup.setProps({ src });

        expect(wrapper.find(".empty__image").props().src).toBe(src);
    });

    it("should render action buttons when provided", () => {
        const actions = [
            { children: "Cancel", appearance: "secondary" as const, onClick: mockOnClose },
            { children: "Reload", appearance: "primary" as const, onClick: mockOnClick }
        ];
        const wrapper = setup.setProps({ actions });

        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();

        expect(wrapper.text()).toContain("Cancel");
        expect(wrapper.text()).toContain("Reload");
    });

    it("should not render ButtonGroup when actions is empty", () => {
        const wrapper = setup.setProps({ actions: [] });
        expect(wrapper.find(ButtonGroup).exists()).toBeFalsy();
    });

    it("should filter out actions without children", () => {
        const actions = [
            { children: "Valid Button", appearance: "primary" as const },
            { children: undefined, appearance: "secondary" as const }
        ];
        const wrapper = setup.setProps({ actions });
        expect(wrapper.text()).toContain("Valid Button");

        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();
    });
});
