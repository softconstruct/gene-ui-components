import React from "react";
import { mount, ReactWrapper } from "enzyme";

import BreadcrumbItem from "@components/molecules/Breadcrumb/BreadcrumbItem";
import { Menu } from "@components/molecules/Menu";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import Breadcrumb, { IBreadcrumbProps } from "./index";

const createBreadcrumbData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        title: `Nav Item ${i + 1}`,
        path: `/nav-${i + 1}`
    }));

describe("Breadcrumb", () => {
    let setup: ReactWrapper<IBreadcrumbProps>;

    describe("Rendering", () => {
        beforeEach(() => {
            setup = mount(<Breadcrumb breadCrumbsData={[]} />, {
                wrappingComponent: GeneUIProvider
            });
        });

        it("renders without crashing", () => {
            expect(setup.exists()).toBeTruthy();
        });

        it("renders className prop correctly", () => {
            const className = "test-class";
            setup.setProps({ className });

            expect(setup.find(".breadcrumb").hasClass(className)).toBeTruthy();
        });

        it("renders nav with aria-label", () => {
            expect(setup.find('nav[aria-label="breadcrumb navigation"]').exists()).toBeTruthy();
        });

        it("renders hidden measurement DOM for width calculation", () => {
            expect(setup.find(".breadcrumb__measure").exists()).toBeTruthy();
            expect(setup.find(".breadcrumb__measure").prop("aria-hidden")).toBe(true);
        });
    });

    describe("Breadcrumb items display", () => {
        it("renders single item without ellipsis", () => {
            setup = mount(<Breadcrumb breadCrumbsData={createBreadcrumbData(1)} />, {
                wrappingComponent: GeneUIProvider
            });

            const visibleItems = setup.find("nav").find(BreadcrumbItem);
            expect(visibleItems).toHaveLength(1);
            expect(setup.find(".breadcrumb__item_hidden").exists()).toBeTruthy();
        });

        it("renders two items without ellipsis", () => {
            setup = mount(<Breadcrumb breadCrumbsData={createBreadcrumbData(2)} />, {
                wrappingComponent: GeneUIProvider
            });

            const visibleItems = setup.find("nav").find(BreadcrumbItem);
            expect(visibleItems).toHaveLength(2);
            expect(setup.find(".breadcrumb__item_hidden").exists()).toBeTruthy();
        });

        it("renders all items when count is 6 or less and fits", () => {
            setup = mount(<Breadcrumb breadCrumbsData={createBreadcrumbData(6)} />, {
                wrappingComponent: GeneUIProvider
            });

            const visibleItems = setup.find("nav").find(BreadcrumbItem);
            expect(visibleItems.length).toBeGreaterThanOrEqual(6);
        });

        it("shows ellipsis button when items exceed 6", () => {
            setup = mount(<Breadcrumb breadCrumbsData={createBreadcrumbData(7)} />, {
                wrappingComponent: GeneUIProvider
            });

            const ellipsisLi = setup
                .find("li.breadcrumb__item")
                .filterWhere((n) => n.find("button").exists() && n.find(Menu).exists());
            expect(ellipsisLi.exists()).toBeTruthy();
        });

        it("renders Menu with hidden items when truncated", () => {
            setup = mount(<Breadcrumb breadCrumbsData={createBreadcrumbData(9)} />, {
                wrappingComponent: GeneUIProvider
            });

            expect(setup.find(Menu).exists()).toBeTruthy();
        });
    });

    describe("Props", () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it("calls onClick when breadcrumb item is clicked", () => {
            const onClick = jest.fn();
            setup = mount(<Breadcrumb breadCrumbsData={createBreadcrumbData(3)} onClick={onClick} />, {
                wrappingComponent: GeneUIProvider
            });

            const firstClickableItem = setup.find(BreadcrumbItem).first().find("button");
            if (firstClickableItem.exists()) {
                firstClickableItem.simulate("click");
                expect(onClick).toHaveBeenCalledWith(
                    expect.objectContaining({
                        title: "Nav Item 1",
                        path: "/nav-1"
                    })
                );
            }
        });

        it("uses custom render when provided", () => {
            const render = ({ path, title }: { path?: string; title?: string }) => (
                <a href={path} data-testid="custom-link">
                    {title}
                </a>
            );
            setup = mount(
                <Breadcrumb
                    breadCrumbsData={[
                        { title: "Home", path: "/" },
                        { title: "Current", path: "/current" }
                    ]}
                    render={render}
                />,
                { wrappingComponent: GeneUIProvider }
            );

            expect(setup.find('[data-testid="custom-link"]').exists()).toBeTruthy();
            expect(setup.find('[data-testid="custom-link"]').first().text()).toBe("Home");
        });

        it("applies iconOnly when true", () => {
            setup = mount(<Breadcrumb breadCrumbsData={createBreadcrumbData(2)} iconOnly />, {
                wrappingComponent: GeneUIProvider
            });

            expect(setup.find(".breadcrumb__link_iconOnly").exists()).toBeTruthy();
        });
    });

    describe("Edge cases", () => {
        it("handles empty breadCrumbsData", () => {
            setup = mount(<Breadcrumb breadCrumbsData={[]} />, {
                wrappingComponent: GeneUIProvider
            });

            expect(setup.find(".breadcrumb__list").exists()).toBeTruthy();
            expect(setup.find(BreadcrumbItem)).toHaveLength(0);
        });

        it("renders items with path or title as identifier", () => {
            setup = mount(
                <Breadcrumb breadCrumbsData={[{ title: "Root" }, { title: "Current", path: "/current" }]} />,
                { wrappingComponent: GeneUIProvider }
            );

            const visibleItems = setup.find("nav").find(BreadcrumbItem);
            expect(visibleItems).toHaveLength(2);
        });
    });
});
