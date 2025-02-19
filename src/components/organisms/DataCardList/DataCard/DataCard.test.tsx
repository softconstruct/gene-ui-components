import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import KeyValue from "@components/molecules/KeyValue";
import DataCard, { IDataCardProps } from "@components/organisms/DataCardList/DataCard";

const cardTextData: IDataCardProps["cardData"] = Array.from(Array(8).keys()).map((index) => ({
    key: `Title ${index + 1}`,
    value: { text: "Description", type: "text" }
}));

const cardPillData: IDataCardProps["cardData"] = Array.from(Array(8).keys()).map((index) => ({
    key: `Title ${index + 1}`,
    value: { text: "Description", type: "pill", isFill: true }
}));

const cardTextLinkData: IDataCardProps["cardData"] = Array.from(Array(8).keys()).map((index) => ({
    key: `Title ${index + 1}`,
    value: { text: "Description", type: "textLink", href: "#" }
}));

describe("DataCard ", () => {
    let setup: ReactWrapper<IDataCardProps>;
    beforeEach(() => {
        setup = mount(<DataCard cardData={cardTextData} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("should render maximum 6 rows", () => {
        const rows = setup.find(KeyValue);
        expect(rows.length).toEqual(6);
    });

    it("should render text values", () => {
        const rows = setup.find(KeyValue);
        expect(rows.at(0).find(".keyValue__value").exists()).toBeTruthy();
    });

    it("should render pill values", () => {
        const wrapper = setup.setProps({ cardData: cardPillData });
        const rows = wrapper.find(KeyValue);
        expect(rows.length).toEqual(6);
        expect(rows.at(0).find(".pill").exists()).toBeTruthy();
    });

    it("should render textLink values", () => {
        const wrapper = setup.setProps({ cardData: cardTextLinkData });
        const rows = wrapper.find(KeyValue);
        expect(rows.length).toEqual(6);
        expect(rows.at(0).find(".textLink").exists()).toBeTruthy();
    });

    it.each<IDataCardProps["size"]>(["large", "medium"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(KeyValue).at(0).props().size).toEqual(size);
    });

    it.each<IDataCardProps["role"]>([
        "alert",
        "alertdialog",
        "button",
        "checkbox",
        "dialog",
        "gridcell",
        "link",
        "log",
        "marquee",
        "menuitem",
        "menuitemcheckbox",
        "menuitemradio",
        "option",
        "progressbar",
        "radio",
        "scrollbar",
        "searchbox",
        "slider",
        "spinbutton",
        "status",
        "switch",
        "tab",
        "tabpanel",
        "textbox",
        "timer",
        "tooltip",
        "treeitem"
    ])("should have %s role", (role) => {
        const wrapper = setup.setProps({ role });
        expect(wrapper.props().role).toEqual(role);
    });
});
