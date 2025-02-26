import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Button from "../Button";
import { IPopoverProps, Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "./index";

const meta: Meta<IPopoverProps> = {
    title: "Atoms/Popover",
    component: Popover,
    subcomponents: { PopoverBody, PopoverFooter },
    argTypes: {
        position: args({ control: "select", ...propCategory.appearance }),
        padding: args({ control: "number", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        alwaysShow: args({ control: "boolean", ...propCategory.states }),
        isOpen: args({ control: "false", ...propCategory.states, defaultValue: undefined }),
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

type Story = StoryObj<IPopoverProps>;

const PopoverStoryComponent: FC<IPopoverProps> = (...props) => {
    const [propsForContent, setPropsForContent] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const openHandler = () => {
        setIsOpen((prev) => !prev);
    };
    return (
        <div style={{ margin: "500px 500px", height: 7000 }}>
            <Popover {...props} setProps={setPropsForContent} isOpen={isOpen}>
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
            <Button onClick={openHandler} {...propsForContent}>
                Click for open
            </Button>
        </div>
    );
};

export const popoverStory: Story = {
    render: (props: IPopoverProps) => <PopoverStoryComponent {...props} />
};

const WithoutFooterComponent: FC<IPopoverProps> = (props) => {
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
export const WithoutFooter: Story = {
    render: (props: IPopoverProps) => <WithoutFooterComponent {...props} />
};

const WithoutHeaderComponent: FC<IPopoverProps> = (props) => {
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

export const WithoutHeader: Story = {
    render: (props: IPopoverProps) => <WithoutHeaderComponent {...props} />
};

const WithoutHeaderAndFooterComponent: FC<IPopoverProps> = (props) => {
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

export const WithoutHeaderAndFooter: Story = {
    render: (props: IPopoverProps) => <WithoutHeaderAndFooterComponent {...props} />
};
