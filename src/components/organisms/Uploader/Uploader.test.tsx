import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Text from "@components/atoms/Text";

import Uploader, { IUploaderProps } from "./index";

describe("Uploader ", () => {
    let setup: ReactWrapper<IUploaderProps>;
    beforeEach(() => {
        setup = mount(<Uploader />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = "Uploader Label";
        const wrapper = setup.setProps({ label });

        expect(wrapper.find(".uploader__label").text()).toBe(label);
    });

    it("renders description prop correctly", () => {
        const description = "Uploader description";
        const wrapper = setup.setProps({ description, type: "button" });

        expect(wrapper.find(Text).text()).toBe(description);
    });
});
