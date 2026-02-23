import React, { FC, useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Info } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Button from "../Button";
import { IPopoverProps, Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "./index";

const meta: Meta<IPopoverProps> = {
    title: "Atoms/Popover",
    component: Popover,
    subcomponents: { PopoverBody, PopoverFooter, PopoverFooterActions },
    argTypes: {
        position: args({ control: "select", ...propCategory.appearance }),
        margin: args({ control: "number", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        fitReference: args({ control: "boolean", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states, defaultValue: undefined }),
        withArrow: args({ control: "boolean", ...propCategory.states }),
        hasCloseButton: args({ control: "boolean", ...propCategory.functionality }),
        disableReposition: args({ control: "boolean", ...propCategory.states }),
        children: args({ control: "false", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "component", ...propCategory.content }),
        setProps: args({ control: "false", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.action }),
        defaultOpen: args({ control: "boolean", ...propCategory.states }),
        trigger: args({ control: "boolean", ...propCategory.functionality })
    },
    args: {
        margin: 15,
        position: "bottom-left",
        size: "medium",
        title: "Popover",
        onClose: () => {},
        hasCloseButton: true
    }
};

export default meta;

type Story = StoryObj<IPopoverProps>;

const PopoverStoryComponent: FC<IPopoverProps> = (props) => {
    const popRef = useRef(null);
    const [propsForContent, setPropsForContent] = useState({});
    const { size, fitReference, title: titleProp } = props;
    const title = !fitReference && size !== "small" ? titleProp : "";

    return (
        <div style={{ margin: "500px 500px", height: 1000 }}>
            <Popover {...props} title={title} setProps={setPropsForContent} ref={popRef}>
                <PopoverBody>
                    <span>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written
                        in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
                        The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section
                        1.10.32.
                    </span>
                </PopoverBody>

                {!fitReference && size !== "small" && (
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
                )}
            </Popover>
            <Button onClick={() => {}} {...propsForContent}>
                Click for open
            </Button>
        </div>
    );
};

export const Default: Story = {
    render: (props: IPopoverProps) => <PopoverStoryComponent {...props} />
};

const WithoutFooterComponent: FC<IPopoverProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});
    return (
        <div style={{ margin: "500px 500px", height: 1000 }}>
            <Popover {...props} setProps={setPropsForContent} Icon={Info}>
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
        <div style={{ margin: "500px 500px", height: 1000 }}>
            <Popover {...props} setProps={setPropsForContent} title="">
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

export const WithoutHeader: Story = {
    render: (props: IPopoverProps) => <WithoutHeaderComponent {...props} />
};

const WithoutHeaderAndFooterComponent: FC<IPopoverProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});
    return (
        <div style={{ margin: "500px 500px", height: 1000 }}>
            <Popover {...props} setProps={setPropsForContent} title="">
                <PopoverBody>
                    <span>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written
                        in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
                        The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section
                        1.10.32.
                    </span>
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
