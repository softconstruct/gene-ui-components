import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { AllStoriesWrapper } from '../assets/storybook.globals';

// Components
import Label from '../../src/lib/atoms/Label';

const meta: Meta<typeof Label> = {
    title: 'Chromatic/Label',
    component: Label
};

export default meta;
const testTypes = [
    // medium size, no infoText, not required, not disabled, not loading
    { labelText: 'test', size: 'medium' },
    { labelText: 'test', size: 'medium', required: true },
    { labelText: 'test', size: 'medium', disabled: true },
    { labelText: 'test', size: 'medium', required: true, disabled: true },

    // medium size with infoText
    { labelText: 'test', size: 'medium', infoText: 'test info text' },
    { labelText: 'test', size: 'medium', infoText: 'test info text', required: true },
    { labelText: 'test', size: 'medium', infoText: 'test info text', disabled: true },
    { labelText: 'test', size: 'medium', infoText: 'test info text', required: true, disabled: true },

    // small size, no infoText, not required, not disabled, not loading
    { labelText: 'test', size: 'small' },
    { labelText: 'test', size: 'small', required: true },
    { labelText: 'test', size: 'small', disabled: true },
    { labelText: 'test', size: 'small', required: true, disabled: true },

    // small size with infoText
    { labelText: 'test', size: 'small', infoText: 'test info text' },
    { labelText: 'test', size: 'small', infoText: 'test info text', required: true },
    { labelText: 'test', size: 'small', infoText: 'test info text', disabled: true },
    { labelText: 'test', size: 'small', infoText: 'test info text', required: true, disabled: true }
];

export const Template = () => {
    return (
        <AllStoriesWrapper>
            {testTypes.map((el) => {
                return <Label {...el} />;
            })}
        </AllStoriesWrapper>
    );
};
