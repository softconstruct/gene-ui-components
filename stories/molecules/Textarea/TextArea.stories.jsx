import React from 'react';

import TextareaComponent from 'src/lib/molecules/Textarea';

import { args, category } from '../../assets/storybook.globals';
import { inputConfig, screenTypes } from 'configs';
import { suggestionData } from './data';

const action = { category: category.action };
const states = { category: category.states };
const others = { category: category.others };
const content = { category: category.content };
const validation = { category: category.validation };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };

export default {
    title: 'Molecules/Textarea',
    component: TextareaComponent,
    argTypes: {
        icon: args({ control: 'text', ...content }),
        onBlur: args({ control: false, ...action }),
        onClear: args({ control: false, ...action }),
        onClick: args({ control: false, ...action }),
        step: args({ control: 'number', ...others }),
        onFocus: args({ control: false, ...action }),
        label: args({ control: 'text', ...content }),
        value: args({ control: 'text', ...content }),
        appearance: args({
            control: 'select',
            options: inputConfig.appearance,
            defaultValue: inputConfig.labelAppearance[0],
            ...appearance
        }),
        onChange: args({ control: false, ...action }),
        className: args({ control: false, ...others }),
        onIconClick: args({ control: false, ...action }),
        withEdit: args({ control: 'boolean', ...others }),
        readOnly: args({ control: 'boolean', ...states }),
        disabled: args({ control: 'boolean', ...states }),
        maxLength: args({ control: 'number', ...states }),
        canClear: args({ control: 'boolean', ...states }),
        description: args({ control: 'text', ...content }),
        tooltipText: args({ control: 'text', ...content }),
        placeholder: args({ control: 'text', ...content }),
        errorText: args({ control: 'text', ...validation }),
        endAdornment: args({ control: 'text', ...content }),
        isValid: args({ control: 'boolean', ...validation }),
        infoIconTitle: args({ control: 'text', ...content }),
        startAdornment: args({ control: 'text', ...others }),
        defaultValue: args({ control: 'array', ...content }),
        withInfoIcon: args({ control: 'boolean', ...states }),
        required: args({ control: 'boolean', ...validation }),
        suggestionData: args({ control: 'array', ...content }),
        clickableIcon: args({ control: 'boolean', ...action }),
        writeProtected: args({ control: 'boolean', ...states }),
        colorOnValid: args({ control: 'boolean', ...validation }),
        showErrorIcon: args({ control: 'boolean', ...validation }),
        isDropdown: args({ control: 'boolean', ...functionality }),
        showIconOnValid: args({ control: 'boolean', ...validation }),
        showClearIcon: args({ control: 'boolean', ...functionality }),
        showNumberIcon: args({ control: 'boolean', ...functionality }),
        colorBorderOnError: args({ control: 'boolean', ...validation }),
        showErrorWithTooltip: args({ control: 'boolean', ...validation }),
        showRemainingLength: args({ control: 'boolean', ...functionality }),
        showClickableTooltipOnError: args({ control: 'boolean', ...validation }),
        screenType: args({ control: 'select', options: screenTypes, ...appearance }),
        inputSize: args({ control: 'select', options: inputConfig.size, ...appearance }),
        flexibility: args({ control: 'select', options: inputConfig.flexibility, ...appearance }),
        cornerRadius: args({ control: 'select', options: inputConfig.cornerRadius, ...appearance }),
        itemsDirection: args({ control: 'select', options: inputConfig.itemsDirection, ...appearance }),
        labelAppearance: args({ control: 'select', options: inputConfig.labelAppearance, ...appearance })
    },
    args: {
        step: 1,
        isValid: true,
        label: 'label',
        canClear: true,
        description: '',
        disabled: false,
        withEdit: false,
        readOnly: false,
        endAdornment: '',
        isDropdown: false,
        startAdornment: '',
        withInfoIcon: true,
        colorOnValid: true,
        showErrorIcon: true,
        showNumberIcon: true,
        showIconOnValid: true,
        colorBorderOnError: true,
        showRemainingLength: true,
        inputSize: inputConfig.size[1],
        suggestionData: suggestionData,
        errorText: 'You have some error',
        infoIconTitle: 'Info icon title',
        showClickableTooltipOnError: true,
        appearance: inputConfig.appearance[0],
        flexibility: inputConfig.flexibility[0],
        cornerRadius: inputConfig.cornerRadius[0],
        itemsDirection: inputConfig.itemsDirection[0],
        labelAppearance: inputConfig.labelAppearance[0],
        placeholder: 'Type here, you can use @ or : symbols to show suggestion list'
    }
};

export let Textarea = ({ ...args }) => {
    return (
        <div style={{ marginTop: '150px' }}>
            <TextareaComponent {...args} />
        </div>
    );
};
