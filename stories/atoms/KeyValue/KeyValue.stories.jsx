import React from 'react';

import KeyValueComponent from 'src/lib/atoms/KeyValue/index';
import { args, category } from '../../assets/storybook.globals';

const keyValueConfig = {
    appearance: ['horizontal', 'vertical']
};

export default {
    title: 'Atoms/KeyValue',
    component: KeyValueComponent,
    argTypes: {
        label: args({ control: 'text', category: category.content }),
        value: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        appearance: args({
            content: 'select',
            defaultValue: keyValueConfig.appearance[0],
            options: keyValueConfig.appearance,
            category: category.appearance
        }),
        icon: args({ control: 'text', category: category.content })
    },
    args: {
        label: 'Some label',
        value: 'Some value',
        icon: 'bc-icon-info',
        appearance: keyValueConfig.appearance[0]
    }
};

const Template = ({ ...args }) => <KeyValueComponent {...args} />;

export const Default = Template.bind({});

export const Vertical = Template.bind({});
Vertical.args = {
    appearance: keyValueConfig.appearance[1]
};
