import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals.js';

// Components
import Label, { ILabelProps } from './index';

const meta: Meta<typeof Label> = {
    title: 'Atoms/Label',
    component: Label,
    argTypes: {
        htmlFor: args({ control: false, ...propCategory.functionality }),
        size: args({ control: 'select', ...propCategory.appearance }),
        children: args({ control: 'text', ...propCategory.content }),
        required: args({ control: 'boolean', ...propCategory.validation }),
        infoText: args({ control: 'text', ...propCategory.content }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        className: args({ control: false, ...propCategory.others })
    },
    args: {
        htmlFor: 'inputId',
        size: 'medium',
        children: 'label',
        required: false
    } as ILabelProps
};

export default meta;

const Template: FC<ILabelProps> = (args) => <Label {...args}>{args.children}</Label>;

export const Default = Template.bind({});

export const Required = Template.bind({});
Required.args = {
    required: true
} as ILabelProps;

export const WithInfo = Template.bind({});
WithInfo.args = {
    infoText: 'Additional info for label'
} as ILabelProps;
