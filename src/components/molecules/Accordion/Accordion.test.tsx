import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ChevronDown, ChevronRight, Tag } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Tooltip from "@components/molecules/Tooltip";

import Accordion, { IAccordionProps } from "./Accordion";
import AccordionItem from "./AccordionItem";

describe("Accordion", () => {
    let setup: ReactWrapper<IAccordionProps>;

    beforeEach(() => {
        setup = mount(
            <Accordion>
                <AccordionItem title="Test">Content</AccordionItem>
            </Accordion>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".accordion").hasClass(className)).toBeTruthy();
    });

    it("renders children correctly", () => {
        const wrapper = setup.setProps({
            children: (
                <>
                    <AccordionItem title="Item 1">Content 1</AccordionItem>
                    <AccordionItem title="Item 2">Content 2</AccordionItem>
                    <AccordionItem title="Item 3">Content 3</AccordionItem>
                </>
            )
        });
        expect(wrapper.find(AccordionItem)).toHaveLength(3);
    });

    it("only accepts AccordionItem as children", () => {
        const wrapper = setup.setProps({
            children: (
                <>
                    <AccordionItem title="Item 1">Content 1</AccordionItem>
                    <AccordionItem title="Item 2">Content 2</AccordionItem>
                </>
            )
        });
        expect(wrapper.find(AccordionItem)).toHaveLength(2);
        wrapper.find(AccordionItem).forEach((item) => {
            expect(item.find(".accordionItem").exists()).toBeTruthy();
        });
    });

    it.each<IAccordionProps["size"]>(["large", "medium", "small"])('should pass "%s" size via context', (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`.accordionItem_size_${size}`)).toHaveLength(1);
    });

    it("renders multiple AccordionItems with different props", () => {
        const MockIcon = Tag;
        const wrapper = setup.setProps({
            children: (
                <>
                    <AccordionItem title="Item 1" Icon={MockIcon}>
                        Content 1
                    </AccordionItem>
                    <AccordionItem title="Item 2">Content 2</AccordionItem>
                    <AccordionItem title="Item 3">Content 3</AccordionItem>
                </>
            )
        });

        expect(wrapper.find(AccordionItem)).toHaveLength(3);
        expect(wrapper.find(Tag).exists()).toBeTruthy();
    });

    it("calls onToggle callback when accordion item is toggled", () => {
        const onToggleMock = jest.fn();
        const wrapper = setup.setProps({
            onToggle: onToggleMock,
            children: (
                <AccordionItem title="Test" id="test-item-1">
                    Content
                </AccordionItem>
            )
        });

        expect(onToggleMock).not.toHaveBeenCalled();

        wrapper.find(".accordionItem__header button").first().simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(1);
        expect(onToggleMock).toHaveBeenCalledWith({
            id: "test-item-1",
            isExpanded: true
        });

        wrapper.find(".accordionItem__header button").first().simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(2);
        expect(onToggleMock).toHaveBeenLastCalledWith({
            id: "test-item-1",
            isExpanded: false
        });
    });

    it("calls onToggle callback with undefined id when id is not provided", () => {
        const onToggleMock = jest.fn();
        const wrapper = setup.setProps({
            onToggle: onToggleMock,
            children: <AccordionItem title="Test">Content</AccordionItem>
        });

        wrapper.find(".accordionItem__header button").first().simulate("click");

        expect(onToggleMock).toHaveBeenCalledWith({
            id: undefined,
            isExpanded: true
        });
    });

    it("calls onToggle callback for each accordion item independently", () => {
        const onToggleMock = jest.fn();
        const wrapper = setup.setProps({
            onToggle: onToggleMock,
            children: (
                <>
                    <AccordionItem title="Item 1" id="item-1">
                        Content 1
                    </AccordionItem>
                    <AccordionItem title="Item 2" id="item-2">
                        Content 2
                    </AccordionItem>
                    <AccordionItem title="Item 3" id="item-3">
                        Content 3
                    </AccordionItem>
                </>
            )
        });

        wrapper.find(".accordionItem__header button").at(0).simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(1);
        expect(onToggleMock).toHaveBeenLastCalledWith({
            id: "item-1",
            isExpanded: true
        });

        wrapper.find(".accordionItem__header button").at(1).simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(2);
        expect(onToggleMock).toHaveBeenLastCalledWith({
            id: "item-2",
            isExpanded: true
        });

        wrapper.find(".accordionItem__header button").at(2).simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(3);
        expect(onToggleMock).toHaveBeenLastCalledWith({
            id: "item-3",
            isExpanded: true
        });
    });

    it("does not throw error when onToggle is not provided", () => {
        const wrapper = setup.setProps({
            children: (
                <AccordionItem title="Test" id="test-item">
                    Content
                </AccordionItem>
            )
        });

        expect(() => {
            wrapper.find(".accordionItem__header button").first().simulate("click");
        }).not.toThrow();
    });
});

