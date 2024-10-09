import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import TextLink, { ITextLinkProps } from './index';
import { Globe } from '@geneui/icons';

const meta: Meta<typeof TextLink> = {
    title: 'Atoms/TextLink',
    component: TextLink,
    argTypes: {
        appearance: args({ control: 'select', ...propCategory.appearance }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        href: args({ control: 'text', ...propCategory.content }),
        underline: args({ control: 'boolean', ...propCategory.appearance }),
        Icon: args({ control: 'false', ...propCategory.content }),
        onClick: args({ control: 'false', ...propCategory.action }),
        rel: args({ control: 'select', ...propCategory.others }),
        target: args({ control: 'select', ...propCategory.functionality }),
        text: args({ control: 'text', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        iconBefore: args({ control: 'boolean', ...propCategory.appearance }),
        className: args({ control: 'boolean', ...propCategory.appearance })
    },
    args: {
        appearance: 'primary',
        text: 'LinkText',
        href: 'javascript:void(0)',
        disabled: false,
        target: 'self',
        iconBefore: false,
        Icon: Globe
    } as ITextLinkProps
};

export default meta;

const Template: FC<ITextLinkProps> = (args) => <TextLink {...args} />;

export const Default = Template.bind({});

Default.args = {} as ITextLinkProps;
