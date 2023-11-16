import React from 'react';
import RadioGroupComponent from 'src/lib/molecules/RadioGroup';
import { optionsWithDisabled } from './data';
import { args, category } from '../../assets/storybook.globals';

const type = ['default', 'tab'];

export default {
    title: 'Molecules/RadioGroup',
    component: RadioGroupComponent,
    argTypes: {
        name: args({ control: 'text', category: category.content }),
        value: args({ control: 'object', category: category.content }),
        options: args({ control: 'object', category: category.content }),
        required: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        descriptionKey: args({ control: 'text', category: category.content }),
        defaultValue: args({ control: 'number', category: category.content }),
        type: args({ control: 'select', options: type, category: category.appearance }),
        onChange: args({ control: 'object', action: 'onChange', category: category.action })
    },
    args: {
        type: type[0],
        defaultValue: 1,
        disabled: false,
        descriptionKey: 'info',
        options: optionsWithDisabled
    }
};

export const RadioGroup = ({ ...args }) => <RadioGroupComponent {...args} />;
