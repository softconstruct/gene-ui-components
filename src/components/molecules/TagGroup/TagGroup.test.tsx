import React from "react";
import { mount, ReactWrapper } from "enzyme";

import Tag from "../Tag/Tag";
// Components
import TagGroup, { ITagGroupProps } from "./index";

describe("TagGroup ", () => {
    let setup: ReactWrapper<ITagGroupProps>;

    const initialTags = (count: number) =>
        Array.from({ length: count }, (_, i) => <Tag key={i} text={`Tag ${i + 1}`} onClose={() => {}} />);

    beforeEach(() => {
        Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
            value: jest.fn(() => ({ height: 20, width: 100 }))
        });

        // Mock useWindowSize
        jest.mock("@hooks/useWindowSize", () => () => ({ width: 800, height: 600 }));

        setup = mount(
            <TagGroup>
                <Tag text="Default Tag" />
            </TagGroup>
        );
    });

    afterEach(() => {
        // Restore mocks
        jest.restoreAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders initial children (Tags)", () => {
        const children = initialTags(3);
        const wrapper = mount(<TagGroup>{children}</TagGroup>);
        expect(wrapper.find(Tag)).toHaveLength(3);
    });
});
