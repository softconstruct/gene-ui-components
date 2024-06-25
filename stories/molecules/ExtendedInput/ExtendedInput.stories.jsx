import React, { useEffect, useState } from 'react';

import ExtendedInputComponent from 'src/lib/molecules/ExtendedInput';
import { args, category } from '../../assets/storybook.globals';
import { inputConfig, screenTypes } from '../../../src/configs';
import { Tooltip } from '../../../src';

const states = { category: category.states };
const others = { category: category.others };
const action = { category: category.action };
const content = { category: category.content };
const validation = { category: category.validation };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };

export default {
    title: 'Molecules/ExtendedInput',
    component: ExtendedInputComponent,
    argTypes: {
        onBlur: args({ control: false, ...action }),
        icon: args({ control: 'text', ...content }),
        value: args({ control: 'text', ...content }),
        label: args({ control: 'text', ...content }),
        onClear: args({ control: false, ...action }),
        onFocus: args({ control: false, ...action }),
        onClick: args({ control: false, ...action }),
        onChange: args({ control: false, ...action }),
        isDropdown: args({ table: { disable: true } }),
        className: args({ control: false, ...others }),
        onIconClick: args({ control: false, ...action }),
        min: args({ control: 'number', ...functionality }),
        max: args({ control: 'number', ...functionality }),
        maxLength: args({ control: 'number', ...states }),
        disabled: args({ control: 'boolean', ...states }),
        readOnly: args({ control: 'boolean', ...states }),
        tooltipText: args({ control: 'text', ...content }),
        placeholder: args({ control: 'text', ...content }),
        errorText: args({ control: 'text', ...validation }),
        step: args({ control: 'number', ...functionality }),
        endAdornment: args({ control: 'text', ...content }),
        defaultValue: args({ control: 'text', ...content }),
        isValid: args({ control: 'boolean', ...validation }),
        infoIconTitle: args({ control: 'text', ...content }),
        required: args({ control: 'boolean', ...validation }),
        startAdornment: args({ control: 'text', ...content }),
        description: args({ control: 'boolean', ...content }),
        canClear: args({ control: 'boolean', ...functionality }),
        colorOnValid: args({ control: 'boolean', ...validation }),
        showErrorIcon: args({ control: 'boolean', ...validation }),
        withInfoIcon: args({ control: 'boolean', ...functionality }),
        showIconOnValid: args({ control: 'boolean', ...validation }),
        showClearIcon: args({ control: 'boolean', ...functionality }),
        clickableIcon: args({ control: 'boolean', ...functionality }),
        writeProtected: args({ control: 'boolean', ...functionality }),
        showNumberIcon: args({ control: 'boolean', ...functionality }),
        colorBorderOnError: args({ control: 'boolean', ...validation }),
        showErrorWithTooltip: args({ control: 'boolean', ...validation }),
        showRemainingLength: args({ control: 'boolean', ...functionality }),
        showClickableTooltipOnError: args({ control: 'boolean', ...validation }),
        screenType: args({ control: false, options: screenTypes, ...appearance }),
        type: args({
            control: 'select',
            options: inputConfig.type,
            ...functionality
        }),
        inputSize: args({
            control: 'select',
            options: inputConfig.size,
            ...appearance
        }),
        appearance: args({
            control: 'select',
            options: [false, ...inputConfig.appearance],
            ...appearance
        }),
        flexibility: args({
            control: 'select',
            options: inputConfig.flexibility,
            ...appearance
        }),
        cornerRadius: args({
            control: 'select',
            options: inputConfig.cornerRadius,
            ...appearance
        }),
        itemsDirection: args({
            control: 'select',
            options: inputConfig.itemsDirection,
            ...appearance
        }),
        labelAppearance: args({
            control: 'select',
            options: inputConfig.labelAppearance,
            ...appearance
        })
    },
    args: {
        step: 1,
        isValid: true,
        className: '',
        label: 'Label',
        canClear: true,
        maxLength: 200,
        readOnly: false,
        disabled: false,
        description: '',
        endAdornment: '',
        isDropdown: false,
        colorOnValid: true,
        withInfoIcon: true,
        startAdornment: '',
        showClearIcon: true,
        showErrorIcon: true,
        showNumberIcon: true,
        placeholder: 'Hello',
        icon: 'bc-icon-apps',
        showIconOnValid: true,
        colorBorderOnError: true,
        showRemainingLength: true,
        type: inputConfig.type[0],
        showErrorWithTooltip: false,
        inputSize: inputConfig.size[1],
        infoIconTitle: 'Info icon title',
        errorText: 'You have some error',
        showClickableTooltipOnError: true,
        appearance: inputConfig.appearance[0],
        flexibility: inputConfig.flexibility[0],
        cornerRadius: inputConfig.cornerRadius[0],
        itemsDirection: inputConfig.itemsDirection[0],
        labelAppearance: inputConfig.labelAppearance[0]
    }
};

const Template = ({ ...args }) => <ExtendedInputComponent {...args} />;

export const Default = Template.bind({});
export const TextArea = Template.bind({});

TextArea.args = { type: 'textarea' };

export const Test = (args) => {
    const [isValid, setIsValid] = useState(false);
    const [MinAmount, setMinAmount] = useState(null);

    useEffect(() => {
        setIsValid(MinAmount > 10);
    }, [MinAmount]);

    return (
        <Tooltip text={'test'} isVisible={true} alwaysShow={isValid} position={'bottom'}>
            <>
                <ExtendedInputComponent
                    type="number"
                    labelAppearance="swap"
                    placeholder={'placeholder'}
                    required
                    value={MinAmount}
                    showErrorWithTooltip
                    errorText={'errorText'}
                    isValid={isValid}
                    canClear
                    onChange={(e) => {
                        setMinAmount(e.target.value);
                    }}
                />

                <h1>Vladimir Putin</h1>
            </>
        </Tooltip>
    );
};
