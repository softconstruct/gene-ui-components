import React, { ComponentType, FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { AppGrid, ArchiveFilled, Calculator, CheckMarkCircleFilled, Flask, Globe, Power } from "@geneui/icons";

// Components
import { Col, Grid, Row } from "@components/atoms/Grid";
import Pill from "@components/atoms/Pill";
import Checkbox from "@components/molecules/Checkbox";
import InteractiveCard, { IInteractiveCardProps } from "@components/molecules/InteractiveCard";
import Switch from "@components/molecules/Switch";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IInteractiveCardProps> = {
    title: "Molecules/InteractiveCard",
    component: InteractiveCard,
    subcomponents: {
        Pill: Pill as ComponentType<unknown>,
        Checkbox: Checkbox as ComponentType<unknown>,
        Switch: Switch as ComponentType<unknown>
    },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        onClick: args({ control: "false", ...propCategory.action }),
        actionProps: args({ control: "false", ...propCategory.functionality }),
        pill: args({ control: "false", ...propCategory.content }),
        onFocus: args({ control: "false", ...propCategory.action })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IInteractiveCardProps>;

export const Default: Story = {
    args: {
        size: "medium",
        label: "Label",
        infoText: "info text",
        description: "description",
        Icon: Globe,
        disabled: false,
        onClick: (e) => e.preventDefault()
    }
};

const InteractiveCardsCombinationComponent: FC<IInteractiveCardProps> = (props) => {
    const { disabled } = props;
    return (
        <Grid>
            <Row flexible={false}>
                <Col size={6}>
                    <InteractiveCard
                        label="Card 1"
                        disabled={disabled}
                        description="With Checkbox"
                        Icon={AppGrid}
                        actionProps={{
                            type: "checkbox"
                        }}
                        pill={{
                            text: "Pill",
                            filled: true,
                            appearance: "magenta",
                            Icon: CheckMarkCircleFilled,
                            size: "small"
                        }}
                        {...props}
                    />
                </Col>
                <Col size={6}>
                    <InteractiveCard
                        disabled={disabled}
                        label="Card 2"
                        description="With Switch"
                        Icon={ArchiveFilled}
                        actionProps={{
                            type: "switch"
                        }}
                        {...props}
                    />
                </Col>
            </Row>
            <Row>
                <Col size={4}>
                    <InteractiveCard
                        label="Card 3"
                        description="Full Interactive"
                        Icon={Calculator}
                        disabled={disabled}
                        {...props}
                    />
                </Col>
                <Col size={4}>
                    <InteractiveCard
                        label="Card 4"
                        description="Full Interactive"
                        Icon={CheckMarkCircleFilled}
                        disabled={disabled}
                        {...props}
                    />
                </Col>
                <Col size={4}>
                    <InteractiveCard
                        label="Card 5"
                        description="Full Interactive"
                        Icon={Flask}
                        disabled={disabled}
                        {...props}
                    />
                </Col>
            </Row>
            <Row>
                <Col size={12}>
                    <InteractiveCard
                        disabled={disabled}
                        label="Ineractive"
                        description="With Size Large and long description. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source."
                        infoText="info text"
                        Icon={Power}
                        size="large"
                        {...props}
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export const InteractiveCardsCombination: Story = {
    render: (props) => <InteractiveCardsCombinationComponent {...props} />
};
