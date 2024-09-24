import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Loader, { ILoaderProps } from './index';

const meta: Meta<typeof Loader> = {
    title: 'Atoms/Loader',
    component: Loader,
    argTypes: {
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        text: args({ control: 'text', ...propCategory.content }),
        children: args({ control: 'text', ...propCategory.content }),
        labelPosition: args({ control: 'select', ...propCategory.appearance }),
        size: args({ control: 'select', ...propCategory.appearance }),
        appearance: args({ control: 'select', ...propCategory.appearance })
    },
    args: {
        text: 'Loading Info',
        isLoading: true,
        labelPosition: 'after',
        size: 'medium',
        appearance: 'brand',
        children: 'content is loaded'
    }
};

export default meta;

const Template: FC<ILoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});

Default.args = {} as ILoaderProps;
