import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { ArrowRight, ChevronDoubleRight, Download, RecycleBin } from "@geneui/icons";

// Components
import Avatar from "@components/atoms/Avatar";
import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";
import Text from "@components/atoms/Text";
import Image from "@components/molecules/Image";
import Section, { ISectionProps } from "@components/molecules/Section";
import { SplitButton } from "@components/molecules/SplitButton";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

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
        inset: args({ control: "boolean", ...propCategory.appearance }),
        id: args({ control: "text", ...propCategory.others })
    },
    args: {}
};

export default meta;

type Story = StoryObj<ISectionProps>;

const defaultContents = {
    body: (
        <>
            <Text as="p" variant="bodyLargeMedium">
                This is the body content of the section. It can contain any React node including text, images, forms,
                and other components.
            </Text>
            <Pill text="Success" filled />
            <Pill text="Warning" />
            <Pill text="Info" />
            <Button size="medium" appearance="secondary">
                Action Button
            </Button>
            <Image src="https://picsum.photos/id/237/500/500" aspectRatio="16x9" />
        </>
    ),
    footer: (
        <SplitButton
            items={[
                { title: "Replay", Icon: ArrowRight, id: "replay" },
                { title: "Forward", Icon: ChevronDoubleRight, id: "forward" },
                { title: "Download", Icon: Download, id: "download" },
                { title: "Delete", Icon: RecycleBin, id: "delete" }
            ]}
            onSelect={() => {}}
        />
    ),
    header: <Avatar fullName="John Doe" onClick={() => {}} />,
    action: {
        children: "Submit",
        appearance: "primary" as const,
        onClick: () => {},
        size: "medium" as const,
        layout: "fill" as const
    }
};

const sectionStories: Array<Partial<ISectionProps> & { id: string }> = [
    {
        id: "body-only",
        bodyContent: defaultContents.body,
        inset: false
    },
    {
        id: "with-title",
        title: "Title",
        bodyContent: defaultContents.body
    },
    {
        id: "with-title-header",
        title: "Title",
        headerContent: defaultContents.header,
        bodyContent: defaultContents.body
    },
    {
        id: "with-footer",
        bodyContent: defaultContents.body,
        footerContent: defaultContents.footer
    },
    {
        id: "with-footer-action",
        bodyContent: defaultContents.body,
        footerContent: defaultContents.footer,
        action: defaultContents.action
    },
    {
        id: "full-section",
        title: "Title",
        subtitle: "Subtitle",
        headerContent: defaultContents.header,
        bodyContent: defaultContents.body,
        footerContent: defaultContents.footer
    }
];

export const Default: Story = {
    args: {
        title: "Title",
        subtitle: "Subtitle",
        inset: true,
        headerContent: defaultContents.header,
        bodyContent: (
            <Text as="p" variant="bodyLargeMedium">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et
                quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
                sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu Excepteur Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est id est laborum. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, dolorem
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
                sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
                dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore
                et dolore magnam aliquam quaerat voluptatem.
            </Text>
        ),
        footerContent: defaultContents.footer,
        action: defaultContents.action
    }
};

const SectionCombinationsComponent: FC<ISectionProps> = (props) => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", maxWidth: "100%" }}>
            {sectionStories.map(({ id, ...storyData }) => (
                <Section key={id} {...storyData} {...props} />
            ))}
        </div>
    );
};

export const SectionCombinations: Story = {
    render: (props) => <SectionCombinationsComponent {...props} />
};
