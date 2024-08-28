import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Grid, { IGridProps } from './index';

const meta: Meta<typeof Grid> = {
    title: 'Atoms/Grid',
    component: Grid,
    argTypes: {
        Col: args({ control: false, ...propCategory.others }),
        Row: args({ control: false, ...propCategory.others })
    },
    args: {
        Col: 'fill the Col prop value',
        Row: 'fill the Row prop value'
    } as IGridProps
};

export default meta;

const Template: FC<IGridProps> = (args) => <Grid {...args} />;

export const Default = Template.bind({});

Default.args = {} as IGridProps;
