import React, { FC } from "react";
import { Meta } from "@storybook/react";

import { Globe, InfoOutline } from "@geneui/icons";

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
        IconBefore: args({ control: false, ...propCategory.content }),
        keyText: args({ control: "text", ...propCategory.content }),
        IconAfter: args({ control: false, ...propCategory.content })
        // value: args({ control: "text", ...propCategory.content })
    },
    args: {
        IconBefore: Globe,
        keyText: "Key",
        IconAfter: InfoOutline,
        // value: "Value",
        // value: WarningFill,
        value: { text: "Pill", isFill: true },
        direction: "vertical",
        size: "medium"
    } as IKeyValueProps
};

export default meta;

const Template: FC<IKeyValueProps> = (props) => <KeyValue {...props} />;

export const Default = Template.bind({});

Default.args = {} as IKeyValueProps;
