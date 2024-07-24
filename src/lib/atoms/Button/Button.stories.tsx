import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Button, { IButtonProps } from './index';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    argTypes: {
        size: args({ control: 'select', ...propCategory.appearance }),
        loaderColor: args({ control: 'select', ...propCategory.appearance }),
        text: args({ control: 'text', ...propCategory.content }),
        type: args({ control: 'select', ...propCategory.appearance }),
        fullWidth: args({ control: 'boolean', ...propCategory.appearance }),
        disabled: args({ control: 'boolean', ...propCategory.functionality }),
        Icon: args({ control: 'false', ...propCategory.content }),
        name: args({ control: 'false', ...propCategory.functionality }),
        onClick: args({ control: 'false', ...propCategory.functionality })
    },
    args: {
        text: 'Button',
        loaderColor: 'primary',
        size: 'large',
        type: 'fill'
    }
};

export default meta;

const Template: FC<IButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {} as IButtonProps;
