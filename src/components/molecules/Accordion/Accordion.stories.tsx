import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Download, Globe, Magnifier, RecycleBin, Tag } from "@geneui/icons";

// Components
import Text from "@components/atoms/Text";
import { Accordion, AccordionItem, IAccordionItemProps, IAccordionProps } from "@components/molecules/Accordion";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";

const AccordionItemContent = (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "var(--guit-ref-spacing-2xsmall)",
            backgroundColor: "#F4E1EC",
            border: "var(--guit-ref-border-width-thin) solid var(--guit-sem-color-border-accent-red)"
        }}
    >
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "var(--guit-ref-color-magenta-500base)"
            }}
        >
            <Magnifier style={{ marginBottom: "var(--guit-ref-spacing-2xsmall)" }} color="#A60063" />
            <span
                style={{
                    marginTop: "var(--guit-ref-spacing-2xsmall)",
                    fontSize: "2rem"
                }}
            >
                Slot component
            </span>
            <span
                style={{
                    marginTop: "var(--guit-ref-spacing-3xsmall)",
                    fontSize: "1.4rem",
                    textAlign: "center"
                }}
            >
                Replace it with any component using the &quot;Component Instance&quot; swapper.
            </span>
        </div>
    </div>
);

const meta: Meta<IAccordionProps> = {
    title: "Molecules/Accordion",
    component: Accordion,
    subcomponents: {
        AccordionItem: AccordionItem as React.ComponentType<unknown>
    }
};

export default meta;

type Story = StoryObj<IAccordionProps>;
type StoryItem = StoryObj<IAccordionItemProps>;

export const Default: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content })
    },
    render: (props) => {
        return (
            <Accordion {...props}>
                <AccordionItem
                    title="Accordion Item 1"
                    Icon={Tag}
                    actions={[
                        {
                            Icon: Globe,
                            appearance: "secondary",
                            layout: "text"
                        },
                        {
                            Icon: Download,
                            appearance: "secondary",
                            layout: "text"
                        },
                        {
                            Icon: RecycleBin,
                            appearance: "secondary",
                            layout: "text"
                        }
                    ]}
                >
                    {AccordionItemContent}
                </AccordionItem>
                <AccordionItem
                    title="Accordion Item 2"
                    Icon={Tag}
                    actions={[
                        {
                            Icon: Globe,
                            appearance: "secondary",
                            layout: "text"
                        },
                        {
                            Icon: Download,
                            appearance: "secondary",
                            layout: "text"
                        },
                        {
                            Icon: RecycleBin,
                            appearance: "secondary",
                            layout: "text"
                        }
                    ]}
                >
                    <Text as="p">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a
                        galley of type and scrambled it to make a type specimen book. It has survived not only five
                        centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
                        was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                        passages, and more recently with desktop publishing software like Aldus PageMaker including
                        versions of Lorem Ipsum. It is a long established fact that a reader will be distracted by the
                        readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it
                        has a more-or-less normal distribution of letters, as opposed to using &apos;Content here,
                        content here&apos;, making it look like readable English. Many desktop publishing packages and
                        web page editors now use Lorem Ipsum as their default model text, and a search for &apos;lorem
                        ipsum&apos; will uncover many web sites still in their infancy. Various versions have evolved
                        over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                    </Text>
                </AccordionItem>
            </Accordion>
        );
    }
};

const AccordionItemStory: StoryItem = storyObjBuilder({
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.functionality }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        title: "Accordion Item",
        Icon: Tag,
        children: AccordionItemContent
    },
    render: (props) => {
        return (
            <Accordion>
                <AccordionItem
                    {...(props as IAccordionItemProps)}
                    actions={[
                        {
                            Icon: Globe,
                            appearance: "secondary",
                            layout: "text"
                        },
                        {
                            Icon: Download,
                            appearance: "secondary",
                            layout: "text"
                        },
                        {
                            Icon: RecycleBin,
                            appearance: "secondary",
                            layout: "text"
                        }
                    ]}
                />
            </Accordion>
        );
    }
});

export { AccordionItemStory as AccordionItem };
