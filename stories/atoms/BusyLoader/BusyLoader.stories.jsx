import React from 'react';
import BusyLoaderComponent from 'src/lib/atoms/BusyLoader';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/BusyLoader',
    component: BusyLoaderComponent,
    argTypes: {
        type: args({ control: 'select', category: category.appearance }),
        spinnerSize: args({ control: 'select', category: category.appearance }),
        children: args({ control: false, category: category.content }),
        loadingText: args({ control: 'text', category: category.content }),
        isBusy: args({ control: 'boolean', category: category.states }),
        className: args({ control: false, category: category.others })
    },
    args: {
        isBusy: true,
        spinnerSize: 'big',
        loadingText: 'Loading text...'
    }
};

const Template = ({ ...args }) => {
    return (
        <BusyLoaderComponent {...args}>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam architecto dicta dolor ea excepturi id
                illum itaque laudantium, magni minima mollitia nemo odio odit possimus praesentium quas tempora vero
                voluptates?
            </div>
        </BusyLoaderComponent>
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
    type: 'bar',
    loadingText: 'bar loading'
};
