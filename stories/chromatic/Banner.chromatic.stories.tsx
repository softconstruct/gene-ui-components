import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { VariantsStoryGrid } from '../assets/storybook.globals';

// Components
import Banner from '../../src/lib/molecules/Banner';

const meta: Meta<typeof Banner> = {
    title: 'Chromatic/Banner',
    component: Banner
};

export default meta;

const variants = [
    {
        //all posible props
    },
    {
        //for all variants
    }
];

export const Template = () => {
    return (
        <VariantsStoryGrid>
            {variants.map((variant, index) => {
                return <Banner {...variant} key={index} />;
            })}
        </VariantsStoryGrid>
    );
};
