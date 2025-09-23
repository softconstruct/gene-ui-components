import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Divider from "@components/atoms/Divider";
import Text from "@components/atoms/Text";
import Tag from "@components/molecules/Tag/Tag";
import TagGroup, { ITagGroupProps } from "@components/molecules/TagGroup/TagGroup";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const tagsArray = Array.from({ length: 100 }, (_, index) => ({
    id: `tag-${Date.now()}-${index}`,
    text: faker.name.firstName()
}));

const meta: Meta<ITagGroupProps> = {
    title: "Molecules/TagGroup",
    component: TagGroup,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        renderToggleText: args({ control: "false", ...propCategory.action })
    },
    args: {
        size: "medium"
    }
};

export default meta;

const DefaultStory = (props: ITagGroupProps) => {
    const [tags, setTags] = useState(tagsArray);

    const handleRemoveTag = (tagId: string) => {
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    };

    return (
        <TagGroup {...props}>
            {tags.map(({ id, text }) => (
                <Tag key={id} text={text} withIcon={false} onClose={() => handleRemoveTag(id)} />
            ))}
        </TagGroup>
    );
};

const TagGroupStory: StoryObj<ITagGroupProps> = {
    render: (props) => <DefaultStory {...props} />,
    args: {
        renderToggleText: (expanded) => (expanded ? "Show less" : "Show more")
    }
};

export { TagGroupStory as Default };

const DifferentTagCountsStory = (props: ITagGroupProps) => {
    const [tags2, setTags2] = useState(tagsArray.slice(0, 2));
    const [tags6, setTags6] = useState(tagsArray.slice(0, 6));
    const [tags100, setTags100] = useState(tagsArray);

    const handleRemoveTag2 = (tagId: string) => {
        setTags2((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    };

    const handleRemoveTag6 = (tagId: string) => {
        setTags6((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    };

    const handleRemoveTag100 = (tagId: string) => {
        setTags100((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    };

    return (
        <>
            <Text as="p" variant="labelMediumSemibold">
                2 tags
            </Text>
            <TagGroup {...props}>
                {tags2.map(({ id, text }) => (
                    <Tag key={id} text={text} onClose={() => handleRemoveTag2(id)} />
                ))}
            </TagGroup>
            <div style={{ height: 40, display: "flex", alignItems: "center" }}>
                <Divider />
            </div>
            <Text as="p" variant="labelMediumSemibold">
                6 tags
            </Text>
            <TagGroup {...props}>
                {tags6.map(({ id, text }) => (
                    <Tag key={id} text={text} onClose={() => handleRemoveTag6(id)} />
                ))}
            </TagGroup>
            <div style={{ height: 40, display: "flex", alignItems: "center" }}>
                <Divider />
            </div>
            <Text as="p" variant="labelMediumSemibold">
                100 tags
            </Text>
            <TagGroup {...props}>
                {tags100.map(({ id, text }) => (
                    <Tag key={id} text={text} onClose={() => handleRemoveTag100(id)} />
                ))}
            </TagGroup>
        </>
    );
};

export const WithDifferentTagCounts: StoryObj<ITagGroupProps> = {
    render: (props) => <DifferentTagCountsStory {...props} />
};
