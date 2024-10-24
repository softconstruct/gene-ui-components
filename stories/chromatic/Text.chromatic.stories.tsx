import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { VariantsStoryGrid } from '../assets/storybook.globals';

// Components
import Text from '../../src/lib/atoms/Text';

const meta: Meta<typeof Text> = {
    title: 'Chromatic/Text',
    component: Text
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
                return (
                    <Text {...variant} key={index}>
                        Text content
                    </Text>
                );
            })}
        </VariantsStoryGrid>
    );
};
