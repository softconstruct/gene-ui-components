import React, { FC } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

import BusyLoader from './index';

import { IBusyLoaderProps } from './index';

const meta: Meta<typeof BusyLoader> = {
    title: 'Atoms/BusyLoader',
    component: BusyLoader,
    argTypes: {
        type: args({ control: 'select', ...propCategory.appearance }),
        spinnerSize: args({ control: 'select', ...propCategory.appearance }),
        children: args({ control: false, ...propCategory.content }),
        loadingText: args({ control: 'text', ...propCategory.content }),
        isBusy: args({ control: 'boolean', ...propCategory.states }),
        className: args({ control: false, ...propCategory.others })
    },
    args: {
        isBusy: true,
        spinnerSize: 'big',
        loadingText: 'Loading text...'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

type StoryTemplateType = Story & FC<IBusyLoaderProps>;

interface IBusyLoaderPropsExtended extends IBusyLoaderProps {
    icon?: string;
}

export const Default: StoryTemplateType = (args) => {
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
Default.args = {
    type: 'spinner',
    spinnerSize: 'medium'
};

export const Bubble: Story = (args: IBusyLoaderPropsExtended) => <Default icon="bc-icon-apps" {...args} />;
Bubble.args = {
    type: 'bubbles'
};

export const Bar: Story = (args: IBusyLoaderPropsExtended) => <Default icon="bc-icon-monospace" {...args} />;
Bar.args = {
    type: 'bar',
    loadingText: 'bar loading'
};
