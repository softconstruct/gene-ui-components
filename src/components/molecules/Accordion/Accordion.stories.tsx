import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Download, Globe, RecycleBin, Tag } from "@geneui/icons";

import Button from "@components/atoms/Button";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import Accordion, { IAccordionProps } from "./Accordion";
// Components
import { AccordionItem, IAccordionItemProps } from "./index";

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
                    actions={
                        <ButtonGroup size="medium">
                            <Button appearance="secondary" layout="text" Icon={Globe} />
                            <Button appearance="secondary" layout="text" Icon={Download} />
                        </ButtonGroup>
                    }
                >
                    <div>Content for accordion item 1</div>
                </AccordionItem>
                <AccordionItem
                    title="Accordion Item 2"
                    IconBefore={Tag}
                    actions={
                        <ButtonGroup size="medium">
                            <Button appearance="secondary" layout="text" Icon={RecycleBin} />
                        </ButtonGroup>
                    }
                >
                    <div>Content for accordion item 2</div>
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
        actions: args({ control: "false", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        title: "Accordion Item",
        IconBefore: Tag,
        actions: (
            <ButtonGroup size="medium">
                <Button appearance="secondary" layout="text" Icon={Globe} />
                <Button appearance="secondary" layout="text" Icon={Download} />
                <Button appearance="secondary" layout="text" Icon={RecycleBin} />
            </ButtonGroup>
        ),
        children: <div>Accordion content goes here</div>
    },
    render: (props) => {
        return (
            <Accordion size="large">
                <AccordionItem {...(props as IAccordionItemProps)} />
            </Accordion>
        );
    }
}) as StoryItem;

export default meta;
export { AccordionStory as Accordion, AccordionItemStory as AccordionItem };
