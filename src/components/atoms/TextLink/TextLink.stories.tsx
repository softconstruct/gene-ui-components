import React, { FC } from "react";
import { Meta } from "@storybook/react";
import { Globe } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import TextLink, { ITextLinkProps } from "./index";

const meta: Meta<typeof TextLink> = {
    title: "Atoms/TextLink",
    component: TextLink,
    argTypes: {
        appearance: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        href: args({ control: "text", ...propCategory.content }),
        underline: args({ control: "boolean", ...propCategory.appearance }),
        Icon: args({ control: "false", ...propCategory.content }),
        onClick: args({ control: "false", ...propCategory.action }),
        rel: args({ control: "select", ...propCategory.others }),
        target: args({ control: "select", ...propCategory.functionality }),
        text: args({ control: "text", ...propCategory.content }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        iconBefore: args({ control: "boolean", ...propCategory.appearance }),
        className: args({ control: "boolean", ...propCategory.appearance })
    },
    args: {
        appearance: "primary",
        size: "medium",
        text: "LinkText",
        href: "#",
        disabled: false,
        target: "self",
        iconBefore: false,
        Icon: Globe,
        onClick: (e) => e.preventDefault()
    } as ITextLinkProps
};

export default meta;

const Template: FC<ITextLinkProps> = (props) => <TextLink {...props} />;

export const Default = Template.bind({});

Default.args = {} as ITextLinkProps;
