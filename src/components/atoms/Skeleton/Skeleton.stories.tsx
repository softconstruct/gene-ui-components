import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { Col, Grid, Row } from "../Grid";
// Components
import Skeleton, { ISkeletonProps } from "./index";

const meta: Meta<typeof Skeleton> = {
    title: "Atoms/Skeleton",
    component: Skeleton,
    argTypes: {
        rounded: args({ control: "select", ...propCategory.appearance }),
        width: args({ control: "number", ...propCategory.appearance }),
        height: args({ control: "number", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),

        flexible: args({ control: "boolean", ...propCategory.states }),
        inverse: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        rounded: "rounded2X",
        width: 125,
        height: 125
    }
};

export default meta;

type Story = StoryObj<ISkeletonProps>;

export const Default: Story = {
    render: (props) => {
        return (
            <div style={{ width: "100%" }}>
                <Skeleton {...props} />
            </div>
        );
    }
};

export const template: Story = {
    render: (props) => {
        return (
            <div style={{ width: "100%" }}>
                <Grid>
                    <Row>
                        <Col size={2}>
                            <Skeleton {...props} />
                        </Col>
                        <Col size={10}>
                            <div
                                style={{
                                    display: "flex",
                                    maxWidth: "100%",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%"
                                }}
                            >
                                <div style={{ width: "100%" }}>
                                    <Skeleton height={20} />
                                </div>
                                <div style={{ width: "100%" }}>
                                    <Skeleton height={20} />
                                </div>
                                <div style={{ width: "100%" }}>
                                    <Skeleton height={20} />
                                </div>
                                <div style={{ width: "100%" }}>
                                    <Skeleton height={20} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col size={12}>
                            <Skeleton height={80} />
                        </Col>
                    </Row>
                    <Row>
                        <Col size={12}>
                            <Skeleton height={200} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
};
