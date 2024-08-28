import React, { FC, forwardRef } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Button, { IButtonProps } from './index';

const meta: Meta<typeof forwardRef<HTMLButtonElement, IButtonProps>> = {
    title: 'Atoms/Button',
    component: Button,
    argTypes: {
        size: args({ control: 'select', ...propCategory.appearance }),
        appearance: args({ control: 'select', ...propCategory.appearance }),
        text: args({ control: 'text', ...propCategory.content }),
        type: args({ control: 'select', ...propCategory.appearance }),
        fullWidth: args({ control: 'boolean', ...propCategory.appearance }),
        disabled: args({ control: 'boolean', ...propCategory.state }),
        Icon: args({ control: 'false', ...propCategory.content }),
        name: args({ control: 'false', ...propCategory.content }),
        onClick: args({ control: 'false', ...propCategory.action }),
        isIconAfter: args({ control: 'boolean', ...propCategory.states }),
        isLoading: args({ control: 'boolean', ...propCategory.states })
    },
    args: {
        text: 'Button',
        appearance: 'primary',
        size: 'large',
        type: 'fill',
        isIconAfter: false,
        isLoading: false
    }
};

export default meta;

const Template: FC<IButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {} as IButtonProps;
