import React, { useEffect, useState } from "react";
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
        failed: args({ control: "boolean", ...propCategory.states }),
        aspectRatio: args({ control: "select", ...propCategory.appearance }),
        actions: args({ control: "false", ...propCategory.functionality }),
        selected: args({ control: "boolean", ...propCategory.states }),
        onImageClick: args({ control: "false", ...propCategory.action }),
        onCheckboxChange: args({ control: "false", ...propCategory.action }),
        onFailed: args({ control: "false", ...propCategory.action })
    },
    args: {
        loading: false,
        failed: false,
        aspectRatio: "16x9",
        selected: false,
        src: "https://picsum.photos/id/237/500/500"
    }
};

export default meta;

type Story = StoryObj<IImageProps>;

const imageActions = [
    { id: "1", Icon: Download, label: "Download", onActionItemClick: () => {} },
    { id: "2", Icon: Tag, label: "Tag", onActionItemClick: () => {} },
    { id: "3", Icon: Globe, label: "Language", onActionItemClick: () => {} }
];
const imageActionsWithMenu = [...imageActions, { id: "4", Icon: Eye, label: "View", onActionItemClick: () => {} }];

const imageStories = [
    {
        id: "1",
        actions: [{ id: "1", Icon: Tag, label: "Tag", onActionItemClick: () => {} }],
        title: "Title",
        description: "Description"
    },
    {
        id: "2",
        actions: imageActionsWithMenu,
        title: "Menu with actions",
        description: "This description should be truncated"
    },
    { id: "3", actions: imageActionsWithMenu, title: "Title", description: "Description", selected: true },
    { id: "4", actions: imageActionsWithMenu, title: "Title", description: "Description", loading: true }
];

const ImageStory = ({ selected, ...props }: IImageProps) => {
    const [imageSelected, setImageSelected] = useState(selected || false);

    const onSelect = () => {
        setImageSelected(!imageSelected);
    };

    useEffect(() => {
        if (selected === undefined) return;
        setImageSelected(selected);
    }, [selected]);

    return <Image {...props} selected={imageSelected} onCheckboxChange={onSelect} />;
};

export const Default: Story = {
    render: (props) => {
        return <ImageStory {...props} />;
    },
    args: {
        id: "test id"
    }
};

export const ImageCombinations: Story = {
    render: (props) => {
        return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: "100%" }}>
                {imageStories.map((storyData) => (
                    <ImageStory key={storyData.id} {...storyData} {...props} />
                ))}
            </div>
        );
    },
    args: {}
};
