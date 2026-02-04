import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import Avatar from "@components/atoms/Avatar";
import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";
import Text from "@components/atoms/Text";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import ButtonGroup from "../ButtonGroup";
import QRCode from "../QRCode";
// Components
import Section, { ISectionProps } from "./index";

const meta: Meta<ISectionProps> = {
    title: "Molecules/Section",
    component: Section,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        subtitle: args({ control: "text", ...propCategory.content }),
        headerContent: args({ control: "false", ...propCategory.content }),
        bodyContent: args({ control: "false", ...propCategory.content }),
        footerContent: args({ control: "false", ...propCategory.content }),
        action: args({ control: "false", ...propCategory.content }),
        hasHeader: args({ control: "boolean", ...propCategory.states }),
        hasFooter: args({ control: "boolean", ...propCategory.states }),
        withPadding: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        size: "medium",
        title: "Title",
        subtitle: "Subtitle",
        headerContent: <Avatar fullName="Test Name" onClick={() => {}} />,
        bodyContent: <QRCode value="https://geneui-storybook.softconstruct.com/" />,
        footerContent: (
            <Button size="medium" fullWidth>
                Submit
            </Button>
        ),
        action: { children: "Submit", appearance: "primary", onClick: () => {}, size: "medium", layout: "fill" },
        hasHeader: true,
        hasFooter: true,
        withPadding: true
    }
};

export default meta;

type Story = StoryObj<ISectionProps>;

export const Default: Story = {
    args: {
        size: "medium",
        title: "Title",
        subtitle: "Subtitle",
        headerContent: (
            <>
                <Avatar fullName="John Doe" onClick={() => {}} />
                <Avatar fullName="Jane Smith" onClick={() => {}} />
                <Avatar fullName="Bob Johnson" onClick={() => {}} />
            </>
        ),
        bodyContent: (
            <>
                <QRCode value="https://geneui-storybook.softconstruct.com/" />
                <Text as="p" variant="headingMediumSemibold">
                    Section Title
                </Text>
                <Text as="p" variant="bodyMediumMedium">
                    This is a sample body content with multiple components to demonstrate how the Section component
                    handles different content types.
                </Text>
                <Pill text="Success" filled />
                <Pill text="Warning" />
                <Pill text="Error" />
                <Pill text="Info" />
                <Text as="p" variant="bodyLargeMedium">
                    Additional content can be added here. The Section component supports any React node as body content,
                    making it flexible for various use cases.
                </Text>
                <Button size="medium" appearance="secondary">
                    Action Button
                </Button>
                {Array.from({ length: 10 }, (_, i) => (
                    <Text key={String(i)} as="p" variant="bodyMediumRegular">
                        {`Content item ${i + 1} - This demonstrates scrolling behavior when content exceeds the available space.`}
                    </Text>
                ))}
            </>
        ),
        footerContent: (
            <ButtonGroup size="medium">
                <Button size="medium" appearance="secondary">
                    Secondary
                </Button>
                <Button size="medium" appearance="primary">
                    Primary
                </Button>
                <Button size="medium" appearance="primary">
                    Primary
                </Button>
                <Button size="medium" appearance="primary">
                    Primary
                </Button>
            </ButtonGroup>
        ),
        action: { children: "Submit", appearance: "primary", onClick: () => {}, size: "medium", layout: "fill" },
        hasHeader: true,
        hasFooter: true,
        withPadding: true
    }
};
