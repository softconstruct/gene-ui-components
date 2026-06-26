import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Image from "@components/molecules/Image";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import ImagePreview, { IImagePreviewProps } from "./index";

const imagePaths = [
    "https://picsum.photos/id/237/500/500",
    "https://picsum.photos/id/238/500/700",
    "https://picsum.photos/id/239/800/500",
    "https://picsum.photos/id/240/200/500"
];

const meta: Meta<IImagePreviewProps> = {
    title: "Molecules/ImagePreview",
    component: ImagePreview,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        path: args({ control: "false", ...propCategory.content }),
        defaultIndex: args({ control: "number", ...propCategory.states }),
        withOverlay: args({ control: "boolean", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states }),
        onClose: args({ control: "false", ...propCategory.action })
    },
    args: {
        withOverlay: false,
        open: true
    }
};

export default meta;

type Story = StoryObj<IImagePreviewProps>;

export const NoOverlay: Story = {
    args: {
        withOverlay: false,
        path: imagePaths
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
            <Image id="test id" src={imagePaths[0]} aspectRatio="16x9" onImageClick={() => setIsOpen(true)} />
            <ImagePreview {...props} withOverlay path={imagePaths[0]} open={isOpen} onClose={() => setIsOpen(false)} />
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
                {imagePaths.map((src, index) => (
                    <div key={src} style={{ width: 180 }}>
                        <Image
                            id={`gallery-image-${index}`}
                            src={src}
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
                path={imagePaths}
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
