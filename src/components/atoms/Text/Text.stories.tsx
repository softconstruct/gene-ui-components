import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import Divider from "@components/atoms/Divider";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Text, { ITextProps } from "./index";

const meta: Meta<ITextProps> = {
    title: "Atoms/Text",
    component: Text,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "text", ...propCategory.content }),
        variant: args({ control: "select", ...propCategory.appearance }),
        as: args({ control: "select", ...propCategory.appearance }),
        alignment: args({ control: "select", ...propCategory.appearance }),
        truncate: args({ control: "boolean", ...propCategory.appearance }),
        withTooltip: args({ control: "boolean", ...propCategory.functionality })
    },
    args: {
        variant: "headingLargeSemibold"
    }
};

export default meta;

type Story = StoryObj<ITextProps>;

export const Default: Story = {
    render: (props) => {
        return <Text as="span" {...props} />;
    },
    args: {
        as: "h1",
        children: "Text content"
    }
};

export const Variants: Meta = {
    render: () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <Divider text="Heading" contentPosition="center" />
                <Text as="p" variant="headingXLargeSemibold">
                    Text with headingXLargeSemibold variant
                </Text>
                <Text as="p" variant="headingLargeSemibold">
                    Text with headingLargeSemibold variant
                </Text>
                <Text as="p" variant="headingMediumSemibold">
                    Text with headingMediumSemibold variant
                </Text>
                <Text as="p" variant="headingSmallSemibold">
                    Text with headingSmallSemibold variant
                </Text>
                <Text as="p" variant="headingXSmallSemibold">
                    Text with headingXSmallSemibold variant
                </Text>
                <Divider text="Subheading" contentPosition="center" />
                <Text as="p" variant="subheadingLargeSemibold">
                    Text with subheadingLargeSemibold variant
                </Text>
                <Text as="p" variant="subheadingMediumSemibold">
                    Text with subheadingMediumSemibold variant
                </Text>
                <Divider text="Label" contentPosition="center" />
                <Text as="p" variant="labelLargeSemibold">
                    Text with labelLargeSemibold variant
                </Text>
                <Text as="p" variant="labelLargeMedium">
                    Text with labelLargeMedium variant
                </Text>
                <Text as="p" variant="labelMediumSemibold">
                    Text with labelMediumSemibold variant
                </Text>
                <Text as="p" variant="labelMediumMedium">
                    Text with labelMediumMedium variant
                </Text>
                <Text as="p" variant="labelSmallSemibold">
                    Text with labelSmallSemibold variant
                </Text>
                <Text as="p" variant="labelSmallMedium">
                    Text with labelSmallMedium variant
                </Text>
                <Divider text="Body" contentPosition="center" />
                <Text as="p" variant="bodyLargeSemibold">
                    Text with bodyLargeSemibold variant
                </Text>
                <Text as="p" variant="bodyLargeMedium">
                    Text with bodyLargeMedium variant
                </Text>
                <Text as="p" variant="bodyLargeRegular">
                    Text with bodyLargeRegular variant
                </Text>
                <Text as="p" variant="bodyMediumSemibold">
                    Text with bodyMediumSemibold variant
                </Text>{" "}
                <Text as="p" variant="bodyMediumMedium">
                    Text with bodyMediumMedium variant
                </Text>
                <Text as="p" variant="bodyMediumRegular">
                    Text with bodyMediumRegular variant
                </Text>
                <Divider text="Caption" contentPosition="center" />
                <Text as="p" variant="captionLargeSemibold">
                    Text with captionLargeSemibold variant
                </Text>
                <Text as="p" variant="captionLargeMedium">
                    Text with captionLargeMedium variant
                </Text>
                <Text as="p" variant="captionLargeRegular">
                    Text with captionLargeRegular variant
                </Text>{" "}
                <Text as="p" variant="captionMediumSemibold">
                    Text with captionMediumSemibold variant
                </Text>
                <Text as="p" variant="captionMediumMedium">
                    Text with captionMediumMedium variant
                </Text>
                <Text as="p" variant="captionMediumRegular">
                    Text with captionMediumRegular variant
                </Text>
            </div>
        );
    },
    parameters: {
        controls: { disable: true }
    }
};
export const Alignment: Meta = {
    render: () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Text as="p" variant="bodyMediumRegular" alignment="start">
                    START aligned text lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a
                    galley of type and scrambled it to make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting, remaining essentially unch
                </Text>
                <Text as="p" variant="bodyMediumRegular" alignment="center">
                    CENTER aligned text lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a
                    galley of type and scrambled it to make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting, remaining essentially unch
                </Text>
                <Text as="p" variant="bodyMediumRegular" alignment="end">
                    END aligned text lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a
                    galley of type and scrambled it to make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting, remaining essentially unch
                </Text>
            </div>
        );
    },
    parameters: {
        controls: { disable: true }
    }
};

export const TruncationWithTooltip: Meta = {
    render: () => {
        return (
            <div style={{ width: "200px" }}>
                <Text as="p" variant="bodyMediumRegular" alignment="start" truncate>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </Text>
            </div>
        );
    },
    parameters: {
        controls: { disable: true }
    }
};
