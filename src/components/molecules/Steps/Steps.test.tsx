import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { SuccessFilled, Unavailable } from "@geneui/icons";

import Label from "@components/atoms/Label";
// Components
import { IStepProps, IStepsProps, Step, Steps } from "@components/molecules/Steps";

describe("Steps ", () => {
    let setup: ReactWrapper<IStepsProps>;
    beforeEach(() => {
        setup = mount(
            <Steps>
                <Step id={33} label={{ text: "test label" }} description="test description" />
            </Steps>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders children prop correctly", () => {
        expect(setup.find(Step)).toBeTruthy();
    });

    it.each<IStepsProps["direction"]>(["vertical", "horizontal"])('should have "%s" direction', (direction) => {
        const wrapper = setup.setProps({ direction });

        expect(wrapper.find(".steps").hasClass(`steps_direction_${direction}`)).toBeTruthy();
    });

    it.each<IStepsProps["type"]>(["dot", "numeric"])('should have "%s" type', (type) => {
        const wrapper = setup.setProps({ type });

        expect(wrapper.find(`steps__status_${type}`)).toBeTruthy();
    });

    it("renders complete prop correctly", () => {
        const wrapper = mount(
            <Steps>
                <Step id={33} complete />
            </Steps>
        );
        expect(wrapper.find(SuccessFilled)).toBeTruthy();
    });

    it("renders error prop correctly", () => {
        const wrapper = mount(
            <Steps>
                <Step id={33} error />
            </Steps>
        );
        expect(wrapper.find(".steps__step").hasClass("steps__step_error")).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        expect(setup.find(Label).text()).toStrictEqual("test label");
    });

    it("renders description prop correctly", () => {
        expect(setup.find(".steps__description").text()).toStrictEqual("test description");
    });

    it.each<IStepProps["state"]>(["previous", "current", "next"])('should have "%s" state', (state) => {
        const wrapper = mount(
            <Steps>
                <Step id={33} state={state} />
            </Steps>
        );
        if (state === "next") {
            expect(wrapper.find(Unavailable)).toBeTruthy();
        } else if (state === "previous") {
            expect(wrapper.find(Unavailable)).toBeTruthy();
        } else if (state !== "current") {
            wrapper.find(Step).setProps({ complete: true });
            expect(wrapper.find(SuccessFilled)).toBeTruthy();
        }
    });

    it("calls onChange when the step is clicked", () => {
        const onChangeMock = jest.fn();
        const id = 33;
        const wrapper = mount(
            <Steps onChange={onChangeMock}>
                <Step id={id} label={{ text: "test label" }} />
            </Steps>
        );

        const stepLabel = wrapper.find(".steps__label");

        expect(stepLabel.exists()).toBe(true);

        stepLabel.simulate("click");

        expect(onChangeMock).toHaveBeenCalledWith(wrapper.find(Step).props());
    });
});
