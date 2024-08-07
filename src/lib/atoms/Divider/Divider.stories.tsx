import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Divider, { IDividerProps } from './index';

const meta: Meta<typeof Divider> = {
    title: 'Atoms/Divider',
    component: Divider,
    argTypes: {
        alignContent: args({ control: 'select', ...propCategory.appearance }),
        appearance: args({ control: 'select', ...propCategory.appearance }),
        isVertical: args({ control: 'boolean', ...propCategory.functionality }),
        Icon: args({ control: 'false', ...propCategory.others }),
        label: args({ control: 'text', ...propCategory.appearance }),
        labelPosition: args({ control: 'select', ...propCategory.appearance })
    },
    args: {
        alignContent: 'left',
        appearance: 'brand',
        isVertical: false,
        label: 'test',
        labelPosition: 'before'
    }
};

export default meta;

const Template: FC<IDividerProps> = (args) => (
    <div style={{ height: 220 }}>
        <Divider {...args} />
    </div>
);

export const Default = Template.bind({});

Default.args = {} as IDividerProps;
