import React from 'react';
import ComboBox from 'src/lib/molecules/ComboBox';
import { args, category } from '../../assets/storybook.globals';
import { inputConfig } from 'configs';
import data from './data';

export default {
    title: 'Molecules/ComboBox',
    component: ComboBox,

    argTypes: {
        flexibility: args({
            control: 'select',
            options: inputConfig.flexibility,
            category: category.appearance
        }),
        labelAppearance: args({
            control: 'select',
            options: inputConfig.labelAppearance,
            category: category.appearance
        }),
        label: args({ control: 'text', category: category.content }),
        value: args({ control: 'array', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        regEx: args({ control: 'text', category: category.validation }),
        tabIndex: args({ control: 'number', category: category.others }),
        readOnly: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        placeholder: args({ control: 'text', category: category.content }),
        defaultValue: args({ control: 'array', category: category.content }),
        maxHeight: args({ control: 'number', category: category.appearance }),
        required: args({ control: 'boolean', category: category.validation }),
        withEdit: args({ control: 'boolean', category: category.functionality }),
        withDelete: args({ control: 'boolean', category: category.functionality }),
        withInfoIcon: args({ control: 'boolean', category: category.functionality }),
        infoIconTooltipProps: args({ control: 'object', category: category.content })
    },
    args: {
        label: 'Label',
        maxHeight: 510,
        withEdit: true,
        disabled: false,
        readOnly: false,
        withDelete: true,
        withInfoIcon: true,
        regEx: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        flexibility: inputConfig.flexibility[0],
        labelAppearance: inputConfig.labelAppearance[0],
        infoIconTooltipProps: { title: 'Info icon title' }
    },
    parameters: {
        chromatic: { disableSnapshot: true }
    }
};
const Template = ({ ...args }) => <ComboBox {...args} defaultValue={data} />;

export let Default = Template.bind({});
export let ViewMode = Template.bind({});

ViewMode.args = {
    withEdit: false,
    withDelete: false
};
