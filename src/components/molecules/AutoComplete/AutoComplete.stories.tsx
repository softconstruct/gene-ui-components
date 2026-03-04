import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import TextField from "@components/molecules/TextField";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import AutoComplete, { IAutoCompleteProps } from "./index";

const meta: Meta<IAutoCompleteProps> = {
    title: "Molecules/AutoComplete",
    component: AutoComplete,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        setPropsForPopover: args({ control: "false", ...propCategory.functionality }),
        children: args({ control: "false", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyText: args({ control: "text", ...propCategory.content }),
        showMore: args({ control: "boolean", ...propCategory.appearance }),
        showMoreLabel: args({ control: "text", ...propCategory.content }),
        size: args({ control: "select", ...propCategory.appearance }),
        position: args({
            control: "select",
            ...propCategory.appearance,
            options: [
                "bottom-center",
                "bottom-left",
                "bottom-right",
                "left-bottom",
                "left-center",
                "left-top",
                "right-bottom",
                "right-center",
                "right-top",
                "top-center",
                "top-left",
                "top-right",
                "auto"
            ]
        }),
        open: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        onOpenChange: () => {
            console.log("onOpenChange");
        },
        emptyText: "No results",
        loadingText: "Loading...",
        loading: false,
        showMore: false,
        showMoreLabel: "Show more",
        size: "small"
    }
};

export default meta;

type Story = StoryObj<IAutoCompleteProps>;

const StoryComponent: FC<IAutoCompleteProps> = (props) => {
    const [propsForPopover, setPropsForPopover] = useState({});

    return (
        <div style={{ padding: "2rem", minHeight: "400px" }}>
            <TextField
                {...propsForPopover}
                placeholder="Search..."
                onFocus={() => setPropsForPopover({ open: true })}
            />
            <AutoComplete {...props} setPropsForPopover={setPropsForPopover}>
                {/* Placeholder - AutoCompleteItem will be added later */}
            </AutoComplete>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryComponent {...props} />
};
