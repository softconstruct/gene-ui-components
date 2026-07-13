import React, { ChangeEvent } from "react";
import { mount, ReactWrapper } from "enzyme";

// Components
import { Eye } from "@geneui/icons";

import Loader from "@components/atoms/Loader";
import Checkbox from "@components/molecules/Checkbox";

import useEllipsisDetection from "@hooks/useEllipsisDetection";

import Image, { IImageProps } from "./index";

jest.mock("@hooks/useEllipsisDetection", () => ({
    __esModule: true,
    default: jest.fn()
}));

describe("Image Component", () => {
    let wrapper: ReactWrapper<IImageProps>;
    const mockUseEllipsisDetection = useEllipsisDetection as jest.Mock;

    const defaultProps: IImageProps = {
        src: "valid-image.jpg",
        id: "test-id"
    };

    const setup = (props: Partial<IImageProps> = {}) => {
        return mount(<Image {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseEllipsisDetection.mockReturnValue(false);
    });

    describe("Rendering & Structure", () => {
        it("renders without crashing", () => {
            wrapper = setup();
            expect(wrapper.exists()).toBeTruthy();
        });

        it("renders custom classNames", () => {
            wrapper = setup({ className: "custom-class" });
            expect(wrapper.find("article.custom-class").exists()).toBeTruthy();
        });

        it("renders correct aspect ratio class", () => {
            wrapper = setup({ aspectRatio: "3x2" });
            expect(wrapper.find(".image_size_3x2").exists()).toBeTruthy();
        });
    });

    describe("Image Preview Logic", () => {
        it("renders an <img> tag when not loading and not failed", () => {
            wrapper = setup();
            expect(wrapper.find("img.image__img").exists()).toBe(true);
            expect(wrapper.find("img.image__img").prop("src")).toBe(defaultProps.src);
        });

        it("renders the preview as a <button> when interactive", () => {
            wrapper = setup();
            const previewNode = wrapper.find(".image__preview").hostNodes();
            expect(previewNode.name()).toBe("button");
        });

        it("renders the preview as a <div> when loading", () => {
            wrapper = setup({ loading: true });
            const previewNode = wrapper.find(".image__preview").hostNodes();
            expect(previewNode.name()).toBe("div");
        });

        it("calls onImageClick with correct ID when clicked", () => {
            const onImageClick = jest.fn();
            wrapper = setup({ id: "my-id", onImageClick });

            wrapper.find("button.image__preview").simulate("click");

            expect(onImageClick).toHaveBeenCalledTimes(1);
            expect(onImageClick.mock.calls[0][0]).toBe("my-id");
        });
    });

    describe("Loading State", () => {
        it("renders Loader and hides Image when loading", () => {
            wrapper = setup({ loading: true });

            expect(wrapper.find(Loader).exists()).toBe(true);
            expect(wrapper.find("img.image__img").exists()).toBe(false);
            expect(wrapper.find(".image_loading").exists()).toBe(true);
        });
    });

    describe("Footer & Text Truncation", () => {
        it("does NOT render footer if no title, description, or actions", () => {
            wrapper = setup({ title: undefined, description: undefined, actions: [] });
            expect(wrapper.find(".image__footer").exists()).toBe(false);
        });

        it("renders footer if title exists", () => {
            const testTitle = "My Title";
            wrapper = setup({ title: testTitle });
            expect(wrapper.find(".image__footer").exists()).toBe(true);

            const titleNode = wrapper.find(".image__title").hostNodes();

            expect(titleNode.exists()).toBe(true);
            expect(titleNode.text()).toBe(testTitle);
            expect(titleNode.name()).toBe("h3");
        });

        it("renders footer if description exists", () => {
            const testDesc = "My Description";
            wrapper = setup({ description: testDesc });

            const descNode = wrapper.find(".image__description").hostNodes();

            expect(descNode.exists()).toBe(true);
            expect(descNode.text()).toBe(testDesc);
            expect(descNode.name()).toBe("p");
        });
    });

    describe("Actions", () => {
        const mockActionClick = jest.fn();
        const actions = [{ id: "edit", label: "Edit Button", Icon: Eye, onActionItemClick: mockActionClick }];

        it("calls action callback when clicked", () => {
            wrapper = setup({ actions });
            wrapper.find(".image__actions button").simulate("click");
            expect(mockActionClick).toHaveBeenCalled();
            expect(mockActionClick.mock.calls[0][0].id).toBe("edit");
        });
    });

    describe("Checkbox / Selection", () => {
        it("renders Checkbox only when onCheckboxChange is provided", () => {
            wrapper = setup({ onCheckboxChange: undefined });
            expect(wrapper.find(Checkbox).exists()).toBe(false);

            wrapper = setup({ onCheckboxChange: jest.fn() });
            expect(wrapper.find(Checkbox).exists()).toBe(true);
        });

        it("calls onCheckboxChange with ID", () => {
            const onChange = jest.fn();
            const testId = "check-id";
            wrapper = setup({ id: testId, onCheckboxChange: onChange });

            const checkbox = wrapper.find(Checkbox);
            const mockEvent = { target: { checked: true } } as ChangeEvent<HTMLInputElement>;
            checkbox.prop("onChange")!(mockEvent);

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(testId, mockEvent);
        });
    });

    describe("Error Handling & State Updates", () => {
        it("enters failed state if failed prop is true", () => {
            wrapper = setup({ failed: true });
            expect(wrapper.find(".image__failed").hostNodes().exists()).toBe(true);
        });

        it("calls onFailed and updates state when native img errors", () => {
            const onFailed = jest.fn();
            wrapper = setup({ onFailed, src: "bad-url.png" });

            const img = wrapper.find("img");
            img.simulate("error");

            expect(onFailed).toHaveBeenCalled();

            wrapper.update();
            expect(wrapper.find(".image__failed").hostNodes().exists()).toBe(true);
        });

        it("recovers from failed state when src changes", () => {
            wrapper = setup({ failed: true });
            expect(wrapper.find(".image__failed").hostNodes().exists()).toBe(true);

            wrapper.setProps({ src: "new-valid.jpg", failed: false });
            wrapper.update();

            expect(wrapper.find(".image__failed").hostNodes().exists()).toBe(false);
            expect(wrapper.find("img").exists()).toBe(true);
        });
    });

    describe("Additional Edge Cases", () => {
        it("passes the 'selected' prop correctly to the Checkbox", () => {
            wrapper = setup({ onCheckboxChange: jest.fn(), selected: true });
            expect(wrapper.find(Checkbox).prop("checked")).toBe(true);

            wrapper.setProps({ selected: false });
            wrapper.update();
            expect(wrapper.find(Checkbox).prop("checked")).toBe(false);
        });

        it("does not render the Checkbox if the image is loading, even if onCheckboxChange is present", () => {
            wrapper = setup({
                onCheckboxChange: jest.fn(),
                loading: true
            });

            expect(wrapper.find(Checkbox).exists()).toBe(false);
        });

        it("disables action buttons when the image is loading", () => {
            const actions = [{ id: "1", label: "Edit", Icon: Eye, onActionItemClick: jest.fn() }];

            wrapper = setup({
                loading: true,
                actions
            });

            const buttonNode = wrapper.find(".image__actions button");
            expect(buttonNode.prop("disabled")).toBe(true);
        });

        it("renders the footer even if only 'actions' are provided (no title/desc)", () => {
            const actions = [{ id: "1", label: "Edit", Icon: Eye, onActionItemClick: jest.fn() }];

            wrapper = setup({
                title: undefined,
                description: undefined,
                actions
            });

            expect(wrapper.find(".image__footer").exists()).toBe(true);
        });

        it("switches preview from button to div immediately if 'failed' prop is true", () => {
            wrapper = setup({
                failed: true,
                onImageClick: jest.fn()
            });

            const previewNode = wrapper.find(".image__preview").hostNodes();

            expect(previewNode.name()).toBe("div");
        });
    });
});
