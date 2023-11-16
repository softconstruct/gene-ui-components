import React from 'react';

import ProgressComponent from 'src/lib/molecules/Progress';
import { args, category } from '../../assets/storybook.globals';
const appearances = ['default', 'detailed', 'circular', 'box-bar', 'box-circular', 'linear'];
const sizes = ['big', 'medium', 'small', 'very-small'];
const circularAppearances = ['show-percentage', 'show-file-name'];
const colors = ['default', 'fail', 'success'];
const statuses = ['completed', 'failed'];

export default {
    title: 'Molecules/Progress',
    component: ProgressComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        onCancel: args({ control: false, category: category.action }),
        onRestart: args({ control: false, category: category.action }),
        fileName: args({ control: 'text', category: category.content }),
        color: args({ control: 'select', category: category.appearance }),
        showCancel: args({ control: 'boolean', category: category.states }),
        showRestart: args({ control: 'boolean', category: category.states }),
        pathStyle: args({ control: 'object', category: category.appearance }),
        loaderStatuses: args({ control: 'object', category: category.content }),
        selectedSize: args({ control: 'select', category: category.appearance }),
        percentage: args({ control: 'number', category: category.functionality }),
        fullFileSize: args({ control: 'number', category: category.functionality }),
        selectedAppearance: args({ control: 'select', category: category.appearance }),
        selectedCircularAppearance: args({ control: 'select', category: category.appearance })
    },
    args: {
        percentage: 45,
        fileName: 'PDF',
        title: 'Profit',
        color: colors[0],
        showCancel: true,
        showRestart: true,
        fullFileSize: 102400,
        selectedSize: sizes[1],
        loaderStatuses: statuses,
        selectedCircularAppearance: circularAppearances[0]
    }
};

const Template = ({ ...args }) => <ProgressComponent {...args} />;

export let Default = Template.bind({});
Default.args = {
    selectedAppearance: appearances[0]
};

export let linear = Template.bind({});
linear.args = {
    selectedAppearance: appearances[5]
};

export let boxCircular = Template.bind({});
boxCircular.args = {
    selectedAppearance: appearances[4]
};
