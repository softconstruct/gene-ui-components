import React, { FC } from 'react';
import Rating, { IRatingProps } from './Rating';
import { Meta } from '@storybook/react';
const meta: Meta<typeof Rating> = {
    title: 'Atoms/Rating',
    component: Rating,
    argTypes: {},
    args: {}
};
export default meta;
export const Template: FC<IRatingProps> = ({ ...args }) => {
    return <Rating {...args} onChange={undefined} />;
};

export const Controlled = Template.bind({});
