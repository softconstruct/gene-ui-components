import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import TransferList, { ITransferListProps } from "./index";

const sourceItems = [
    { id: "source-a", title: "Source A" },
    { id: "source-b", title: "Source B" }
];

const targetItems = [{ id: "target-a", title: "Target A" }];

describe("TransferList ", () => {
    let setup: ReactWrapper<ITransferListProps>;
    beforeEach(() => {
        setup = mount(<TransferList defaultSourceItems={sourceItems} defaultTargetItems={targetItems} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("moves selected items to target and emits payload", () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <TransferList defaultSourceItems={sourceItems} defaultTargetItems={targetItems} onChange={onChange} />
        );

        const sourceCheckboxes = wrapper.find(".transferList__panel").at(0).find("input[type='checkbox']");
        sourceCheckboxes.at(1).simulate("change", { target: { checked: true } });

        const moveRightButton = wrapper.find(".transferList__controls button").at(0);
        moveRightButton.simulate("click");

        expect(onChange).toHaveBeenCalledTimes(1);
        const payload = onChange.mock.calls[0][0];
        expect(payload.direction).toBe("toTarget");
        expect(payload.movedIds).toContain("source-a");
        expect(payload.sourceItems.map((item: { id: string }) => item.id)).toEqual(["source-b"]);
        expect(payload.targetItems.map((item: { id: string }) => item.id)).toEqual(["target-a", "source-a"]);
    });

    it("does not mutate controlled lists without parent update", () => {
        const onChange = jest.fn();
        const wrapper = mount(<TransferList sourceItems={sourceItems} targetItems={targetItems} onChange={onChange} />);

        const sourceCheckboxes = wrapper.find(".transferList__panel").at(0).find("input[type='checkbox']");
        sourceCheckboxes.at(1).simulate("change", { target: { checked: true } });
        wrapper.find(".transferList__controls button").at(0).simulate("click");
        wrapper.update();

        const leftPanelText = wrapper.find(".transferList__panel").at(0).text();
        expect(leftPanelText).toContain("Source A");
        expect(leftPanelText).toContain("Source B");
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
