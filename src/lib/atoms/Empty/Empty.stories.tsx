import React, { FC } from 'react';
import { Meta } from '@storybook/react';

//Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
import { appearances, sizes, types } from './utils';

// Components
import Empty from './index';

// Types
import { IEmptyProps } from './index';

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

const Template: FC<IEmptyProps> = (args) => <Empty {...args} />;

export const Default = Template.bind({});

export const WithNoImage = Template.bind({});

WithNoImage.args = {
    type: types[3] as IEmptyProps['type'],
    withImage: false
};
