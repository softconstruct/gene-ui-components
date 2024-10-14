import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Info, { IInfoProps } from './index';

const meta: Meta<typeof Info> = {
    title: 'Atoms/Info',
    component: Info,
    argTypes: {
        infoText: args({ control: 'text', ...propCategory.content }),
        appearance: args({ control: 'select', ...propCategory.appearance }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        size: args({ control: 'select', ...propCategory.appearance }),
        className: args({ control: false, ...propCategory.appearance })
    },
    args: {
        infoText: 'info text'
    } as IInfoProps
};

export default meta;

const Template: FC<IInfoProps> = (args) => <Info {...args} />;

export const Default = Template.bind({});

Default.args = {} as IInfoProps;
