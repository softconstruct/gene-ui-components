import React from "react";
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
        size: {
            control: "select",
            options: ["medium", "small"],
            description: "Size of the tags and show more/less button",
            table: {
                category: "Appearance"
            }
        },
        showMoreText: args({ control: "text", ...propCategory.content }),
        showLessText: args({ control: "text", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        size: "medium"
    }
};

export default meta;

const DefaultStory = (props: ITagGroupProps) => {
    return (
        <TagGroup {...props}>
            {tagsArray.map(({ id, text }) => (
                <Tag key={id} text={text} withIcon={false} />
            ))}
        </TagGroup>
    );
};

const TagGroupStory: StoryObj<ITagGroupProps> = {
    render: (props) => <DefaultStory {...props} />,
    args: {
        showMoreText: `Show all (${tagsArray.length})`,
        showLessText: "Show less"
    }
};

export { TagGroupStory as Default };

const DifferentTagTypesStory = (props: ITagGroupProps) => {
    const tagTypes: Array<"rest" | "warning" | "error"> = ["rest", "warning", "error"];

    return (
        <TagGroup {...props}>
            {tagsArray.slice(0, 5).map(({ id, text }, index) => (
                <Tag key={id} text={text} type={tagTypes[index % tagTypes.length]} />
            ))}
        </TagGroup>
    );
};

export const WithDifferentTagTypes: StoryObj<ITagGroupProps> = {
    render: (props) => <DifferentTagTypesStory {...props} />,
    args: {
        showMoreText: "Show more",
        showLessText: "Show less"
    }
};

const DifferentTagCountsStory = (props: ITagGroupProps) => {
    return (
        <>
            <Text as="p" variant="labelMediumSemibold">
                2 tags
            </Text>
            <TagGroup {...props}>
                {tagsArray.slice(0, 2).map(({ id, text }) => (
                    <Tag key={id} text={text} />
                ))}
            </TagGroup>
            <div style={{ height: 40, display: "flex", alignItems: "center" }}>
                <Divider />
            </div>
            <Text as="p" variant="labelMediumSemibold">
                6 tags
            </Text>
            <TagGroup {...props}>
                {tagsArray.slice(0, 6).map(({ id, text }) => (
                    <Tag key={id} text={text} />
                ))}
            </TagGroup>
            <div style={{ height: 40, display: "flex", alignItems: "center" }}>
                <Divider />
            </div>
            <Text as="p" variant="labelMediumSemibold">
                100 tags
            </Text>
            <TagGroup {...props}>
                {tagsArray.map(({ id, text }) => (
                    <Tag key={id} text={text} />
                ))}
            </TagGroup>
        </>
    );
};

export const WithDifferentTagCounts: StoryObj<ITagGroupProps> = {
    render: (props) => <DifferentTagCountsStory {...props} />
};
