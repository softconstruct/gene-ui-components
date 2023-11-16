import React from 'react';

import DropdownComponent from 'src/lib/organisms/Dropdown';
import data, { dataForReadOnly } from './data';
import { args, category } from '../../assets/storybook.globals';

const align = ['start', 'end', 'center'];
const position = ['bottom', 'left', 'right', 'top'];
const cornerRadius = ['full-radius', 'smooth-radius'];
const screenTypes = ['desktop', 'mobile'];

const inputConfig = {
    itemsDirection: ['start', 'end'],
    size: ['small', 'default', 'big'],
    labelAppearance: ['none', 'title', 'swap'],
    appearance: ['outline', 'minimal', 'light'],
    flexibility: ['full-width', 'content-size'],
    type: ['text', 'color', 'number', 'password', 'textarea', 'date', 'time', 'datetime-local']
};

const types = ['data', 'image', 'search'];

const states = { category: category.states };
const action = { category: category.action };
const content = { category: category.content };
const appearance = { category: category.appearance };
export default {
    title: 'Organisms/Dropdown',
    component: DropdownComponent,
    argTypes: {
        labelAppearance: args({
            control: 'select',
            options: inputConfig.labelAppearance,
            ...appearance
        }),
        icon: args({ control: 'text', ...content }),
        value: args({ control: false, ...content }),
        onOpen: args({ control: false, ...action }),
        label: args({ control: 'text', ...content }),
        onClose: args({ control: false, ...action }),
        data: args({ control: 'array', ...content }),
        onScroll: args({ control: false, ...action }),
        labelKey: args({ control: false, ...states }),
        onSearch: args({ control: false, ...action }),
        onChange: args({ control: false, ...action }),
        className: args({ control: false, ...content }),
        valueKey: args({ control: 'text', ...content }),
        onScrollEnd: args({ control: false, ...action }),
        isValid: args({ control: 'boolean', ...states }),
        errorText: args({ control: 'text', ...content }),
        noDataText: args({ control: 'text', ...content }),
        onSwipedDown: args({ control: false, ...action }),
        readOnly: args({ control: 'boolean', ...states }),
        disabled: args({ control: 'boolean', ...states }),
        tooltipText: args({ control: 'text', ...content }),
        swipeable: args({ control: 'boolean', ...states }),
        description: args({ control: 'text', ...content }),
        isLoading: args({ control: 'boolean', ...states }),
        hasSearch: args({ control: 'boolean', ...states }),
        clearable: args({ control: 'boolean', ...states }),
        placeholder: args({ control: 'text', ...content }),
        defaultValue: args({ control: false, ...content }),
        checkAllText: args({ control: 'text', ...content }),
        customSearch: args({ control: 'boolean', ...states }),
        unCheckAllText: args({ control: 'text', ...content }),
        colorOnValid: args({ control: 'boolean', ...states }),
        defaultOpened: args({ control: 'boolean', ...states }),
        isMultiSelect: args({ control: 'boolean', ...states }),
        showIconOnValid: args({ control: 'boolean', ...states }),
        inputLabelTooltip: args({ control: 'text', ...content }),
        multiSelectCount: args({ control: 'number', ...states }),
        rowHeightMobile: args({ control: 'number', ...appearance }),
        shownRowsCountMobile: args({ control: 'number', ...states }),
        searchPlaceholderText: args({ control: 'text', ...content }),
        rowHeightDesktop: args({ control: 'number', ...appearance }),
        shownRowsCountDesktop: args({ control: 'number', ...states }),
        multiSelectWrappedText: args({ control: 'text', ...content }),
        extendParentScope: args({ control: 'boolean', ...appearance }),
        align: args({ control: 'select', options: align, ...appearance }),
        position: args({ control: 'select', options: position, ...appearance }),
        screenType: args({ control: 'select', options: screenTypes, ...appearance }),
        cornerRadius: args({ control: 'select', options: cornerRadius, ...appearance }),
        inputSize: args({ control: 'select', options: inputConfig.size, ...appearance }),
        appearance: args({ control: 'select', options: inputConfig.appearance, ...appearance }),
        flexibility: args({ control: 'select', options: inputConfig.flexibility, ...appearance })
    },
    args: {
        data,
        label: 'Label',
        description: '',
        hasSearch: true,
        disabled: false,
        clearable: true,
        readOnly: false,
        align: align[0],
        swipeable: false,
        multiSelectCount: 5,
        rowHeightMobile: 48,
        rowHeightDesktop: 40,
        isMultiSelect: false,
        defaultOpened: false,
        icon: 'bc-icon-apps',
        showIconOnValid: true,
        shownRowsCountMobile: 7,
        shownRowsCountDesktop: 5,
        extendParentScope: false,
        checkAllText: 'Check all',
        tooltipText: 'test tooltip',
        noDataText: 'No data found',
        cornerRadius: cornerRadius[0],
        placeholder: 'Dropdown title',
        unCheckAllText: 'Uncheck all',
        inputSize: inputConfig.size[1],
        searchPlaceholderText: 'Search',
        appearance: inputConfig.appearance[0],
        flexibility: inputConfig.flexibility[0],
        multiSelectWrappedText: 'options selected',
        labelAppearance: inputConfig.labelAppearance[0]
    }
};

const Template = ({ ...args }) => <DropdownComponent {...args} />;
export const Default = Template.bind({});

export const Multiselect = Template.bind({});
Multiselect.args = {
    isMultiSelect: true
};
export const ReadOnly = Template.bind({});
ReadOnly.args = {
    readOnly: true,
    data: dataForReadOnly,
    value: 1,
    label: 'Readonly Label'
};
