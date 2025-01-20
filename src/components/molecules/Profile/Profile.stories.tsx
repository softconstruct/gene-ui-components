import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Profile, { IProfileProps } from "./index";

const meta: Meta<typeof Profile> = {
    title: "Molecules/Profile",
    component: Profile,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Profile component argTypes
    },
    args: {
        // fill Profile component args
    } as IProfileProps
};

export default meta;

const Template: FC<IProfileProps> = (props) => <Profile {...props} />;

export const Default = Template.bind({});

Default.args = {} as IProfileProps;
