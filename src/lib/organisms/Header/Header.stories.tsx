import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Header, { IHeaderProps } from './index';

const meta: Meta<typeof Header> = {
    title: 'Organisms/Header',
    component: Header,
    argTypes: {
        type: args({ control: false, ...propCategory.others })
    },
    args: {
        type: 'fill the type prop value'
    } as IHeaderProps
};

export default meta;

const Template: FC<IHeaderProps> = (args) => <Header {...args} />;

export const Default = Template.bind({});

Default.args = {} as IHeaderProps;
