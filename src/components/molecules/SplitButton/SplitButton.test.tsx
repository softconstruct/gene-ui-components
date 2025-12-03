import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ArrowRight, ChevronDoubleRight, Download, RecycleBin } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { IMenuItemProps, Menu } from "@components/molecules/Menu";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import { ISplitButtonProps, SplitButton } from "./index";

describe("SplitButton ", () => {
    let setup: ReactWrapper<ISplitButtonProps>;
    const onSelect = jest.fn();
    const items = [
        { title: "Replay", Icon: ArrowRight, id: "replay" },
        { title: "Forward", Icon: ChevronDoubleRight, id: "forward" },
        { title: "Download", Icon: Download, id: "download" },
        { title: "Delete", Icon: RecycleBin, id: "delete" }
    ];

    beforeEach(() => {
        setup = mount(<SplitButton appearance="primary" layout="outline" items={items} onSelect={onSelect} />, {
            wrappingComponent: GeneUIProvider
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders loader when loading is true", () => {
        const wrapper = setup.setProps({ loading: true });
        expect(wrapper.find(".splitButton__loader").exists()).toBeTruthy();
    });

    it("renders a single Button when only one item is provided", () => {
        const wrapper = setup.setProps({ items: [items[0]] });
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(".splitButton__button_type_toggle")).toHaveLength(0);
    });

    it("disables both controls when disabled prop is true", () => {
        const wrapper = setup.setProps({ disabled: true });
        const buttons = wrapper.find("button");
        expect(buttons).toHaveLength(2);
        buttons.forEach((btn) => expect(btn.prop("disabled")).toBeTruthy());
    });

    it("passes remaining items to Menu as children with matching ids", () => {
        const restItems = items.slice(1);
        const menuChildren = setup.find(Menu).prop("children");
        expect(React.Children.count(menuChildren)).toBe(restItems.length);

        React.Children.toArray(menuChildren).forEach((child, index) => {
            const element = child as React.ReactElement;
            expect(element.props.id).toBe(restItems[index].id);
        });
    });

    it("calls onSelect with normalized payload when main button is clicked", () => {
        setup.find("button").at(0).simulate("click");
        const [firstItem] = items;
        expect(onSelect).toHaveBeenCalledWith({
            title: firstItem.title,
            Icon: firstItem.Icon,
            id: firstItem.id
        });
    });

    it("calls onSelect when a menu item triggers change", () => {
        const [secondItem] = items;
        const menuOnChange = setup.find(Menu).prop("onChange") as (item: IMenuItemProps) => void;
        menuOnChange({
            title: secondItem.title,
            id: secondItem.id,
            IconBefore: secondItem.Icon
        });
        expect(onSelect).toHaveBeenCalledWith({
            title: secondItem.title,
            Icon: secondItem.Icon,
            id: secondItem.id
        });
    });
});
