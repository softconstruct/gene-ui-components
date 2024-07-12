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
        isBusy: args({ control: false, ...propCategory.others })
    },
    args: {
        isBusy: 'fill the isBusy prop value'
    } as ILoaderProps
};

export default meta;

const Template: FC<ILoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});

Default.args = {} as ILoaderProps;
