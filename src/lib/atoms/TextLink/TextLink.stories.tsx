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
        appearance: args({ control: 'select', ...propCategory.options }),
        disabled: args({ control: 'boolean', ...propCategory.functionality }),
        href: args({ control: 'text', ...propCategory.content }),
        Icon: args({ control: 'false', ...propCategory.appearance }),
        onClick: args({ control: 'false', ...propCategory.functionality }),
        onFocus: args({ control: 'false', ...propCategory.functionality }),
        rel: args({ control: 'select', ...propCategory.options }),
        target: args({ control: 'select', ...propCategory.options }),
        text: args({ control: 'text', ...propCategory.content }),
        skeleton: args({ control: 'boolean', ...propCategory.functionality })
    },
    args: {
        appearance: 'primary',
        text: 'LinkText',
        href: 'javascript:void(0)',
        disabled: false,
        rel: 'nofollow',
        target: 'self'
    } as ITextLinkProps
};

export default meta;

const Template: FC<ITextLinkProps> = (args) => <TextLink {...args} />;

export const Default = Template.bind({});

Default.args = {} as ITextLinkProps;
