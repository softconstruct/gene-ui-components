import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Components
import { Col, Grid, Row } from "@components/atoms/Grid";
import Widget, { IWidgetProps } from "@components/molecules/Widget";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IWidgetProps> = {
    title: "Molecules/Widget",
    component: Widget,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        swappableElement: args({ control: "false", ...propCategory.content })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IWidgetProps>;

export const Default: Story = {
    args: {
        title: "Title",
        infoText: "Additional info for label",
        Icon: Globe,
        swappableElement: <div>Swappable Element</div>
    }
};

const widgetStories: Array<Partial<IWidgetProps> & { id: string }> = [
    {
        id: "with-icon-and-swap",
        title: "Revenue",
        infoText: "Monthly revenue overview",
        Icon: Globe,
        swappableElement: <div>Chart placeholder</div>
    },
    {
        id: "with-icon-only",
        title: "Active Users",
        infoText: "Users active in the last 30 days",
        Icon: Globe
    },
    {
        id: "with-swap-only",
        title: "Conversion Rate",
        swappableElement: <div>Trend placeholder</div>
    },
    {
        id: "title-only",
        title: "Widget Title"
    }
];

const WidgetCombinationsComponent: FC<IWidgetProps> = (props) => {
    return (
        <Grid>
            <Row>
                {widgetStories.map(({ id, ...storyData }) => (
                    <Col key={id} size={6}>
                        <div style={{ padding: "8px 0" }}>
                            <Widget {...storyData} {...props} />
                        </div>
                    </Col>
                ))}
            </Row>
        </Grid>
    );
};

export const WidgetCombinations: Story = {
    render: (props) => <WidgetCombinationsComponent {...props} />
};
