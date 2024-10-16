import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Banner, { IBannerProps } from './index';

const meta: Meta<typeof Banner> = {
    title: 'Molecules/Banner',
    component: Banner,
    argTypes: {
        title: args({ control: 'text', ...propCategory.content }),
        type: args({ control: 'select', ...propCategory.appearance }),
        isVisible: args({ control: 'boolean', ...propCategory.functionality }),
        onClose: args({ control: false, ...propCategory.action })
    },
    args: {
        title: 'Description text goes here.',
        type: 'informational'
    } as IBannerProps,
    parameters: {
        chromatic: { disableSnapshot: true }
    }
};

export default meta;

const Template: FC<IBannerProps> = (args) => <Banner {...args} />;

export const Default = Template.bind({});

Default.args = {} as IBannerProps;
