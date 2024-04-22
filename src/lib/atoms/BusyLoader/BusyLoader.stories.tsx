import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import BusyLoader, { IBusyLoaderProps } from './index';

const meta: Meta<typeof BusyLoader> = {
    title: 'Atoms/BusyLoader',
    component: BusyLoader,
    argTypes: {
        type: args({ control: 'select', options: ['spinner', 'bubbles', 'bar'], ...propCategory.appearance }),
        spinnerSize: args({ control: 'select', options: ['small', 'medium', 'big'], ...propCategory.appearance }),
        children: args({ control: false, ...propCategory.content }),
        loadingText: args({ control: 'text', ...propCategory.content }),
        isBusy: args({ control: 'boolean', ...propCategory.states }),
        className: args({ control: false, ...propCategory.others })
    },
    args: {
        isBusy: true,
        spinnerSize: 'big',
        loadingText: 'Loading text...'
    } as IBusyLoaderProps
};

export default meta;

const Template: FC<IBusyLoaderProps> = (args) => {
    return (
        <BusyLoader {...args}>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam architecto dicta dolor ea excepturi id
                illum itaque laudantium, magni minima mollitia nemo odio odit possimus praesentium quas tempora vero
                voluptates?
            </div>
        </BusyLoader>
    );
};

export const Default = Template.bind({});

Default.args = {
    type: 'spinner',
    spinnerSize: 'medium'
};

export const Bubble = Template.bind({});

Bubble.args = {
    type: 'bubbles'
};

export const Bar = Template.bind({});

Bar.args = {
    type: 'bar'
};
