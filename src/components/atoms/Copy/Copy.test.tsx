import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { Copy } from "@geneui/icons";

import Button from "@components/atoms/Button";

import CopyComponent, { ICopyProps } from "./Copy";

describe("Copy Component", () => {
    const defaultProps: ICopyProps = {
        size: "medium",
        copyTooltipText: "Copy",
        copiedTooltipText: "Successfully copied!"
    };

    const setup = (props?: ICopyProps): ShallowWrapper => {
        const finalProps = { ...defaultProps, ...props };
        return shallow(<CopyComponent {...finalProps} />);
    };

    const wrapper = setup();

    it("renders without crashing", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const copyWrapper = wrapper.setProps({ className });

        expect(copyWrapper.find(Button).hasClass(className)).toBeTruthy();
    });

    it("renders the copy icon", () => {
        expect(wrapper.find(Button).props().Icon).toBe(Copy);
    });

    it("renders the correct copyTooltipText", () => {
        expect(wrapper.find("Tooltip").prop("text")).toBe(defaultProps.copyTooltipText);
    });

    it.each<ICopyProps["size"]>(["small", "medium", "large", "smallNudge"])("should have %s size", (size) => {
        const copyWrapper = wrapper.setProps({ size });
        expect(copyWrapper.find(Button).props().size).toBe(size);
    });

    it.each<ICopyProps["appearance"]>(["secondary", "primary", "inverse"])(
        "should have %s appearance",
        (appearance) => {
            const copyWrapper = wrapper.setProps({ appearance });
            expect(copyWrapper.find(Button).props().appearance).toBe(appearance);
        }
    );

    it("renders disabled prop correctly", () => {
        const copyWrapper = wrapper.setProps({ disabled: true });
        expect(copyWrapper.find(Button).props().disabled).toBeTruthy();
    });
});
