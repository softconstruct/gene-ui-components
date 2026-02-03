// import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// import Avatar from "@components/atoms/Avatar";
// import Button from "@components/atoms/Button";
// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// import QRCode from "../QRCode";
// Components
import Section, { ISectionProps } from "./index";

const meta: Meta<ISectionProps> = {
    title: "Molecules/Section",
    component: Section,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // size: args({ control: "select", ...propCategory.appearance }),
        // title: args({ control: "text", ...propCategory.content }),
        // subtitle: args({ control: "text", ...propCategory.content }),
        // headerContent: args({ control: "false", ...propCategory.content }),
        // bodyContent: args({ control: "false", ...propCategory.content }),
        // footerContent: args({ control: "false", ...propCategory.content }),
        // action: args({ control: "false", ...propCategory.content }),
        // hasHeader: args({ control: "boolean", ...propCategory.states }),
        // hasFooter: args({ control: "boolean", ...propCategory.states }),
        // withPadding: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        // size: "medium",
        // title: "Title",
        // subtitle: "Subtitle",
        // headerContent: <Avatar fullName="Test Name" onClick={() => { }} />,
        // bodyContent: <QRCode value="https://geneui-storybook.softconstruct.com/" />,
        // footerContent: (
        //     <Button size="medium" fullWidth>
        //         Submit
        //     </Button>
        // ),
        // action: { children: "Submit", appearance: "primary", onClick: () => { }, size: "medium", layout: "fill" },
        // hasHeader: true,
        // hasFooter: true,
        // withPadding: true
    }
};

export default meta;

type Story = StoryObj<ISectionProps>;

export const Default: Story = {};
