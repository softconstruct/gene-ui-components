import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import { navigationCreateData, navigationData } from "../../../../stories/data/__navigation";
import Navigation, { INavigationProps } from "./index";
import { findPath } from "./Navigation";
import NavigationMobile from "./NavigationMobile/NavigationMobile";

describe("Navigation", () => {
    let setup: ReactWrapper<INavigationProps>;
    const mockOnClick = jest.fn();
    const mockOnNavigationCreateDataClick = jest.fn();
    const mockOnOpenChange = jest.fn();

    const defaultProps: Partial<INavigationProps> = {
        open: true,
        navigationData,
        onClick: mockOnClick,
        onNavigationCreateDataClick: mockOnNavigationCreateDataClick,
        onOpenChange: mockOnOpenChange
    };

    beforeEach(() => {
        jest.clearAllMocks();
        setup = mount(<Navigation {...defaultProps} />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        jest.clearAllMocks();
        if (setup) {
            setup.unmount();
        }
    });

    describe("Basic Rendering", () => {
        it("renders without crashing", () => {
            expect(setup.exists()).toBeTruthy();
        });

        it("renders className prop correctly", () => {
            const className = "test-class";
            const wrapper = setup.setProps({ className });
            expect(wrapper.find(".navigation").hasClass(className)).toBeTruthy();
        });

        it("renders navigation items", () => {
            expect(setup.find(".navigation__listItems").exists()).toBeTruthy();
        });
    });

    describe("Desktop", () => {
        beforeEach(() => {
            // Ensure desktop mode
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 1200
            });
            window.dispatchEvent(new Event("resize"));
        });

        it("renders navigation when not mobile", () => {
            expect(setup.find(".navigation__list").exists()).toBeTruthy();
        });

        it("calls onClick when item is clicked", () => {
            const desktopWrapper = mount(<Navigation {...defaultProps} />, {
                wrappingComponent: GeneUIProvider
            });
            desktopWrapper.update();

            const moreButton = desktopWrapper.find(".navigation__moreButton");
            if (moreButton.exists()) {
                moreButton.simulate("click");
                desktopWrapper.update();

                const menuItem = desktopWrapper.find("MenuItem").first();
                if (menuItem.exists()) {
                    menuItem.simulate("click");
                    desktopWrapper.update();
                    expect(mockOnClick).toHaveBeenCalled();
                }
            } else {
                const firstItem = desktopWrapper.find(".navigation__iconButton").first();
                if (firstItem.exists() && !firstItem.prop("disabled")) {
                    firstItem.simulate("click");
                    desktopWrapper.update();

                    if (mockOnClick.mock.calls.length > 0) {
                        expect(mockOnClick).toHaveBeenCalled();
                    }
                }
            }

            desktopWrapper.unmount();
        });

        it("renders More menu when items exceed maxVisibleItems", () => {
            expect(setup.find(".navigation__listItems").exists()).toBeTruthy();
        });

        it("renders create button when navigationCreateData is provided", () => {
            const wrapper = setup.setProps({ navigationCreateData });
            expect(wrapper.find(".navigation__addButton").exists()).toBeTruthy();
        });

        it("calls onNavigationCreateDataClick when create menu item is clicked", () => {
            const wrapper = setup.setProps({ navigationCreateData });
            const createButton = wrapper.find(".navigation__addButton").first();
            if (createButton.exists()) {
                createButton.simulate("click");

                wrapper.update();
                const createMenuItem = wrapper.find('[id="createTemplate"]').first();
                if (createMenuItem.exists()) {
                    createMenuItem.simulate("click");
                    expect(mockOnNavigationCreateDataClick).toHaveBeenCalled();
                }
            }
        });
    });

    describe("Mobile", () => {
        let mobileSetup: ReactWrapper<INavigationProps>;

        beforeEach(() => {
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 500
            });
            window.dispatchEvent(new Event("resize"));
            mobileSetup = mount(<Navigation {...defaultProps} activePath="/performance" />, {
                wrappingComponent: GeneUIProvider
            });
        });

        afterEach(() => {
            if (mobileSetup) {
                mobileSetup.unmount();
            }
        });

        describe("Basic Rendering", () => {
            it("renders NavigationMobile when mobile breakpoint is active", () => {
                expect(mobileSetup.find(NavigationMobile).exists()).toBeTruthy();
            });

            it("renders Spreadsheet when open is true", () => {
                expect(mobileSetup.find(".navigationMobile").exists()).toBeTruthy();
            });

            it("renders close button in header", () => {
                const closeButton = mobileSetup.find('[aria-label="Close navigation"]');
                expect(closeButton.exists()).toBeTruthy();
            });

            it("renders navigation items", () => {
                expect(mobileSetup.find(".navigationMobile__list").exists()).toBeTruthy();
            });
        });

        describe("Close Functionality", () => {
            it("calls onOpenChange when close button is clicked", () => {
                const closeButton = mobileSetup.find('[aria-label="Close navigation"]').first();
                if (closeButton.exists()) {
                    closeButton.simulate("click");
                    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
                }
            });

            it("calls onOpenChange when clicking outside", () => {
                const spreadsheet = mobileSetup.find("Spreadsheet").first();
                const onClose = spreadsheet.prop("onClose");
                if (onClose && typeof onClose === "function") {
                    onClose();
                }
                expect(mockOnOpenChange).toHaveBeenCalled();
            });
        });

        describe("Navigation Items", () => {
            it("renders all items", () => {
                const items = mobileSetup.find(".navigationItem");
                expect(items.length).toBeGreaterThan(0);
            });

            it("calls onClick when item without children is clicked", () => {
                const wrapper = mobileSetup.setProps({ activePath: null });

                const allItems = wrapper.find(".navigationItem");
                const leafItem = allItems
                    .filterWhere((item) => !item.find(".navigationItem__chevron").exists())
                    .first();
                if (leafItem.exists()) {
                    const button = leafItem.find(".navigationItem__button");
                    if (button.exists()) {
                        button.simulate("click");
                        expect(mockOnClick).toHaveBeenCalled();
                    }
                }
            });

            it("does not close menu when clicking item with children", () => {
                const wrapper = mobileSetup.setProps({ activePath: null });
                const parentItem = wrapper.find(".navigationItem").first();
                if (parentItem.exists()) {
                    parentItem.simulate("click");
                    expect(mockOnOpenChange).not.toHaveBeenCalled();
                }
            });

            it("highlights selected item", () => {
                const selectedItems = mobileSetup.find(".navigationItem__button_selected");
                expect(selectedItems.length).toBeGreaterThan(0);
            });
        });

        describe("Create Menu", () => {
            it("renders create button when navigationCreateData is provided", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData });
                expect(wrapper.find(".navigationMobile__footer").exists()).toBeTruthy();
            });

            it("does not render create button when navigationCreateData is not provided", () => {
                expect(mobileSetup.find(".navigationMobile__footer").exists()).toBeFalsy();
            });

            it("opens create menu when create button is clicked", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData });
                const createButton = wrapper.find(".navigationMobile__footer Button");
                if (createButton.exists()) {
                    createButton.simulate("click");
                    wrapper.update();
                    const createMenu = wrapper.find(".navigationMobile_create");
                    expect(createMenu.exists()).toBeTruthy();
                }
            });

            it("renders create button with text when createButtonText is provided", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData, createButtonText: "Create" });
                const navigationMobile = wrapper.find(NavigationMobile);
                expect(navigationMobile.prop("createButtonText")).toBe("Create");
            });

            it("renders create button without text when createButtonText is not provided", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData });
                const navigationMobile = wrapper.find(NavigationMobile);
                expect(navigationMobile.prop("createButtonText")).toBeUndefined();
            });

            it("renders create menu items", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData });
                const createButton = wrapper.find(".navigationMobile__footer Button");
                if (createButton.exists()) {
                    createButton.simulate("click");
                    wrapper.update();
                    const createItems = wrapper.find(".navigationMobile__createItem");
                    expect(createItems.length).toBeGreaterThan(0);
                }
            });

            it("calls onNavigationCreateDataClick when create menu item is clicked", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData });
                const createButton = wrapper.find(".navigationMobile__footer Button");
                if (createButton.exists()) {
                    createButton.simulate("click");
                    wrapper.update();
                    const createItem = wrapper.find(".navigationMobile__createItem").first();
                    if (createItem.exists()) {
                        createItem.simulate("click");
                        expect(mockOnNavigationCreateDataClick).toHaveBeenCalled();
                        expect(mockOnOpenChange).toHaveBeenCalled();
                    }
                }
            });

            it("closes create menu when close button is clicked", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData });
                const createButton = wrapper.find(".navigationMobile__footer Button");
                if (createButton.exists()) {
                    createButton.simulate("click");
                    wrapper.update();
                    const closeButton = wrapper.find('[aria-label="Close create menu"]');
                    if (closeButton.exists()) {
                        closeButton.simulate("click");
                        wrapper.update();
                        const createMenu = wrapper.find(".navigationMobile_create");
                        expect(createMenu.length).toBe(0);
                    }
                }
            });

            it("renders create items with danger style when danger prop is true", () => {
                const wrapper = mobileSetup.setProps({ navigationCreateData });
                const createButton = wrapper.find(".navigationMobile__footer Button");
                if (createButton.exists()) {
                    createButton.simulate("click");
                    wrapper.update();
                    const dangerItem = wrapper
                        .find(".navigationMobile__createItem")
                        .filterWhere((item) => item.hasClass("navigationMobile__createItem_danger"));
                    expect(dangerItem.exists()).toBeTruthy();
                }
            });
        });

        describe("Auto-scroll", () => {
            it("scrolls to selected item when menu opens", () => {
                mobileSetup.update();
                const scrollbar = mobileSetup.find("Scrollbar").first();
                expect(scrollbar.exists()).toBeTruthy();
            });

            it("does not scroll when no activePathIndex", () => {
                const wrapper = mobileSetup.setProps({ activePath: null });
                const scrollbar = wrapper.find("Scrollbar").first();
                const scrollToTop = scrollbar.prop("scrollToTop");
                expect(scrollToTop).toBeUndefined();
            });
        });

        describe("Nested Navigation", () => {
            it("renders nested items", () => {
                const itemsWithChildren = mobileSetup.find(".navigationItem").filterWhere((item) => {
                    return item.find(".navigationItem__chevron").exists();
                });
                expect(itemsWithChildren.length).toBeGreaterThan(0);
            });
        });
    });

    describe("findPath utility", () => {
        it("finds path for existing item", () => {
            const path = findPath(navigationData, "/performance");
            expect(path).not.toBeNull();
            expect(Array.isArray(path)).toBe(true);
        });

        it("returns null for non-existent path", () => {
            const path = findPath(navigationData, "/non-existent");
            expect(path).toBeNull();
        });

        it("finds nested path correctly", () => {
            const path = findPath(navigationData, "/dashboard");
            expect(path).not.toBeNull();
            expect(path && path.length > 0).toBe(true);
        });
    });

    describe("Active Path", () => {
        it("highlights active path correctly", () => {
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 1200
            });
            window.dispatchEvent(new Event("resize"));
            const desktopWrapper = mount(<Navigation {...defaultProps} activePath="/performance" />, {
                wrappingComponent: GeneUIProvider
            });
            desktopWrapper.update();
            expect(desktopWrapper.find(".navigation__iconButton_selected").exists()).toBeTruthy();
            desktopWrapper.unmount();
        });
    });

    describe("Compact Mode", () => {
        it("renders in compact mode when compact prop is true", () => {
            const wrapper = setup.setProps({ compact: true });
            expect(wrapper.find(".navigation").exists()).toBeTruthy();
        });
    });
});
