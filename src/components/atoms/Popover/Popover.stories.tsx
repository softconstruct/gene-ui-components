import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Popover, { IPopoverProps } from "./index";
import Button from "../Button";

const meta: Meta<IPopoverProps> = {
    title: "Atoms/Popover",
    component: Popover,
    argTypes: {
        position: args({ control: "select", ...propCategory.appearance }),
        padding: args({ control: "number", ...propCategory.appearance }),
        title: args({ control: "number", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        alwaysShow: args({ control: "boolean", ...propCategory.states }),
        isOpen: args({ control: "boolean", ...propCategory.states }),
        isClosable: args({ control: "boolean", ...propCategory.functionality }),
        setProps: args({ control: "false", ...propCategory.functionality })
    },
    args: {
        padding: 15,
        position: "bottom-left"
    }
};

export default meta;

const Template: FC<IPopoverProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});
    return (
        <div style={{ margin: "200px 200px" }}>
            <Popover {...props} setProps={setPropsForContent} />
            <Button text="Click" onClick={() => {}} {...propsForContent} />
        </div>
    );
};

export const Default = Template.bind({});

Default.args = {} as IPopoverProps;
