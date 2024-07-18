import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Tag, { ITagProps } from './index';

const meta: Meta<typeof Tag> = {
    title: 'Molecules/Tag',
    component: Tag,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as ITagProps
};

export default meta;

const Template: FC<ITagProps> = (args) => <Tag {...args} />;

export const Default = Template.bind({});

Default.args = {} as ITagProps;
