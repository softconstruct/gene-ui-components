import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Icons
import { Tag } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import ButtonGroup from "@components/molecules/ButtonGroup";

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
                <AccordionItem title="Item 1" IconBefore={MockIcon}>
                    Content 1
                </AccordionItem>
                <AccordionItem title="Item 2" disabled>
                    Content 2
                </AccordionItem>
                <AccordionItem title="Item 3">Content 3</AccordionItem>
            </Accordion>
        );

        expect(wrapper.find(AccordionItem)).toHaveLength(3);
        expect(wrapper.find(Tag).exists()).toBeTruthy();
        expect(wrapper.find(".accordionItem_disabled")).toHaveLength(1);
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

        // Click the chevron button to expand
        setup.find(".accordionItem__header button").first().simulate("click");
        setup.update();

        expect(setup.find(".accordionItem_expanded")).toHaveLength(1);
        expect(setup.find(".accordionItem__body")).toHaveLength(1);

        // Click again to collapse
        setup.find(".accordionItem__header button").first().simulate("click");
        setup.update();

        expect(setup.find(".accordionItem_expanded")).toHaveLength(0);
        expect(setup.find(".accordionItem__body")).toHaveLength(0);
    });

    it("renders disabled prop correctly", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" disabled>
                    Content
                </AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(".accordionItem_disabled")).toHaveLength(1);
        expect(wrapper.find(".accordionItem__header button").first().prop("disabled")).toBe(true);
    });

    it("does not expand when disabled", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" disabled>
                    Content
                </AccordionItem>
            </Accordion>
        );

        // Try to click the disabled button
        wrapper.find(".accordionItem__header button").first().simulate("click");
        wrapper.update();

        // Should not expand
        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(0);
        expect(wrapper.find(".accordionItem__body")).toHaveLength(0);
    });

    it("renders IconBefore when provided", () => {
        const MockIcon = Tag;
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" IconBefore={MockIcon}>
                    Content
                </AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(MockIcon).exists()).toBeTruthy();
    });

    it("does not render IconBefore when not provided", () => {
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

        // Content should not be visible initially
        expect(wrapper.find(".test-content")).toHaveLength(0);

        // Expand to see content
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
                    actions={
                        <button type="button" className="test-action">
                            Action
                        </button>
                    }
                >
                    Content
                </AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(".test-action")).toHaveLength(1);
    });

    it("does not render actions when not provided", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
        expect(wrapper.find(".accordionItem__header").children()).toHaveLength(2); // Only button and title
    });

    it("disables action buttons when disabled prop is true", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem
                    title="Test"
                    disabled
                    actions={
                        <ButtonGroup size="medium">
                            <Button appearance="secondary" layout="text" className="action-button-1" />
                            <Button appearance="secondary" layout="text" className="action-button-2" />
                        </ButtonGroup>
                    }
                >
                    Content
                </AccordionItem>
            </Accordion>
        );

        // Check that ButtonGroup is disabled
        expect(wrapper.find(ButtonGroup).prop("disabled")).toBe(true);
        // Check that all buttons inside are disabled
        wrapper.find(Button).forEach((button) => {
            expect(button.prop("disabled")).toBe(true);
        });
    });

    it("sets aria-expanded attribute correctly", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );

        const button = wrapper.find(".accordionItem__header button").first();

        // Initially collapsed
        expect(button.prop("aria-expanded")).toBe(false);

        // Expand
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

        // Expand first item
        wrapper.find(".accordionItem__header button").at(0).simulate("click");
        wrapper.update();

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(1);

        // Expand third item
        wrapper.find(".accordionItem__header button").at(2).simulate("click");
        wrapper.update();

        // Both should be expanded (independent state)
        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(2);

        // Collapse first item
        wrapper.find(".accordionItem__header button").at(0).simulate("click");
        wrapper.update();

        // Only third should be expanded now
        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(1);
    });
});
