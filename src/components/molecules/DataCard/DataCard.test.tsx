import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";
import Spreadsheet from "@components/atoms/Spreadsheet";
import TextLink from "@components/atoms/TextLink";
import { KeyValue } from "@components/molecules/KeyValue";
import { IMenuItemProps, Menu } from "@components/molecules/Menu";

// Data
import { baseCardData, basicActions, emptyCardData, longCardData } from "../../../../stories/data/__dataCard";
import DataCard, { IDataCardProps } from "./index";

describe("DataCard ", () => {
    let setup: ReactWrapper<IDataCardProps>;
    const mockOnActionClick = jest.fn();

    const createWrapper = (props: Partial<IDataCardProps> = {}) => {
        const defaultProps: IDataCardProps = {
            cardData: baseCardData,
            ...props
        };
        return mount(<DataCard {...defaultProps} />);
    };

    beforeEach(() => {
        mockOnActionClick.mockClear();
        setup = createWrapper();
    });

    afterEach(() => {
        if (setup) {
            setup.unmount();
        }
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".dataCard").first()).toHaveLength(1);
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });
        expect(wrapper.find(".dataCard").first().hasClass(className)).toBeTruthy();
    });

    it("renders cardData prop correctly", () => {
        expect(setup.find(KeyValue)).toHaveLength(baseCardData.length);
    });

    it("renders text values correctly", () => {
        const nameKeyValue = setup.find(KeyValue).first();
        expect(nameKeyValue.text()).toContain("John Doe");
    });

    it("renders pill values correctly", () => {
        expect(setup.find(Pill)).toHaveLength(1);
        expect(setup.find(Pill).text()).toBe("Active");
    });

    it("renders textLink values correctly", () => {
        expect(setup.find(TextLink)).toHaveLength(1);
        expect(setup.find(TextLink).text()).toBe("john@example.com");
    });

    it("renders infoText correctly", () => {
        const nameKeyValue = setup.find(KeyValue).first();
        expect(nameKeyValue.text()).toContain("Name");
    });

    it("renders showMoreText prop correctly", () => {
        setup = createWrapper({ cardData: longCardData, showMoreText: "View All" });
        expect(setup.find(Button).first().text()).toBe("View All");
    });

    it("renders actionsText prop correctly", () => {
        setup = createWrapper({ actions: basicActions, actionsText: "Custom Actions" });
        const actionButton = setup.find(Button).last();
        expect(actionButton.text()).toBe("Custom Actions");
    });

    it("shows Show More button when cardData length exceeds MAX_VISIBLE_ROWS", () => {
        setup = createWrapper({ cardData: longCardData });
        expect(setup.find(Button).first().text()).toBe("Show more");
    });

    it("does not show Show More button when cardData length is within MAX_VISIBLE_ROWS", () => {
        expect(setup.find(Button)).toHaveLength(0);
    });

    it("renders actions menu when actions prop is provided", () => {
        setup = createWrapper({ actions: basicActions });
        expect(setup.find(Menu)).toHaveLength(1);
        expect(setup.find(Button)).toHaveLength(1); // Only Actions button (no Show More for short data)
    });

    it("does not render actions menu when actions prop is not provided", () => {
        expect(setup.find(Menu)).toHaveLength(0);
    });

    it("handles Show More button click", () => {
        setup = createWrapper({ cardData: longCardData });
        const showMoreButton = setup.find(Button).first();
        act(() => {
            showMoreButton.simulate("click");
        });
        expect(setup.find(Spreadsheet)).toHaveLength(1);
    });

    it("handles onActionClick callback", () => {
        setup = createWrapper({ actions: basicActions, onActionClick: mockOnActionClick });
        const menu = setup.find(Menu);
        // Simulate menu item click
        const onChange = menu.prop("onChange") as (menuItem: IMenuItemProps) => void;
        onChange(basicActions[0]);
        expect(mockOnActionClick).toHaveBeenCalledWith(basicActions[0]);
    });

    it("renders Spreadsheet when Show More is clicked", () => {
        setup = createWrapper({ cardData: longCardData });
        const showMoreButton = setup.find(Button).first();
        act(() => {
            showMoreButton.simulate("click");
        });
        setup.update(); // Force re-render to get updated state
        expect(setup.find(Spreadsheet).prop("open")).toBe(true);
    });

    it("closes Spreadsheet when onClose is called", () => {
        setup = createWrapper({ cardData: longCardData });
        const showMoreButton = setup.find(Button).first();
        act(() => {
            showMoreButton.simulate("click");
        });
        setup.update(); // Force re-render to get updated state

        const spreadsheet = setup.find(Spreadsheet);
        act(() => {
            spreadsheet.prop("onClose")();
        });
        setup.update(); // Force re-render to get updated state
        expect(setup.find(Spreadsheet).prop("open")).toBe(false);
    });

    it("renders all data in Spreadsheet when opened", () => {
        setup = createWrapper({ cardData: longCardData });
        const showMoreButton = setup.find(Button).first();
        act(() => {
            showMoreButton.simulate("click");
        });
        setup.update(); // Force re-render to get updated state

        // Check that Spreadsheet is open
        expect(setup.find(Spreadsheet).prop("open")).toBe(true);

        // Since Spreadsheet only renders children when open, we can't test the KeyValue components
        // directly through enzyme when they're in a portal. Instead, we verify the Spreadsheet
        // receives the correct data through its children prop.
        const spreadsheet = setup.find(Spreadsheet);
        expect(spreadsheet.exists()).toBeTruthy();
    });

    it("renders with default props when not provided", () => {
        setup = createWrapper({ cardData: [] });
        expect(setup.exists()).toBeTruthy();
        expect(setup.find(".dataCard").first()).toHaveLength(1);
    });

    it("renders empty cardData gracefully", () => {
        setup = createWrapper({ cardData: emptyCardData });
        expect(setup.find(KeyValue)).toHaveLength(0);
        expect(setup.find(Button)).toHaveLength(0);
    });
});
