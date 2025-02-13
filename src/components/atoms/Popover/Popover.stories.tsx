import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Button from "../Button";
import { IPopoverProps, Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "./index";

const meta: Meta<IPopoverProps> = {
    title: "Atoms/Popover",
    component: Popover,
    argTypes: {
        position: args({ control: "select", ...propCategory.appearance }),
        padding: args({ control: "number", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        alwaysShow: args({ control: "boolean", ...propCategory.states }),
        isOpen: args({ control: "boolean", ...propCategory.states }),
        withArrow: args({ control: "boolean", ...propCategory.states }),
        disableReposition: args({ control: "boolean", ...propCategory.states }),
        children: args({ control: "false", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        footerContent: args({ control: "false", ...propCategory.content }),
        setProps: args({ control: "false", ...propCategory.functionality })
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
                <PopoverBody>
                    <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
                </PopoverBody>

                <PopoverFooter>
                    <div
                        className="swapComponent"
                        style={{ minHeight: "32px", width: "60px", background: "#F4E1EC" }}
                    />

                    <PopoverFooterActions>
                        <Button onClick={() => {}} size="medium" appearance="inverse">
                            Primary
                        </Button>
                        <Button onClick={() => {}} size="medium" appearance="primary">
                            Secondary
                        </Button>
                    </PopoverFooterActions>
                </PopoverFooter>
            </Popover>
            <Button onClick={() => {}} {...propsForContent}>
                Click for open
            </Button>
        </div>
    );
};
export const WithHeaderAndFooter = Template.bind({});

export const WithoutFooter: FC<IPopoverProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});
    return (
        <div style={{ margin: "500px 500px", height: 7000 }}>
            <Popover {...props} setProps={setPropsForContent}>
                <PopoverBody>
                    <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
                </PopoverBody>
            </Popover>
            <Button onClick={() => {}} {...propsForContent}>
                Click for open
            </Button>
        </div>
    );
};

export const WithoutHeader = WithHeaderAndFooter.bind({});

WithoutHeader.args = {
    title: ""
};

export const WithoutHeaderAndFooter = (props) => {
    const [propsForContent, setPropsForContent] = useState({});
    return (
        <div style={{ margin: "500px 500px", height: 7000 }}>
            <Popover {...props} setProps={setPropsForContent} title="">
                <PopoverBody>
                    <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
                </PopoverBody>
            </Popover>
            <Button onClick={() => {}} {...propsForContent}>
                Click for open
            </Button>
        </div>
    );
};
