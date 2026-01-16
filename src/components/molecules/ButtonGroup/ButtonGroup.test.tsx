import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import ButtonGroup, { IButtonGroupProps } from "@components/molecules/ButtonGroup";
import GeneUIProvider from "@components/providers/GeneUIProvider";

describe("ButtonGroup ", () => {
    let setup: ReactWrapper<IButtonGroupProps>;
    const mockOnClick1 = jest.fn();
    const mockOnClick2 = jest.fn();

    beforeEach(() => {
        setup = mount(
            <ButtonGroup>
                <Button size="medium" appearance="primary" onClick={mockOnClick1}>
                    primary
                </Button>
                <Button size="medium" appearance="secondary" onClick={mockOnClick2}>
                    secondary
                </Button>
            </ButtonGroup>,
            { wrappingComponent: GeneUIProvider }
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".buttonGroup")).toHaveLength(1);
    });

    it("renders children buttons correctly", () => {
        expect(setup.find(Button)).toHaveLength(2);
        expect(setup.find(Button).at(0).text()).toBe("primary");
        expect(setup.find(Button).at(1).text()).toBe("secondary");
    });

    it("renders prop iconOnly correct", () => {
        const wrapper = mount(
            <ButtonGroup size="large" iconOnly>
                <Button appearance="primary">Button 1</Button>
                <Button appearance="secondary">Button 2</Button>
                <Button appearance="primary">Button 3</Button>
                <Button appearance="secondary">Button 4</Button>
            </ButtonGroup>,
            { wrappingComponent: GeneUIProvider }
        );

        wrapper.find(Button).forEach((button) => {
            expect(button.text()).not.toContain("Button");
        });
    });

    it("applies size prop to all child buttons", () => {
        const wrapper = mount(
            <ButtonGroup size="large">
                <Button appearance="primary">Button 1</Button>
                <Button appearance="secondary">Button 2</Button>
            </ButtonGroup>,
            { wrappingComponent: GeneUIProvider }
        );

        wrapper.find(Button).forEach((button) => {
            expect(button.prop("size")).toBe("large");
        });
    });

    it("uses medium as default size when size prop is not provided", () => {
        setup.find(Button).forEach((button) => {
            expect(button.prop("size")).toBe("medium");
        });
    });

    it.each<IButtonGroupProps["size"]>(["small", "medium", "large", "smallNudge"])(
        "applies %s size to all child buttons",
        (size) => {
            const wrapper = mount(
                <ButtonGroup size={size}>
                    <Button appearance="primary">Button 1</Button>
                    <Button appearance="secondary">Button 2</Button>
                </ButtonGroup>,
                { wrappingComponent: GeneUIProvider }
            );

            wrapper.find(Button).forEach((button) => {
                expect(button.prop("size")).toBe(size);
            });
        }
    );

    it("preserves other button props while overriding size", () => {
        const wrapper = mount(
            <ButtonGroup size="small">
                <Button appearance="danger" disabled Icon={Globe} onClick={mockOnClick1}>
                    Button 1
                </Button>
            </ButtonGroup>,
            { wrappingComponent: GeneUIProvider }
        );

        const button = wrapper.find(Button).at(0);
        expect(button.prop("size")).toBe("small");
        expect(button.prop("appearance")).toBe("danger");
        expect(button.prop("disabled")).toBe(true);
        expect(button.prop("Icon")).toBe(Globe);
        expect(button.prop("onClick")).toBe(mockOnClick1);
    });

    it("handles empty children correctly", () => {
        const wrapper = mount(<ButtonGroup>{null}</ButtonGroup>, {
            wrappingComponent: GeneUIProvider
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(Button)).toHaveLength(0);
    });
});
