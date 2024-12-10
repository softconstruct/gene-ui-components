import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Tag, { ITagProps } from "./index";

const meta: Meta<typeof Tag> = {
    title: "Molecules/Tag",
    component: Tag,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        state: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        withIcon: args({ control: "boolean", ...propCategory.appearance }),
        text: args({ control: "text", ...propCategory.content })
    },
    args: {
        text: "Tag",
        withIcon: true
    } as ITagProps
};

export default meta;

const Template: FC<ITagProps> = (props) => <Tag {...props} />;

export const Default = Template.bind({});

Default.args = {} as ITagProps;