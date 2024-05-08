import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { Angry, Annoyed, Smile, Laugh, Meh } from 'lucide-react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Rating, { IRatingProps } from './';

const icons = [Angry, Annoyed, Smile, Laugh, Meh];

const meta: Meta<typeof Rating> = {
    title: 'Atoms/Rating',
    component: Rating,
    argTypes: {
        size: args({ control: 'select', ...propCategory.appearance }),
        defaultValue: args({ control: 'number', ...propCategory.appearance }),
        value: args({ control: 'number', ...propCategory.appearance }),
        color: args({ control: 'color', default: 'red', ...propCategory.appearance }),
        backgroundColor: args({ control: 'color', default: 'white', ...propCategory.appearance }),
        count: args({ control: 'number', ...propCategory.appearance }),
        readonly: args({ control: 'boolean', ...propCategory.states }),
        character: args({ control: 'string', ...propCategory.appearance }),
        halfAllow: args({ control: 'boolean', default: true, ...propCategory.states })
    },
    args: { size: 'big' }
};
export default meta;

const Template: FC<IRatingProps> = ({ ...args }) => {
    return <Rating {...args} onChange={undefined} />;
};

const TemplateControlled: FC<IRatingProps> = ({ ...args }) => {
    const [rating, setRating] = useState(0);

    const onChangeHandler = (value: number) => {
        setTimeout(() => {
            setRating(value + 1);
        }, 1000);
    };

    return <Rating {...args} onChange={onChangeHandler} value={rating} />;
};

export const Default = Template.bind({});

export const Controlled = TemplateControlled.bind({});

export const WithCustomIcons = Template.bind({});

WithCustomIcons.args = {
    character: (i: number) => {
        const Icon = icons[i];
        return <Icon />;
    }
};

export const WithCharacter = Template.bind({});

WithCharacter.args = {
    character: 'A'
};
