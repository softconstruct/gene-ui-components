import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import ButtonGroup, { IButtonGroupProps } from "@components/molecules/ButtonGroup";
import { Menu } from "@components/molecules/Menu";
import GeneUIProvider from "@components/providers/GeneUIProvider";

describe("ButtonGroup ", () => {
    let setup: ReactWrapper<IButtonGroupProps>;
    const mockOnClick1 = jest.fn();
    const mockOnClick2 = jest.fn();
    const mockOnClick3 = jest.fn();
    const mockOnClick4 = jest.fn();
    const mockOnClick5 = jest.fn();

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
        expect(setup.find(".ButtonGroup")).toHaveLength(1);
    });

    it("renders children buttons correctly", () => {
        expect(setup.find(Button)).toHaveLength(2);
        expect(setup.find(Button).at(0).text()).toBe("primary");
        expect(setup.find(Button).at(1).text()).toBe("secondary");
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

    it("handles empty children gracefully", () => {
        const wrapper = mount(<ButtonGroup>{null}</ButtonGroup>, {
            wrappingComponent: GeneUIProvider
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.find(Button)).toHaveLength(0);
    });

    describe("when buttons count is less than or equal to MAX_VISIBLE_BUTTONS (3)", () => {
        it("renders all buttons without dropdown menu", () => {
            const wrapper = mount(
                <ButtonGroup>
                    <Button onClick={mockOnClick1}>Button 1</Button>
                    <Button onClick={mockOnClick2}>Button 2</Button>
                    <Button onClick={mockOnClick3}>Button 3</Button>
                </ButtonGroup>,
                { wrappingComponent: GeneUIProvider }
            );

            expect(wrapper.find(Button)).toHaveLength(3);
            expect(wrapper.find(Menu)).toHaveLength(0);
            expect(wrapper.find(ThreeDotsHorizontal)).toHaveLength(0);
        });

        it("allows clicking on all visible buttons", () => {
            const wrapper = mount(
                <ButtonGroup>
                    <Button onClick={mockOnClick1}>Button 1</Button>
                    <Button onClick={mockOnClick2}>Button 2</Button>
                </ButtonGroup>,
                { wrappingComponent: GeneUIProvider }
            );

            wrapper.find(Button).at(0).simulate("click");
            wrapper.find(Button).at(1).simulate("click");

            expect(mockOnClick1).toHaveBeenCalledTimes(1);
            expect(mockOnClick2).toHaveBeenCalledTimes(1);
        });
    });

    describe("when buttons count exceeds MAX_VISIBLE_BUTTONS (3)", () => {
        let wrapperWithManyButtons: ReactWrapper;

        beforeEach(() => {
            wrapperWithManyButtons = mount(
                <ButtonGroup>
                    <Button onClick={mockOnClick1}>Button 1</Button>
                    <Button onClick={mockOnClick2}>Button 2</Button>
                    <Button onClick={mockOnClick3}>Button 3</Button>
                    <Button onClick={mockOnClick4} appearance="danger" Icon={Globe}>
                        Button 4
                    </Button>
                    <Button onClick={mockOnClick5} disabled>
                        Button 5
                    </Button>
                </ButtonGroup>,
                { wrappingComponent: GeneUIProvider }
            );
        });

        it("renders first 3 buttons and creates dropdown menu for the rest", () => {
            expect(wrapperWithManyButtons.find(Button)).toHaveLength(4); // 3 visible + 1 dropdown trigger
            expect(wrapperWithManyButtons.find(Menu)).toHaveLength(1);
        });

        it("renders dropdown trigger button with correct props", () => {
            const dropdownButton = wrapperWithManyButtons.find(Button).last();

            expect(dropdownButton.prop("Icon")).toBe(ThreeDotsHorizontal);
            expect(dropdownButton.prop("layout")).toBe("text");
            expect(dropdownButton.prop("appearance")).toBe("secondary");
            expect(dropdownButton.prop("size")).toBe("medium");
        });

        it("applies size prop to dropdown trigger button", () => {
            const wrapper = mount(
                <ButtonGroup size="large">
                    <Button>Button 1</Button>
                    <Button>Button 2</Button>
                    <Button>Button 3</Button>
                    <Button>Button 4</Button>
                </ButtonGroup>,
                { wrappingComponent: GeneUIProvider }
            );

            const dropdownButton = wrapper.find(Button).last();
            expect(dropdownButton.prop("size")).toBe("large");
        });

        it("handles menu item selection and triggers correct button onClick", () => {
            const menu = wrapperWithManyButtons.find(Menu);
            const menuOnChange = menu.prop("onChange");

            // Simulate selecting first menu item (Button 4)
            menuOnChange({ id: "0" });
            expect(mockOnClick4).toHaveBeenCalledTimes(1);

            // Simulate selecting second menu item (Button 5)
            menuOnChange({ id: "1" });
            expect(mockOnClick5).toHaveBeenCalledTimes(1);
        });

        it("handles menu item selection with invalid id gracefully", () => {
            const menu = wrapperWithManyButtons.find(Menu);
            const menuOnChange = menu.prop("onChange");

            // Simulate selecting non-existent menu item
            expect(() => menuOnChange({ id: "999" })).not.toThrow();
            expect(mockOnClick1).not.toHaveBeenCalled();
            expect(mockOnClick2).not.toHaveBeenCalled();
            expect(mockOnClick3).not.toHaveBeenCalled();
            expect(mockOnClick4).not.toHaveBeenCalled();
            expect(mockOnClick5).not.toHaveBeenCalled();
        });
    });

    describe("size prop updates", () => {
        it("applies size changes to all buttons when prop is updated", () => {
            const TestComponent = ({ size }: { size: IButtonGroupProps["size"] }) => (
                <ButtonGroup size={size}>
                    <Button>Button 1</Button>
                    <Button>Button 2</Button>
                </ButtonGroup>
            );

            const wrapper = mount(<TestComponent size="medium" />, {
                wrappingComponent: GeneUIProvider
            });

            // Check initial size
            wrapper.find(Button).forEach((button) => {
                expect(button.prop("size")).toBe("medium");
            });

            // Change size
            wrapper.setProps({ size: "small" });
            wrapper.update();

            // Check updated size
            wrapper.find(Button).forEach((button) => {
                expect(button.prop("size")).toBe("small");
            });
        });
    });
});
