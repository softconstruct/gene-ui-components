import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import TextLink, { ITextLinkProps } from './index';

const meta: Meta<typeof TextLink> = {
    title: 'Atoms/TextLink',
    component: TextLink,
    argTypes: {
        type: args({ control: false, ...propCategory.others })
    },
    args: {
        type: 'fill the type prop value'
    } as ITextLinkProps
};

export default meta;

const Template: FC<ITextLinkProps> = (args) => <TextLink {...args} />;

export const Default = Template.bind({});

Default.args = {} as ITextLinkProps;
