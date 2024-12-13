import React, { FC } from "react";
import { Meta } from "@storybook/react";

import { Globe, WarningFill } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import KeyValue, { IKeyValueProps } from "./index";

const meta: Meta<typeof KeyValue> = {
    title: "Molecules/KeyValue",
    component: KeyValue,
    argTypes: {
        className: args({ control: false, ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        KeyIcon: args({ control: false, ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        iconInfo: args({ control: "object", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.content })
    },
    args: {
        KeyIcon: Globe,
        title: "Title",
        iconInfo: { infoText: "Info text" },
        value: "Description",
        direction: "vertical",
        size: "medium"
    } as IKeyValueProps
};

export default meta;

const Template: FC<IKeyValueProps> = (props) => <KeyValue {...props} />;

export const Default = Template.bind({});
Default.args = {} as IKeyValueProps;

export const WithPillValue = Template.bind({});
WithPillValue.args = { value: { text: "Any text", isFill: true } } as IKeyValueProps;
WithPillValue.argTypes = { value: args({ control: "object", ...propCategory.content }) } as IKeyValueProps;

export const WithIconValue = Template.bind({});
WithIconValue.args = { value: WarningFill } as IKeyValueProps;
