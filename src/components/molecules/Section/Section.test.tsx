import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Section, { ISectionProps } from "@components/molecules/Section";
import Tooltip from "@components/molecules/Tooltip";

describe("Section", () => {
    let setup: ReactWrapper<ISectionProps>;

    beforeEach(() => {
        setup = mount(<Section title="Test Title" />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
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

    it("renders header when title is provided", () => {
        const wrapper = setup.setProps({ title: "Test Title" });
        expect(wrapper.find(".section__header").exists()).toBeTruthy();
    });

    it("does not render header when title is not provided", () => {
        const wrapper = setup.setProps({ title: undefined });
        expect(wrapper.find(".section__header").exists()).toBeFalsy();
    });

    it("does not render header when title is empty string", () => {
        const wrapper = setup.setProps({ title: "" });
        expect(wrapper.find(".section__header").exists()).toBeFalsy();
    });

    it("renders headerSwappable correctly", () => {
        const headerSwappable = <div className="custom-header">Custom Header</div>;
        const wrapper = setup.setProps({ headerSwappable });
        expect(wrapper.find(".custom-header").exists()).toBeTruthy();
        expect(wrapper.find(".section__headerSwappable").exists()).toBeTruthy();
    });

    it("renders header with title and headerSwappable together", () => {
        const headerSwappable = <button type="button">Action</button>;
        const wrapper = setup.setProps({ title: "Title", headerSwappable });
        expect(wrapper.find(".section__title").exists()).toBeTruthy();
        expect(wrapper.find("button").exists()).toBeTruthy();
    });

    it("does not render header when only headerSwappable is provided without title", () => {
        const headerSwappable = <button type="button">Action</button>;
        const wrapper = setup.setProps({ title: undefined, headerSwappable });
        expect(wrapper.find(".section__header").exists()).toBeFalsy();
    });

    it("renders body section", () => {
        expect(setup.find(".section__body").exists()).toBeTruthy();
    });

    it("renders Scrollbar component in body", () => {
        expect(setup.find(Scrollbar).exists()).toBeTruthy();
    });

    it("renders children correctly", () => {
        const children = <div className="custom-body">Custom Body</div>;
        const wrapper = mount(<Section title="Test Title">{children}</Section>);
        expect(wrapper.find(".custom-body").exists()).toBeTruthy();
        expect(wrapper.find(".section__content").exists()).toBeTruthy();
    });

    it("does not apply withPadding class when false", () => {
        const wrapper = setup.setProps({ inset: false });
        expect(wrapper.find(".section__content").hasClass("section__content_withPadding")).toBeFalsy();
    });

    it("applies withPadding class to content when inset is true", () => {
        const wrapper = setup.setProps({ inset: true });
        expect(wrapper.find(".section__content").hasClass("section__content_withPadding")).toBeTruthy();
    });

    it("does not apply withPadding class to content when inset is false", () => {
        const wrapper = setup.setProps({ inset: false });
        expect(wrapper.find(".section__content").hasClass("section__content_withPadding")).toBeFalsy();
    });

    it("applies hasHeader class to body when title is provided", () => {
        const wrapper = setup.setProps({ title: "Test Title" });
        expect(wrapper.find(".section__body").hasClass("section__body_hasHeader")).toBeTruthy();
    });

    it("does not apply hasHeader class to body when title is not provided", () => {
        const wrapper = setup.setProps({ title: undefined });
        expect(wrapper.find(".section__body").hasClass("section__body_hasHeader")).toBeFalsy();
    });

    it("applies hasFooter class to body when footer is present", () => {
        const wrapper = setup.setProps({ primaryAction: { children: "Submit" } });
        expect(wrapper.find(".section__body").hasClass("section__body_hasFooter")).toBeTruthy();
    });

    it("renders footer when footerSwappable is provided", () => {
        const footerSwappable = <div className="custom-footer">Custom Footer</div>;
        const wrapper = setup.setProps({ footerSwappable });
        expect(wrapper.find(".section__footer").exists()).toBeTruthy();
        expect(wrapper.find(".custom-footer").exists()).toBeTruthy();
    });

    it("renders footer when primaryAction is provided", () => {
        const primaryAction = { children: "Submit" };
        const wrapper = setup.setProps({ primaryAction });
        expect(wrapper.find(".section__footer").exists()).toBeTruthy();
    });

    it("does not render footer when no footerSwappable or primaryAction is provided", () => {
        const wrapper = setup.setProps({ footerSwappable: undefined, primaryAction: undefined });
        expect(wrapper.find(".section__footer").exists()).toBeFalsy();
    });

    it("renders primaryAction button correctly", () => {
        const primaryAction = { children: "Submit", onClick: jest.fn() };
        const wrapper = setup.setProps({ primaryAction });
        expect(wrapper.find(".section__action").exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
        expect(wrapper.find(Button).text()).toContain("Submit");
        expect(wrapper.find(Button).prop("appearance")).toBe("primary");
    });

    it("calls primaryAction onClick handler", () => {
        const onClickMock = jest.fn();
        const primaryAction = { children: "Submit", onClick: onClickMock };
        const wrapper = setup.setProps({ primaryAction });
        wrapper.find(Button).simulate("click");
        expect(onClickMock).toHaveBeenCalled();
    });

    it("renders footerSwappable and primaryAction together", () => {
        const footerSwappable = <span>Footer Info</span>;
        const primaryAction = { children: "Submit" };
        const wrapper = setup.setProps({ footerSwappable, primaryAction });
        expect(wrapper.find(".section__footerSwappable").exists()).toBeTruthy();
        expect(wrapper.find(".section__action").exists()).toBeTruthy();
    });

    it("does not render primaryAction button when primaryAction is not provided", () => {
        const wrapper = setup.setProps({ primaryAction: undefined });
        expect(wrapper.find(".section__action").exists()).toBeFalsy();
    });

    it("renders header by default when title is provided", () => {
        expect(setup.find(".section__header").exists()).toBeTruthy();
    });

    it("has default inset as true", () => {
        expect(setup.find(".section__content").hasClass("section__content_withPadding")).toBeTruthy();
    });

    it("renders complete section with all parts", () => {
        const headerSwappable = <button type="button">Header Action</button>;
        const children = <p>Body Content</p>;
        const footerSwappable = <span>Footer Info</span>;
        const primaryAction = { children: "Submit" };

        const wrapper = mount(
            <Section
                title="Section Title"
                subtitle="Section Subtitle"
                headerSwappable={headerSwappable}
                footerSwappable={footerSwappable}
                primaryAction={primaryAction}
            >
                {children}
            </Section>
        );

        expect(wrapper.find(".section__header").exists()).toBeTruthy();
        expect(wrapper.find(".section__body").exists()).toBeTruthy();
        expect(wrapper.find(".section__footer").exists()).toBeTruthy();
        expect(wrapper.text()).toContain("Section Title");
        expect(wrapper.text()).toContain("Section Subtitle");
    });

    it("renders minimal section with only title", () => {
        const wrapper = setup.setProps({
            title: "Minimal Title",
            footerSwappable: undefined,
            primaryAction: undefined
        });
        expect(wrapper.find(".section__header").exists()).toBeTruthy();
        expect(wrapper.find(".section__body").exists()).toBeTruthy();
        expect(wrapper.find(".section__footer").exists()).toBeFalsy();
    });

    it("handles undefined footerSwappable gracefully", () => {
        const wrapper = setup.setProps({ footerSwappable: undefined });
        expect(wrapper.find(".section__footerSwappable").exists()).toBeFalsy();
    });

    it("handles undefined headerSwappable gracefully", () => {
        const wrapper = setup.setProps({ headerSwappable: undefined });
        expect(wrapper.find(".section__title").exists()).toBeTruthy();
    });

    it("handles all optional props as undefined", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders id prop correctly", () => {
        const id = "section-id-123";
        const wrapper = setup.setProps({ id });
        expect(wrapper.find(".section").prop("id")).toBe(id);
    });

    it("applies hasFooter class to body when footerSwappable is provided", () => {
        const footerSwappable = <span>Footer Info</span>;
        const wrapper = setup.setProps({ footerSwappable });
        expect(wrapper.find(".section__body").hasClass("section__body_hasFooter")).toBeTruthy();
    });

    it("renders multiple children correctly", () => {
        const wrapper = mount(
            <Section title="Test Title">
                <div className="child-1">Child 1</div>
                <div className="child-2">Child 2</div>
                <div className="child-3">Child 3</div>
            </Section>
        );
        expect(wrapper.find(".child-1").exists()).toBeTruthy();
        expect(wrapper.find(".child-2").exists()).toBeTruthy();
        expect(wrapper.find(".child-3").exists()).toBeTruthy();
    });
});
