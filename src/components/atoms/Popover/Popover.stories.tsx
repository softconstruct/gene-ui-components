import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Popover, { IPopoverProps } from "./index";
import Button from "../Button";

const meta: Meta<IPopoverProps> = {
    title: "Atoms/Popover",
    component: Popover,
    argTypes: {
        position: args({ control: "select", ...propCategory.appearance }),
        padding: args({ control: "number", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        alwaysShow: args({ control: "boolean", ...propCategory.states }),
        isOpen: args({ control: "boolean", ...propCategory.states }),
        children: args({ control: "false", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        footerContent: args({ control: "false", ...propCategory.content }),

        setProps: args({ control: "false", ...propCategory.functionality }),
        primaryButton: { control: "false", ...propCategory.functionality },
        secondaryButton: { control: "false", ...propCategory.functionality }
    },
    args: {
        padding: 15,
        position: "bottom-left",
        size: "medium",
        title: "Popover"
    }
};

export default meta;

const Template: FC<IPopoverProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});
    return (
        <div style={{ margin: "500px 500px", height: 7000 }}>
            <Popover {...props} setProps={setPropsForContent}>
                <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
            </Popover>
            <Button onClick={() => {}} {...propsForContent}>
                Click for open
            </Button>
        </div>
    );
};

export const WithoutFooter = Template.bind({});

export const WithHeader = Template.bind({});

WithHeader.args = {
    primaryButton: {
        onClick: () => {},
        title: "Primary"
    },
    secondaryButton: {
        onClick: () => {},
        title: "Secondary"
    }
} as IPopoverProps;

export const WithHeaderAndFooter = WithHeader.bind({});

WithHeaderAndFooter.args = {
    ...WithHeader.args,
    footerContent: (
        <div className="swapComponent" style={{ height: "2.8rem", width: "6.4rem", background: "#F4E1EC" }} />
    )
};

export const WithoutHeaderAndFooter = Template.bind({});

WithoutHeaderAndFooter.args = {
    title: ""
};
