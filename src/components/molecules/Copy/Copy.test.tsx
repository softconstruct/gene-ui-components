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

    it("renders the copy icon", () => {
        expect(wrapper.find(Button).props().Icon).toBe(Copy);
    });

    it("renders the correct tooltip text", () => {
        expect(wrapper.find("Tooltip").prop("text")).toBe(defaultProps.copyTooltipText);
    });
});
