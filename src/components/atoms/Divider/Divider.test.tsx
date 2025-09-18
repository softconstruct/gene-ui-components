import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { CheckMark } from "@geneui/icons";

// Components
import Avatar from "../Avatar";
import Divider, { IDividerProps } from "./index";

describe("Divider ", () => {
    let setup: ReactWrapper<IDividerProps>;
    beforeEach(() => {
        setup = mount(<Divider />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders direction prop correctly", () => {
        const wrapper = setup.setProps({ direction: "vertical" });
        expect(wrapper.find(".divider").hasClass("divider_vertical")).toBeTruthy();
    });

    it("renders Icon prop correctly", () => {
        const wrapper = setup.setProps({ Icon: CheckMark, direction: "horizontal" });
        expect(wrapper.find(CheckMark).exists()).toBeTruthy();
    });

    it("renders text prop correctly", () => {
        const TestText = "test";
        const wrapper = setup.setProps({ text: TestText, direction: "horizontal" });
        expect(wrapper.find(".divider").text()).toBe(TestText);
    });

    it("renders content prop correctly", () => {
        const content = <Avatar />;
        const wrapper = setup.setProps({ content });
        expect(wrapper.find(Avatar)).toBeTruthy();
    });

    it("renders inset prop correctly", () => {
        const wrapper = setup.setProps({ inset: true });
        expect(wrapper.find(".divider").hasClass(`divider_inset`)).toBeTruthy();
    });

    it.each<IDividerProps["appearance"]>(["brand", "default", "inverse", "strong"])(
        "should have %s appearance",
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(".divider").hasClass(`divider_color_${appearance}`)).toBeTruthy();
        }
    );

    it.each<IDividerProps["contentPosition"]>(["center", "after", "before"])(
        "should have %s contentPosition",
        (contentPosition) => {
            const wrapper = setup.setProps({ contentPosition, text: "test", direction: "horizontal" });
            expect(wrapper.find(".divider").hasClass(`divider_withLabel_${contentPosition}`)).toBeTruthy();
        }
    );

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
