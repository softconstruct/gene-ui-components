import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { fn } from "@storybook/test";

import { Col, Grid, Row } from "@components/atoms/Grid";
import Section from "@components/molecules/Section";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import OTPField, { IOTPFieldProps } from "./index";

const meta: Meta<IOTPFieldProps> = {
    title: "Molecules/OTPField",
    component: OTPField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", options: ["large", "medium"], ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        status: args({ control: "select", options: ["rest", "error"], ...propCategory.states }),
        value: args({ control: "text", ...propCategory.content }),
        defaultValue: args({ control: "number", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        timerDuration: args({ control: "number", ...propCategory.functionality }),
        notification: args({ control: "text", ...propCategory.content }),
        onChange: args({ control: "false", ...propCategory.action }),
        onComplete: args({ control: "false", ...propCategory.action }),
        onTimerExpire: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action })
    },
    args: {
        // size: "large",
        // helperText: "Code is valid for",
        // timerDuration: 152,
        onChange: fn(),
        onComplete: fn(),
        onTimerExpire: fn(),
        onFocus: fn(),
        onBlur: fn()
    }
};

export default meta;

type Story = StoryObj<IOTPFieldProps>;

const OTPFieldVariations: FC<IOTPFieldProps> = (props) => {
    const variations: Array<{ id: string; title: string; render: React.ReactNode }> = [
        {
            id: "default",
            title: "Default",
            render: <OTPField helperText="Helper text" {...props} />
        },
        {
            id: "medium",
            title: "Medium size",
            render: <OTPField helperText="Helper text" size="medium" {...props} />
        },
        {
            id: "filled",
            title: "Filled",
            render: <OTPField defaultValue="111111" {...props} />
        },
        {
            id: "error",
            title: "Error with notification",
            render: (
                <OTPField
                    helperText="Code is valid for"
                    status="error"
                    timerDuration={120}
                    notification="The entered code is invalid."
                    {...props}
                />
            )
        },
        {
            id: "disabled",
            title: "Disabled",
            render: (
                <OTPField
                    disabled
                    helperText="Code is valid for"
                    defaultValue="222222"
                    timerDuration={600}
                    {...props}
                />
            )
        },
        {
            id: "short-timer",
            title: "Short timer",
            render: <OTPField helperText="Code is valid for" timerDuration={30} {...props} />
        }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <style>{`
                .row.flexible {
                    flex-wrap: wrap;
                    row-gap: var(--guit-ref-spacing-2xlarge);
                }
            `}</style>
            <div style={{ display: "flex" }}>
                <Grid>
                    <Row flexible>
                        {variations.map(({ id, title, render }) => (
                            <Col key={id} size={4}>
                                <Section title={title}>{render}</Section>
                            </Col>
                        ))}
                    </Row>
                </Grid>
            </div>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <OTPFieldVariations {...props} />
};
