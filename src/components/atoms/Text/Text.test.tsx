import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Text, { ITextProps } from "./index";

const content = "content";

describe("Text ", () => {
    let setup: ReactWrapper<ITextProps>;
    beforeEach(() => {
        setup = mount(<Text>{content}</Text>);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("should render text component with passed as property", () => {
        const wrapper = setup.setProps({ as: "h1" });
        expect(wrapper.find("h1").exists()).toBeTruthy();
    });

    it("should render text with span if as is missing", () => {
        expect(setup.find("span").exists()).toBeTruthy();
    });

    it("should render text with span if unsupported element was passed to as", () => {
        const wrapper = setup.setProps({ as: "strong" as "h1" });
        expect(wrapper.find("span").exists()).toBeTruthy();
    });

    it("should render correctly render variant if passed", () => {
        const wrapper = setup.setProps({ variant: "bodyLargeMedium" });
        expect(wrapper.find(".text_bodyLargeMedium").exists()).toBeTruthy();
    });

    it("should not render variant if it is not passed", () => {
        expect(setup.find(".text").exists()).toBeTruthy();
    });
});
