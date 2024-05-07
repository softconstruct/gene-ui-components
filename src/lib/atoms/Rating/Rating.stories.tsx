import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { Angry, Annoyed, Smile, Laugh, Meh } from 'lucide-react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Rating, { IRatingProps } from './';

const meta: Meta<typeof Rating> = {
    title: 'Atoms/Rating',
    component: Rating,
    argTypes: {
        size: args({ control: 'select', ...propCategory.appearance }),
        defaultValue: args({ control: 'number', ...propCategory.appearance }),
        color: args({ control: 'color', default: 'red', ...propCategory.appearance }),
        backgroundColor: args({ control: 'color', default: 'white', ...propCategory.appearance }),
        count: args({ control: 'number', ...propCategory.appearance }),
        readonly: args({ control: 'boolean', ...propCategory.states }),
        character: args({ control: 'string', ...propCategory.appearance }),
        halfAllow: args({ control: 'boolean', default: true, ...propCategory.states }),
        onChange: args({ ...propCategory.others })
    },
    args: { size: 'big' }
};
export default meta;

export const Template: FC<IRatingProps> = ({ ...args }) => {
    return <Rating {...args} onChange={undefined} />;
};

export const Controlled = Template.bind({});

export const TemplateWithCustomIcons: FC<IRatingProps> = ({ ...args }) => {
    const arr = [Angry, Annoyed, Smile, Laugh, Meh];
    return (
        <Rating
            {...args}
            onChange={undefined}
            character={(i) => {
                const Icon = arr[i];
                return <Icon />;
            }}
        />
    );
};
export const TemplateWithPrimitive: FC<IRatingProps> = ({ ...args }) => {
    const arr = [Angry, Annoyed, Smile, Laugh, Meh];
    return <Rating {...args} onChange={undefined} character={'A'} />;
};
