import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Button from "@components/atoms/Button";
import Banner, { IBannerProps } from "@components/molecules/Banner";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<typeof Banner> = {
    title: "Molecules/Banner",
    component: Banner,
    argTypes: {
        text: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.appearance }),
        onClose: args({ control: "false", ...propCategory.action }),
        primaryActionText: args({ control: "text", ...propCategory.content }),
        secondaryActionText: args({ control: "text", ...propCategory.content }),
        onPrimaryActionClick: args({ control: "false", ...propCategory.action }),
        onSecondaryActionClick: args({ control: "false", ...propCategory.action }),
        open: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        text: "Description text goes here.",
        status: "informative"
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

export const WithAction: Story = {
    render: (props) => <BannerStory {...props} />,
    args: { primaryActionText: "Primary Action", secondaryActionText: "Secondary Action" }
};
