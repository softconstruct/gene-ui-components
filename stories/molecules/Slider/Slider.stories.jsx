import React from 'react';

import SliderComponent from 'src/lib/molecules/Slider';
import { args, category } from '../../assets/storybook.globals';

const circleTypes = ['c-type-1', 'c-type-2', 'c-type-3'];

const colorTypes = ['primary', 'positive-value', 'negative-value', 'gradient-value'];

const tooltipTypes = ['default', 'percentage', 'currency', 'pixel'];

const action = { category: category.action };
const states = { category: category.states };
const others = { category: category.others };
const content = { category: category.content };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };
export default {
    title: 'Molecules/Slider',
    component: SliderComponent,
    argTypes: {
        onChange: args({ control: false, ...action }),
        value: args({ control: 'number', ...content }),
        className: args({ control: false, ...others }),
        disabled: args({ control: 'boolean', ...states }),
        min: args({ control: 'number', ...functionality }),
        max: args({ control: 'number', ...functionality }),
        step: args({ control: 'number', ...functionality }),
        coloring: args({ control: 'select', ...appearance }),
        withTooltip: args({ control: 'boolean', ...states }),
        defaultValue: args({ control: 'number', ...content }),
        circleType: args({ control: 'select', ...appearance }),
        tooltipType: args({ control: 'select', ...appearance }),
        withInput: args({ control: 'boolean', ...functionality }),
        isSmallHandler: args({ control: 'boolean', ...appearance }),
        showCircleOnDrag: args({ control: 'select', ...appearance }),
        plusMinusIcons: args({ control: 'boolean', ...functionality }),
        likeDislikeIcons: args({ control: 'boolean', ...functionality }),
        withActionButtons: args({ control: 'boolean', ...functionality }),
        circleSizeBasedOnRange: args({ control: 'boolean', ...appearance })
    },

    args: {
        min: 0,
        step: 5,
        max: 100,
        defaultValue: 5,
        withInput: true,
        disabled: false,
        withTooltip: true,
        plusMinusIcons: true,
        isSmallHandler: true,
        likeDislikeIcons: true,
        showCircleOnDrag: true,
        withActionButtons: false,
        coloring: colorTypes[3],
        circleType: circleTypes[0],
        tooltipType: tooltipTypes[0],
        circleSizeBasedOnRange: true
    }
};

export const Slider = ({ ...args }) => <SliderComponent {...args} />;
