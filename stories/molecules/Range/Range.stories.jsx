import React from 'react';

import RangeComponent from 'src/lib/molecules/Range';
import { args, category } from '../../assets/storybook.globals';

const circleTypes = ['c-type-1', 'c-type-2', 'c-type-3'];

const colorTypes = ['primary', 'positive-value', 'negative-value', 'gradient-value'];

const tooltipTypes = ['default', 'percentage', 'currency', 'pixel'];

export default {
    title: 'Molecules/Range',
    component: RangeComponent,
    argTypes: {
        value: args({ control: false, category: category.content }),
        min: args({ control: 'number', category: category.content }),
        max: args({ control: 'number', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        step: args({ control: 'number', category: category.content }),
        className: args({ control: false, category: category.others }),
        disabled: args({ control: 'boolean', category: category.states }),
        defaultValue: args({ control: 'array', category: category.content }),
        withTooltip: args({ control: 'boolean', category: category.states }),
        circleTypes: args({ control: 'array', category: category.appearance }),
        isSmallHandler: args({ control: 'boolean', category: category.appearance }),
        showCircleOnDrag: args({ control: 'boolean', category: category.appearance }),
        circleSizeBasedOnRange: args({ control: 'boolean', category: category.appearance }),
        coloring: args({ control: 'select', options: colorTypes, category: category.appearance }),
        tooltipType: args({ control: 'select', options: tooltipTypes, category: category.states })
    },
    args: {
        step: 5,
        min: 0,
        max: 100,
        disabled: false,
        withTooltip: true,
        isSmallHandler: true,
        defaultValue: [10, 50],
        showCircleOnDrag: false,
        coloring: colorTypes[0],
        tooltipType: tooltipTypes[0],
        circleSizeBasedOnRange: false,
        circleTypes: [circleTypes[0], circleTypes[2]]
    }
};

export const Default = ({ ...args }) => <RangeComponent {...args} />;

export const WithOnePoint = ({ ...args }) => <RangeComponent {...args} />;

WithOnePoint.args = {
    step: 1,
    withTooltip: true,
    defaultValue: [5],
    showCircleOnDrag: true,
    circleTypes: [circleTypes[2]]
};
