import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Image from "@components/molecules/Image";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import ImagePreview, { IImagePreviewProps } from "./index";

const meta: Meta<IImagePreviewProps> = {
    title: "Molecules/ImagePreview",
    component: ImagePreview,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
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
        withOverlay: false
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
            <Image
                id="test id"
                src="https://picsum.photos/id/237/500/500"
                aspectRatio="16x9"
                onImageClick={() => setIsOpen(true)}
            />
            <ImagePreview {...props} withOverlay open={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export const WithOverlay: Story = {
    render: (props) => <ImagePreviewWithOverlayStory {...props} />,
    parameters: {
        layout: "fullscreen"
    }
};
