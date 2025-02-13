import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import Avatar from "@components/atoms/Avatar";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Profile, { IProfileProps } from "./index";

const meta: Meta<typeof Profile> = {
    title: "Molecules/Profile",
    component: Profile,
    subcomponents: {
        Avatar
    },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        onToggle: args({ control: "false", ...propCategory.action }),
        avatarProps: args({ control: "false", ...propCategory.appearance }),
        name: args({ control: "text", ...propCategory.content })
    },
    args: {
        name: "User Name",
        avatarProps: { src: "https://picsum.photos/id/64/200/300", color: "slate" }
    }
};

export default meta;

type Story = StoryObj<IProfileProps>;

export const Default: Story = {
    render: (props) => {
        return (
            <div
                style={{ width: "100%", background: "var(--guit-sem-color-background-neutral-5)", padding: "5px 10px" }}
            >
                <Profile {...props} />
            </div>
        );
    }
};
