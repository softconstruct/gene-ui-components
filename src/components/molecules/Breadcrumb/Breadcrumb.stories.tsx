import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Receipt } from "@geneui/icons";

import { Col, Grid, Row } from "@components/atoms/Grid";
import Section from "@components/molecules/Section";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Breadcrumb, { IBreadcrumbProps } from "./index";

const meta: Meta<IBreadcrumbProps> = {
    title: "Molecules/Breadcrumb",
    component: Breadcrumb,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        breadCrumbsData: args({ control: "false", ...propCategory.content }),
        iconOnly: args({ control: "boolean", ...propCategory.appearance }),
        render: args({ control: "false", ...propCategory.content }),
        onClick: args({ control: "false", ...propCategory.action })
    },
    args: {
        // fill Breadcrumb component args
    }
};

export default meta;

type Story = StoryObj<IBreadcrumbProps>;

const BreadcrumbVariations: FC<IBreadcrumbProps> = (props) => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexWrap: "nowrap" }}>
                <Grid>
                    <Row>
                        <Col size={8}>
                            <Section title="Col 8 with 5 item">
                                <Breadcrumb {...props} />
                            </Section>
                        </Col>
                        <Col size={4}>
                            <Section title="Col 4 with 5 item">
                                <Breadcrumb {...props} />
                            </Section>
                        </Col>
                    </Row>
                    <Row>
                        <Col size={12}>
                            <Section title="Col 12 with 9 item">
                                <Breadcrumb
                                    {...props}
                                    breadCrumbsData={[
                                        { title: "Nav Item 1", path: "javascript:void(0)" },
                                        {
                                            title: "Nav Item 2",
                                            path: "javascript:void(0)",
                                            Icon: Receipt
                                        },
                                        { title: "Nav Item 3", path: "javascript:void(0)" },
                                        { title: "Nav Item 4", path: "javascript:void(0)" },
                                        { title: "Nav Item 5", path: "javascript:void(0)" },
                                        { title: "Nav Item 6", path: "javascript:void(0)" },
                                        { title: "Nav Item 7", path: "javascript:void(0)" },
                                        { title: "Nav Item 8", path: "javascript:void(0)" },
                                        { title: "Nav Item 9", path: "javascript:void(0)" }
                                    ]}
                                />
                            </Section>
                        </Col>
                    </Row>
                    <Row>
                        <Col size={12}>
                            <Section title="Col 12 with 2 item">
                                <Breadcrumb
                                    {...props}
                                    breadCrumbsData={[
                                        { title: "Nav Item 1", path: "javascript:void(0)" },
                                        {
                                            title: "Nav Item 2",
                                            path: "javascript:void(0)",
                                            Icon: Receipt
                                        }
                                    ]}
                                />
                            </Section>
                        </Col>
                    </Row>
                    <Row>
                        <Col size={12}>
                            <Section title="Col 12 with 9 item and icon only">
                                <Breadcrumb
                                    iconOnly
                                    {...props}
                                    breadCrumbsData={[
                                        { title: "Nav Item 1", path: "javascript:void(0)" },
                                        {
                                            title: "Nav Item 2",
                                            path: "javascript:void(0)",
                                            Icon: Receipt
                                        },
                                        { title: "Nav Item 3", path: "javascript:void(0)" },
                                        { title: "Nav Item 4", path: "javascript:void(0)" },
                                        { title: "Nav Item 5", path: "javascript:void(0)" },
                                        { title: "Nav Item 6", path: "javascript:void(0)" },
                                        { title: "Nav Item 7", path: "javascript:void(0)" },
                                        { title: "Nav Item 8", path: "javascript:void(0)" },
                                        { title: "Nav Item 9", path: "javascript:void(0)" }
                                    ]}
                                />
                            </Section>
                        </Col>
                    </Row>
                </Grid>
            </div>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <BreadcrumbVariations {...props} />,
    args: {
        breadCrumbsData: [
            { title: "Nav Item 1", path: "javascript:void(0)" },
            {
                title: "Nav Item 2",
                path: "javascript:void(0)",
                Icon: Receipt
            },
            { title: "Nav Item 3", path: "javascript:void(0)" },
            { title: "Nav Item 4", path: "javascript:void(0)" },
            { title: "Nav Item 5", path: "javascript:void(0)" }
        ]
    }
};

export const WithRender: Story = {
    args: {
        breadCrumbsData: [
            { title: "Home", path: "javascript:void(0)" },
            {
                title: "Products",
                path: "javascript:void(0)",
                Icon: Receipt
            },
            { title: "Current Page 1", path: "javascript:void(0)" },
            { title: "Current Page 2", path: "javascript:void(0)" },
            { title: "Current Page 3", path: "javascript:void(0)", Icon: Receipt },
            { title: "Current Page 4", path: "javascript:void(0)" },
            { title: "Current Page 5", path: "javascript:void(0)" }
        ],
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        render: (linkData) => <a aria-label={linkData.title} href={linkData.path} />
    },
    render: (props) => <Breadcrumb {...props} />
};
