import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import Controllers from "@components/molecules/ImagePreview/Controllers/Controllers";
import Magnifier from "@components/molecules/ImagePreview/Magnifier/Magnifier";
import Switch from "@components/molecules/Switch";
import GeneUIProvider from "@components/providers/GeneUIProvider";

import { getImageDownloadFileName } from "./ImagePreview.helpers";
import ImagePreview, { IImagePreviewImage, IImagePreviewProps } from "./index";

const previewImages: IImagePreviewImage[] = [
    { path: "https://example.com/image-1.jpg", title: "Image 1" },
    { path: "https://example.com/image-2.jpg", title: "Image 2" },
    { path: "https://example.com/image-3.jpg", title: "Image 3" }
];

const mockImageFetch = () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(2 * 1024 * 1024))
        })
    ) as jest.Mock;
};

const mockDownload = () => {
    const clickMock = jest.fn();
    const link = {
        href: "",
        download: "",
        click: clickMock
    };
    const originalCreateElement = document.createElement.bind(document);

    jest.spyOn(document, "createElement").mockImplementation((tagName, options) => {
        if (tagName === "a") {
            return link as unknown as HTMLAnchorElement;
        }

        return originalCreateElement(tagName, options);
    });
    jest.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    jest.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            blob: () => Promise.resolve(new Blob(["image-data"], { type: "image/jpeg" }))
        })
    ) as jest.Mock;

    return { clickMock, link };
};

const flushUpdates = async () => {
    await act(async () => {
        await new Promise((resolve) => {
            setTimeout(resolve);
        });
    });
};

const mountImagePreview = async (
    props?: IImagePreviewProps,
    options?: { wrappingComponent?: typeof GeneUIProvider }
) => {
    let wrapper: ReactWrapper<IImagePreviewProps>;

    await act(async () => {
        wrapper = mount(<ImagePreview {...props} />, options);
    });

    await flushUpdates();

    return wrapper!.update();
};

const updateImagePreviewProps = async (
    wrapper: ReactWrapper<IImagePreviewProps>,
    props: Partial<IImagePreviewProps>
) => {
    await act(async () => {
        wrapper.setProps(props);
    });

    await flushUpdates();

    return wrapper.update();
};

const getPreviewImage = (wrapper: ReactWrapper<IImagePreviewProps>) => {
    if (wrapper.find(Magnifier).exists()) {
        return wrapper.find(Magnifier).find("img").first();
    }

    return wrapper.find(".imagePreview__image").first();
};

