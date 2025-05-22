import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Loader from "@components/atoms/Loader";
import Popover from "@components/atoms/Popover/Popover";
import { IMenuProps, Menu, MenuItem } from "@components/molecules/Menu";

import GeneUIProvider from "../../providers/GeneUIProvider";

describe("Menu ", () => {
    let setup: ReactWrapper<IMenuProps>;
    beforeEach(() => {
        setup = mount(
            <Menu onChange={() => {}} setPropsForPopover={() => {}} open>
                <MenuItem selected={false} danger={false} disabled={false} id="testId">
                    test
                </MenuItem>
            </Menu>,
            { wrappingComponent: GeneUIProvider }
        );
    });

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders open prop correctly", () => {
        expect(setup.find(Menu).exists()).toBeTruthy();
    });

    it("renders children prop correctly", () => {
        expect(setup.find(MenuItem)).toBeTruthy();
    });

    it("renders loading prop correctly", () => {
        const wrapper = setup.setProps({ loading: true });

        expect(wrapper.find(Loader)).toBeTruthy();
    });

    it("renders loadingText prop correctly", () => {
        const wrapper = setup.setProps({ loading: true, loadingText: "Loading" });

        expect(wrapper.find(Loader).contains("Loading")).toBeTruthy();
    });

    it("renders swappable prop correctly", () => {
        const wrapper = setup.setProps({ swappable: true });

        expect(wrapper.find(".menu_swappable")).toBeTruthy();
    });

    it.each<IMenuProps["size"]>(["large", "medium", "small"])("should have %s size", (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`menu__body_size_${size}`)).toBeTruthy();
    });

    it.each<IMenuProps["position"]>([
        "bottom-center",
        "bottom-left",
        "bottom-right",
        "left-bottom",
        "left-center",
        "left-top",
        "right-bottom",
        "right-center",
        "right-top",
        "top-center",
        "top-left",
        "top-right",
        "auto"
    ])("should have %s position", (position) => {
        const wrapper = setup.setProps({ position });
        expect(wrapper.find(Popover).props().position).toBe(position);
    });
});
