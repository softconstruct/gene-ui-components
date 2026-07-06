import React, { FC, useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe, Tag } from "@geneui/icons";

// Components
import { Col, Grid, Row } from "@components/atoms/Grid";
import { ISegmentedControlButtonProps } from "@components/molecules/SegmentedControl";
import Widget, { IWidgetProps } from "@components/molecules/Widget";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const segmentedControlData: ISegmentedControlButtonProps[] = [
    {
        name: "option1",
        Icon: Tag,
        children: "Option 1"
    },
    {
        name: "option2",
        Icon: Tag,
        children: "Option 2"
    }
];

const segmentedControlLabels = ["Daily", "Weekly", "Monthly", "Yearly", "Hourly", "Quarterly"];

const getRandomSegmentedControlData = (): ISegmentedControlButtonProps[] => {
    return Array.from({ length: 2 }, (_, index) => {
        const label = segmentedControlLabels[Math.floor(Math.random() * segmentedControlLabels.length)];

        return {
            name: `option-${index + 1}`,
            Icon: Tag,
            children: label
        };
    });
};

const widgetDefaultArgs: IWidgetProps = {
    title: "Title",
    infoText: "Additional info for label",
    value: "$ 123",
    trend: "down",
    trendValue: "-33%",
    Icon: Globe,
    swappableElement: <div>Swappable Element</div>,
    segmentedControl: segmentedControlData,
    segmentedControlValue: "option1",
    onDetailsClick: () => {}
};

const meta: Meta<IWidgetProps> = {
    title: "Molecules/Widget",
    component: Widget,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.content }),
        trend: args({ control: "select", options: ["up", "down"], ...propCategory.content }),
        trendValue: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        swappableElement: args({ control: "false", ...propCategory.content }),
        onDetailsClick: args({ control: "false", ...propCategory.action }),
        segmentedControl: args({ control: "false", ...propCategory.content }),
        onSegmentedControlChange: args({ control: "false", ...propCategory.action }),
        segmentedControlValue: args({ control: "false", ...propCategory.content })
    },
    args: widgetDefaultArgs
};

export default meta;

type Story = StoryObj<IWidgetProps>;

const StatefulWidget: FC<IWidgetProps> = ({
    segmentedControl,
    segmentedControlValue,
    onSegmentedControlChange,
    ...props
}) => {
    const [selectedValue, setSelectedValue] = useState(segmentedControlValue ?? segmentedControl?.[0]?.name);

    useEffect(() => {
        if (segmentedControlValue !== undefined) {
            setSelectedValue(segmentedControlValue);
        }
    }, [segmentedControlValue]);

    if (!segmentedControl?.length) {
        return <Widget {...props} segmentedControl={segmentedControl} />;
    }

    const handleSegmentedControlChange = (name: string) => {
        setSelectedValue(name);
        onSegmentedControlChange?.(name);
    };

    return (
        <Widget
            {...props}
            segmentedControl={segmentedControl}
            segmentedControlValue={selectedValue}
            onSegmentedControlChange={handleSegmentedControlChange}
        />
    );
};

export const Default: Story = {
    render: (props) => <StatefulWidget {...props} />
};

const widgetStories: Array<Partial<IWidgetProps> & { id: string }> = [
    {
        id: "with-icon-and-swap",
        title: "Revenue",
        infoText: "Monthly revenue overview",
        Icon: Globe,
        swappableElement: <div>Chart placeholder</div>,
        segmentedControl: getRandomSegmentedControlData()
    },
    {
        id: "with-icon-only",
        title: "Active Users",
        infoText: "Users active in the last 30 days",
        Icon: Globe,
        segmentedControl: getRandomSegmentedControlData()
    },
    {
        id: "with-swap-only",
        title: "Conversion Rate",
        swappableElement: <div>Trend placeholder</div>,
        segmentedControl: getRandomSegmentedControlData()
    },
    {
        id: "title-only",
        title: "Widget Title",
        segmentedControl: getRandomSegmentedControlData()
    },
    {
        id: "without-header",
        title: undefined,
        infoText: undefined,
        onDetailsClick: undefined,
        segmentedControl: undefined,
        value: "$ 456",
        trend: "up",
        trendValue: "+8%",
        Icon: Globe,
        swappableElement: <div>Chart placeholder</div>
    },
    {
        id: "details-only-header",
        title: undefined,
        infoText: undefined,
        value: "$ 789",
        trend: "down",
        trendValue: "-5%",
        segmentedControl: getRandomSegmentedControlData()
    }
];

const WidgetCombinationItem: FC<IWidgetProps> = (props) => <StatefulWidget {...props} />;

const WidgetCombinationsComponent: FC<IWidgetProps> = ({
    segmentedControl: _segmentedControl,
    segmentedControlValue: _segmentedControlValue,
    onSegmentedControlChange: _onSegmentedControlChange,
    ...props
}) => {
    return (
        <Grid>
            <Row>
                {widgetStories.map(({ id, ...storyData }) => (
                    <Col key={id} size={6}>
                        <div style={{ padding: "8px 0" }}>
                            <WidgetCombinationItem {...props} {...storyData} />
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
