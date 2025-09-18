import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import Button from "@components/atoms/Button";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Banner, { IBannerProps } from "./index";

const meta: Meta<typeof Banner> = {
    title: "Molecules/Banner",
    component: Banner,
    argTypes: {
        text: args({ control: "text", ...propCategory.content }),
        type: args({ control: "select", ...propCategory.appearance }),
        visible: args({ control: "boolean", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.action })
    },
    args: {
        text: "Description text goes here.",
        type: "informational"
    }
};

export default meta;

type Story = StoryObj<IBannerProps>;

const BannerStory = (props: IBannerProps) => {
    const [open, setOpen] = useState(true);

    const onCloseHandler = () => setOpen(false);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <Banner {...props} open={open} onClose={onCloseHandler} />
            {!open && (
                <Button onClick={() => setOpen(true)} appearance="primary">
                    Show Banner
                </Button>
            )}
        </div>
    );
};

export const Default: Story = {
    render: (props) => <BannerStory {...props} />
};
