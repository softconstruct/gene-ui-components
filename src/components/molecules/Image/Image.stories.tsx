import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Image, { IImageProps } from "./index";
import { Download, Eye, Globe, Tag } from "@geneui/icons";

const meta: Meta<IImageProps> = {
    title: "Molecules/Image",
    component: Image,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        src: args({ control: "text", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        error: args({ control: "boolean", ...propCategory.states }),
        aspectRatio: args({ control: "select", ...propCategory.appearance }),
        actions: args({ control: "false", ...propCategory.content }),
        selected: args({ control: "boolean", ...propCategory.states }),
        onClick: args({ control: "false", ...propCategory.action }),
        onSelect: args({ control: "false", ...propCategory.action }),
    },
    args: {
        loading: false,
        error: false,
        aspectRatio: '16:9',
        selected: false,
    }
};

export default meta;

type Story = StoryObj<IImageProps>;

const imageActions = [
    { id: 1, Icon: Download, label: 'Download', onActionItemClick: () => console.log('Download') },
    { id: 2, Icon: Tag, label: 'Tag', onActionItemClick: () => console.log('Tagging') },
    { id: 3, Icon: Globe, label: 'Language', onActionItemClick: () => console.log('Language') },
];
const imageActionsWithMenu = [...imageActions, { id: 4, Icon: Eye, label: 'View', onActionItemClick: () => console.log('View') },]

const ImageStory = (props: IImageProps) => {
    const [imageSelected, setImageSelected] = useState(props.selected || false);


    const onSelect = () => {
        setImageSelected(!imageSelected);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <Image {...props} selected={imageSelected} onSelect={onSelect} />
        </div>
    );
};


export const Default: Story = {
    render: (props) => {
        return <ImageStory {...props} />;
    }
};

export const WithoutFooter: Story = {
    render: (props) => <ImageStory {...props} />,
    args: {}
};

export const WithActions: Story = {
    render: (props) => <ImageStory {...props} />,
    args: {
        title: 'Title',
        description: 'Description',
        actions: imageActions,
    }
};

export const WithDottedMenuActions: Story = {
    render: (props) => <ImageStory {...props} />,
    args: {
        title: 'Title',
        description: 'Description',
        actions: imageActionsWithMenu
    }
};

export const DefaultSelected: Story = {
    render: (props) => <ImageStory {...props} />,
    args: {
        title: 'Title',
        description: 'Description',
        actions: imageActionsWithMenu,
        selected: true,
    }
};

export const WithLoading: Story = {
    render: (props) => <ImageStory {...props} />,
    args: {
        title: 'Title',
        description: 'Description',
        actions: imageActionsWithMenu,
        loading: true,
    }
};


