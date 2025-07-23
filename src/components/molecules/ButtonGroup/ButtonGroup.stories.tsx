import React, { FC } from "react";
import { Meta } from "@storybook/react";

import Button from "@components/atoms/Button";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ButtonGroup, { IButtonGroupProps } from "./index";

const meta: Meta<typeof ButtonGroup> = {
    title: "Molecules/ButtonGroup",
    component: ButtonGroup,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill ButtonGroup component argTypes
    },
    args: {
        // fill ButtonGroup component args
    } as IButtonGroupProps
};

export default meta;

const Template: FC<IButtonGroupProps> = (props) => {
    return (
        <ButtonGroup {...props}>
            <Button onClick={() => {}} appearance="primary">
                primary
            </Button>
            <Button onClick={() => {}} appearance="secondary">
                secondary
            </Button>
            <Button onClick={() => {}} appearance="secondary" layout="outline">
                transparent
            </Button>
            <Button
                onClick={() => {
                    console.log("1");
                }}
                appearance="secondary"
                layout="outline"
            >
                zzzzzz1
            </Button>
            <Button
                onClick={() => {
                    console.log("2");
                }}
                appearance="secondary"
                layout="outline"
            >
                zzzzzz2
            </Button>
            <Button
                onClick={() => {
                    console.log("3");
                }}
                appearance="secondary"
                layout="outline"
            >
                zzzzzz3
            </Button>
            <Button
                onClick={() => {
                    console.log("4");
                }}
                appearance="secondary"
                layout="outline"
            >
                zzzzzz4
            </Button>{" "}
            <Button
                onClick={() => {
                    console.log("4");
                }}
                appearance="secondary"
                layout="outline"
            >
                zzzzzz4
            </Button>{" "}
            <Button
                onClick={() => {
                    console.log("4");
                }}
                appearance="secondary"
                layout="outline"
            >
                zzzzzz4
            </Button>{" "}
            <Button
                onClick={() => {
                    console.log("4");
                }}
                appearance="secondary"
                layout="outline"
            >
                zzzzzz4
            </Button>
        </ButtonGroup>
    );
};
export const Default = Template.bind({});

Default.args = {} as IButtonGroupProps;
