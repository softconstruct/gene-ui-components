import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Image from "@components/molecules/Image";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import ImagePreview, { IImagePreviewImage, IImagePreviewProps } from "./index";

const previewImages: IImagePreviewImage[] = [
    { path: "https://picsum.photos/id/237/500/500", title: "Black dog portrait" },
    { path: "https://picsum.photos/id/238/500/700", title: "Forest trail" },
    { path: "https://picsum.photos/id/239/800/500", title: "Mountain lake" },
    { path: "https://picsum.photos/id/240/200/500", title: "City skyline" }
];

const meta: Meta<IImagePreviewProps> = {
    title: "Molecules/ImagePreview",
    component: ImagePreview,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        images: args({ control: "false", ...propCategory.content }),
        defaultIndex: args({ control: "number", ...propCategory.states }),
        showSize: args({ control: "boolean", ...propCategory.functionality }),
        showDimensions: args({ control: "boolean", ...propCategory.functionality }),
        showRotate: args({ control: "boolean", ...propCategory.functionality }),
        showDownload: args({ control: "boolean", ...propCategory.functionality }),
        withMagnifier: args({ control: "boolean", ...propCategory.functionality }),
        magnifierDefaultValue: args({ control: "boolean", ...propCategory.states }),
        withOverlay: args({ control: "boolean", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states }),
        onClose: args({ control: "false", ...propCategory.action })
    },
    args: {
        withOverlay: false,
        open: true,
        showSize: true,
        showDimensions: true,
        showRotate: true,
        showDownload: true,
        withMagnifier: true,
        magnifierDefaultValue: false
    }
};

export default meta;

type Story = StoryObj<IImagePreviewProps>;

export const NoOverlay: Story = {
    args: {
        withOverlay: false,
        images: previewImages
    }
};

const ImagePreviewWithOverlayStory = (props: IImagePreviewProps) => {
    const { open } = props;
    const [isOpen, setIsOpen] = useState(!!open);

    useEffect(() => {
        setIsOpen(!!open);
    }, [open]);

    return (
        <div style={{ height: "100vh" }}>
            <Image id="test id" src={previewImages[0].path} aspectRatio="16x9" onImageClick={() => setIsOpen(true)} />
            <ImagePreview
                {...props}
                withOverlay
                images={{ path: previewImages[0].path }}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
};

export const WithOverlay: Story = {
    render: (props) => <ImagePreviewWithOverlayStory {...props} />,
    parameters: {
        layout: "fullscreen"
    }
};

const ImagePreviewWithOverlayGalleryStory = (props: IImagePreviewProps) => {
    const { open } = props;
    const [isOpen, setIsOpen] = useState(!!open);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setIsOpen(!!open);
    }, [open]);

    return (
        <div style={{ height: "100vh" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 800 }}>
                {previewImages.map((image, index) => (
                    <div key={image.path} style={{ width: 180 }}>
                        <Image
                            id={`gallery-image-${index}`}
                            src={image.path}
                            title={image.title}
                            aspectRatio="1x1"
                            onImageClick={() => {
                                setActiveIndex(index);
                                setIsOpen(true);
                            }}
                        />
                    </div>
                ))}
            </div>
            <ImagePreview
                {...props}
                withOverlay
                images={previewImages}
                defaultIndex={activeIndex}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
};

export const WithOverlayGallery: Story = {
    render: (props) => <ImagePreviewWithOverlayGalleryStory {...props} />,
    parameters: {
        layout: "fullscreen"
    }
};
