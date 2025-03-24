import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Tag from "../Tag/Tag";
// Components
import TagGroup, { ITagGroupProps } from "./index";

describe("TagGroup ", () => {
    let setup: ReactWrapper<ITagGroupProps>;

    beforeEach(() => {
        setup = mount(
            <TagGroup>
                <Tag text="Tab" />
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

    it("renders multiple tags correctly", () => {
        expect(setup.find(Tag)).toHaveLength(2);
    });

    it("removes a tag when close button is clicked", () => {
        expect(setup.find(Tag)).toHaveLength(2);

        // Simulate closing the first tag
        setup.find(Tag).first().props().onClose?.();
        setup.mount();

        expect(setup.find(Tag)).toHaveLength(1);
    });
});
