import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Tag from "../Tag/Tag";
import TagGroup, { ITagGroupProps } from "./index";
import { ITagGroupContextProps } from "./TagGroup";

describe("TagGroup ", () => {
    let setup: ReactWrapper<ITagGroupProps>;

    beforeEach(() => {
        setup = mount(
            <TagGroup>
                <Tag text="Tab" />
            </TagGroup>
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

    it("renders children prop correctly", () => {
        expect(setup.find(Tag)).toBeTruthy();
    });

    it.each<ITagGroupContextProps["size"]>(["medium", "small"])("should have %s size", async (size) => {
        const wrapper = setup.setProps({ size });

        const tagNode = wrapper.find(".tagGroup__tags");
        const innerChild = tagNode.find(`.tag_size_${size}`);

        requestAnimationFrame(() => {
            expect(innerChild.find(`.tag_size_${size}`).exists()).toBeTruthy();
        });
    });
});
