import React, { useState } from 'react';

import Icon from 'src/lib/atoms/Icon/index';
import { screenTypes } from '../../../src/configs';
import { args, category } from '../../assets/storybook.globals';
import AlertComponent, { alertTypes } from 'src/lib/molecules/Alert/index';

export default {
    title: 'Molecules/Alert',
    component: AlertComponent,
    argTypes: {
        screenType: args({
            control: 'select',
            category: category.appearance,
            options: screenTypes
        }),
        iconProps: args({
            control: false,
            category: category.content
        }),
        title: args({ control: 'text', category: category.content }),
        message: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        swapIcon: args({ control: 'text', category: category.content }),
        type: args({ control: 'select', options: alertTypes, category: category.appearance }),
        onClose: {
            table: {
                disable: true
            }
        }
    },
    args: {
        iconProps: {},
        swapIcon: false,
        type: alertTypes[0],
        title: 'Some title',
        screenType: 'desktop',
        message: 'Some description'
    }
};

const Template = ({ ...args }) => {
    const { type, title, message, swapIcon, iconProps, isFilled } = args;
    return (
        <AlertComponent
            type={type}
            title={title}
            message={message}
            iconProps={iconProps ? { isFilled } : null}
            swapIcon={swapIcon ? <Icon type="bc-icon-apps" /> : undefined}
            {...args}
        />
    );
};

export const Success = Template.bind({});
export const Info = Template.bind({});
Info.args = {
    type: alertTypes[1]
};
export const Warning = Template.bind({});
Info.args = {
    type: alertTypes[2]
};
export const Error = Template.bind({});
Error.args = {
    type: alertTypes[3]
};
export const Note = Template.bind({});
Note.args = {
    type: alertTypes[4]
};
export const Message = Template.bind({});
Message.args = {
    type: alertTypes[5]
};
