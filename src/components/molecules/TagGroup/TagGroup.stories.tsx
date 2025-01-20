import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import TagGroup, { ITagGroupProps } from "./index";

const meta: Meta<typeof TagGroup> = {
    title: "Molecules/TagGroup",
    component: TagGroup,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill TagGroup component argTypes
    },
    args: {
        // fill TagGroup component args
    } as ITagGroupProps
};

export default meta;

const Template: FC<ITagGroupProps> = (props) => <TagGroup {...props} />;

export const Default = Template.bind({});

Default.args = {} as ITagGroupProps;
