import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import HelperText from "@components/atoms/HelperText";
import Switch, { ISwitchProps } from "@components/molecules/Switch";

describe("Switch ", () => {
    let setup: ReactWrapper<ISwitchProps>;
    beforeEach(() => {
        setup = mount(<Switch />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders label prop correctly", () => {
        const label = "Label";
        const wrapper = setup.setProps({ label });
        expect(wrapper.find(".switch__labelText").contains(label)).toBeTruthy();
    });

    it("renders helperText prop correctly", () => {
        const helperText = "Helper text";
        const wrapper = setup.setProps({ helperText });
        expect(wrapper.find(HelperText).contains(helperText)).toBeTruthy();
    });

    it("renders disabled prop correctly", () => {
        const helperText = "Helper text";
        const wrapper = setup.setProps({ disabled: true, helperText });
        expect(wrapper.find(".switch__input").props().disabled).toBeTruthy();
        expect(wrapper.find(HelperText).props().isDisabled).toBeTruthy();
    });

    it("renders readonly prop correctly", () => {
        const wrapper = setup.setProps({ readOnly: true });
        expect(wrapper.find(".switch__input").props().readOnly).toBeTruthy();
    });

    it.each<ISwitchProps["labelAlignment"]>(["before", "after", "top"])(
        'should have "%s" labelAlignment',
        (labelAlignment) => {
            const className = {
                before: "switch_labelBefore",
                after: "switch_labelAfter",
                top: "switch_labelTop"
            };
            const wrapper = setup.setProps({ labelAlignment });
            expect(
                wrapper.find(".switch").hasClass(labelAlignment ? className[labelAlignment] : "switch_labelAfter")
            ).toBeTruthy();
        }
    );
});
