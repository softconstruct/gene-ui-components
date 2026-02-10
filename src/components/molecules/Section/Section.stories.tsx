import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { CaretDownFilled } from "@geneui/icons";

import Avatar from "@components/atoms/Avatar";
import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";
import Text from "@components/atoms/Text";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import ButtonGroup from "../ButtonGroup";
import InteractiveCard from "../InteractiveCard";
import QRCode from "../QRCode";
import { SplitButton } from "../SplitButton";
// Components
import Section, { ISectionProps } from "./index";

const meta: Meta<ISectionProps> = {
    title: "Molecules/Section",
    component: Section,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        subtitle: args({ control: "text", ...propCategory.content }),
        headerContent: args({ control: "false", ...propCategory.content }),
        bodyContent: args({ control: "false", ...propCategory.content }),
        footerContent: args({ control: "false", ...propCategory.content }),
        action: args({ control: "false", ...propCategory.content }),
        inset: args({ control: "boolean", ...propCategory.appearance })
    },
    args: {
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
        inset: true
    }
};

export default meta;

type Story = StoryObj<ISectionProps>;

export const Default: Story = {
    args: {
        headerContent: (
            <SplitButton items={[{ title: "Test", Icon: CaretDownFilled, id: "test" }]} onSelect={() => {}} />
        ),
        bodyContent: (
            <>
                <QRCode value="https://geneui-storybook.softconstruct.com/" />
                <Text as="p" variant="headingMediumSemibold">
                    Section Title
                </Text>
                <InteractiveCard label="Test Label" description="Test Description" />
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
                <QRCode value="https://geneui-storybook.softconstruct.com/" />
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
        action: { children: "Submit", appearance: "primary", onClick: () => {}, size: "medium", layout: "fill" }
    }
};
