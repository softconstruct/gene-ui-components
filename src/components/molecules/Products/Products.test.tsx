import React, { PropsWithChildren } from "react";
import { mount, ReactWrapper } from "enzyme";

import { Globe } from "@geneui/icons";

// Components
import { Badge, Button, Divider, Text } from "../../../index";
import { Product, Products, ProductsMainSection, ProductsSecondarySection } from "./index";

describe("Products ", () => {
    let setup: (children: PropsWithChildren) => ReactWrapper<unknown>;

    beforeEach(() => {
        setup = ({ children }: PropsWithChildren) => mount(<Products>{children}</Products>);
    });
    afterEach(() => {
        if (setup) {
            setup({ children: <Product id={1} title="Backoffice" Icon={Globe} /> }).unmount(); // Unmount to clean up after each test
        }
    });

    it("renders without crashing", () => {
        const component = setup({ children: <Product id={1} title="Backoffice" Icon={Globe} /> });
        expect(component.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const component = setup({ children: <Product id={1} title="Backoffice" Icon={Globe} /> });
        const className = "test-class";
        const wrapper = component.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders with prop children correctly", () => {
        const title = "test title";
        let component = setup({
            children: (
                <ProductsMainSection>
                    <Product id={0} title={title} Icon={Globe} />
                </ProductsMainSection>
            )
        });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(Product).exists()).toBeTruthy();
        component.unmount();
        component = setup({
            children: (
                <>
                    <ProductsMainSection>
                        <Product id={0} title={title} Icon={Globe} />
                    </ProductsMainSection>
                    <ProductsSecondarySection>
                        <Product id={0} title={title} Icon={Globe} />
                    </ProductsSecondarySection>
                </>
            )
        });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(Divider).exists()).toBeTruthy();
        component.unmount();
    });

    it("renders with prop title for component Product", () => {
        const title = "test title";
        const component = setup({ children: <Product id={0} title={title} Icon={Globe} /> });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(Text).text()).toStrictEqual(title);
        component.unmount();
    });

    it("renders with prop withBadge for component Product", () => {
        const withBadge = true;
        const component = setup({
            children: <Product id={0} title="Backoffice" withBadge={withBadge} Icon={Globe} />
        });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(Badge).exists()).toBeTruthy();
        component.unmount();
    });

    it("renders with prop Icon for component Product", () => {
        const component = setup({
            children: <Product id={0} title="Backoffice" Icon={Globe} />
        });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(Globe).exists()).toBeTruthy();
        component.unmount();
    });

    it("renders with prop disabled for component Product", () => {
        const disabled = true;
        const component = setup({
            children: <Product id={0} title="Backoffice" disabled={disabled} Icon={Globe} />
        });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(".products__item").hasClass("products__item_disabled")).toBeTruthy();
        component.unmount();
    });

    it("renders with prop children for component ProductsMainSection", () => {
        const component = setup({
            children: (
                <ProductsMainSection>
                    <Product id={0} title="Backoffice" Icon={Globe} />
                </ProductsMainSection>
            )
        });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(Product).exists()).toBeTruthy();
        component.unmount();
    });

    it("renders with prop children for component ProductsSecondarySection", () => {
        const component = setup({
            children: (
                <ProductsSecondarySection>
                    <Product id={0} title="Backoffice" Icon={Globe} />
                </ProductsSecondarySection>
            )
        });
        component.find(Button).simulate("click");
        component.update();
        expect(component.find(Product).exists()).toBeTruthy();
        component.unmount();
    });
});
