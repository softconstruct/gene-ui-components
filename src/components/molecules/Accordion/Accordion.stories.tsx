import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Download, Globe, RecycleBin, Tag } from "@geneui/icons";

import Button from "@components/atoms/Button";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Accordion from "./Accordion";
import { AccordionItem, IAccordionItemProps } from "./index";

const meta: Meta<IAccordionItemProps> = {
    title: "Molecules/Accordion",
    component: AccordionItem,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        withIconBefore: args({ control: "boolean", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        IconBefore: args({ control: "false", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content }),
        withActions: args({ control: "boolean", ...propCategory.content })
    },
    args: {
        title: "Accordion Item",
        withIconBefore: true,
        IconBefore: Tag,
        actions: (
            <ButtonGroup size="medium">
                <Button appearance="secondary" layout="text" Icon={Globe} />
                <Button appearance="secondary" layout="text" Icon={Download} />
                <Button appearance="secondary" layout="text" Icon={RecycleBin} />
            </ButtonGroup>
        ),
        children: <div>Accordion content goes here</div>,
        withActions: true
    }
};

export default meta;

type Story = StoryObj<IAccordionItemProps>;

export const Default: Story = {
    render: (props) => (
        <Accordion size="large">
            <AccordionItem {...props} />
        </Accordion>
    )
};
