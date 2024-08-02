import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Pill, { IPillProps } from './index';

const meta: Meta<typeof Pill> = {
    title: 'Atoms/Pill',
    component: Pill,
    argTypes: {
        size: args({ control: 'select', ...propCategory.others }),
        color: args({ control: 'select', ...propCategory.appearance }),
        Icon: args({ control: 'false', ...propCategory.appearance }),
        text: args({ control: 'text', ...propCategory.functionality }),
        isFill: args({ control: 'boolean', ...propCategory.appearance }),
        isIconAfter: args({ control: 'boolean', ...propCategory.appearance })
    },
    args: {
        size: 'medium',
        color: 'informative',
        isFill: true,
        isIconAfter: false,
        text: 'Pill'
    }
};

export default meta;

const Template: FC<IPillProps> = (args) => <Pill {...args} />;

export const Default = Template.bind({});
