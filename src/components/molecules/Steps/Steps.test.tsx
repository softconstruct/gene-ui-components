import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ErrorFilled, SuccessFilled } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import Loader from "@components/atoms/Loader";
import { IStepProps, IStepsProps, Step, Steps } from "@components/molecules/Steps";

describe("Steps ", () => {
    let setup: ReactWrapper<IStepsProps>;
    beforeEach(() => {
        setup = mount(
            <Steps>
                <Step id={33} label="test label" description="test description" />
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
                <Step id={34} state={state} />
                <Step id={35} state={state} />
            </Steps>
        );

        if (state === "current") {
            wrapper.setProps({ current: 0 });
            expect(wrapper.find(".steps__step_current").exists()).toBeTruthy();
        } else {
            wrapper.setProps({ current: 1 });
            expect(wrapper.find(".steps__status_dot_empty").exists()).toBeTruthy();
        }
    });

    it("calls onChange when the step is clicked", () => {
        const onChangeMock = jest.fn();
        const id = 33;
        const wrapper = mount(
            <Steps onChange={onChangeMock} current={1}>
                <Step id={id} label="test label" />
                <Step id={id} label="test label" />
            </Steps>
        );

        const stepLabel = wrapper.find(".steps__label");

        expect(stepLabel.exists()).toBe(true);

        stepLabel.at(0).simulate("click");

        expect(onChangeMock).toHaveBeenCalledWith(wrapper.find(Step).at(0).props());
    });

    it("renders with prop current is 0", () => {
        const wrapper = mount(
            <Steps current={0}>
                <Step id={1} label="Step 1" />
                <Step id={2} label="Step 2" />
                <Step id={3} label="Step 3" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("state")).toBe("current");
        expect(steps.at(1).prop("state")).toBe("next");
        expect(steps.at(2).prop("state")).toBe("next");
    });

    it("renders with prop current is 1", () => {
        const wrapper = mount(
            <Steps current={1}>
                <Step id={1} label="Step 1" />
                <Step id={2} label="Step 2" />
                <Step id={3} label="Step 3" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("state")).toBe("previous");
        expect(steps.at(1).prop("state")).toBe("current");
        expect(steps.at(2).prop("state")).toBe("next");
    });

    it("renders with prop current is undefined", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} label="Step 1" />
                <Step id={2} label="Step 2" />
                <Step id={3} label="Step 3" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("state")).toBe("next");
        expect(steps.at(1).prop("state")).toBe("next");
        expect(steps.at(2).prop("state")).toBe("next");
    });

    it("renders with prop current is last", () => {
        const wrapper = mount(
            <Steps current={2}>
                <Step id={1} label="Step 1" />
                <Step id={2} label="Step 2" />
                <Step id={3} label="Step 3" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("state")).toBe("previous");
        expect(steps.at(1).prop("state")).toBe("previous");
        expect(steps.at(2).prop("state")).toBe("current");
    });

    it("renders without stepNumber prop", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} label="Step 1" />
                <Step id={2} label="Step 2" />
                <Step id={3} label="Step 3" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("stepNumber")).toBe(1);
        expect(steps.at(1).prop("stepNumber")).toBe(2);
        expect(steps.at(2).prop("stepNumber")).toBe(3);
    });

    it("renders with stepNumber prop", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} label="Step 1" stepNumber={10} />
                <Step id={2} label="Step 2" stepNumber={20} />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("stepNumber")).toBe(10);
        expect(steps.at(1).prop("stepNumber")).toBe(20);
    });

    it("renders without id prop", () => {
        const wrapper = mount(
            <Steps>
                <Step label="Step 1" />
                <Step label="Step 2" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("id")).toBe(1);
        expect(steps.at(1).prop("id")).toBe(2);
    });

    it("renders with id prop", () => {
        const wrapper = mount(
            <Steps>
                <Step id="custom-1" label="Step 1" />
                <Step id="custom-2" label="Step 2" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).prop("id")).toBe("custom-1");
        expect(steps.at(1).prop("id")).toBe("custom-2");
    });

    it("renders with numeric type", () => {
        const wrapper = mount(
            <Steps type="numeric">
                <Step id={1} stepNumber={1} />
                <Step id={2} stepNumber={2} />
            </Steps>
        );

        const numericElements = wrapper.find(".steps__status_numeric");
        expect(numericElements.at(0).text()).toBe("1");
        expect(numericElements.at(1).text()).toBe("2");
    });

    it("renders with stepNumber prop is 10", () => {
        const wrapper = mount(
            <Steps type="numeric">
                <Step id={1} stepNumber={10} />
            </Steps>
        );

        const numericElements = wrapper.find(".steps__status_numeric");
        expect(numericElements.at(0).text()).toBe("9");
    });

    it("shows success icon when complete in numeric type", () => {
        const wrapper = mount(
            <Steps type="numeric" current={1}>
                <Step id={1} stepNumber={1} complete state="previous" />
                <Step id={2} stepNumber={2} />
            </Steps>
        );

        expect(wrapper.find(SuccessFilled)).toBeTruthy();
    });

    it("does not show success icon when current step is complete in numeric type", () => {
        const wrapper = mount(
            <Steps type="numeric" current={0}>
                <Step id={1} stepNumber={1} complete state="current" />
            </Steps>
        );

        const numericElement = wrapper.find(".steps__status_numeric");
        expect(numericElement.text()).toBe("1");
        expect(wrapper.find(SuccessFilled).length).toBe(0);
    });

    it("shows current dot when state is current", () => {
        const wrapper = mount(
            <Steps type="dot" current={0}>
                <Step id={1} />
            </Steps>
        );

        expect(wrapper.find(".steps__status_dot_current").exists()).toBeTruthy();
    });

    it("shows empty dot when state is next", () => {
        const wrapper = mount(
            <Steps type="dot" current={0}>
                <Step id={1} />
                <Step id={2} />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(1).find(".steps__status_dot_empty").exists()).toBeTruthy();
    });

    it("shows success icon when complete in dot type", () => {
        const wrapper = mount(
            <Steps type="dot" current={1}>
                <Step id={1} complete state="previous" />
                <Step id={2} />
            </Steps>
        );

        expect(wrapper.find(SuccessFilled).exists()).toBeTruthy();
    });

    it("does not show success icon when current step is complete in dot type", () => {
        const wrapper = mount(
            <Steps type="dot" current={0}>
                <Step id={1} complete state="current" />
            </Steps>
        );

        expect(wrapper.find(".steps__status_dot_current").exists()).toBeTruthy();
        expect(wrapper.find(SuccessFilled).length).toBe(0);
    });

    it("shows loader when loading is true", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} loading />
            </Steps>
        );

        expect(wrapper.find(Loader).exists()).toBeTruthy();
    });

    it("disables step label when loading", () => {
        const onChangeMock = jest.fn();
        const wrapper = mount(
            <Steps onChange={onChangeMock} current={0}>
                <Step id={1} label="Step 1" loading />
            </Steps>
        );

        const button = wrapper.find("button.steps__label");
        expect(button.prop("disabled")).toBe(true);
    });

    it("shows error icon when error is true", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} error />
            </Steps>
        );

        expect(wrapper.find(ErrorFilled).exists()).toBeTruthy();
    });

    it("applies error class when error is true", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} error />
            </Steps>
        );

        expect(wrapper.find(".steps__step").hasClass("steps__step_error")).toBeTruthy();
    });

    it("error state takes priority over other states", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} error complete />
            </Steps>
        );

        expect(wrapper.find(ErrorFilled).exists()).toBeTruthy();
    });

    it("disables step label when disabled is true", () => {
        const onChangeMock = jest.fn();
        const wrapper = mount(
            <Steps onChange={onChangeMock} current={0}>
                <Step id={1} label="Step 1" disabled />
            </Steps>
        );

        const button = wrapper.find("button.steps__label");
        expect(button.prop("disabled")).toBe(true);
    });

    it("applies disabled class when disabled is true", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} disabled />
            </Steps>
        );

        expect(wrapper.find(".steps__step").hasClass("steps__step_disabled")).toBeTruthy();
    });

    it("does not apply disabled class when error or loading", () => {
        const wrapper1 = mount(
            <Steps>
                <Step id={1} disabled error />
            </Steps>
        );

        const wrapper2 = mount(
            <Steps>
                <Step id={1} disabled loading />
            </Steps>
        );

        expect(wrapper1.find(".steps__step").hasClass("steps__step_disabled")).toBeFalsy();
        expect(wrapper2.find(".steps__step").hasClass("steps__step_disabled")).toBeFalsy();
    });

    it("disables current step label", () => {
        const onChangeMock = jest.fn();
        const wrapper = mount(
            <Steps onChange={onChangeMock} current={0}>
                <Step id={1} label="Step 1" />
            </Steps>
        );

        const button = wrapper.find("button.steps__label");
        expect(button.prop("disabled")).toBe(true);
    });

    it("shows success icon when complete and state is previous", () => {
        const wrapper = mount(
            <Steps current={1}>
                <Step id={1} complete state="previous" />
                <Step id={2} />
            </Steps>
        );

        expect(wrapper.find(SuccessFilled).exists()).toBeTruthy();
    });

    it("applies success class when complete and not next", () => {
        const wrapper = mount(
            <Steps current={1}>
                <Step id={1} complete state="previous" />
                <Step id={2} complete state="current" />
            </Steps>
        );

        const steps = wrapper.find(Step);
        expect(steps.at(0).find(".steps__step").hasClass("steps__step_success")).toBeTruthy();
        expect(steps.at(1).find(".steps__step").hasClass("steps__step_success")).toBeTruthy();
    });

    it("applies steps_linear class when onChange is not provided", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} label="Step 1" />
            </Steps>
        );

        expect(wrapper.find(".steps").hasClass("steps_linear")).toBeTruthy();
    });

    it("does not apply steps_linear class when onChange is provided", () => {
        const onChangeMock = jest.fn();
        const wrapper = mount(
            <Steps onChange={onChangeMock}>
                <Step id={1} label="Step 1" />
            </Steps>
        );

        expect(wrapper.find(".steps").hasClass("steps_linear")).toBeFalsy();
    });

    it("renders label as button when onChange is provided", () => {
        const onChangeMock = jest.fn();
        const wrapper = mount(
            <Steps onChange={onChangeMock} current={1}>
                <Step id={1} label="Step 1" />
            </Steps>
        );

        expect(wrapper.find("button.steps__label").exists()).toBeTruthy();
    });

    it("renders label as Label component when onChange is not provided", () => {
        const wrapper = mount(
            <Steps>
                <Step id={1} label="Step 1" />
            </Steps>
        );

        expect(wrapper.find("button.steps__label").length).toBe(0);
        expect(wrapper.find(Label).exists()).toBeTruthy();
    });

    it("applies brand appearance when state is previous and not disabled", () => {
        const wrapper = mount(
            <Steps current={1}>
                <Step id={1} state="previous" />
                <Step id={2} />
            </Steps>
        );

        const divider = wrapper.find(Step).at(0).find("Divider");
        expect(divider.prop("appearance")).toBe("brand");
    });

    it("applies default appearance when state is not previous", () => {
        const wrapper = mount(
            <Steps current={0}>
                <Step id={1} />
                <Step id={2} />
            </Steps>
        );

        const divider = wrapper.find(Step).at(0).find("Divider");
        expect(divider.prop("appearance")).toBe("default");
    });

    it("applies default appearance when step is disabled", () => {
        const wrapper = mount(
            <Steps current={1}>
                <Step id={1} state="previous" disabled />
                <Step id={2} />
            </Steps>
        );

        const divider = wrapper.find(Step).at(0).find("Divider");
        expect(divider.prop("appearance")).toBe("default");
    });
});
