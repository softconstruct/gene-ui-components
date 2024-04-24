import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Empty, { IEmptyProps } from './index';

const meta: Meta<typeof Empty> = {
    title: 'Atoms/Empty',
    component: Empty,
    argTypes: {
        appearance: args({ control: 'select', ...propCategory.appearance }),
        type: args({ control: 'select', ...propCategory.appearance }),
        size: args({ control: 'select', ...propCategory.appearance }),
        title: args({ control: 'text', ...propCategory.content }),
        subTitle: args({ control: 'text', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        withImage: args({ control: 'boolean', ...propCategory.functionality })
    },
    args: {
        appearance: 'with-circles',
        size: 'big',
        type: 'data',
        withImage: true,
        title: 'No Data to Display',
        subTitle: 'Subtitle text can bes some descriptive information.'
    }
};

export default meta;

const Template: FC<IEmptyProps> = (args) => <Empty {...args} />;

export const Default = Template.bind({});

export const WithNoImage = Template.bind({});

WithNoImage.args = {
    type: 'message',
    withImage: false
} as IEmptyProps;
