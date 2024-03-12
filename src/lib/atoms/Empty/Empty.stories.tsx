import React, { FC } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

import Empty, { IEmptyProps } from './index';
import { appearances, sizes, types } from './helper';

const meta: Meta<typeof Empty> = {
    title: 'Atoms/Empty',
    component: Empty,
    argTypes: {
        appearance: args({ control: 'select', options: appearances, ...propCategory.appearance }),
        type: args({ control: 'select', options: types, ...propCategory.appearance }),
        size: args({ control: 'select', options: sizes, ...propCategory.appearance }),
        title: args({ control: 'text', ...propCategory.content }),
        subTitle: args({ control: 'text', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        withImage: args({ control: 'boolean', ...propCategory.functionality })
    },
    args: {
        appearance: appearances[0],
        size: sizes[0],
        type: types[0],
        withImage: true,
        title: 'No Data to Display',
        subTitle: 'Duis tempus justo nec nunc accumsan eleifend.'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

type StoryTemplateType = Story & FC<IEmptyProps>;

export const Default: StoryTemplateType = (args) => <Empty {...args} />;

export const WithNoImage: Story = (args: IEmptyProps) => <Default {...args} />;

WithNoImage.args = {
    type: types[3],
    withImage: false
};
