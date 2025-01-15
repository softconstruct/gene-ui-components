import React, { FC, FunctionComponent } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { ChevronLeft, CheckMark, Close } from "@geneui/icons";
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Tabs, { ITabsProps, Tab } from ".";

const meta: Meta<typeof Tabs> = {
    title: "Molecules/Tabs",
    component: Tabs,
    argTypes: {
        isLoading: args({ control: "boolean", ...propCategory.states }),

        className: args({ control: "false", ...propCategory.appearance }),
        iconBefore: args({ control: "boolean", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        direction: "horizontal",
        size: "large",
        type: "contained"
    } as ITabsProps,
    subcomponents: { Tab: Tab as FunctionComponent<unknown> }
};

export default meta;

const Template: FC<ITabsProps> = (props) => {
    return (
        <Tabs {...props}>
            <Tab> Tab1</Tab>
            <Tab Icon={ChevronLeft} title="data1" iconBefore={false}>
                Tab2
            </Tab>
            <Tab Icon={Close} title="data2" iconBefore={false}>
                Tab3
            </Tab>
            <Tab Icon={CheckMark} title="data3" iconBefore={false} isError>
                Tab4
            </Tab>
            <Tab title="data4" iconBefore={false}>
                Tab5
            </Tab>
            <Tab title="data5" iconBefore={false}>
                Tab6
            </Tab>
            <Tab title="data6" iconBefore={false}>
                Tab7
            </Tab>
        </Tabs>
    );
};

export const Default = Template.bind({});

Default.args = {} as ITabsProps;
