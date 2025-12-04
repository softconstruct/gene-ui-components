import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Download, Globe, Magnifier, RecycleBin, Tag } from "@geneui/icons";

// Components
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
        children: args({ control: "false", ...propCategory.content }),
        onToggle: args({ control: "false", ...propCategory.action })
    },
    render: (props) => {
        return (
            <Accordion {...props}>
                <AccordionItem
                    title="Accordion Item 1"
                    Icon={Tag}
                    actions={[
                        {
                            Icon: Globe
                        },
                        {
                            Icon: Download
                        },
                        {
                            Icon: RecycleBin
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
                            Icon: Globe
                        },
                        {
                            Icon: Download
                        },
                        {
                            Icon: RecycleBin
                        }
                    ]}
                >
                    {AccordionItemContent}
                </AccordionItem>
            </Accordion>
        );
    }
};

export const AccordionItemStory: StoryItem = storyObjBuilder({
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.functionality }),
        children: args({ control: "false", ...propCategory.content }),
        id: args({ control: "text", ...propCategory.others })
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
                            Icon: Globe
                        },
                        {
                            Icon: Download
                        },
                        {
                            Icon: RecycleBin
                        }
                    ]}
                />
            </Accordion>
        );
    }
});