describe("ImagePreview ", () => {
    let setup: ReactWrapper<IImagePreviewProps>;
    const originalFetch = global.fetch;

    beforeEach(() => {
        setup = mount(<ImagePreview />);
    });

    afterEach(async () => {
        await flushUpdates();
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it("renders withOverlay via portal", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(1);
    });

    it("does not apply withOverlay class in inline mode", () => {
        expect(setup.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("does not render overlay when open is false", () => {
        const wrapper = mount(<ImagePreview withOverlay open={false} />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("calls onClose when close button is clicked", () => {
        const onCloseMock = jest.fn();
        const wrapper = mount(<ImagePreview withOverlay onClose={onCloseMock} />, {
            wrappingComponent: GeneUIProvider
        });

        wrapper.find(".imagePreview_withOverlay").find(Button).first().simulate("click");

        expect(onCloseMock).toHaveBeenCalled();
    });

    it("renders with correct default CSS class", () => {
        expect(setup.find(".imagePreview")).toHaveLength(1);
    });

    it("renders open prop correctly", () => {
        const wrapper = mount(<ImagePreview withOverlay open />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview_withOverlay").exists()).toBeTruthy();
    });

    it("renders inline mode when open is false", () => {
        const wrapper = mount(<ImagePreview open={false} />);

        expect(wrapper.find(".imagePreview").exists()).toBeTruthy();
        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("does not render overlay without GeneUIProvider", () => {
        const wrapper = mount(<ImagePreview withOverlay />);

        expect(wrapper.find(".imagePreview_withOverlay")).toHaveLength(0);
    });

    it("does not render close button in inline mode", () => {
        expect(setup.find(".imagePreview__header").find(Button)).toHaveLength(0);
    });

    it("renders close button in overlay mode", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview__header").find(Button)).toHaveLength(1);
        expect(wrapper.find('.imagePreview__header [aria-label="Close"]').exists()).toBeTruthy();
    });

    it("renders header, body and footer sections", () => {
        expect(setup.find(".imagePreview__header").exists()).toBeTruthy();
        expect(setup.find(".imagePreview__body").exists()).toBeTruthy();
        expect(setup.find(".imagePreview__footer").exists()).toBeTruthy();
    });

    it("does not render metadata when images is not provided", () => {
        expect(setup.find(".imagePreview__meta")).toHaveLength(0);
    });

    it("does not render title when image title is not provided", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: { path: previewImages[0].path },
            showSize: false
        });
        const texts = wrapper.find(Text).map((node) => node.text());

        expect(texts).not.toContain("Image 1");
    });

    it("renders title when image title is provided", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: previewImages[0],
            showSize: false
        });

        expect(wrapper.find(Text).first().text()).toBe("Image 1");
    });

    it("uses image title as img alt text", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: previewImages[0],
            showSize: false
        });

        expect(getPreviewImage(wrapper).prop("alt")).toBe("Image 1");
    });

    it("uses empty alt text when image title is not provided", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: { path: previewImages[0].path },
            showSize: false
        });

        expect(getPreviewImage(wrapper).prop("alt")).toBe("");
    });

    it("updates title when navigating between images", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: previewImages,
            showSize: false
        });

        wrapper.find(".imagePreview__body").find(Button).at(1).simulate("click");

        expect(wrapper.find(Text).first().text()).toBe("Image 2");
    });

    it("does not render page count when images is not provided", () => {
        expect(setup.find(".imagePreview__count")).toHaveLength(0);
    });

    it("renders Controllers component", () => {
        expect(setup.find(Controllers).exists()).toBeTruthy();
    });

    it("passes withOverlay prop to Controllers", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(Controllers).prop("withOverlay")).toBe(true);
        expect(wrapper.find(".imagePreview__controllers_withOverlay").exists()).toBeTruthy();
    });

    it("passes showRotate prop to Controllers by default", () => {
        expect(setup.find(Controllers).prop("showRotate")).toBe(true);
    });

    it("passes showRotate false to Controllers when showRotate is false", async () => {
        const wrapper = await updateImagePreviewProps(setup, { showRotate: false });

        expect(wrapper.find(Controllers).prop("showRotate")).toBe(false);
    });

    it("rotates image clockwise when rotate right button is clicked", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], showSize: false });

        wrapper
            .find(Controllers)
            .find(Button)
            .filterWhere((button) => button.prop("aria-label") === "Rotate right")
            .first()
            .simulate("click");

        expect(wrapper.find(Magnifier).prop("rotation")).toBe(90);
    });

    it("rotates image counterclockwise when rotate left button is clicked", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], showSize: false });

        wrapper
            .find(Controllers)
            .find(Button)
            .filterWhere((button) => button.prop("aria-label") === "Rotate left")
            .first()
            .simulate("click");

        expect(wrapper.find(Magnifier).prop("rotation")).toBe(-90);
    });

    it("does not render rotate buttons when showRotate is false", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], showRotate: false, showSize: false });

        expect(
            wrapper
                .find(Controllers)
                .find(Button)
                .filterWhere((button) => button.prop("aria-label") === "Rotate right")
        ).toHaveLength(0);
        expect(
            wrapper
                .find(Controllers)
                .find(Button)
                .filterWhere((button) => button.prop("aria-label") === "Rotate left")
        ).toHaveLength(0);
    });

    it("resets rotation when navigating to another image", async () => {
        const wrapper = await mountImagePreview({ images: previewImages, showSize: false });

        wrapper
            .find(Controllers)
            .find(Button)
            .filterWhere((button) => button.prop("aria-label") === "Rotate right")
            .first()
            .simulate("click");
        wrapper.find(".imagePreview__body").find(Button).at(1).simulate("click");

        expect(wrapper.find(Magnifier).prop("rotation")).toBe(0);
    });

    it("passes withMagnifier prop to Controllers by default", () => {
        expect(setup.find(Controllers).prop("withMagnifier")).toBe(true);
    });

    it("passes withMagnifier false to Controllers when withMagnifier is false", async () => {
        const wrapper = await updateImagePreviewProps(setup, { withMagnifier: false });

        expect(wrapper.find(Controllers).prop("withMagnifier")).toBe(false);
    });

    it("renders magnifier switch when withMagnifier is true", () => {
        expect(setup.find(Controllers).find(Switch).exists()).toBeTruthy();
    });

    it("does not render magnifier switch when withMagnifier is false", async () => {
        const wrapper = await updateImagePreviewProps(setup, { withMagnifier: false });

        expect(wrapper.find(Controllers).find(Switch)).toHaveLength(0);
    });

    it("renders Magnifier when withMagnifier is true and images are provided", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], showSize: false });

        expect(wrapper.find(Magnifier).exists()).toBeTruthy();
        expect(wrapper.find(Magnifier).prop("showMagnifier")).toBe(false);
    });

    it("does not render Magnifier when withMagnifier is false", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], withMagnifier: false, showSize: false });

        expect(wrapper.find(Magnifier)).toHaveLength(0);
    });

    it("uses magnifierDefaultValue as initial magnifier switch state", async () => {
        const wrapper = await mountImagePreview({
            images: previewImages[0],
            magnifierDefaultValue: true,
            showSize: false
        });

        expect(wrapper.find(Magnifier).prop("showMagnifier")).toBe(true);
        expect(wrapper.find(Controllers).prop("magnifierChecked")).toBe(true);
    });

    it("toggles magnifier when switch value changes", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], showSize: false });

        await act(async () => {
            wrapper.find(Controllers).prop("onMagnifierChange")?.(true);
        });

        wrapper.update();

        expect(wrapper.find(Magnifier).prop("showMagnifier")).toBe(true);
        expect(wrapper.find(Controllers).prop("magnifierChecked")).toBe(true);
    });

    it("rotates image with plain img when withMagnifier is false", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], withMagnifier: false, showSize: false });

        wrapper
            .find(Controllers)
            .find(Button)
            .filterWhere((button) => button.prop("aria-label") === "Rotate right")
            .first()
            .simulate("click");

        expect(getPreviewImage(wrapper).prop("style")).toEqual(expect.objectContaining({ transform: "rotate(90deg)" }));
    });

    it("passes showDownload prop to Controllers by default", () => {
        expect(setup.find(Controllers).prop("showDownload")).toBe(true);
    });

    it("passes showDownload false to Controllers when showDownload is false", async () => {
        const wrapper = await updateImagePreviewProps(setup, { showDownload: false });

        expect(wrapper.find(Controllers).prop("showDownload")).toBe(false);
    });

    it("does not render download button when showDownload is false", async () => {
        const wrapper = await mountImagePreview({ images: previewImages[0], showDownload: false, showSize: false });

        expect(
            wrapper
                .find(Controllers)
                .find(Button)
                .filterWhere((button) => button.prop("aria-label") === "Download")
        ).toHaveLength(0);
    });

    it("downloads current image when download button is clicked", async () => {
        const { clickMock, link } = mockDownload();
        const wrapper = await mountImagePreview({ images: previewImages[0], showSize: false });

        await act(async () => {
            wrapper
                .find(Controllers)
                .find(Button)
                .filterWhere((button) => button.prop("aria-label") === "Download")
                .first()
                .simulate("click");
            await new Promise((resolve) => {
                setTimeout(resolve);
            });
        });

        wrapper.update();

        expect(global.fetch).toHaveBeenCalledWith(previewImages[0].path);
        expect(link.download).toBe(getImageDownloadFileName(previewImages[0].path, previewImages[0].title));
        expect(clickMock).toHaveBeenCalled();
    });

    it("applies overlay modifier classes when withOverlay is true", () => {
        const wrapper = mount(<ImagePreview withOverlay />, { wrappingComponent: GeneUIProvider });

        expect(wrapper.find(".imagePreview__headerInfo_withOverlay").exists()).toBeTruthy();
    });

    it("does not apply overlay modifier classes in inline mode", () => {
        expect(setup.find(".imagePreview__headerInfo_withOverlay")).toHaveLength(0);
        expect(setup.find(".imagePreview__count_withOverlay")).toHaveLength(0);
        expect(setup.find(".imagePreview__controllers_withOverlay")).toHaveLength(0);
    });

    it("does not render navigation buttons when images is not provided", () => {
        expect(setup.find(".imagePreview__body").find(Button)).toHaveLength(0);
    });

    it("handles undefined onClose gracefully", () => {
        const wrapper = mount(<ImagePreview withOverlay onClose={undefined} />, {
            wrappingComponent: GeneUIProvider
        });

        expect(() => {
            wrapper.find(".imagePreview_withOverlay").find(Button).first().simulate("click");
        }).not.toThrow();
    });

    it("renders image from single images object", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: previewImages[0],
            showSize: false
        });

        expect(getPreviewImage(wrapper).prop("src")).toBe(previewImages[0].path);
    });

    it("renders image from images array", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: previewImages,
            showSize: false
        });

        expect(getPreviewImage(wrapper).prop("src")).toBe(previewImages[0].path);
    });

    it("renders page count for images array", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: previewImages,
            showSize: false
        });

        expect(wrapper.find(".imagePreview__count").text()).toBe("1/3");
    });

    it("does not render page count for single image", async () => {
        const wrapper = await updateImagePreviewProps(setup, {
            images: previewImages[0],
            showSize: false
        });

        expect(wrapper.find(".imagePreview__count")).toHaveLength(0);
    });

    it("renders navigation buttons only when images is an array with multiple items", async () => {
        const singleImageWrapper = await mountImagePreview({ images: previewImages[0], showSize: false });
        const multipleImagesWrapper = await mountImagePreview({ images: previewImages, showSize: false });

        expect(singleImageWrapper.find(".imagePreview__body").find(Button)).toHaveLength(0);
        expect(multipleImagesWrapper.find(".imagePreview__body").find(Button)).toHaveLength(2);
    });

    it("navigates to next image on forward button click", async () => {
        const wrapper = await mountImagePreview({ images: previewImages, showSize: false });

        wrapper.find(".imagePreview__body").find(Button).at(1).simulate("click");

        expect(getPreviewImage(wrapper).prop("src")).toBe(previewImages[1].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("2/3");
    });

    it("navigates to previous image on back button click", async () => {
        const wrapper = await mountImagePreview({ images: previewImages, showSize: false });

        wrapper.find(".imagePreview__body").find(Button).at(0).simulate("click");

        expect(getPreviewImage(wrapper).prop("src")).toBe(previewImages[2].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("3/3");
    });

    it("resets selected image when images changes", async () => {
        const wrapper = await mountImagePreview({ images: previewImages, showSize: false });

        wrapper.find(".imagePreview__body").find(Button).at(1).simulate("click");
        await updateImagePreviewProps(wrapper, { images: previewImages.slice(0, 2), showSize: false });

        expect(getPreviewImage(wrapper).prop("src")).toBe(previewImages[0].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("1/2");
    });

    it("renders image at defaultIndex", async () => {
        const wrapper = await mountImagePreview({
            images: previewImages,
            defaultIndex: 2,
            showSize: false
        });

        expect(getPreviewImage(wrapper).prop("src")).toBe(previewImages[2].path);
        expect(wrapper.find(".imagePreview__count").text()).toBe("3/3");
        expect(wrapper.find(Text).first().text()).toBe("Image 3");
    });

    it("renders size when showSize is true", async () => {
        mockImageFetch();

        const wrapper = await mountImagePreview({
            images: previewImages[0],
            showDimensions: false
        });

        expect(wrapper.find(".imagePreview__meta").text()).toContain("2 MB");
    });

    it("does not render size when showSize is false", async () => {
        const fetchMock = jest.fn();
        global.fetch = fetchMock;

        const wrapper = await mountImagePreview({
            images: previewImages[0],
            showSize: false
        });
        const image = getPreviewImage(wrapper);
        const imageNode = image.getDOMNode() as HTMLImageElement;

        Object.defineProperty(imageNode, "naturalWidth", { value: 700, configurable: true });
        Object.defineProperty(imageNode, "naturalHeight", { value: 394, configurable: true });

        await act(async () => {
            image.simulate("load");
        });

        wrapper.update();

        expect(wrapper.find(".imagePreview__meta").text()).toBe("700x394");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("renders dimensions when showDimensions is true", async () => {
        const wrapper = await mountImagePreview({
            images: previewImages[0],
            showSize: false
        });
        const image = getPreviewImage(wrapper);
        const imageNode = image.getDOMNode() as HTMLImageElement;

        Object.defineProperty(imageNode, "naturalWidth", { value: 700, configurable: true });
        Object.defineProperty(imageNode, "naturalHeight", { value: 394, configurable: true });

        await act(async () => {
            image.simulate("load");
        });

        wrapper.update();

        expect(wrapper.find(".imagePreview__meta").text()).toBe("700x394");
    });

    it("does not render dimensions when showDimensions is false", async () => {
        mockImageFetch();

        const wrapper = await mountImagePreview({
            images: previewImages[0],
            showDimensions: false
        });

        expect(wrapper.find(".imagePreview__meta").text()).toContain("2 MB");
        expect(wrapper.find(".imagePreview__meta").text()).not.toContain("700x394");
    });

    it("does not render metadata when showSize and showDimensions are false", async () => {
        const wrapper = await mountImagePreview({
            images: previewImages[0],
            showSize: false,
            showDimensions: false
        });

        expect(wrapper.find(".imagePreview__meta")).toHaveLength(0);
    });
});
