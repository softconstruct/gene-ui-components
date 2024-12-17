import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Rating, { IRateProps } from ".";

const meta: Meta<typeof Rating> = {
    title: "Atoms/Rating",
    component: Rating,
    argTypes: {
        size: args({ control: "select", defaultValue: "small", ...propCategory.appearance }),
        defaultValue: args({ control: "number", defaultValue: 0, ...propCategory.content }),
        value: args({ control: "false", ...propCategory.content }),
        count: args({ control: "number", defaultValue: 5, ...propCategory.appearance }),
        readonly: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
        halfAllow: args({ control: "boolean", defaultValue: false, ...propCategory.states })
    },
    args: {
        count: 5,
        defaultValue: 0
    } as IRateProps
};
export default meta;

const Template: FC<IRateProps> = (props) => {
    return <Rating {...props} />;
};

const TemplateControlled: FC<IRateProps> = (props) => {
    const [rating, setRating] = useState(0);
    const onChangeHandler = (value: number) => {
        setRating((prev) => (prev === value ? 2 : value));
    };
    return (
        <div>
            <Rating {...props} onChange={onChangeHandler} value={rating} />
        </div>
    );
};

export const Default = Template.bind({});

export const Controlled = TemplateControlled.bind({});

Controlled.args = {
    halfAllow: true
};

Controlled.argTypes = {
    value: args({ control: "number", ...propCategory.appearance })
};

export const Stars = Template.bind({});

Stars.args = {
    count: 10,
    halfAllow: true
};

export const WithCustomIcons = Template.bind({});

WithCustomIcons.args = {};

export const WithCharacter = Template.bind({});

WithCharacter.args = {};

WithCharacter.argTypes = {
    character: args({ control: "text", ...propCategory.appearance })
};
