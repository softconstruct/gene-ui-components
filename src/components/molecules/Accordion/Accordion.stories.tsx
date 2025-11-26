import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Download, Globe, Magnifier, RecycleBin, Tag } from "@geneui/icons";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import Accordion, { IAccordionProps } from "./Accordion";
// Components
import { AccordionItem, IAccordionItemProps } from "./index";

const AccordionContent = (
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
        AccordionItem
    }
};

type Story = StoryObj<IAccordionProps>;
type StoryItem = StoryObj<IAccordionItemProps>;

const AccordionStory: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        size: "large"
    },
    render: (props) => {
        return (
            <Accordion {...props}>
                <AccordionItem
                    title="Accordion Item 1"
                    IconBefore={Tag}
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
                    {AccordionContent}
                </AccordionItem>
                <AccordionItem
                    title="Accordion Item 2"
                    IconBefore={Tag}
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
                    {AccordionContent}
                </AccordionItem>
            </Accordion>
        );
    }
};

const AccordionItemStory: StoryItem = storyObjBuilder({
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        title: args({ control: "text", ...propCategory.content }),
        IconBefore: args({ control: "false", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.functionality }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        title: "Accordion Item",
        IconBefore: Tag,
        children: AccordionContent
    },
    render: (props) => {
        return (
            <Accordion>
                <AccordionItem
                    {...props}
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

export default meta;
export { AccordionStory as Accordion, AccordionItemStory as AccordionItem };
