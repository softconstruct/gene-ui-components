import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Tooltip from "@components/molecules/Tooltip";

import Section, { ISectionProps } from "./index";

describe("Section", () => {
    let setup: ReactWrapper<ISectionProps>;

    beforeEach(() => {
        setup = mount(<Section title="Test Title" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".section").hasClass("section_isInset")).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".section").hasClass(className)).toBeTruthy();
    });

    it("renders title correctly", () => {
        const title = "Section Title";
        const wrapper = setup.setProps({ title });
        expect(wrapper.find(".section__title").exists()).toBeTruthy();
        const titleNode = wrapper.find(".section__title .ellipsis-text").at(0);
        expect(titleNode.exists()).toBeTruthy();
        expect(titleNode.text()).toEqual(title);
    });

    it("renders title with tooltip support", () => {
        const wrapper = setup.setProps({ title: "Test Title" });
        expect(wrapper.find(Tooltip).at(0).exists()).toBeTruthy();
    });

    it("renders subtitle correctly", () => {
        const subtitle = "Section Subtitle";
        const wrapper = setup.setProps({ title: "Title", subtitle });
        const subtitleNode = wrapper.find(".section__title .ellipsis-text").at(1);
        expect(subtitleNode.exists()).toBeTruthy();
        expect(subtitleNode.text()).toEqual(subtitle);
    });

    it("renders subtitle with tooltip support", () => {
        const wrapper = setup.setProps({ subtitle: "Test Subtitle" });
        expect(wrapper.find(Tooltip).at(1).exists()).toBeTruthy();
    });

    it("does not render subtitle when not provided", () => {
        const titleAndSubtitleNodes = setup.find(".section__title .ellipsis-text");
        expect(titleAndSubtitleNodes).toHaveLength(1);
    });

    it("renders header when hasHeader is true", () => {
        const wrapper = setup.setProps({ hasHeader: true });
        expect(wrapper.find(".section__header").exists()).toBeTruthy();
    });

    it("does not render header when hasHeader is false", () => {
        const wrapper = setup.setProps({ hasHeader: false });
        expect(wrapper.find(".section__header").exists()).toBeFalsy();
    });

    it("renders headerContent correctly", () => {
        const headerContent = <div className="custom-header">Custom Header</div>;
        const wrapper = setup.setProps({ headerContent });
        expect(wrapper.find(".custom-header").exists()).toBeTruthy();
        expect(wrapper.find(".section__header_content").exists()).toBeTruthy();
    });

    it("renders header with title and headerContent together", () => {
        const headerContent = <button type="button">Action</button>;
        const wrapper = setup.setProps({ title: "Title", headerContent });
        expect(wrapper.find(".section__title").exists()).toBeTruthy();
        expect(wrapper.find("button").exists()).toBeTruthy();
    });

    it("renders body section", () => {
        expect(setup.find(".section__body").exists()).toBeTruthy();
    });

    it("renders Scrollbar component in body", () => {
        expect(setup.find(Scrollbar).exists()).toBeTruthy();
    });

    it("renders bodyContent correctly", () => {
        const bodyContent = <div className="custom-body">Custom Body</div>;
        const wrapper = setup.setProps({ bodyContent });
        expect(wrapper.find(".custom-body").exists()).toBeTruthy();
        expect(wrapper.find(".section__content").exists()).toBeTruthy();
    });

    it("applies withPadding class when true", () => {
        const wrapper = setup.setProps({ withPadding: true });
        expect(wrapper.find(".section__body").hasClass("section__body_withPadding")).toBeTruthy();
    });

    it("does not apply withPadding class when false", () => {
        const wrapper = setup.setProps({ withPadding: false });
        expect(wrapper.find(".section__body").hasClass("section__body_withPadding")).toBeFalsy();
    });

    it("renders wrapper div when withPadding is true", () => {
        const wrapper = setup.setProps({ withPadding: true });
        expect(wrapper.find(".section__wrapper").exists()).toBeTruthy();
    });

    it("does not render wrapper div when withPadding is false", () => {
        const wrapper = setup.setProps({ withPadding: false });
        expect(wrapper.find(".section__wrapper").exists()).toBeFalsy();
    });

    it("applies hasHeader class to body when header is present", () => {
        const wrapper = setup.setProps({ hasHeader: true });
        expect(wrapper.find(".section__body").hasClass("section__body_hasHeader")).toBeTruthy();
    });

    it("applies hasFooter class to body when footer is present", () => {
        const wrapper = setup.setProps({ hasFooter: true, action: { children: "Submit" } });
        expect(wrapper.find(".section__body").hasClass("section__body_hasFooter")).toBeTruthy();
    });

    it("renders footer when hasFooter is true and footerContent is provided", () => {
        const footerContent = <div className="custom-footer">Custom Footer</div>;
        const wrapper = setup.setProps({ hasFooter: true, footerContent });
        expect(wrapper.find(".section__footer").exists()).toBeTruthy();
        expect(wrapper.find(".custom-footer").exists()).toBeTruthy();
    });

    it("renders footer when hasFooter is true and action is provided", () => {
        const action = { children: "Submit", appearance: "primary" as const };
        const wrapper = setup.setProps({ hasFooter: true, action });
        expect(wrapper.find(".section__footer").exists()).toBeTruthy();
    });

    it("does not render footer when hasFooter is false", () => {
        const wrapper = setup.setProps({ hasFooter: false, action: { children: "Submit" } });
        expect(wrapper.find(".section__footer").exists()).toBeFalsy();
    });

    it("does not render footer when no footerContent or action is provided", () => {
        const wrapper = setup.setProps({ hasFooter: true, footerContent: undefined, action: undefined });
        expect(wrapper.find(".section__footer").exists()).toBeFalsy();
    });

    it("renders action button correctly", () => {
        const action = { children: "Submit", appearance: "primary" as const, onClick: jest.fn() };
        const wrapper = setup.setProps({ action });
        expect(wrapper.find(".section__footer_actions").exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
        expect(wrapper.find(Button).text()).toContain("Submit");
    });

    it("calls action onClick handler", () => {
        const onClickMock = jest.fn();
        const action = { children: "Submit", onClick: onClickMock };
        const wrapper = setup.setProps({ action });
        wrapper.find(Button).simulate("click");
        expect(onClickMock).toHaveBeenCalled();
    });

    it("renders footerContent and action together", () => {
        const footerContent = <span>Footer Info</span>;
        const action = { children: "Submit" };
        const wrapper = setup.setProps({ footerContent, action });
        expect(wrapper.find(".section__footer_content").exists()).toBeTruthy();
        expect(wrapper.find(".section__footer_actions").exists()).toBeTruthy();
    });

    it("does not render action button when action is not provided", () => {
        const wrapper = setup.setProps({ action: undefined });
        expect(wrapper.find(".section__footer_actions").exists()).toBeFalsy();
    });

    it("has default hasHeader as true", () => {
        expect(setup.find(".section__header").exists()).toBeTruthy();
    });

    it("has default hasFooter as true", () => {
        const wrapper = setup.setProps({ action: { children: "Submit" } });
        expect(wrapper.find(".section__footer").exists()).toBeTruthy();
    });

    it("has default withPadding as true", () => {
        expect(setup.find(".section__wrapper").exists()).toBeTruthy();
    });

    it("renders complete section with all parts", () => {
        const headerContent = <button type="button">Header Action</button>;
        const bodyContent = <p>Body Content</p>;
        const footerContent = <span>Footer Info</span>;
        const action = { children: "Submit", appearance: "primary" as const };

        const wrapper = setup.setProps({
            title: "Section Title",
            subtitle: "Section Subtitle",
            headerContent,
            bodyContent,
            footerContent,
            action
        });

        expect(wrapper.find(".section__header").exists()).toBeTruthy();
        expect(wrapper.find(".section__body").exists()).toBeTruthy();
        expect(wrapper.find(".section__footer").exists()).toBeTruthy();
        expect(wrapper.text()).toContain("Section Title");
        expect(wrapper.text()).toContain("Section Subtitle");
    });

    it("renders minimal section with only title", () => {
        const wrapper = mount(<Section title="Minimal Title" hasHeader hasFooter={false} />);
        expect(wrapper.find(".section__header").exists()).toBeTruthy();
        expect(wrapper.find(".section__body").exists()).toBeTruthy();
        expect(wrapper.find(".section__footer").exists()).toBeFalsy();
    });

    it("handles undefined footerContent gracefully", () => {
        const wrapper = setup.setProps({ footerContent: undefined });
        expect(wrapper.find(".section__footer_content").exists()).toBeFalsy();
    });

    it("handles undefined headerContent gracefully", () => {
        const wrapper = setup.setProps({ headerContent: undefined });
        expect(wrapper.find(".section__title").exists()).toBeTruthy();
    });

    it("handles undefined bodyContent gracefully", () => {
        const wrapper = setup.setProps({ bodyContent: undefined });
        expect(wrapper.find(".section__content").exists()).toBeTruthy();
    });

    it("handles all optional props as undefined", () => {
        const wrapper = mount(<Section title="Title" />);
        expect(wrapper.exists()).toBeTruthy();
    });
});
