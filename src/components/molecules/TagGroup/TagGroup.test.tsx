import React from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import Tag from "@components/molecules/Tag/Tag";
import TagGroup, { ITagGroupProps } from "@components/molecules/TagGroup/TagGroup";

// Hooks
import useWindowSize from "@hooks/useWindowSize";

jest.mock("@hooks/useWindowSize", () => ({
    __esModule: true,
    default: jest.fn()
}));

// Mock DOM layout properties for JSDOM
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    writable: true,
    value: 32
});

Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    writable: true,
    value: 100
});

Object.defineProperty(HTMLElement.prototype, "offsetTop", {
    get() {
        const container = this.parentElement;
        if (!container) return 0;

        const containerWidth = container.offsetWidth || 500;
        const tagWidth = 100;
        const tagHeight = 32;
        const tagsPerLine = Math.floor(containerWidth / tagWidth);

        const index = Array.from(container.children).indexOf(this);
        const lineNumber = Math.floor(index / tagsPerLine);

        return lineNumber * tagHeight;
    }
});

describe("TagGroup", () => {
    let setup: ReactWrapper<ITagGroupProps>;

    const mockUseWindowSize = useWindowSize as jest.Mock;
    mockUseWindowSize.mockReturnValue({ width: 500, height: 300 });

    const showLessText = "Show Less";
    const showMoreText = "Show More";
    const tagsCount = 15;

    const createTags = (count: number) => {
        return Array.from({ length: count }, (_, index) => <Tag key={index} text={`Tag ${index + 1}`} />);
    };

    beforeEach(() => {
        setup = mount(
            <TagGroup renderToggleText={(expanded: boolean) => (expanded ? showLessText : showMoreText)}>
                {createTags(tagsCount)}
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
        expect(setup.find(Tag).first().prop("text")).toBe("Tag 1");
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        setup.setProps({ className });
        expect(setup.find(".tagGroup").hasClass(className)).toBeTruthy();
    });

    it.each<ITagGroupProps["size"]>(["medium", "small"])("applies %s size correctly", (size) => {
        setup.setProps({ size });
        const tagsContainer = setup.find(".tagGroup__tags");
        expect(tagsContainer.hasClass(`tagGroup__tags_size_${size}`)).toBeTruthy();
    });

    it("renders renderToggleText prop correctly", () => {
        expect(setup.find(".tagGroup__showButton")).toBeTruthy();
    });

    it("starts in collapsed state", () => {
        expect(setup.find(".tagGroup__container").hasClass("tagGroup__container_expanded")).toBeFalsy();
    });

    it("toggles to expanded state when button is clicked", () => {
        (useWindowSize as jest.Mock).mockReturnValue({ width: 100 });

        const toggleButton = setup.find("button.tagGroup__showButton");
        expect(toggleButton.exists()).toBe(true);
        toggleButton.simulate("click");

        expect(setup.find(".tagGroup__container").hasClass("tagGroup__container_expanded")).toBeTruthy();
    });

    it("toggles back to collapsed state when button is clicked again", () => {
        const toggleButton = setup.find("button.tagGroup__showButton");

        toggleButton.simulate("click");

        toggleButton.simulate("click");
        expect(setup.find(".tagGroup__container").hasClass("tagGroup__container_expanded")).toBeFalsy();
    });

    it("shows correct button text based on state", () => {
        const toggleButton = setup.find("button.tagGroup__showButton");

        expect(toggleButton.text()).toContain(showMoreText);

        toggleButton.simulate("click");
        expect(setup.find("button.tagGroup__showButton").text()).toContain(showLessText);
    });

    it("shows only icon when no text props provided", () => {
        const wrapper = mount(<TagGroup>{createTags(15)}</TagGroup>);
        const button = wrapper.find("button.tagGroup__showButton");
        expect(button.text()).toBe("");
        expect(button.find("svg").exists()).toBeTruthy();
    });

    it("handles empty children", () => {
        const wrapper = mount(<TagGroup>{null}</TagGroup>);
        expect(wrapper.find(Tag).length).toBe(0);
        expect(wrapper.find("button.tagGroup__showButton").exists()).toBeFalsy();
    });

    it("handles single child", () => {
        const wrapper = mount(
            <TagGroup>
                <Tag text="Single Tag" />
            </TagGroup>
        );
        expect(wrapper.find(Tag).length).toBe(1);
        expect(wrapper.find("button.tagGroup__showButton").exists()).toBeFalsy();
    });

    it("provides size to children", () => {
        const wrapper = mount(
            <TagGroup size="small">
                <Tag className="test_tag" text="Test Tag" size="medium" />
            </TagGroup>
        );

        const tag = wrapper.find(Tag).at(0);
        expect(tag.prop("size")).toBe("small");
    });

    it("provides default size when not specified", () => {
        const tag = setup.find(Tag).first();
        expect(tag.prop("size")).toBe("medium");
    });

    it("does not show toggle button when all tags are visible", () => {
        const wrapper = mount(<TagGroup>{createTags(2)}</TagGroup>);

        expect(wrapper.find("button.tagGroup__showButton").exists()).toBeFalsy();
    });

    it("renders all tags when expanded", () => {
        const toggleButton = setup.find("button.tagGroup__showButton");
        toggleButton.simulate("click");

        const renderedTags = setup.find(Tag);
        expect(renderedTags.length).toBe(tagsCount);
    });

    it("hides toggle button when items are removed and no overflow remains", () => {
        const manyTags = createTags(20);
        const wrapper = mount(<TagGroup>{manyTags}</TagGroup>);

        expect(wrapper.find("button.tagGroup__showButton").exists()).toBeTruthy();

        const toggleButton = wrapper.find("button.tagGroup__showButton");
        toggleButton.simulate("click");

        expect(wrapper.find("button.tagGroup__showButton").exists()).toBeTruthy();

        const fewTags = createTags(2);
        wrapper.setProps({ children: fewTags });

        wrapper.update();

        expect(wrapper.find("button.tagGroup__showButton").exists()).toBeFalsy();
    });
});
