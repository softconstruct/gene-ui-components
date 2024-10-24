import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Text, { ITextProps } from './index';

const meta: Meta<typeof Text> = {
    title: 'Atoms/Text',
    component: Text,
    argTypes: {
        className: args({ control: 'false', ...propCategory.appearance }),
        children: args({ control: 'text', ...propCategory.content })
    },
    args: {
        children: 'Text content'
    } as ITextProps,
    parameters: {
        chromatic: { disableSnapshot: true }
    }
};

export default meta;

const Template: FC<ITextProps> = (args) => <Text {...args} />;

export const Default = Template.bind({});

Default.args = {} as ITextProps;
