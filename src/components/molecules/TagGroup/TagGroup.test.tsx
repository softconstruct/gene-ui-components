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
});
