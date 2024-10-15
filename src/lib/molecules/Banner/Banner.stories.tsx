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
        // fill Banner component argTypes
    },
    args: {
        // fill Banner component args
    } as IBannerProps,
    parameters: {
        chromatic: { disableSnapshot: true }
    }
};

export default meta;

const Template: FC<IBannerProps> = (args) => <Banner {...args} />;

export const Default = Template.bind({});

Default.args = {} as IBannerProps;
