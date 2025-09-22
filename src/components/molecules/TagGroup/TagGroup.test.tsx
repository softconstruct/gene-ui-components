import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Tag from "@components/molecules/Tag/Tag";
import TagGroup, { ITagGroupContextProps, ITagGroupProps } from "@components/molecules/TagGroup/TagGroup";

// Hooks
import useWindowSize from "@hooks/useWindowSize";

jest.mock("@hooks/useWindowSize", () => ({
    __esModule: true,
    default: jest.fn()
}));

describe("TagGroup", () => {
    let setup: ReactWrapper<ITagGroupProps>;

    const mockUseWindowSize = useWindowSize as jest.Mock;
    mockUseWindowSize.mockReturnValue({ width: 500, height: 300 });

    const createTags = (count: number) => {
        return Array.from({ length: count }, (_, index) => <Tag key={index} text={`Tag ${index + 1}`} />);
    };

    beforeEach(() => {
        setup = mount(
            <TagGroup>
                <Tag text="Test Tag" />
            </TagGroup>
        );
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with default props", () => {
        expect(setup.find(".tagGroup").exists()).toBeTruthy();
        expect(setup.find(".tagGroup__container").exists()).toBeTruthy();
        expect(setup.find(".tagGroup__tags").exists()).toBeTruthy();
    });

    it("renders children prop correctly", () => {
        expect(setup.find(Tag).exists()).toBeTruthy();
        expect(setup.find(Tag).prop("text")).toBe("Test Tag");
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        setup.setProps({ className });
        expect(setup.find(".tagGroup").hasClass(className)).toBeTruthy();
    });

    it.each<ITagGroupContextProps["size"]>(["medium", "small"])("applies %s size correctly", (size) => {
        setup.setProps({ size });
        const tagsContainer = setup.find(".tagGroup__tags");
        expect(tagsContainer.hasClass(`tagGroup__tags_size_${size}`)).toBeTruthy();
    });

    it("renders showMoreText and showLessText props", () => {
        setup = mount(<TagGroup>{createTags(15)}</TagGroup>);
        const showMoreText = "Show More";
        const showLessText = "Show Less";
        setup.setProps({ showMoreText, showLessText });

        expect(setup.find(".tagGroup__showButton")).toBeTruthy();
    });

    it("starts in collapsed state", () => {
        setup = mount(<TagGroup>{createTags(15)}</TagGroup>);
        expect(setup.find(".tagGroup__container").hasClass("tagGroup__container_expanded")).toBeFalsy();
    });

    it("toggles to expanded state when button is clicked", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 100 });

        setup = mount(<TagGroup>{createTags(15)}</TagGroup>);

        const toggleButton = setup.find("button.tagGroup__showButton");
        expect(toggleButton.exists()).toBe(true);
        toggleButton.simulate("click");

        expect(setup.find(".tagGroup__container").hasClass("tagGroup__container_expanded")).toBeTruthy();
    });

    it("toggles back to collapsed state when button is clicked again", () => {
        setup = mount(<TagGroup>{createTags(15)}</TagGroup>);
        const toggleButton = setup.find("button.tagGroup__showButton");

        toggleButton.simulate("click");

        toggleButton.simulate("click");
        expect(setup.find(".tagGroup__container").hasClass("tagGroup__container_expanded")).toBeFalsy();
    });

    it("shows correct button text based on state", () => {
        setup = mount(<TagGroup>{createTags(15)}</TagGroup>);
        const showMoreText = "Show More";
        const showLessText = "Show Less";
        setup.setProps({ showMoreText, showLessText });

        const toggleButton = setup.find("button.tagGroup__showButton");

        expect(toggleButton.text()).toContain(showMoreText);

        toggleButton.simulate("click");
        expect(setup.find("button.tagGroup__showButton").text()).toContain(showLessText);
    });

    it("shows only icon when no text props provided", () => {
        setup = mount(<TagGroup>{createTags(15)}</TagGroup>);
        const button = setup.find("button.tagGroup__showButton");
        expect(button.text()).toBe("");
        expect(button.find("svg").exists()).toBeTruthy();
    });

    it("handles empty children", () => {
        setup = mount(<TagGroup>{null}</TagGroup>);
        expect(setup.find(Tag).length).toBe(0);
        expect(setup.find("button.tagGroup__showButton").exists()).toBeFalsy();
    });

    it("handles single child", () => {
        setup = mount(
            <TagGroup>
                <Tag text="Single Tag" />
            </TagGroup>
        );
        expect(setup.find(Tag).length).toBe(1);
        expect(setup.find("button.tagGroup__showButton").exists()).toBeFalsy();
    });

    it("provides size context to children", () => {
        setup = mount(
            <TagGroup size="small">
                <Tag text="Test Tag" />
            </TagGroup>
        );

        const tag = setup.find(Tag);
        expect(tag.prop("size")).toBe("small");
    });

    it("provides default size context when not specified", () => {
        setup = mount(
            <TagGroup>
                <Tag text="Test Tag" />
            </TagGroup>
        );

        const tag = setup.find(Tag);
        expect(tag.prop("size")).toBe("medium");
    });

    it("does not show toggle button when all tags are visible", () => {
        setup = mount(<TagGroup>{createTags(2)}</TagGroup>);

        expect(setup.find("button.tagGroup__showButton").exists()).toBeFalsy();
    });

    it("renders all tags when expanded", () => {
        setup = mount(<TagGroup>{createTags(25)}</TagGroup>);

        const toggleButton = setup.find("button.tagGroup__showButton");
        toggleButton.simulate("click");

        const renderedTags = setup.find(Tag);
        expect(renderedTags.length).toBe(25);
    });
});
