import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TransferList, { ITransferListProps } from "./index";

const sourceItems = [
    { id: "source-a", title: "Source A" },
    { id: "source-b", title: "Source B" }
];

const targetItems = [{ id: "target-a", title: "Target A" }];

const twoPanels: ITransferListProps["panels"] = [
    { id: "source", defaultItems: sourceItems },
    { id: "target", defaultItems: targetItems }
];

const threePanels: ITransferListProps["panels"] = [
    { id: "panel-1", defaultItems: [{ id: "a", title: "A" }] },
    { id: "panel-2", defaultItems: [{ id: "b", title: "B" }] },
    { id: "panel-3", defaultItems: [{ id: "c", title: "C" }] }
];

describe("TransferList ", () => {
    let setup: ReactWrapper<ITransferListProps>;
    beforeEach(() => {
        setup = mount(<TransferList panels={twoPanels} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("does not render redundant panel title elements", () => {
        expect(setup.find(".transferList__title").exists()).toBeFalsy();
    });

    it("moves selected items forward and emits payload", () => {
        const onChange = jest.fn();
        const wrapper = mount(<TransferList panels={twoPanels} onChange={onChange} />);

        const sourceCheckboxes = wrapper.find(".transferList__panel").at(0).find("input[type='checkbox']");
        sourceCheckboxes.at(1).simulate("change", { target: { checked: true } });

        const moveForwardButton = wrapper.find(".transferList__controls button").at(0);
        moveForwardButton.simulate("click");

        expect(onChange).toHaveBeenCalledTimes(1);
        const payload = onChange.mock.calls[0][0];
        expect(payload.fromPanelIndex).toBe(0);
        expect(payload.toPanelIndex).toBe(1);
        expect(payload.direction).toBe("forward");
        expect(payload.movedIds).toContain("source-a");
        expect(payload.panels[0].map((item: { id: string }) => item.id)).toEqual(["source-b"]);
        expect(payload.panels[1].map((item: { id: string }) => item.id)).toEqual(["target-a", "source-a"]);
    });

    it("does not mutate controlled lists without parent update", () => {
        const onChange = jest.fn();
        const controlledPanels = [
            { id: "source", items: sourceItems },
            { id: "target", items: targetItems }
        ];
        const wrapper = mount(<TransferList panels={controlledPanels} onChange={onChange} />);

        const sourceCheckboxes = wrapper.find(".transferList__panel").at(0).find("input[type='checkbox']");
        sourceCheckboxes.at(1).simulate("change", { target: { checked: true } });
        wrapper.find(".transferList__controls button").at(0).simulate("click");
        wrapper.update();

        const leftPanelText = wrapper.find(".transferList__panel").at(0).text();
        expect(leftPanelText).toContain("Source A");
        expect(leftPanelText).toContain("Source B");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("renders three panels with two control columns", () => {
        const wrapper = mount(<TransferList panels={threePanels} />);
        expect(wrapper.find(".transferList__panel")).toHaveLength(3);
        expect(wrapper.find(".transferList__controls")).toHaveLength(2);
        expect(wrapper.find(".transferList").hasClass("transferList_panels3")).toBeTruthy();
    });

    it("throws when panel count is invalid", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        expect(() => mount(<TransferList panels={[{ id: "only", defaultItems: [] }]} />)).toThrow(
            /requires between 2 and 4 panels/
        );
        consoleError.mockRestore();
    });
});
