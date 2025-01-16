import React, { FC, FunctionComponent } from "react";
import { Meta } from "@storybook/react";

// Helpers
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
            {new Array(25).fill(null).map((_, i) => (
                <Tab title={i + 1} iconBefore={false}>
                    tab {i + 1}
                </Tab>
            ))}
        </Tabs>
    );
};

export const Default = Template.bind({});
Default.args = {} as ITabsProps;

export const IconOnly: FC<ITabsProps> = (props) => {
    return (
        <Tabs {...props}>
            {new Array(25).fill(null).map((_, i) => (
                <Tab iconBefore={false}>tab {i + 1} </Tab>
            ))}
        </Tabs>
    );
};

export const TextOnly: FC<ITabsProps> = (props) => {
    return (
        <Tabs {...props}>
            {new Array(25).fill(null).map((_, i) => (
                <Tab iconBefore={false} title={`tab${i + 1}`} Icon={null}>
                    tab {i + 1}
                </Tab>
            ))}
        </Tabs>
    );
};
