import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Download, Globe, RecycleBin, Tag } from "@geneui/icons";

// Components
import Avatar from "@components/atoms/Avatar";
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Text from "@components/atoms/Text";
import { Accordion, AccordionItem, IAccordionItemProps, IAccordionProps } from "@components/molecules/Accordion";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IAccordionProps> = {
    title: "Molecules/Accordion",
    component: Accordion,
    subcomponents: {
        AccordionItem: AccordionItem as ComponentType<unknown>
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
                    <Text as="p">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written
                        in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
                        The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section
                        1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
                        interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also
                        reproduced in their exact original form, accompanied by English versions from the 1914
                        translation by H. Rackham.
                    </Text>
                </AccordionItem>
                <AccordionItem
                    title="Accordion Item 2"
                    Icon={Tag}
                    defaultExpanded
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Text as="h3" variant="labelMediumMedium" alignment="center">
                            Default Expanded
                        </Text>
                        <Divider
                            text="GeneUI divider"
                            Icon={Globe}
                            content={<Avatar fullName="Test Name" onClick={() => {}} />}
                            contentPosition="before"
                        />
                        <Button size="medium" fullWidth>
                            test button
                        </Button>
                    </div>
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
        children: args({ control: "false", ...propCategory.content }),
        id: args({ control: "text", ...propCategory.others }),
        defaultExpanded: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        title: "Accordion Item",
        Icon: Tag,
        children: "Accordion Content"
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

export { AccordionItemStory as AccordionItem };
