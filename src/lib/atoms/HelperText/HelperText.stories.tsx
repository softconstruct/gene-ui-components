import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import HelperText, { IHelperTextProps } from './index';

const meta: Meta<typeof HelperText> = {
    title: 'Atoms/HelperText',
    component: HelperText,
    argTypes: {
        size: args({ control: 'select', ...propCategory.appearance }),
        type: args({ control: 'select', ...propCategory.appearance }),
        text: args({ control: 'text', ...propCategory.content }),
        icon: args({ control: 'text', ...propCategory.content }),
        isDisabled: args({ control: 'boolean', ...propCategory.states }),
        isLoading: args({ control: 'boolean', ...propCategory.states })
    },
    args: {
        size: 'medium',
        text: 'Helper Text',
        isDisabled: false,
        type: 'rest'
    } as IHelperTextProps
};

export default meta;

const Template: FC<IHelperTextProps> = (args) => <HelperText {...args} />;

export const Default = Template.bind({});

export const Danger = Template.bind({});
Danger.args = {
    type: 'danger'
} as IHelperTextProps;

export const Warning = Template.bind({});
Warning.args = {
    type: 'warning'
} as IHelperTextProps;
