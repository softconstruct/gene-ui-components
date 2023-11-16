import React from 'react';

import CounterComponent from 'src/lib/molecules/Counter';

import { args, category } from '../../assets/storybook.globals';

const CounterConfig = {
    size: ['small', 'medium', 'big'],
    cornerRadius: ['round', 'smooth']
};
export default {
    title: 'Molecules/Counter',
    component: CounterComponent,
    argTypes: {
        label: args({ control: 'text', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        width: args({ control: 'text', category: category.appearance }),
        readOnly: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        isLoading: args({ control: 'boolean', category: category.states }),
        step: args({ control: 'number', category: category.functionality }),
        defaultValue: args({ control: 'number', category: category.content }),
        plusTooltipText: args({ control: 'text', category: category.content }),
        inputReadOnly: args({ control: 'boolean', category: category.states }),
        minusTooltipText: args({ control: 'text', category: category.content }),
        minValue: args({ control: 'number', category: category.functionality }),
        maxValue: args({ control: 'number', category: category.functionality }),
        size: args({ control: 'select', defaultValue: CounterConfig.size[1], category: category.appearance }),
        cornerRadius: args({
            control: 'select',
            defaultValue: CounterConfig.cornerRadius[0],
            category: category.appearance
        }),
        value: args({ control: 'number', category: category.content })
    },
    args: {
        step: 1,
        minValue: 0,
        maxValue: 100,
        label: 'Label',
        width: '100px',
        readOnly: false,
        defaultValue: 0,
        disabled: false,
        isLoading: false,
        inputReadOnly: false,
        size: CounterConfig.size[1],
        plusTooltipText: 'Plus Tooltip text',
        minusTooltipText: 'Minus Tooltip text',
        cornerRadius: CounterConfig.cornerRadius[0]
    }
};
const Template = ({ ...args }) => <CounterComponent {...args} />;

export let Counter = Template.bind({});