describe("AccordionItem", () => {
    let setup: ReactWrapper<IAccordionProps>;

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

    it("renders id prop correctly", () => {
        const wrapper = setup.setProps({
            children: (
                <AccordionItem title="Test" id="test-accordion-item">
                    Content
                </AccordionItem>
            )
        });
        expect(wrapper.find("#test-accordion-item").exists()).toBeTruthy();
        expect(wrapper.find(".accordionItem").prop("id")).toBe("test-accordion-item");
    });

    it("does not render id attribute when id prop is not provided", () => {
        const wrapper = setup.setProps({
            children: <AccordionItem title="Test">Content</AccordionItem>
        });
        const accordionItem = wrapper.find(".accordionItem");
        expect(accordionItem.prop("id")).toBeUndefined();
    });

    it("renders title prop correctly", () => {
        expect(setup.find(".accordionItem__title").first().text()).toBe("Test Title");
    });

    it("renders Tooltip when title is provided", () => {
        expect(setup.find(Tooltip).exists()).toBeTruthy();
        expect(setup.find(Tooltip).prop("text")).toBe("Test Title");
    });

    it("does not render title when not provided", () => {
        const wrapper = setup.setProps({ children: <AccordionItem>Content</AccordionItem> });
        expect(wrapper.find(".accordionItem__title").exists()).toBeTruthy();
        expect(wrapper.find(Tooltip).exists()).toBeFalsy();
        expect(wrapper.find(".accordionItem__title").text()).toBe("");
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

    it("renders expanded by default when defaultExpanded is true", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" defaultExpanded>
                    Content
                </AccordionItem>
            </Accordion>
        );

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(1);
        expect(wrapper.find(".accordionItem__body")).toHaveLength(1);
        expect(wrapper.find(".accordionItem__header button").first().prop("aria-expanded")).toBe(true);
        expect(wrapper.find(Scrollbar).exists()).toBeTruthy();
    });

    it("renders collapsed by default when defaultExpanded is false", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" defaultExpanded={false}>
                    Content
                </AccordionItem>
            </Accordion>
        );

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(0);
        expect(wrapper.find(".accordionItem__body")).toHaveLength(0);
        expect(wrapper.find(".accordionItem__header button").first().prop("aria-expanded")).toBe(false);
    });

    it("renders collapsed by default when defaultExpanded is not provided", () => {
        expect(setup.find(".accordionItem_expanded")).toHaveLength(0);
        expect(setup.find(".accordionItem__body")).toHaveLength(0);
        expect(setup.find(".accordionItem__header button").first().prop("aria-expanded")).toBe(false);
    });

    it("allows toggling after initial defaultExpanded state", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Test" defaultExpanded>
                    Content
                </AccordionItem>
            </Accordion>
        );

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(1);

        wrapper.find(".accordionItem__header button").first().simulate("click");
        wrapper.update();

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(0);
        expect(wrapper.find(".accordionItem__body")).toHaveLength(0);

        wrapper.find(".accordionItem__header button").first().simulate("click");
        wrapper.update();

        expect(wrapper.find(".accordionItem_expanded")).toHaveLength(1);
        expect(wrapper.find(".accordionItem__body")).toHaveLength(1);
    });

    it("each AccordionItem can have independent defaultExpanded values", () => {
        const wrapper = mount(
            <Accordion>
                <AccordionItem title="Item 1" defaultExpanded>
                    Content 1
                </AccordionItem>
                <AccordionItem title="Item 2" defaultExpanded={false}>
                    Content 2
                </AccordionItem>
                <AccordionItem title="Item 3">Content 3</AccordionItem>
            </Accordion>
        );

        const expandedItems = wrapper.find(".accordionItem_expanded");
        expect(expandedItems).toHaveLength(1);
        expect(wrapper.find(".accordionItem__header button").at(0).prop("aria-expanded")).toBe(true);
        expect(wrapper.find(".accordionItem__header button").at(1).prop("aria-expanded")).toBe(false);
        expect(wrapper.find(".accordionItem__header button").at(2).prop("aria-expanded")).toBe(false);
    });

    it("calls onToggle callback with correct id and isExpanded state", () => {
        const onToggleMock = jest.fn();
        const wrapper = setup.setProps({
            onToggle: onToggleMock,
            children: (
                <AccordionItem title="Test Title" id="accordion-item-1">
                    Test Content
                </AccordionItem>
            )
        });

        const button = wrapper.find(".accordionItem__header button").first();

        button.simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(1);
        expect(onToggleMock).toHaveBeenCalledWith({
            id: "accordion-item-1",
            isExpanded: true
        });

        button.simulate("click");

        expect(onToggleMock).toHaveBeenCalledTimes(2);
        expect(onToggleMock).toHaveBeenLastCalledWith({
            id: "accordion-item-1",
            isExpanded: false
        });
    });

    it("renders Icon when provided", () => {
        const MockIcon = Tag;
        const wrapper = setup.setProps({
            children: (
                <AccordionItem title="Test" Icon={MockIcon}>
                    Content
                </AccordionItem>
            )
        });
        expect(wrapper.find(MockIcon).exists()).toBeTruthy();
    });

    it("does not render Icon when not provided", () => {
        expect(setup.find(Tag).exists()).toBeFalsy();
    });

    it("renders children content correctly when expanded", () => {
        const content = "Test Content";
        const wrapper = setup.setProps({
            children: (
                <AccordionItem title="Test">
                    <div className="test-content">{content}</div>
                </AccordionItem>
            )
        });

        expect(wrapper.find(".test-content")).toHaveLength(0);

        wrapper.find(".accordionItem__header button").first().simulate("click");
        wrapper.update();

        expect(wrapper.find(".test-content")).toHaveLength(1);
        expect(wrapper.find(".test-content").text()).toBe(content);
    });

    it("renders accordionItem__inner div when expanded", () => {
        expect(setup.find(".accordionItem__inner").exists()).toBeFalsy();
        setup.find(".accordionItem__header button").first().simulate("click");
        setup.update();
        expect(setup.find(".accordionItem__inner").exists()).toBeTruthy();
        expect(setup.find(".accordionItem__inner").text()).toBe("Test Content");
        expect(setup.find(".accordionItem__content").find(".accordionItem__inner").exists()).toBeTruthy();
    });

    it("renders actions when provided", () => {
        const wrapper = setup.setProps({
            children: (
                <AccordionItem title="Test" actions={[{ Icon: Tag, id: "test-action", name: "Test action" }]}>
                    Content
                </AccordionItem>
            )
        });
        wrapper.update();
        expect(wrapper.find(ButtonGroup).exists()).toBeTruthy();
        expect(wrapper.find(ButtonGroup).find(Button).length).toBeGreaterThan(0);
        expect(wrapper.find(ButtonGroup).find(Button).first().prop("id")).toBe("test-action");
    });

    it("does not render actions when not provided", () => {
        expect(setup.find(ButtonGroup).exists()).toBeFalsy();
    });

    it("sets aria-expanded attribute correctly", () => {
        const button = setup.find(".accordionItem__header button").first();

        expect(button.prop("aria-expanded")).toBe(false);

        button.simulate("click");
        setup.update();

        expect(setup.find(".accordionItem__header button").first().prop("aria-expanded")).toBe(true);
    });

    it.each<IAccordionProps["size"]>(["large", "medium", "small"])('should apply "%s" size from context', (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`.accordionItem_size_${size}`)).toHaveLength(1);
    });

    it("applies ellipsis to long titles", () => {
        const longTitle = "This is a very long accordion item title that should be truncated";
        const wrapper = setup.setProps({
            children: <AccordionItem title={longTitle}>Content</AccordionItem>
        });
        expect(wrapper.find(".accordionItem__title").first().hasClass("ellipsis-text")).toBeTruthy();
    });

    it("each AccordionItem maintains independent expanded state", () => {
        const wrapper = setup.setProps({
            children: (
                <>
                    <AccordionItem title="Item 1">Content 1</AccordionItem>
                    <AccordionItem title="Item 2">Content 2</AccordionItem>
                    <AccordionItem title="Item 3">Content 3</AccordionItem>
                </>
            )
        });

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

    it("changes chevron icon when expanded/collapsed", () => {
        const button = setup.find(".accordionItem__header button").first();

        expect(button.find(ChevronRight).exists()).toBeTruthy();
        expect(button.find(ChevronDown).exists()).toBeFalsy();

        button.simulate("click");
        setup.update();

        expect(setup.find(".accordionItem__header button").first().find(ChevronDown).exists()).toBeTruthy();
        expect(setup.find(".accordionItem__header button").first().find(ChevronRight).exists()).toBeFalsy();

        setup.find(".accordionItem__header button").first().simulate("click");
        setup.update();

        expect(setup.find(".accordionItem__header button").first().find(ChevronRight).exists()).toBeTruthy();
        expect(setup.find(".accordionItem__header button").first().find(ChevronDown).exists()).toBeFalsy();
    });

    it("renders Scrollbar in expanded content", () => {
        expect(setup.find(Scrollbar).exists()).toBeFalsy();

        setup.find(".accordionItem__header button").first().simulate("click");
        setup.update();

        expect(setup.find(Scrollbar).exists()).toBeTruthy();
    });
    it("renders multiple actions correctly", () => {
        const wrapper = setup.setProps({
            children: (
                <AccordionItem
                    title="Test"
                    actions={[
                        { Icon: Tag, id: "action-1", name: "Action 1" },
                        { Icon: Tag, id: "action-2", name: "Action 2" },
                        { Icon: Tag, id: "action-3", name: "Action 3" }
                    ]}
                >
                    Content
                </AccordionItem>
            )
        });
        wrapper.update();
        expect(wrapper.find(ButtonGroup).find(Button)).toHaveLength(3);
        expect(wrapper.find(ButtonGroup).find(Button).at(0).prop("id")).toBe("action-1");
        expect(wrapper.find(ButtonGroup).find(Button).at(1).prop("id")).toBe("action-2");
        expect(wrapper.find(ButtonGroup).find(Button).at(2).prop("id")).toBe("action-3");
    });

    it("calls action onClick handler when action button is clicked", () => {
        const onClickMock = jest.fn();
        const wrapper = setup.setProps({
            children: (
                <AccordionItem title="Test" actions={[{ Icon: Tag, onClick: onClickMock, name: "Tag" }]}>
                    Content
                </AccordionItem>
            )
        });
        wrapper.update();
        wrapper.find(ButtonGroup).find(Button).first().simulate("click");
        expect(onClickMock).toHaveBeenCalled();
    });

    it("does not render ButtonGroup when actions array is empty", () => {
        const wrapper = setup.setProps({
            children: (
                <AccordionItem title="Test" actions={[]}>
                    Content
                </AccordionItem>
            )
        });
        expect(wrapper.find(ButtonGroup).exists()).toBeFalsy();
    });
});
