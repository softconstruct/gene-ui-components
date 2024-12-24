import React, { FC } from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import { IconProps } from "@geneui/icons";
import Rate, { IRateProps } from "./index";
import { Icons } from "./Rate";
import HelperText from "../HelperText";
import Label from "../Label";

describe("Rate ", () => {
    let setup: ReactWrapper<IRateProps>;
    const jestFn = jest.fn();
    beforeEach(() => {
        setup = mount(<Rate iconType="star" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders count prop correctly", () => {
        const count = 5;
        const wrapper = setup.setProps({ count });
        expect(wrapper.find(".rate__item")).toHaveLength(count);
    });

    it("renders readonly prop correctly", () => {
        const wrapper = setup.setProps({ readonly: true, iconType: "heart" });
        expect(wrapper.find(".rate__heart_readOnly").exists()).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "test";
        const wrapper = setup.setProps({ helperText });
        expect(wrapper.find(HelperText).contains(helperText)).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = "test";
        const wrapper = setup.setProps({ label });
        expect(wrapper.find(Label).contains(label)).toBeTruthy();
    });

    it("renders required prop correctly", () => {
        const wrapper = setup.setProps({ required: true });
        expect(wrapper.find(Label)).toBeTruthy();
    });

    it("renders infoText prop correctly", () => {
        const infoText = "test";
        const wrapper = setup.setProps({ infoText });
        expect(wrapper.find(Label).props().infoText).toBe(infoText);
    });

    it("renders count prop correctly", () => {
        const count = 7;
        const wrapper = setup.setProps({ count });
        expect(wrapper.find(".rate__item").length).toBe(count);
    });

    it("renders disable prop correctly", () => {
        const wrapper = setup.setProps({ disable: true, iconType: "heart" });
        expect(wrapper.find(".rate__heart_disabled").exists()).toBeTruthy();
    });

    it.each(Object.keys(Icons))("renders Icon prop %p correctly", (keys) => {
        const key = keys as keyof typeof Icons;
        type keyType = (typeof Icons)[typeof key];
        const wrapper = setup.setProps({ iconType: key });
        const { Default, Filled } = (Array.isArray(Icons[key]) ? (Icons[key] as keyType[])[0] : Icons[key]) as {
            Filled: FC<IconProps>;
            Default: FC<IconProps>;
        };

        expect(wrapper.find(Filled).exists()).toBeTruthy();
        expect(wrapper.find(Default).exists()).toBeTruthy();
    });

    it.each<"medium" | "small">(["medium", "small"])("renders size prop correctly", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`.rate__item_size_${size}`).exists()).toBeTruthy();
    });

    it("renders onChange prop correctly", () => {
        const wrapper = setup.setProps({ onChange: jestFn, value: 3, defaultValue: 3 });
        wrapper.find(".rate__item").first().simulate("click");
        expect(jestFn).toHaveBeenCalledWith(1);
    });
});
