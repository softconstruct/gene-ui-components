import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import Tag from "../Tag/Tag";
// Components
import TagGroup, { ITagGroupProps } from "./index";

const meta: Meta<ITagGroupProps> = {
    title: "Molecules/TagGroup",
    component: TagGroup,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {}
};

export default meta;

const TagGroupStory: StoryObj<ITagGroupProps> = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {},
    render: (props) => {
        return (
            <TagGroup {...props}>
                {Array.from({ length: 32 }).map(() => (
                    <Tag text="Tag" />
                ))}
            </TagGroup>
        );
    }
};

export { TagGroupStory as TagGroup };
