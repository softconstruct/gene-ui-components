import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Download, Eye, Globe, Tag } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Image, { IImageProps } from "./index";

const meta: Meta<IImageProps> = {
    title: "Molecules/Image",
    component: Image,
    argTypes: {
        id: args({ control: "text", ...propCategory.others }),
        className: args({ control: "false", ...propCategory.appearance }),
        src: args({ control: "text", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        failed: args({ control: "boolean", ...propCategory.states }),
        aspectRatio: args({ control: "select", ...propCategory.appearance }),
        actions: args({ control: "false", ...propCategory.content }),
        selected: args({ control: "boolean", ...propCategory.states }),
        onImageClick: args({ control: "false", ...propCategory.action }),
        onSelectionChange: args({ control: "false", ...propCategory.action })
    },
    args: {
        loading: false,
        failed: false,
        aspectRatio: "16:9",
        selected: false
    }
};

export default meta;

type Story = StoryObj<IImageProps>;

const imageActions = [
    { id: 1, Icon: Download, label: "Download", onActionItemClick: () => {} },
    { id: 2, Icon: Tag, label: "Tag", onActionItemClick: () => {} },
    { id: 3, Icon: Globe, label: "Language", onActionItemClick: () => {} }
];
const imageActionsWithMenu = [...imageActions, { id: 4, Icon: Eye, label: "View", onActionItemClick: () => {} }];

const ImageStory = ({ selected, ...props }: IImageProps) => {
    const [imageSelected, setImageSelected] = useState(selected || false);

    const onSelect = () => {
        setImageSelected(!imageSelected);
    };

    return <Image {...props} selected={imageSelected} onSelectionChange={onSelect} />;
};

export const Default: Story = {
    render: (props) => {
        return <ImageStory {...props} />;
    },
    args: {
        src: "https://picsum.photos/id/237/500/500"
    }
};

export const ImageCombinations: Story = {
    render: (props) => {
        return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: "100%" }}>
                <ImageStory {...props} actions={imageActions} id="1" />
                <ImageStory {...props} id="2" />
                <ImageStory {...props} selected id="3" />
                <ImageStory {...props} loading id="4" />
            </div>
        );
    },
    args: {
        title: "Title",
        description: "Description",
        actions: imageActionsWithMenu,
        src: "https://picsum.photos/id/237/500/500"
    }
};
