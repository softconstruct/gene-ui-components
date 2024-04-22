import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import KeyValueComponent from '.';

// Types
import { IKeyValueProps } from '.';

const appearance = ['horizontal', 'vertical'] as const;

const meta: Meta<typeof KeyValueComponent> = {
    title: 'Atoms/KeyValue',
    component: KeyValueComponent,
    argTypes: {
        label: args({ control: 'text', ...propCategory.content }),
        value: args({ control: 'text', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        appearance: args({
            content: 'select',
            defaultValue: appearance[0],
            options: appearance,
            ...propCategory.appearance
        }),
        icon: args({ control: 'text', ...propCategory.content })
    },
    args: {
        label: 'Some label',
        value: 'Some value',
        icon: 'bc-icon-info',
        appearance: appearance[0]
    }
};

export default meta;

const Template: FC<IKeyValueProps> = ({ ...args }) => <KeyValueComponent {...args} />;

export const Default = Template.bind({});

export const Vertical = Template.bind({});
Vertical.args = {
    appearance: appearance[1]
};
