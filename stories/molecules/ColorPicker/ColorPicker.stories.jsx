import React from 'react';

import ColorPickerComponent from 'src/lib/molecules/ColorPicker';
import { args, category } from '../../assets/storybook.globals';

const recentColors = [
    '#3f51b5',
    '#e91e63',
    '#9c26b0',
    '#673ab7',
    '#2096f3',
    '#06a9f4',
    '#02bcd4',
    '#029588',
    '#4caf50',
    '#ffeb3b',
    '#ffc108',
    '#fe9804',
    '#ff5622'
];
const hexColor = '#aabbcc';

export default {
    title: 'Molecules/ColorPicker',
    component: ColorPickerComponent,
    argTypes: {
        value: args({ control: 'text', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        alphaValue: args({ control: 'text', category: category.content }),
        defaultColor: args({ control: 'text', category: category.content }),
        recentColors: args({ control: 'array', category: category.content }),
        colorPickerProps: args({ control: false, category: category.content }),
        alphaEnabled: args({ control: 'boolean', category: category.functionality })
    }
};

const Template = ({ ...args }) => <ColorPickerComponent {...args} />;

export const ColorPicker = Template.bind({});
ColorPicker.args = {
    alphaEnabled: false,
    defaultColor: hexColor,
    recentColors: recentColors
};
