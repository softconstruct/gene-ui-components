import React, { MouseEvent } from "react";
import { ReactWrapper, mount } from "enzyme";
import { Globe } from "@geneui/icons";

// Components
import TextLink, { ITextLinkProps } from "./index";

describe("TextLink", () => {
    let setup: ReactWrapper<ITextLinkProps>;
    const mockFn = jest.fn();
    beforeEach(() => {
        setup = mount(<TextLink text="test" href="testHref" />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders text prop correctly", () => {
        expect(setup.text()).toBe("test");
    });

    it("should have href prop", () => {
        expect(setup.find("a").prop("href")).toBe("testHref");
    });

    it("renders iconBefore prop correctly", async () => {
        const wrapper = setup.setProps({ iconBefore: true, Icon: Globe });
        expect(wrapper.find(".textLink__icon_before").exists()).toBeTruthy();

        const wrapperAfter = setup.setProps({ iconBefore: false, Icon: Globe });
        expect(wrapperAfter.find(".textLink__icon_after").exists()).toBeTruthy();
    });

    it("renders underline prop correctly", () => {
        const wrapper = setup.setProps({ underline: true });
        expect(wrapper.find(".textLink_underline").exists()).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find(".textLink_disabled").exists()).toBeTruthy();
    });

    it("renders Icon prop correctly", () => {
        const wrapper = setup.setProps({ Icon: Globe });
        expect(wrapper.find(Globe)).toBeTruthy();
    });

    it("renders onClick prop correctly", () => {
        const wrapper = setup.setProps({ onClick: mockFn });
        const event = {
            currentTarget: {
                innerHTML: "test"
            }
        } as MouseEvent<HTMLAnchorElement>;
        wrapper.find("a").props().onClick!(event);
        expect(mockFn).toHaveBeenCalledWith(event);
    });

    it("renders isLoading prop correctly", () => {
        const wrapper = setup.setProps({ isLoading: true });
        expect(wrapper.text()).toStrictEqual("skeleton");
    });

    it.each<ITextLinkProps["rel"]>(["nofollow", "none"])('should have "%s" rel', (rel) => {
        const wrapper = setup.setProps({ rel });
        expect(wrapper.find(".textLink").props().rel).toBe(rel);
    });

    it.each<ITextLinkProps["appearance"]>(["inverse", "secondary", "primary"])(
        'should have "%s" appearance',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(`textLink_color_${appearance}`)).toBeTruthy();
        }
    );

    it.each<ITextLinkProps["size"]>(["large", "medium"])('should have "%s" appearance', (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`textLink_size_${size}`)).toBeTruthy();
    });

    it.each<ITextLinkProps["target"]>(["blank", "self"])('should have "%s" target', (target) => {
        const wrapper = setup.setProps({ target });
        expect(wrapper.find(".textLink").props().target).toBe(`_${target}`);
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
