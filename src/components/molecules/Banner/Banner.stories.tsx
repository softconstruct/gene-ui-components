import React, { useEffect, useState } from "react";
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
        className: args({ control: "false", ...propCategory.appearance }),
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
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setIsOpen(!!props?.open);
    }, [props?.open]);

    const onCloseHandler = () => setIsOpen(false);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <Banner {...props} open={isOpen} onClose={onCloseHandler} />
            {!isOpen && (
                <Button onClick={() => setIsOpen(true)} appearance="primary">
                    Show Banner
                </Button>
            )}
        </div>
    );
};

export const Default: Story = {
    render: (props) => <BannerStory {...props} />,
    args: { open: true }
};

export const WithAction: Story = {
    render: (props) => <BannerStory {...props} />,
    args: { primaryActionText: "Primary Action", secondaryActionText: "Secondary Action" }
};
