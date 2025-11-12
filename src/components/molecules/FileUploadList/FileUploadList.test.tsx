import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import FileUploadList, { IFileUploadListProps } from "./index";

describe("FileUploadList ", () => {
    let setup: ReactWrapper<IFileUploadListProps>;
    beforeEach(() => {
        setup = mount(<FileUploadList />);
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
