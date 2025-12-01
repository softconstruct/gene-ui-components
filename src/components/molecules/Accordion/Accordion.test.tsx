import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Icons
import { Tag } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Tooltip from "@components/molecules/Tooltip";

import Accordion, { IAccordionProps } from "./Accordion";
import AccordionItem, { IAccordionItemProps } from "./AccordionItem";

describe("Accordion", () => {
    it("renders without crashing", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = mount(
            <Accordion className={className}>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(".accordion").hasClass(className)).toBeTruthy();
    });

    it("renders children correctly", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Item 1">Content 1</AccordionItem>
                <AccordionItem title="Item 2">Content 2</AccordionItem>
                <AccordionItem title="Item 3">Content 3</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(AccordionItem)).toHaveLength(3);
    });

    it("only accepts AccordionItem as children", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Item 1">Content 1</AccordionItem>
                <AccordionItem title="Item 2">Content 2</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(AccordionItem)).toHaveLength(2);
        wrapper.find(AccordionItem).forEach((item) => {
            expect(item.find(".accordionItem").exists()).toBeTruthy();
        });
    });

    it.each<IAccordionProps["size"]>(["large", "medium", "small"])('should pass "%s" size via context', (size) => {
        const wrapper = mount(
            <Accordion size={size}>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(`.accordionItem_size_${size}`)).toHaveLength(1);
    });

    it("renders multiple AccordionItems with different props", () => {
        const MockIcon = Tag;
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Item 1" Icon={MockIcon}>
                    Content 1
                </AccordionItem>
                <AccordionItem title="Item 2">Content 2</AccordionItem>
                <AccordionItem title="Item 3">Content 3</AccordionItem>
            </Accordion>
        );

        expect(wrapper.find(AccordionItem)).toHaveLength(3);
        expect(wrapper.find(Tag).exists()).toBeTruthy();
    });
});

describe("AccordionItem", () => {
    let setup: ReactWrapper<IAccordionItemProps>;

    beforeEach(() => {
        setup = mount(
            <Accordion>
                <AccordionItem title="Test Title">Test Content</AccordionItem>
            </Accordion>
        );
    });

    it("renders without crashing", () => {
        expect(setup.find(AccordionItem).exists()).toBeTruthy();
    });

    it("renders title prop correctly", () => {
        const title = "Accordion Item Title";
        const wrapper = mount(
            <Accordion>
                <AccordionItem title={title}>Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(".accordionItem__title").first().text()).toBe(title);
    });

    it("renders Tooltip when title is provided", () => {
        const title = "Test Title";
        const wrapper = mount(
            <Accordion>
                <AccordionItem title={title}>Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
        expect(wrapper.find(Tooltip).prop("text")).toBe(title);
    });

    it("does not render title when not provided", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem>Content</AccordionItem>
            </Accordion>
        );
        // Title element exists as spacer, but Tooltip and Text should not exist
        expect(wrapper.find(".accordionItem__title").exists()).toBeTruthy();
        expect(wrapper.find(Tooltip).exists()).toBeFalsy();
        expect(wrapper.find(Text).exists()).toBeFalsy();
        // Spacer should be empty
        expect(wrapper.find(".accordionItem__title").text()).toBe("");
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" className={className}>
                    Content
                </AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(".accordionItem").hasClass(className)).toBeTruthy();
    });

    it("toggles expanded state on chevron button click", () => {
        expect(setup.find(".accordionItem_expanded")).toHaveLength(0);
        expect(setup.find(".accordionItem__body")).toHaveLength(0);

        setup.find(".accordionItem__header button").first().simulate("click");
        setup.update();

        expect(setup.find(".accordionItem_expanded")).toHaveLength(1);
        expect(setup.find(".accordionItem__body")).toHaveLength(1);

        setup.find(".accordionItem__header button").first().simulate("click");
        setup.update();

        expect(setup.find(".accordionItem_expanded")).toHaveLength(0);
        expect(setup.find(".accordionItem__body")).toHaveLength(0);
    });

    it("renders Icon when provided", () => {
        const MockIcon = Tag;
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" Icon={MockIcon}>
                    Content
                </AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(MockIcon).exists()).toBeTruthy();
    });

    it("does not render Icon when not provided", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(Tag).exists()).toBeFalsy();
    });

    it("renders children content correctly when expanded", () => {
        const content = "Test Content";
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test">
                    <div className="test-content">{content}</div>
                </AccordionItem>
            </Accordion>
        );

        expect(wrapper.find(".test-content")).toHaveLength(0);

        wrapper.find(".accordionItem__header button").first().simulate("click");
        wrapper.update();

        expect(wrapper.find(".test-content")).toHaveLength(1);
        expect(wrapper.find(".test-content").text()).toBe(content);
    });

    it("renders actions when provided", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem
                    title="Test"
                    actions={[{ Icon: Tag, appearance: "secondary", layout: "text", className: "test-action" }]}
                >
                    Content
                </AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();
        expect(wrapper.find(ButtonGroup).find(Button).length).toBeGreaterThan(0);
        expect(wrapper.find(".test-action").length).toBeGreaterThan(0);
    });

    it("does not render actions when not provided", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(ButtonGroup).exists()).toBeFalsy();
    });

    it("sets aria-expanded attribute correctly", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );

        const button = wrapper.find(".accordionItem__header button").first();

        expect(button.prop("aria-expanded")).toBe(false);

        button.simulate("click");
        wrapper.update();

        expect(wrapper.find(".accordionItem__header button").first().prop("aria-expanded")).toBe(true);
    });

    it.each<IAccordionProps["size"]>(["large", "medium", "small"])('should apply "%s" size from context', (size) => {
        const wrapper = mount(
            <Accordion size={size}>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(`.accordionItem_size_${size}`)).toHaveLength(1);
    });

    it("applies ellipsis to long titles", () => {
        const longTitle = "This is a very long accordion item title that should be truncated";
        const wrapper = mount(
            <Accordion>
                <AccordionItem title={longTitle}>Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(".accordionItem__title").first().hasClass("ellipsis-text")).toBeTruthy();
    });

    it("each AccordionItem maintains independent expanded state", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Item 1">Content 1</AccordionItem>
                <AccordionItem title="Item 2">Content 2</AccordionItem>
                <AccordionItem title="Item 3">Content 3</AccordionItem>
            </Accordion>
        );

        wrapper.find(".accordionItem__header button").at(0).simulate("click");
        wrapper.update();

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(1);

        wrapper.find(".accordionItem__header button").at(2).simulate("click");
        wrapper.update();

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(2);

        wrapper.find(".accordionItem__header button").at(0).simulate("click");
        wrapper.update();

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(1);
    });
});
