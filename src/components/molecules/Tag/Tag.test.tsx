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

    // Your tests here
});
